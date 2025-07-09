"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, User, CreditCard, Shield, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import UserDetailsForm from "@/components/user-details-form"
import CostingOptions from "@/components/costing-options"
import RegistrationSummary from "@/components/registration-summary"
import { useWallet } from "@/components/wallet-provider"

export default function RegisterDomainPage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, connect } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const domainName = decodeURIComponent(params.domain as string)
  const [registrationData, setRegistrationData] = useState({
    domain: domainName,
    userDetails: null,
    selectedPlan: null,
    totalCost: 0,
  })

  const steps = [
    { number: 1, title: "User Details", icon: User, description: "Personal information" },
    { number: 2, title: "Choose Plan", icon: CreditCard, description: "Select registration options" },
    { number: 3, title: "Review & Pay", icon: Shield, description: "Confirm and complete" },
  ]

  useEffect(() => {
    if (!isConnected) {
      // Don't redirect immediately, show connection prompt instead
      return
    }
  }, [isConnected])

  const handleUserDetailsSubmit = (userDetails: any) => {
    setRegistrationData((prev) => ({ ...prev, userDetails }))
    setCurrentStep(2)
  }

  const handlePlanSelection = (planData: any) => {
    setRegistrationData((prev) => ({ ...prev, selectedPlan: planData.plan, totalCost: planData.totalCost }))
    setCurrentStep(3)
  }

  const handleFinalSubmit = async (finalData: any) => {
    setIsProcessing(true)
    try {
      // Simulate registration process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In real implementation:
      // 1. Create IPFS metadata
      // 2. Call smart contract
      // 3. Mint NFT
      // 4. Update DNS records

      console.log("Registration completed:", { ...registrationData, ...finalData })

      // Navigate to success page
      router.push(`/registration-success/${encodeURIComponent(domainName)}`)
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/")
    }
  }

  const progressPercentage = (currentStep / steps.length) * 100

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="bg-gray-800 border-gray-700 max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Globe className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Wallet Required</h2>
              <p className="text-gray-400 mb-6">Please connect your Sui wallet to register a domain.</p>
              <Button onClick={connect} className="w-full bg-blue-600 hover:bg-blue-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-400 hover:text-white mb-4"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Register {domainName}.dns</h1>
            <p className="text-gray-400">Complete your domain registration in {steps.length} simple steps</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    currentStep >= step.number
                      ? "bg-blue-600 text-white"
                      : currentStep === step.number
                        ? "bg-blue-600/20 text-blue-400 border-2 border-blue-600"
                        : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-gray-400"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Info Card */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{domainName}.dns</h3>
                  <p className="text-gray-400">Decentralized Domain Registration</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white mb-2">Available</Badge>
                <div className="text-sm text-gray-400">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && <UserDetailsForm onSubmit={handleUserDetailsSubmit} />}
          {currentStep === 2 && (
            <CostingOptions domainName={domainName} onPlanSelect={handlePlanSelection} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <RegistrationSummary
              registrationData={registrationData}
              onSubmit={handleFinalSubmit}
              onBack={handleBack}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  )
}
