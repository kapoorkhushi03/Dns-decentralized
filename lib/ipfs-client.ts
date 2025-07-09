export class IPFSClient {
  private static PINATA_API_KEY = process.env.PINATA_API_KEY
  private static PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY
  private static PINATA_GATEWAY = "https://gateway.pinata.cloud"

  static async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: this.PINATA_API_KEY || "",
          pinata_secret_api_key: this.PINATA_SECRET_KEY || "",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.IpfsHash
    } catch (error) {
      console.error("Error uploading to IPFS:", error)
      throw error
    }
  }

  static async uploadJSON(data: any): Promise<string> {
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: this.PINATA_API_KEY || "",
          pinata_secret_api_key: this.PINATA_SECRET_KEY || "",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.IpfsHash
    } catch (error) {
      console.error("Error uploading JSON to IPFS:", error)
      throw error
    }
  }

  static async unpinFile(ipfsHash: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        method: "DELETE",
        headers: {
          pinata_api_key: this.PINATA_API_KEY || "",
          pinata_secret_api_key: this.PINATA_SECRET_KEY || "",
        },
      })

      if (!response.ok) {
        console.warn(`Failed to unpin ${ipfsHash}: ${response.status}`)
        return false
      }

      return true
    } catch (error) {
      console.error("Error unpinning from IPFS:", error)
      return false
    }
  }

  static getGatewayUrl(ipfsHash: string): string {
    return `${this.PINATA_GATEWAY}/ipfs/${ipfsHash}`
  }

  static async getFileInfo(ipfsHash: string): Promise<any> {
    try {
      const response = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`, {
        method: "GET",
        headers: {
          pinata_api_key: this.PINATA_API_KEY || "",
          pinata_secret_api_key: this.PINATA_SECRET_KEY || "",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.rows[0] || null
    } catch (error) {
      console.error("Error getting file info from IPFS:", error)
      return null
    }
  }
}
