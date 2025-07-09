"use client"

import { useState } from "react"
import { Globe, Search, Copy, ExternalLink, Server, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ResolverPage() {
  const [lookupDomain, setLookupDomain] = useState("")
  const [isResolving, setIsResolving] = useState(false)
  const [resolveResult, setResolveResult] = useState<any>(null)

  const handleDomainLookup = async () => {
    if (!lookupDomain.trim()) return

    setIsResolving(true)
    // Simulate DNS resolution
    setTimeout(() => {
      setResolveResult({
        domain: lookupDomain,
        resolved: true,
        records: [
          { type: "A", value: "192.168.1.100", ttl: 300 },
          { type: "AAAA", value: "2001:db8::1", ttl: 300 },
          { type: "CNAME", value: "example.com", ttl: 300 },
        ],
        nftId: "SUI_NFT_" + Math.random().toString(36).substr(2, 9),
        ipfsHash: "Qm" + Math.random().toString(36).substr(2, 44),
        owner: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
        resolveTime: Math.floor(Math.random() * 50) + 10,
      })
      setIsResolving(false)
    }, 1000)
  }

  const resolverStats = [
    { label: "Total Queries", value: "2,847,392" },
    { label: "Avg Response Time", value: "23ms" },
    { label: "Success Rate", value: "99.8%" },
    { label: "Active Nodes", value: "156" },
  ]

  const recentQueries = [
    { domain: "myapp.dns", ip: "192.168.1.1", time: "2s ago", status: "success" },
    { domain: "portfolio.dns", ip: "203.0.113.1", time: "5s ago", status: "success" },
    { domain: "startup.dns", ip: "Not found", time: "12s ago", status: "failed" },
    { domain: "crypto.dns", ip: "198.51.100.1", time: "18s ago", status: "success" },
    { domain: "nft.dns", ip: "172.16.0.1", time: "25s ago", status: "success" },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
                Marketplace
              </Link>
              <Link href="/resolver" className="text-blue-400 font-medium">
                Resolver
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">Connect Wallet</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DNS Resolver</h1>
          <p className="text-gray-400">Resolve decentralized domains to IP addresses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {resolverStats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* DNS Lookup */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  DNS Lookup
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Resolve any decentralized domain to its IP address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter domain name (e.g., myapp.dns)"
                      value={lookupDomain}
                      onChange={(e) => setLookupDomain(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && handleDomainLookup()}
                    />
                  </div>
                  <Button onClick={handleDomainLookup} disabled={isResolving} className="bg-blue-600 hover:bg-blue-700">
                    {isResolving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Resolve
                      </>
                    )}
                  </Button>
                </div>

                {/* Resolution Result */}
                {resolveResult && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <div>
                          <div className="text-white font-semibold">{resolveResult.domain}</div>
                          <div className="text-sm text-gray-400">Resolved in {resolveResult.resolveTime}ms</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">Success</Badge>
                    </div>

                    <Tabs defaultValue="records" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                        <TabsTrigger value="records" className="data-[state=active]:bg-gray-600">
                          DNS Records
                        </TabsTrigger>
                        <TabsTrigger value="nft" className="data-[state=active]:bg-gray-600">
                          NFT Info
                        </TabsTrigger>
                        <TabsTrigger value="ipfs" className="data-[state=active]:bg-gray-600">
                          IPFS Data
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="records" className="space-y-3">
                        {resolveResult.records.map((record: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <div className="flex items-center space-x-4">
                              <Badge className="bg-blue-600 text-white">{record.type}</Badge>
                              <span className="text-white font-mono">{record.value}</span>
                              <span className="text-gray-400 text-sm">TTL: {record.ttl}s</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(record.value)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="nft" className="space-y-3">
                        <div className="p-4 bg-gray-700 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">NFT ID:</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-mono">{resolveResult.nftId}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(resolveResult.nftId)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Owner:</span>
                            <span className="text-white font-mono">{resolveResult.owner}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Blockchain:</span>
                            <span className="text-white">Sui Network</span>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on Sui Explorer
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="ipfs" className="space-y-3">
                        <div className="p-4 bg-gray-700 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IPFS Hash:</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-mono text-sm">{resolveResult.ipfsHash}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(resolveResult.ipfsHash)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on IPFS Gateway
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Queries */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div className="flex-1">
                        <div className="text-white font-medium">{query.domain}</div>
                        <div className="text-sm text-gray-400">{query.ip}</div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={query.status === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                        >
                          {query.status}
                        </Badge>
                        <div className="text-xs text-gray-400 mt-1">{query.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Documentation */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">API Integration</CardTitle>
            <CardDescription className="text-gray-400">
              Integrate our DNS resolver into your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">REST API Endpoint</h4>
                <div className="p-3 bg-gray-700 rounded font-mono text-sm text-gray-300">
                  GET https://api.decentradns.com/resolve/{"<domain>"}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Example Response</h4>
                <pre className="p-3 bg-gray-700 rounded text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(
                    {
                      domain: "myapp.dns",
                      records: [
                        { type: "A", value: "192.168.1.1", ttl: 300 },
                        { type: "AAAA", value: "2001:db8::1", ttl: 300 },
                      ],
                      nft_id: "SUI_NFT_001",
                      ipfs_hash: "QmX7Y8Z9...",
                      owner: "0x1234...5678",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">View Full API Documentation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
