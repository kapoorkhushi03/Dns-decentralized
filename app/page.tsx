"use client"

import { Shield, Zap, Globe, ArrowRight, CheckCircle, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import Footer from "@/components/footer"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: Globe,
      title: "Decentralized DNS",
      description:
        "Own your domain on the blockchain with complete control and censorship resistance. No central authority can take it away.",
      benefits: ["True ownership", "Censorship resistant", "Global accessibility"],
    },
    {
      icon: Shield,
      title: "NFT Ownership",
      description:
        "Each domain is minted as an NFT on Sui blockchain, providing verifiable ownership and seamless transferability.",
      benefits: ["Verifiable ownership", "Easy transfers", "Marketplace ready"],
    },
    {
      icon: Zap,
      title: "IPFS Storage",
      description:
        "Metadata and DNS records stored on IPFS via Pinata for distributed, permanent, and fast availability worldwide.",
      benefits: ["Permanent storage", "Fast access", "Distributed network"],
    },
  ]

  const useCases = [
    {
      title: "Personal Branding",
      description: "Secure your name or brand as a decentralized domain",
      icon: "👤",
    },
    {
      title: "DApp Hosting",
      description: "Host your decentralized applications with true ownership",
      icon: "🚀",
    },
    {
      title: "Investment",
      description: "Buy premium domains as digital assets for future resale",
      icon: "💎",
    },
    {
      title: "Business Identity",
      description: "Establish your business presence in the decentralized web",
      icon: "🏢",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Search & Discover",
      description: "Find your perfect domain name and check availability across our decentralized registry",
      icon: "🔍",
    },
    {
      step: "02",
      title: "Connect Wallet",
      description: "Connect your Sui wallet securely to proceed with domain registration and payment",
      icon: "🔗",
    },
    {
      step: "03",
      title: "Register & Mint",
      description: "Pay the registration fee and mint your domain as an NFT on the Sui blockchain",
      icon: "⚡",
    },
    {
      step: "04",
      title: "Configure & Use",
      description: "Set up DNS records, configure your domain, and start using it for your projects",
      icon: "⚙️",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Why Choose DecentraDNS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for the Decentralized Future</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of domain ownership with blockchain technology, IPFS storage, and true
              digital sovereignty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get your decentralized domain in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Perfect For Every Use Case</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you&apos;re building the next big DApp or securing your personal brand, DecentraDNS has you
              covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm text-center p-6"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm">{useCase.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Thousands</h2>
            <p className="text-xl text-gray-300">Join the growing community of decentralized domain owners</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Domains Registered", value: "12,847", icon: Globe },
              { label: "Active Users", value: "3,421", icon: Users },
              { label: "Total Volume", value: "847 SUI", icon: Zap },
              { label: "NFTs Minted", value: "12,847", icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Own Your Digital Identity?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of users who have already secured their decentralized domains. Start building your presence
            in the decentralized web today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold px-8 py-4 text-lg"
            >
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

