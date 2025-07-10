"use client"

import { useState, useEffect, Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Shield, Globe, Loader2 } from "lucide-react"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"

type Domain = {
  id: string
  name: string
  price: string
  seller: string
}

interface PurchaseModalProps {
  domain: Domain | null
  isOpen: boolean
  isProcessing: boolean
  onClose: () => void
  onConfirm: (profileData: any) => void
}

export default function PurchaseModal({ domain, isOpen, isProcessing, onClose, onConfirm }: PurchaseModalProps) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Organization (Optional)
    organization: "",
    jobTitle: "",
    // Address
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    // Domain Usage
    intendedUse: "",
    description: "",
    // Preferences
    newsletter: false,
    terms: false,
    privacy: false,
  })

  const [costs, setCosts] = useState({
    domainPrice: Number.parseFloat(domain?.price.replace(" SUI", "") ?? "0"),
    registrationFee: 0.1,
    gasFee: 0.05,
    platformFee: 0.02,
    total: 0,
  })

  // Calculate total cost
  useEffect(() => {
    const total = costs.domainPrice + costs.registrationFee + costs.gasFee + costs.platformFee
    setCosts((prev) => ({ ...prev, total }))
  }, [costs.domainPrice, costs.registrationFee, costs.gasFee, costs.platformFee])

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    return (
      profileData.firstName && profileData.lastName && profileData.email && profileData.terms && profileData.privacy
    )
  }

  const validateStep2 = () => {
    return profileData.address && profileData.city && profileData.country
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleConfirm = () => {
    onConfirm({ ...profileData, costs })
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative w-full max-w-lg overflow-hidden bg-gray-900 border border-gray-700 rounded-lg">
              <Card className="bg-transparent border-0">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-white">{domain?.name ?? "Purchase Domain"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-8">
                  {domain ? (
                    <>
                      <div className="text-sm text-gray-400">
                        Seller&nbsp;
                        <span className="font-mono text-gray-300">
                          {domain.seller.slice(0, 6)}…{domain.seller.slice(-4)}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-blue-400">{domain.price}</div>
                    </>
                  ) : (
                    <p className="text-gray-400">No domain selected. Please close this dialog and try again.</p>
                  )}

                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <User className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-white">
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-white">
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-white">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <Separator className="bg-gray-600" />

                      <div>
                        <h4 className="text-white font-medium mb-3">Organization (Optional)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="organization" className="text-white">
                              Company/Organization
                            </Label>
                            <Input
                              id="organization"
                              value={profileData.organization}
                              onChange={(e) => handleInputChange("organization", e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="Acme Corp"
                            />
                          </div>
                          <div>
                            <Label htmlFor="jobTitle" className="text-white">
                              Job Title
                            </Label>
                            <Input
                              id="jobTitle"
                              value={profileData.jobTitle}
                              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="CEO"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={profileData.terms}
                            onCheckedChange={(checked) => handleInputChange("terms", checked)}
                          />
                          <Label htmlFor="terms" className="text-white text-sm">
                            I agree to the{" "}
                            <span className="text-blue-400 underline cursor-pointer">Terms of Service</span> *
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="privacy"
                            checked={profileData.privacy}
                            onCheckedChange={(checked) => handleInputChange("privacy", checked)}
                          />
                          <Label htmlFor="privacy" className="text-white text-sm">
                            I agree to the{" "}
                            <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span> *
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="newsletter"
                            checked={profileData.newsletter}
                            onCheckedChange={(checked) => handleInputChange("newsletter", checked)}
                          />
                          <Label htmlFor="newsletter" className="text-white text-sm">
                            Subscribe to newsletter for updates and announcements
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Address & Domain Usage */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Globe className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Address & Domain Usage</h3>
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-white">
                          Street Address *
                        </Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-white">
                            City *
                          </Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-white">
                            State/Province
                          </Label>
                          <Input
                            id="state"
                            value={profileData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="NY"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country" className="text-white">
                            Country *
                          </Label>
                          <Select
                            value={profileData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="jp">Japan</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="text-white">
                            ZIP/Postal Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={profileData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <Separator className="bg-gray-600" />

                      <div>
                        <Label htmlFor="intendedUse" className="text-white">
                          Intended Use
                        </Label>
                        <Select
                          value={profileData.intendedUse}
                          onValueChange={(value) => handleInputChange("intendedUse", value)}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select intended use" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="personal">Personal Website</SelectItem>
                            <SelectItem value="business">Business Website</SelectItem>
                            <SelectItem value="portfolio">Portfolio</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="dapp">DApp/Web3 Project</SelectItem>
                            <SelectItem value="investment">Investment/Resale</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-white">
                          Project Description
                        </Label>
                        <Textarea
                          id="description"
                          value={profileData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Briefly describe your project or how you plan to use this domain..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Summary */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Payment Summary</h3>
                      </div>

                      {/* Domain Info */}
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            <span>{domain?.name}</span>
                            <Badge className="bg-blue-600 text-white">Category</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Type:</span>
                              <span className="text-white">Direct Purchase</span>
                            </div>
                            {domain?.seller && (
                              <div className="flex justify-between">
                                <span className="text-gray-300">Seller:</span>
                                <span className="text-white font-mono">{domain.seller}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-300">Duration:</span>
                              <span className="text-white">1 Year</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cost Breakdown */}
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white">Cost Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Domain Price:</span>
                              <span className="text-white">{costs.domainPrice.toFixed(2)} SUI</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Registration Fee:</span>
                              <span className="text-white">{costs.registrationFee.toFixed(2)} SUI</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Gas Fee (Estimated):</span>
                              <span className="text-white">{costs.gasFee.toFixed(2)} SUI</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Platform Fee:</span>
                              <span className="text-white">{costs.platformFee.toFixed(2)} SUI</span>
                            </div>
                            <Separator className="bg-gray-600" />
                            <div className="flex justify-between text-lg font-semibold">
                              <span className="text-white">Total:</span>
                              <span className="text-blue-400">{costs.total.toFixed(2)} SUI</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Profile Summary */}
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white">Profile Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Name:</span>
                              <span className="text-white">
                                {profileData.firstName} {profileData.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Email:</span>
                              <span className="text-white">{profileData.email}</span>
                            </div>
                            {profileData.organization && (
                              <div className="flex justify-between">
                                <span className="text-gray-300">Organization:</span>
                                <span className="text-white">{profileData.organization}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-300">Location:</span>
                              <span className="text-white">
                                {profileData.city}, {profileData.country}
                              </span>
                            </div>
                            {profileData.intendedUse && (
                              <div className="flex justify-between">
                                <span className="text-gray-300">Intended Use:</span>
                                <span className="text-white">{profileData.intendedUse}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Security Notice */}
                      <div className="flex items-start space-x-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-blue-400 font-medium">Secure Transaction</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            This transaction will be processed on the Sui blockchain. Your domain will be minted as an
                            NFT and metadata will be stored on IPFS via Pinata for permanent availability.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                    <div className="flex space-x-3">
                      {step > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => setStep(step - 1)}
                          className="border-gray-600 text-gray-300 bg-transparent"
                          disabled={isProcessing}
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-600 text-gray-300 bg-transparent"
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      {step < 3 ? (
                        <Button
                          onClick={handleNext}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={step === 1 ? !validateStep1() : !validateStep2()}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleConfirm}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            `Confirm Purchase (${costs.total.toFixed(2)} SUI)`
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
