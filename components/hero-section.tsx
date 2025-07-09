"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/wallet-provider"

export default function HeroSection() {
  const router = useRouter()
  const [searchDomain, setSearchDomain] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const { isConnected, connect } = useWallet()

  const handleDomainSearch = async () => {
    if (!searchDomain.trim()) return

    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResults({
        domain: searchDomain,
        available: Math.random() > 0.3,
        price: "0.5 SUI",
        suggestions: [`${searchDomain}web3`, `${searchDomain}dao`, `${searchDomain}nft`],
      })
      setIsSearching(false)
    }, 1500)
  }

  const handleRegisterDomain = async () => {
    if (!searchResults?.available) return

    if (!isConnected) {
      try {
        await connect()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        return
      }
    }

    // Navigate to registration page
    router.push(`/register/${encodeURIComponent(searchResults.domain)}`)
  }

  const handleGetStarted = async () => {
    if (!isConnected) {
      try {
        await connect()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Sui Blockchain
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Own Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Digital Identity
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Register decentralized domains as NFTs, store metadata on IPFS, and control your web presence with
            blockchain-powered DNS on the Sui network
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 text-gray-300">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Censorship Resistant</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>NFT Ownership</span>
          </div>
        </div>

        {/* Domain Search */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search for your perfect domain..."
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                className="h-16 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && handleDomainSearch()}
              />
            </div>
            <Button
              onClick={handleDomainSearch}
              disabled={isSearching}
              className="h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Domain
                </>
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults && (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{searchResults.domain}.dns</h3>
                    {searchResults.available ? (
                      <Badge className="bg-green-600 text-white">Available</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">Taken</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{searchResults.price}</p>
                    <p className="text-sm text-gray-400">per year</p>
                  </div>
                </div>

                {searchResults.available ? (
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                    onClick={handleRegisterDomain}
                  >
                    Register Domain & Mint NFT
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-3">Try these alternatives:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.suggestions.map((suggestion: string, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          {suggestion}.dns
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg"
          >
            {isConnected ? "Get Started" : "Connect Wallet to Start"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent px-8 py-4 text-lg"
          >
            View Documentation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Domains Registered", value: "12,847" },
            { label: "Active Users", value: "3,421" },
            { label: "Total Volume", value: "847 SUI" },
            { label: "NFTs Minted", value: "12,847" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
