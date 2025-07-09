"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  signAndExecuteTransaction: (transaction: any) => Promise<any>
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const [suiClient] = useState(() => new SuiClient({ url: getFullnodeUrl("testnet") }))

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      // Check if Sui wallet is installed
      if (typeof window !== "undefined" && (window as any).suiWallet) {
        const wallet = (window as any).suiWallet
        const accounts = await wallet.getAccounts()
        if (accounts.length > 0) {
          setAddress(accounts[0].address)
          setIsConnected(true)
          await updateBalance(accounts[0].address)
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const updateBalance = async (walletAddress: string) => {
    try {
      const balanceResult = await suiClient.getBalance({
        owner: walletAddress,
        coinType: "0x2::sui::SUI",
      })
      const suiBalance = (Number.parseInt(balanceResult.totalBalance) / 1_000_000_000).toFixed(4)
      setBalance(suiBalance)
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("0")
    }
  }

  const connect = async () => {
    setIsLoading(true)
    try {
      // Check if Sui wallet is installed
      if (typeof window === "undefined" || !(window as any).suiWallet) {
        // Fallback: simulate wallet connection for demo
        const demoAddress = "0x" + Math.random().toString(16).substr(2, 40)
        setAddress(demoAddress)
        setIsConnected(true)
        setBalance("10.5000")
        return
      }

      const wallet = (window as any).suiWallet

      // Request connection
      await wallet.requestPermissions({
        permissions: ["viewAccount", "suggestTransactions"],
      })

      // Get accounts
      const accounts = await wallet.getAccounts()
      if (accounts.length > 0) {
        setAddress(accounts[0].address)
        setIsConnected(true)
        await updateBalance(accounts[0].address)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw new Error("Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
  }

  const signAndExecuteTransaction = async (transaction: any) => {
    if (!isConnected || typeof window === "undefined" || !(window as any).suiWallet) {
      throw new Error("Wallet not connected")
    }

    try {
      const wallet = (window as any).suiWallet
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })

      // Update balance after transaction
      if (address) {
        await updateBalance(address)
      }

      return result
    } catch (error) {
      console.error("Error executing transaction:", error)
      throw error
    }
  }

  const value = {
    isConnected,
    address,
    balance,
    connect,
    disconnect,
    signAndExecuteTransaction,
    isLoading,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
