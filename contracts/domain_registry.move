module decentra_dns::domain_registry {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    // Error codes
    const E_DOMAIN_ALREADY_EXISTS: u64 = 1;
    const E_DOMAIN_NOT_EXISTS: u64 = 2;
    const E_NOT_OWNER: u64 = 3;
    const E_INSUFFICIENT_PAYMENT: u64 = 4;
    const E_INVALID_DOMAIN_NAME: u64 = 5;

    // Domain NFT structure
    struct DomainNFT has key, store {
        id: UID,
        name: String,
        owner: address,
        ipfs_hash: String,
        dns_records: vector<DNSRecord>,
        created_at: u64,
        expires_at: u64,
    }

    // DNS Record structure
    struct DNSRecord has store, copy, drop {
        record_type: String, // A, AAAA, CNAME, MX, TXT
        name: String,
        value: String,
        ttl: u64,
    }

    // Registry capability
    struct RegistryCap has key {
        id: UID,
    }

    // Global registry state
    struct Registry has key {
        id: UID,
        domains: Table<String, ID>,
        registration_fee: u64,
        renewal_fee: u64,
    }

    // Events
    struct DomainRegistered has copy, drop {
        domain_name: String,
        owner: address,
        nft_id: ID,
        ipfs_hash: String,
    }

    struct DomainTransferred has copy, drop {
        domain_name: String,
        from: address,
        to: address,
        nft_id: ID,
    }

    struct DNSRecordUpdated has copy, drop {
        domain_name: String,
        owner: address,
        record_type: String,
        record_value: String,
    }

    // Initialize the registry
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            domains: table::new(ctx),
            registration_fee: 1000000000, // 1 SUI
            renewal_fee: 500000000,       // 0.5 SUI
        };

        let cap = RegistryCap {
            id: object::new(ctx),
        };

        transfer::share_object(registry);
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    // Register a new domain
    public entry fun register_domain(
        registry: &mut Registry,
        domain_name: String,
        ipfs_hash: String,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Validate domain name
        assert!(!string::is_empty(&domain_name), E_INVALID_DOMAIN_NAME);
        assert!(!table::contains(&registry.domains, domain_name), E_DOMAIN_ALREADY_EXISTS);
        
        // Check payment
        assert!(coin::value(&payment) >= registry.registration_fee, E_INSUFFICIENT_PAYMENT);

        let sender = tx_context::sender(ctx);
        let current_time = tx_context::epoch(ctx);
        let expires_at = current_time + 365; // 1 year expiration

        // Create domain NFT
        let domain_nft = DomainNFT {
            id: object::new(ctx),
            name: domain_name,
            owner: sender,
            ipfs_hash,
            dns_records: vector::empty(),
            created_at: current_time,
            expires_at,
        };

        let nft_id = object::id(&domain_nft);
        
        // Add to registry
        table::add(&mut registry.domains, domain_name, nft_id);

        // Emit event
        event::emit(DomainRegistered {
            domain_name,
            owner: sender,
            nft_id,
            ipfs_hash,
        });

        // Transfer payment to registry (in real implementation, would go to treasury)
        transfer::public_transfer(payment, @decentra_dns);
        
        // Transfer NFT to owner
        transfer::transfer(domain_nft, sender);
    }

    // Add or update DNS record
    public entry fun update_dns_record(
        domain_nft: &mut DomainNFT,
        record_type: String,
        name: String,
        value: String,
        ttl: u64,
        ctx: &mut TxContext
    ) {
        assert!(domain_nft.owner == tx_context::sender(ctx), E_NOT_OWNER);

        let new_record = DNSRecord {
            record_type,
            name,
            value,
            ttl,
        };

        // Find and update existing record or add new one
        let records = &mut domain_nft.dns_records;
        let mut found = false;
        let mut i = 0;
        
        while (i < vector::length(records)) {
            let record = vector::borrow_mut(records, i);
            if (record.record_type == new_record.record_type && record.name == new_record.name) {
                *record = new_record;
                found = true;
                break
            };
            i = i + 1;
        };

        if (!found) {
            vector::push_back(records, new_record);
        };

        // Emit event
        event::emit(DNSRecordUpdated {
            domain_name: domain_nft.name,
            owner: domain_nft.owner,
            record_type: new_record.record_type,
            record_value: new_record.value,
        });
    }

    // Transfer domain ownership
    public entry fun transfer_domain(
        domain_nft: DomainNFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(domain_nft.owner == tx_context::sender(ctx), E_NOT_OWNER);

        let domain_name = domain_nft.name;
        let nft_id = object::id(&domain_nft);
        let from = domain_nft.owner;

        // Update owner in NFT
        domain_nft.owner = recipient;

        // Emit event
        event::emit(DomainTransferred {
            domain_name,
            from,
            to: recipient,
            nft_id,
        });

        // Transfer NFT
        transfer::transfer(domain_nft, recipient);
    }

    // Resolve domain to get DNS records
    public fun resolve_domain(
        registry: &Registry,
        domain_name: String
    ): (bool, vector<DNSRecord>) {
        if (table::contains(&registry.domains, domain_name)) {
            // In a real implementation, we would fetch the NFT and return its records
            // For now, return empty vector indicating domain exists
            (true, vector::empty())
        } else {
            (false, vector::empty())
        }
    }

    // Update IPFS hash
    public entry fun update_ipfs_hash(
        domain_nft: &mut DomainNFT,
        new_ipfs_hash: String,
        ctx: &mut TxContext
    ) {
        assert!(domain_nft.owner == tx_context::sender(ctx), E_NOT_OWNER);
        domain_nft.ipfs_hash = new_ipfs_hash;
    }

    // Renew domain
    public entry fun renew_domain(
        registry: &Registry,
        domain_nft: &mut DomainNFT,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(domain_nft.owner == tx_context::sender(ctx), E_NOT_OWNER);
        assert!(coin::value(&payment) >= registry.renewal_fee, E_INSUFFICIENT_PAYMENT);

        // Extend expiration by 1 year
        domain_nft.expires_at = domain_nft.expires_at + 365;

        // Transfer payment
        transfer::public_transfer(payment, @decentra_dns);
    }

    // Admin functions
    public entry fun update_fees(
        _: &RegistryCap,
        registry: &mut Registry,
        registration_fee: u64,
        renewal_fee: u64,
    ) {
        registry.registration_fee = registration_fee;
        registry.renewal_fee = renewal_fee;
    }

    // Getter functions
    public fun get_domain_info(domain_nft: &DomainNFT): (String, address, String, u64, u64) {
        (
            domain_nft.name,
            domain_nft.owner,
            domain_nft.ipfs_hash,
            domain_nft.created_at,
            domain_nft.expires_at
        )
    }

    public fun get_dns_records(domain_nft: &DomainNFT): &vector<DNSRecord> {
        &domain_nft.dns_records
    }

    public fun get_registration_fee(registry: &Registry): u64 {
        registry.registration_fee
    }

    public fun get_renewal_fee(registry: &Registry): u64 {
        registry.renewal_fee
    }
}
