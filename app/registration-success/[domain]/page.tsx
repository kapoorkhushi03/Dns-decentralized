"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Globe, ExternalLink, Copy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"

export default function RegistrationSuccessPage() {
  const params = useParams()
  const domainName = decodeURIComponent(params.domain as string)

  // Mock transaction data - in real app, this would come from the registration process
  const transactionData = {
    transactionId: "0x1234567890abcdef",
    nftId: "SUI_NFT_001",
    ipfsHash: "QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K",
    blockHeight: 12345678,
    timestamp: Date.now(),
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Registration Successful! 🎉</h1>
          <p className="text-xl text-gray-300 mb-2">
            Congratulations! You now own <span className="text-blue-400 font-semibold">{domainName}.dns</span>
          </p>
          <Badge className="bg-green-600 text-white">NFT Minted Successfully</Badge>
        </div>

        {/* Domain Info Card */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-6 w-6 mr-2 text-blue-400" />
              Your New Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{domainName}.dns</h3>
                <p className="text-gray-400 mb-4">Decentralized domain registered on Sui blockchain</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blockchain:</span>
                    <span className="text-white">Sui Network</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Storage:</span>
                    <span className="text-white">IPFS (Pinata)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Registered:</span>
                    <span className="text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-lg">{domainName}.dns</div>
                  </div>
                </div>
                <p className="text-center text-gray-400 text-sm">Your domain NFT visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono text-sm">{transactionData.transactionId}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transactionData.transactionId)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">NFT ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono text-sm">{transactionData.nftId}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transactionData.nftId)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">IPFS Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono text-sm">{transactionData.ipfsHash}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transactionData.ipfsHash)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Height:</span>
                <span className="text-white">{transactionData.blockHeight.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Manage Your Domain</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Set up DNS records</li>
                  <li>• Configure domain forwarding</li>
                  <li>• Update IPFS metadata</li>
                  <li>• Monitor domain analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Explore Features</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• View your NFT in wallet</li>
                  <li>• List on marketplace</li>
                  <li>• Transfer ownership</li>
                  <li>• Access API endpoints</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/domains">
              Manage Domain
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Sui Explorer
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on IPFS
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-12 p-6 bg-gray-800/50 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Need Help?</h4>
          <p className="text-gray-400 mb-4">
            Our support team is here to help you get the most out of your decentralized domain.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              Documentation
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
