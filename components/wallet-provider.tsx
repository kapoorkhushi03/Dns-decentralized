"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  connectWallet: () => Promise<void>
  connect: () => Promise<void>
  disconnectWallet: () => void
  disconnect: () => void
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const checkWalletConnection = useCallback(async () => {
    try {
      // Check if wallet is already connected (from localStorage or wallet extension)
      const savedAddress = localStorage.getItem("wallet_address")
      if (savedAddress) {
        setAddress(savedAddress)
        setIsConnected(true)
        // Simulate balance fetch
        setBalance(Math.random() * 1000)
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }, [])

  useEffect(() => {
    checkWalletConnection()
  }, [checkWalletConnection])

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
      setAddress(mockAddress)
      setIsConnected(true)
      setBalance(Math.random() * 1000)

      localStorage.setItem("wallet_address", mockAddress)

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    localStorage.removeItem("wallet_address")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connectWallet,
        connect: connectWallet,
        disconnectWallet,
        disconnect: disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
