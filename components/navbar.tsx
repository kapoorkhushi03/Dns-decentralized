"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, Menu, X, Wallet, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isConnected, address, balance, connect, disconnect, isLoading } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">DecentraDNS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/domains" className="text-gray-300 hover:text-white transition-colors font-medium">
              My Domains
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/resolver" className="text-gray-300 hover:text-white transition-colors font-medium">
              Resolver
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors font-medium">
              Docs
            </Link>

            {/* Wallet Connection */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{formatAddress(address!)}</span>
                        <span className="text-xs text-gray-400">{balance} SUI</span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">Connected Wallet</p>
                    <p className="text-xs text-gray-400 font-mono">{address}</p>
                    <p className="text-xs text-gray-400 mt-1">Balance: {balance} SUI</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={disconnect} className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleConnect} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/domains"
                className="text-gray-300 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Domains
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-300 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/resolver"
                className="text-gray-300 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resolver
              </Link>
              <Link
                href="/docs"
                className="text-gray-300 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-gray-800">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="px-2">
                      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {address?.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{formatAddress(address!)}</p>
                          <p className="text-xs text-gray-400">{balance} SUI</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={disconnect}
                      variant="outline"
                      className="w-full mx-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full mx-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
