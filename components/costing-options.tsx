"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Zap, Shield, Globe, ArrowLeft } from "lucide-react"

interface CostingOptionsProps {
  domainName: string
  onPlanSelect: (data: { plan: any; totalCost: number }) => void
  onBack: () => void
}

export default function CostingOptions({ domainName, onPlanSelect, onBack }: CostingOptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard")
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [addOns, setAddOns] = useState({
    privacy: false,
    ssl: false,
    backup: false,
    analytics: false,
  })

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 0.5,
      icon: Globe,
      description: "Perfect for personal use",
      features: [
        "Domain registration",
        "Basic DNS management",
        "IPFS metadata storage",
        "NFT minting",
        "Community support",
      ],
      limitations: ["5 DNS records", "Basic analytics"],
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: 1.2,
      icon: Zap,
      description: "Great for businesses and projects",
      features: [
        "Everything in Basic",
        "Advanced DNS management",
        "Custom DNS records",
        "Priority support",
        "Domain forwarding",
        "Email forwarding",
      ],
      limitations: ["50 DNS records", "Standard analytics"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 2.5,
      icon: Crown,
      description: "For high-traffic applications",
      features: [
        "Everything in Standard",
        "Unlimited DNS records",
        "Advanced analytics",
        "API access",
        "White-label options",
        "24/7 priority support",
        "Custom integrations",
      ],
      limitations: [],
      popular: false,
    },
  ]

  const durations = [
    { years: 1, discount: 0, label: "1 Year" },
    { years: 2, discount: 0.1, label: "2 Years", badge: "Save 10%" },
    { years: 3, discount: 0.15, label: "3 Years", badge: "Save 15%" },
    { years: 5, discount: 0.2, label: "5 Years", badge: "Save 20%" },
  ]

  const addOnOptions = [
    {
      id: "privacy",
      name: "Domain Privacy Protection",
      price: 0.1,
      description: "Hide your personal information from WHOIS lookups",
      icon: Shield,
    },
    {
      id: "ssl",
      name: "SSL Certificate",
      price: 0.05,
      description: "Secure your domain with SSL encryption",
      icon: Shield,
    },
    {
      id: "backup",
      name: "DNS Backup Service",
      price: 0.03,
      description: "Automatic backup of your DNS configurations",
      icon: Shield,
    },
    {
      id: "analytics",
      name: "Advanced Analytics",
      price: 0.08,
      description: "Detailed traffic and performance analytics",
      icon: Zap,
    },
  ]

  const calculateTotal = () => {
    const selectedPlanData = plans.find((p) => p.id === selectedPlan)!
    const selectedDurationData = durations.find((d) => d.years === selectedDuration)!

    const basePrice = selectedPlanData.price * selectedDuration
    const discount = basePrice * selectedDurationData.discount
    const planTotal = basePrice - discount

    let addOnTotal = 0
    Object.entries(addOns).forEach(([key, enabled]) => {
      if (enabled) {
        const addOn = addOnOptions.find((a) => a.id === key)
        if (addOn) {
          addOnTotal += addOn.price * selectedDuration
        }
      }
    })

    const registrationFee = 0.1
    const gasFee = 0.05
    const platformFee = 0.02

    return {
      planTotal,
      addOnTotal,
      registrationFee,
      gasFee,
      platformFee,
      discount,
      total: planTotal + addOnTotal + registrationFee + gasFee + platformFee,
    }
  }

  const costs = calculateTotal()

  const handleContinue = () => {
    const selectedPlanData = plans.find((p) => p.id === selectedPlan)!
    const planData = {
      plan: {
        ...selectedPlanData,
        duration: selectedDuration,
        addOns: Object.entries(addOns)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => addOnOptions.find((a) => a.id === key)),
      },
      totalCost: costs.total,
    }
    onPlanSelect(planData)
  }

  return (
    <div className="space-y-8">
      {/* Plan Selection */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <plan.icon className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                  </div>
                  {plan.popular && <Badge className="bg-blue-600 text-white">Popular</Badge>}
                </div>
                <div className="text-3xl font-bold text-white">
                  {plan.price} SUI
                  <span className="text-sm text-gray-400 font-normal">/year</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.limitations.length > 0 && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Limitations:</p>
                    {plan.limitations.map((limitation, index) => (
                      <p key={index} className="text-xs text-gray-500">
                        • {limitation}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Registration Duration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {durations.map((duration) => (
            <Card
              key={duration.years}
              className={`cursor-pointer transition-all duration-300 ${
                selectedDuration === duration.years
                  ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedDuration(duration.years)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold text-white">{duration.label}</div>
                {duration.badge && <Badge className="bg-green-600 text-white mt-1">{duration.badge}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Add-ons</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {addOnOptions.map((addOn) => (
            <Card key={addOn.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <addOn.icon className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{addOn.name}</div>
                      <div className="text-sm text-gray-400">{addOn.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-white font-semibold">+{addOn.price} SUI</div>
                    <Switch
                      checked={addOns[addOn.id as keyof typeof addOns]}
                      onCheckedChange={(checked) => setAddOns((prev) => ({ ...prev, [addOn.id]: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">
                {plans.find((p) => p.id === selectedPlan)?.name} Plan ({selectedDuration} year
                {selectedDuration > 1 ? "s" : ""})
              </span>
              <span className="text-white">{costs.planTotal.toFixed(2)} SUI</span>
            </div>

            {Object.entries(addOns).map(([key, enabled]) => {
              if (!enabled) return null
              const addOn = addOnOptions.find((a) => a.id === key)!
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-300">{addOn.name}</span>
                  <span className="text-white">{(addOn.price * selectedDuration).toFixed(2)} SUI</span>
                </div>
              )
            })}

            {costs.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Duration Discount</span>
                <span>-{costs.discount.toFixed(2)} SUI</span>
              </div>
            )}

            <Separator className="bg-gray-600" />

            <div className="flex justify-between">
              <span className="text-gray-300">Registration Fee</span>
              <span className="text-white">{costs.registrationFee.toFixed(2)} SUI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gas Fee (Estimated)</span>
              <span className="text-white">{costs.gasFee.toFixed(2)} SUI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Platform Fee</span>
              <span className="text-white">{costs.platformFee.toFixed(2)} SUI</span>
            </div>

            <Separator className="bg-gray-600" />

            <div className="flex justify-between text-lg font-semibold">
              <span className="text-white">Total</span>
              <span className="text-blue-400">{costs.total.toFixed(2)} SUI</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-300 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
