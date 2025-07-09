"use client"

import { useState } from "react"
import { Globe, Search, Filter, TrendingUp, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PurchaseModal from "@/components/purchase-modal"
import Link from "next/link"

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-low")
  const [filterBy, setFilterBy] = useState("all")

  const [selectedDomainForPurchase, setSelectedDomainForPurchase] = useState<any>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const domains = [
    {
      id: "1",
      name: "crypto.dns",
      price: "15.5 SUI",
      seller: "0x1234...5678",
      category: "Finance",
      length: 6,
      age: "2 years",
      views: 1250,
      isAuction: false,
      endsAt: null,
    },
    {
      id: "2",
      name: "nft.dns",
      price: "8.2 SUI",
      seller: "0x9876...5432",
      category: "Technology",
      length: 3,
      age: "1 year",
      views: 890,
      isAuction: true,
      endsAt: "2024-07-15T10:30:00Z",
    },
    {
      id: "3",
      name: "defi.dns",
      price: "22.0 SUI",
      seller: "0x5555...7777",
      category: "Finance",
      length: 4,
      age: "3 years",
      views: 2100,
      isAuction: false,
      endsAt: null,
    },
    {
      id: "4",
      name: "web3gaming.dns",
      price: "5.8 SUI",
      seller: "0x3333...9999",
      category: "Gaming",
      length: 10,
      age: "6 months",
      views: 450,
      isAuction: true,
      endsAt: "2024-07-12T15:45:00Z",
    },
    {
      id: "5",
      name: "ai.dns",
      price: "45.0 SUI",
      seller: "0x7777...1111",
      category: "Technology",
      length: 2,
      age: "4 years",
      views: 3200,
      isAuction: false,
      endsAt: null,
    },
    {
      id: "6",
      name: "metaverse.dns",
      price: "12.3 SUI",
      seller: "0x2222...8888",
      category: "Gaming",
      length: 9,
      age: "1.5 years",
      views: 780,
      isAuction: true,
      endsAt: "2024-07-20T09:15:00Z",
    },
  ]

  const categories = ["All", "Finance", "Technology", "Gaming", "Art", "Business"]

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const diff = end - now

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handlePurchase = async (domain: any) => {
    setSelectedDomainForPurchase(domain)
    setShowPurchaseModal(true)
  }

  const confirmPurchase = async (profileData: any) => {
    setIsPurchasing(true)
    try {
      // Simulate purchase process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real implementation, this would:
      // 1. Connect to wallet
      // 2. Create IPFS metadata with profile data
      // 3. Create transaction
      // 4. Transfer payment
      // 5. Transfer domain NFT

      console.log("Purchase completed with profile:", profileData)
      alert(`Successfully purchased ${selectedDomainForPurchase.name}!`)
      setShowPurchaseModal(false)
    } catch (error) {
      alert("Purchase failed. Please try again.")
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">DecentraDNS</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/domains" className="text-gray-300 hover:text-white transition-colors">
                My Domains
              </Link>
              <Link href="/marketplace" className="text-blue-400 font-medium">
                Marketplace
              </Link>
              <Link href="/resolver" className="text-gray-300 hover:text-white transition-colors">
                Resolver
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">Connect Wallet</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Domain Marketplace</h1>
          <p className="text-gray-400">Buy and sell premium decentralized domains</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="length">Length</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterBy === category.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy(category.toLowerCase())}
                className={
                  filterBy === category.toLowerCase()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Domain Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl">{domain.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {domain.length} characters • {domain.age} old
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className="bg-blue-600 text-white">{domain.category}</Badge>
                    {domain.isAuction && (
                      <Badge className="bg-orange-600 text-white">
                        <Clock className="h-3 w-3 mr-1" />
                        Auction
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{domain.price}</div>
                      {domain.isAuction && domain.endsAt && (
                        <div className="text-sm text-orange-400">Ends in {getTimeRemaining(domain.endsAt)}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{domain.views} views</div>
                      <div className="text-xs text-gray-500">
                        by {domain.seller.slice(0, 6)}...{domain.seller.slice(-4)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase(domain)}>
                      {domain.isAuction ? "Place Bid" : "Buy Now"}
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
            Load More Domains
          </Button>
        </div>
      </div>

      {/* Purchase Modal – rendered only after a domain is chosen */}
      {selectedDomainForPurchase && (
        <PurchaseModal
          domain={selectedDomainForPurchase}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={confirmPurchase}
          isProcessing={isPurchasing}
        />
      )}
    </div>
  )
}
