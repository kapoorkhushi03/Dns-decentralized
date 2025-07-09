"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, MapPin, Globe } from "lucide-react"

interface UserDetailsFormProps {
  onSubmit: (data: any) => void
}

export default function UserDetailsForm({ onSubmit }: UserDetailsFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Organization (Optional)
    organization: "",
    jobTitle: "",
    website: "",

    // Address
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",

    // Domain Usage
    intendedUse: "",
    description: "",
    expectedTraffic: "",

    // Preferences
    newsletter: false,
    terms: false,
    privacy: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.intendedUse) newErrors.intendedUse = "Please select intended use"
    if (!formData.terms) newErrors.terms = "You must agree to the terms of service"
    if (!formData.privacy) newErrors.privacy = "You must agree to the privacy policy"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-white">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-white">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${errors.lastName ? "border-red-500" : ""}`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${errors.email ? "border-red-500" : ""}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-400" />
            Organization (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organization" className="text-white">
                Company/Organization
              </Label>
              <Input
                id="organization"
                value={formData.organization}
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
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="CEO"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website" className="text-white">
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-400" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-white">
              Street Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`bg-gray-700 border-gray-600 text-white ${errors.address ? "border-red-500" : ""}`}
              placeholder="123 Main Street"
            />
            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-white">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${errors.city ? "border-red-500" : ""}`}
                placeholder="New York"
              />
              {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state" className="text-white">
                State/Province
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="NY"
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-white">
                ZIP/Postal Code
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country" className="text-white">
              Country *
            </Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger
                className={`bg-gray-700 border-gray-600 text-white ${errors.country ? "border-red-500" : ""}`}
              >
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
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Domain Usage */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Domain Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="intendedUse" className="text-white">
              Intended Use *
            </Label>
            <Select value={formData.intendedUse} onValueChange={(value) => handleInputChange("intendedUse", value)}>
              <SelectTrigger
                className={`bg-gray-700 border-gray-600 text-white ${errors.intendedUse ? "border-red-500" : ""}`}
              >
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
                <SelectItem value="redirect">Domain Redirect</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.intendedUse && <p className="text-red-400 text-sm mt-1">{errors.intendedUse}</p>}
          </div>

          <div>
            <Label htmlFor="expectedTraffic" className="text-white">
              Expected Monthly Traffic
            </Label>
            <Select
              value={formData.expectedTraffic}
              onValueChange={(value) => handleInputChange("expectedTraffic", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select expected traffic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="low">Less than 1,000 visitors</SelectItem>
                <SelectItem value="medium">1,000 - 10,000 visitors</SelectItem>
                <SelectItem value="high">10,000 - 100,000 visitors</SelectItem>
                <SelectItem value="enterprise">100,000+ visitors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Project Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Briefly describe your project or how you plan to use this domain..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => handleInputChange("terms", checked)}
                className={errors.terms ? "border-red-500" : ""}
              />
              <div>
                <Label htmlFor="terms" className="text-white text-sm cursor-pointer">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-400 underline hover:text-blue-300">
                    Terms of Service
                  </a>{" "}
                  *
                </Label>
                {errors.terms && <p className="text-red-400 text-sm mt-1">{errors.terms}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={formData.privacy}
                onCheckedChange={(checked) => handleInputChange("privacy", checked)}
                className={errors.privacy ? "border-red-500" : ""}
              />
              <div>
                <Label htmlFor="privacy" className="text-white text-sm cursor-pointer">
                  I agree to the{" "}
                  <a href="/privacy" className="text-blue-400 underline hover:text-blue-300">
                    Privacy Policy
                  </a>{" "}
                  *
                </Label>
                {errors.privacy && <p className="text-red-400 text-sm mt-1">{errors.privacy}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleInputChange("newsletter", checked)}
              />
              <Label htmlFor="newsletter" className="text-white text-sm cursor-pointer">
                Subscribe to newsletter for updates and announcements
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
          Continue to Pricing
        </Button>
      </div>
    </form>
  )
}
