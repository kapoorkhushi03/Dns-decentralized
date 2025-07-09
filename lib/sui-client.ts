import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client"
import { TransactionBlock } from "@mysten/sui.js/transactions"
import type { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519"

// Sui network configuration
const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "0x..." // Replace with actual package ID
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "0x..." // Replace with actual registry ID

export class SuiDNSClient {
  private client: SuiClient
  private packageId: string
  private registryId: string

  constructor() {
    this.client = new SuiClient({ url: getFullnodeUrl(NETWORK as any) })
    this.packageId = PACKAGE_ID
    this.registryId = REGISTRY_ID
  }

  // Register a new domain
  async registerDomain(domainName: string, ipfsHash: string, paymentCoinId: string, signer: Ed25519Keypair) {
    try {
      const tx = new TransactionBlock()

      tx.moveCall({
        target: `${this.packageId}::domain_registry::register_domain`,
        arguments: [tx.object(this.registryId), tx.pure(domainName), tx.pure(ipfsHash), tx.object(paymentCoinId)],
      })

      const result = await this.client.signAndExecuteTransactionBlock({
        signer,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })

      return result
    } catch (error) {
      console.error("Error registering domain:", error)
      throw new Error("Failed to register domain")
    }
  }

  // Update DNS records
  async updateDNSRecord(
    domainNftId: string,
    recordType: string,
    name: string,
    value: string,
    ttl: number,
    signer: Ed25519Keypair,
  ) {
    try {
      const tx = new TransactionBlock()

      tx.moveCall({
        target: `${this.packageId}::domain_registry::update_dns_record`,
        arguments: [tx.object(domainNftId), tx.pure(recordType), tx.pure(name), tx.pure(value), tx.pure(ttl)],
      })

      const result = await this.client.signAndExecuteTransactionBlock({
        signer,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })

      return result
    } catch (error) {
      console.error("Error updating DNS record:", error)
      throw new Error("Failed to update DNS record")
    }
  }

  // Transfer domain ownership
  async transferDomain(domainNftId: string, recipient: string, signer: Ed25519Keypair) {
    try {
      const tx = new TransactionBlock()

      tx.moveCall({
        target: `${this.packageId}::domain_registry::transfer_domain`,
        arguments: [tx.object(domainNftId), tx.pure(recipient)],
      })

      const result = await this.client.signAndExecuteTransactionBlock({
        signer,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })

      return result
    } catch (error) {
      console.error("Error transferring domain:", error)
      throw new Error("Failed to transfer domain")
    }
  }

  // Get domain information
  async getDomainInfo(domainNftId: string) {
    try {
      const object = await this.client.getObject({
        id: domainNftId,
        options: {
          showContent: true,
        },
      })

      return object
    } catch (error) {
      console.error("Error getting domain info:", error)
      throw new Error("Failed to get domain information")
    }
  }

  // Resolve domain name to get records
  async resolveDomain(domainName: string) {
    try {
      // This would typically involve calling a view function
      // For now, we'll simulate the resolution
      const tx = new TransactionBlock()

      tx.moveCall({
        target: `${this.packageId}::domain_registry::resolve_domain`,
        arguments: [tx.object(this.registryId), tx.pure(domainName)],
      })

      // In a real implementation, this would be a dev inspect call
      // const result = await this.client.devInspectTransactionBlock({
      //   transactionBlock: tx,
      //   sender: '0x...',
      // })

      // For now, return mock data
      return {
        exists: true,
        records: [
          { type: "A", name: "@", value: "192.168.1.1", ttl: 300 },
          { type: "CNAME", name: "www", value: domainName, ttl: 300 },
        ],
      }
    } catch (error) {
      console.error("Error resolving domain:", error)
      throw new Error("Failed to resolve domain")
    }
  }

  // Get user's domains
  async getUserDomains(userAddress: string) {
    try {
      const objects = await this.client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${this.packageId}::domain_registry::DomainNFT`,
        },
        options: {
          showContent: true,
        },
      })

      return objects.data
    } catch (error) {
      console.error("Error getting user domains:", error)
      throw new Error("Failed to get user domains")
    }
  }

  // Get registration fee
  async getRegistrationFee() {
    try {
      // This would be a view function call in a real implementation
      return 1000000000 // 1 SUI in MIST
    } catch (error) {
      console.error("Error getting registration fee:", error)
      throw new Error("Failed to get registration fee")
    }
  }

  // Check domain availability
  async isDomainAvailable(domainName: string): Promise<boolean> {
    try {
      const resolution = await this.resolveDomain(domainName)
      return !resolution.exists
    } catch (error) {
      // If resolution fails, assume domain is available
      return true
    }
  }

  // Get SUI balance
  async getSuiBalance(address: string): Promise<number> {
    try {
      const balance = await this.client.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      })
      return Number.parseInt(balance.totalBalance)
    } catch (error) {
      console.error("Error getting SUI balance:", error)
      return 0
    }
  }
}

// Export singleton instance
export const suiClient = new SuiDNSClient()
