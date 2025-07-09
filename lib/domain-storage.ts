export interface PurchasedDomain {
  id: string
  name: string
  purchaseDate: string
  expiresAt: string
  nftId: string
  ipfsHash: string
  status: "active" | "pending" | "expired" | "deleted"
  plan: string
  userDetails: any
  htmlCode?: string
  cssCode?: string
  jsCode?: string
  isPublished?: boolean
  transferHistory?: TransferRecord[]
  dnsHistory?: DNSHistoryRecord[]
}

export interface TransferRecord {
  id: string
  fromAddress: string
  toAddress: string
  timestamp: number
  transactionHash: string
  status: "pending" | "completed" | "failed"
}

export interface DNSHistoryRecord {
  id: string
  domainName: string
  action: "registered" | "renewed" | "transferred" | "deleted" | "dns_updated"
  timestamp: number
  details: any
  userAddress: string
}

export class DomainStorage {
  private static STORAGE_KEY = "decentradns_purchased_domains"
  private static DNS_HISTORY_KEY = "decentradns_dns_history"

  static getPurchasedDomains(): PurchasedDomain[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading purchased domains:", error)
      return []
    }
  }

  static addPurchasedDomain(domain: PurchasedDomain): void {
    if (typeof window === "undefined") return

    try {
      const domains = this.getPurchasedDomains()
      const existingIndex = domains.findIndex((d) => d.name === domain.name)

      if (existingIndex >= 0) {
        domains[existingIndex] = domain
      } else {
        domains.push(domain)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(domains))

      // Add to DNS history
      this.addDNSHistoryRecord({
        id: `reg_${Date.now()}`,
        domainName: domain.name,
        action: "registered",
        timestamp: Date.now(),
        details: { plan: domain.plan, nftId: domain.nftId },
        userAddress: "0x1234...5678", // Mock address
      })
    } catch (error) {
      console.error("Error saving purchased domain:", error)
    }
  }

  static updateDomainCode(domainName: string, code: { html?: string; css?: string; js?: string }): void {
    if (typeof window === "undefined") return

    try {
      const domains = this.getPurchasedDomains()
      const domainIndex = domains.findIndex((d) => d.name === domainName)

      if (domainIndex >= 0) {
        domains[domainIndex] = {
          ...domains[domainIndex],
          htmlCode: code.html ?? domains[domainIndex].htmlCode,
          cssCode: code.css ?? domains[domainIndex].cssCode,
          jsCode: code.js ?? domains[domainIndex].jsCode,
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(domains))

        // Add to DNS history
        this.addDNSHistoryRecord({
          id: `update_${Date.now()}`,
          domainName: domainName,
          action: "dns_updated",
          timestamp: Date.now(),
          details: { type: "code_update" },
          userAddress: "0x1234...5678",
        })
      }
    } catch (error) {
      console.error("Error updating domain code:", error)
    }
  }

  static publishDomain(domainName: string, isPublished: boolean): void {
    if (typeof window === "undefined") return

    try {
      const domains = this.getPurchasedDomains()
      const domainIndex = domains.findIndex((d) => d.name === domainName)

      if (domainIndex >= 0) {
        domains[domainIndex].isPublished = isPublished
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(domains))
      }
    } catch (error) {
      console.error("Error publishing domain:", error)
    }
  }

  static deleteDomain(domainName: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const domains = this.getPurchasedDomains()
      const domainIndex = domains.findIndex((d) => d.name === domainName)

      if (domainIndex >= 0) {
        // Mark as deleted instead of removing completely
        domains[domainIndex].status = "deleted"
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(domains))

        // Add to DNS history
        this.addDNSHistoryRecord({
          id: `del_${Date.now()}`,
          domainName: domainName,
          action: "deleted",
          timestamp: Date.now(),
          details: { nftId: domains[domainIndex].nftId },
          userAddress: "0x1234...5678",
        })

        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting domain:", error)
      return false
    }
  }

  static transferDomain(domainName: string, toAddress: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const domains = this.getPurchasedDomains()
      const domainIndex = domains.findIndex((d) => d.name === domainName)

      if (domainIndex >= 0) {
        const transferRecord: TransferRecord = {
          id: `transfer_${Date.now()}`,
          fromAddress: "0x1234...5678", // Current owner
          toAddress: toAddress,
          timestamp: Date.now(),
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: "completed",
        }

        if (!domains[domainIndex].transferHistory) {
          domains[domainIndex].transferHistory = []
        }
        domains[domainIndex].transferHistory!.push(transferRecord)

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(domains))

        // Add to DNS history
        this.addDNSHistoryRecord({
          id: `transfer_${Date.now()}`,
          domainName: domainName,
          action: "transferred",
          timestamp: Date.now(),
          details: { fromAddress: transferRecord.fromAddress, toAddress: transferRecord.toAddress },
          userAddress: transferRecord.fromAddress,
        })

        return true
      }
      return false
    } catch (error) {
      console.error("Error transferring domain:", error)
      return false
    }
  }

  static getDomain(domainName: string): PurchasedDomain | null {
    const domains = this.getPurchasedDomains()
    return domains.find((d) => d.name === domainName && d.status !== "deleted") || null
  }

  static getAllDomains(): PurchasedDomain[] {
    return this.getPurchasedDomains()
  }

  // DNS History Management
  static getDNSHistory(): DNSHistoryRecord[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.DNS_HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading DNS history:", error)
      return []
    }
  }

  static addDNSHistoryRecord(record: DNSHistoryRecord): void {
    if (typeof window === "undefined") return

    try {
      const history = this.getDNSHistory()
      history.unshift(record) // Add to beginning

      // Keep only last 100 records
      if (history.length > 100) {
        history.splice(100)
      }

      localStorage.setItem(this.DNS_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error("Error adding DNS history record:", error)
    }
  }

  static clearDNSHistory(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.DNS_HISTORY_KEY)
  }

  // Statistics
  static getDomainStats() {
    const domains = this.getPurchasedDomains()
    const history = this.getDNSHistory()

    return {
      totalDomains: domains.length,
      activeDomains: domains.filter((d) => d.status === "active").length,
      expiredDomains: domains.filter((d) => d.status === "expired").length,
      deletedDomains: domains.filter((d) => d.status === "deleted").length,
      totalTransactions: history.length,
      recentActivity: history.slice(0, 10),
    }
  }
}
