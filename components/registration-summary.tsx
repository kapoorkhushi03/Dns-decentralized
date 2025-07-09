"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Shield, Globe, User, CreditCard, CheckCircle } from "lucide-react"
import { DomainStorage } from "@/lib/domain-storage"

interface RegistrationSummaryProps {
  registrationData: any
  onSubmit: (data: any) => void
  onBack: () => void
  isProcessing: boolean
}

export default function RegistrationSummary({
  registrationData,
  onSubmit,
  onBack,
  isProcessing,
}: RegistrationSummaryProps) {
  const { domain, userDetails, selectedPlan, totalCost } = registrationData

  const handleConfirm = () => {
    const finalData = {
      timestamp: Date.now(),
      transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
    }

    // Save purchased domain to local storage
    const purchasedDomain = {
      id: Math.random().toString(36).substr(2, 9),
      name: domain,
      purchaseDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (selectedPlan?.duration || 1) * 365 * 24 * 60 * 60 * 1000).toISOString(),
      nftId: `SUI_NFT_${Math.random().toString(36).substr(2, 9)}`,
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
      status: "active" as const,
      plan: selectedPlan?.name || "Standard",
      userDetails,
      htmlCode: "",
      cssCode: "",
      jsCode: "",
      isPublished: false,
    }

    DomainStorage.addPurchasedDomain(purchasedDomain)

    onSubmit({ ...finalData, purchasedDomain })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Registration</h2>
        <p className="text-gray-400">Please review all details before completing your domain registration</p>
      </div>

      {/* Domain Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Domain Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{domain}.dns</h3>
              <p className="text-gray-400">Decentralized Domain Registration</p>
            </div>
            <Badge className="bg-green-600 text-white">Available</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Plan:</span>
              <span className="text-white ml-2">{selectedPlan?.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="text-white ml-2">
                {selectedPlan?.duration} year{selectedPlan?.duration > 1 ? "s" : ""}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Blockchain:</span>
              <span className="text-white ml-2">Sui Network</span>
            </div>
            <div>
              <span className="text-gray-400">Storage:</span>
              <span className="text-white ml-2">IPFS (Pinata)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            Registration Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">
                    {userDetails?.firstName} {userDetails?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{userDetails?.email}</span>
                </div>
                {userDetails?.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{userDetails?.phone}</span>
                  </div>
                )}
                {userDetails?.organization && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Organization:</span>
                    <span className="text-white">{userDetails?.organization}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Address</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white">{userDetails?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">City:</span>
                  <span className="text-white">{userDetails?.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white">{userDetails?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Intended Use:</span>
                  <span className="text-white">{userDetails?.intendedUse}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Details */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
            Plan & Add-ons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{selectedPlan?.name} Plan</h4>
                <p className="text-gray-400 text-sm">{selectedPlan?.description}</p>
              </div>
              <Badge className="bg-blue-600 text-white">
                {selectedPlan?.duration} year{selectedPlan?.duration > 1 ? "s" : ""}
              </Badge>
            </div>

            {selectedPlan?.addOns && selectedPlan.addOns.length > 0 && (
              <div>
                <h5 className="text-white font-medium mb-2">Add-ons:</h5>
                <ul className="space-y-1">
                  {selectedPlan.addOns.map((addOn: any, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      {addOn.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h5 className="text-white font-medium mb-2">Features:</h5>
              <ul className="grid grid-cols-2 gap-1">
                {selectedPlan?.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Amount</span>
              <span className="text-2xl font-bold text-blue-400">{totalCost.toFixed(2)} SUI</span>
            </div>
            <Separator className="bg-gray-600" />
            <div className="text-sm text-gray-400">
              <p>• Payment will be processed on the Sui blockchain</p>
              <p>• Domain will be minted as an NFT to your wallet</p>
              <p>• Metadata will be stored on IPFS via Pinata</p>
              <p>• Registration is non-refundable once completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-blue-400 font-medium">Secure Transaction</h4>
          <p className="text-sm text-gray-300 mt-1">
            This transaction will be processed securely on the Sui blockchain. Your domain will be minted as an NFT and
            metadata will be stored on IPFS for permanent availability. Make sure you have sufficient SUI balance in
            your connected wallet.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-600 text-gray-300 bg-transparent"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700" disabled={isProcessing}>
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Processing Registration...</span>
            </div>
          ) : (
            <>Complete Registration ({totalCost.toFixed(2)} SUI)</>
          )}
        </Button>
      </div>
    </div>
  )
}
