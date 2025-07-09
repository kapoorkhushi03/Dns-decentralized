"use client"

import { useState, useEffect } from "react"
import {
  Globe,
  Settings,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Plus,
  Code,
  History,
  Send,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { DomainStorage } from "@/lib/domain-storage"
import { IPFSClient } from "@/lib/ipfs-client"
import CodeEditor from "@/components/code-editor"
import DNSHistory from "@/components/dns-history"
import DomainTransfer from "@/components/domain-transfer"

export default function DomainsPage() {
  const [domains, setDomains] = useState<any[]>([])
  const [selectedDomain, setSelectedDomain] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("domains")
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = () => {
    // Load purchased domains from storage (excluding deleted ones for main view)
    const purchasedDomains = DomainStorage.getPurchasedDomains().filter((d) => d.status !== "deleted")

    // Convert to the format expected by the component
    const formattedDomains = purchasedDomains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      status: domain.status,
      expiresAt: domain.expiresAt.split("T")[0], // Format date
      nftId: domain.nftId,
      ipfsHash: domain.ipfsHash,
      records: [
        { type: "A", name: "@", value: "192.168.1.1", ttl: 300 },
        { type: "CNAME", name: "www", value: domain.name + ".dns", ttl: 300 },
      ],
    }))

    setDomains(formattedDomains)

    // Update selected domain if it still exists
    if (selectedDomain) {
      const updatedSelected = formattedDomains.find((d) => d.id === selectedDomain.id)
      if (updatedSelected) {
        setSelectedDomain(updatedSelected)
      } else {
        // Selected domain was deleted, select first available or null
        setSelectedDomain(formattedDomains.length > 0 ? formattedDomains[0] : null)
      }
    } else if (formattedDomains.length > 0) {
      setSelectedDomain(formattedDomains[0])
    }
  }

  const [newRecord, setNewRecord] = useState({ type: "A", name: "", value: "", ttl: 300 })

  // Add this state for the code editor
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [selectedDomainForEdit, setSelectedDomainForEdit] = useState(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  // Add this function to handle code saving
  const handleCodeSave = (domainName: string, code: { html: string; css: string; js: string }) => {
    console.log(`Code saved for ${domainName}:`, code)
    toast({
      title: "Code Saved",
      description: `Website code updated for ${domainName}`,
    })
  }

  const handleDeleteDomain = async (domainName: string) => {
    if (isDeleting) return

    setIsDeleting(true)

    try {
      // Get domain details before deletion
      const domain = DomainStorage.getDomain(domainName)
      if (!domain) {
        toast({
          title: "Error",
          description: "Domain not found",
          variant: "destructive",
        })
        return
      }

      // Delete from IPFS (simulate unpinning)
      if (domain.ipfsHash) {
        console.log(`Unpinning ${domain.ipfsHash} from IPFS...`)
        try {
          await IPFSClient.unpinFile(domain.ipfsHash)
          console.log(`Successfully unpinned ${domain.ipfsHash}`)
        } catch (ipfsError) {
          console.warn("IPFS unpinning failed:", ipfsError)
          // Continue with deletion even if IPFS fails
        }
      }

      // Delete from local storage
      const success = DomainStorage.deleteDomain(domainName)

      if (success) {
        toast({
          title: "Domain Deleted",
          description: `${domainName} has been successfully deleted`,
        })

        // Reload domains list
        loadDomains()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete domain",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting domain:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the domain",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
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
              <Link href="/domains" className="text-blue-400 font-medium">
                My Domains
              </Link>
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
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
          <h1 className="text-3xl font-bold text-white mb-2">Domain Management</h1>
          <p className="text-gray-400">Manage your decentralized domains, view history, and transfer ownership</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-8">
            <TabsTrigger value="domains" className="data-[state=active]:bg-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              My Domains
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-600">
              <History className="h-4 w-4 mr-2" />
              DNS History
            </TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-gray-600">
              <Send className="h-4 w-4 mr-2" />
              Transfer Domain
            </TabsTrigger>
          </TabsList>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Domain List */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Your Domains
                      <Link href="/">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-1" />
                          Register
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {domains.map((domain) => (
                      <div
                        key={domain.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedDomain?.id === domain.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        onClick={() => setSelectedDomain(domain)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{domain.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                domain.status === "active" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                              }
                            >
                              {domain.status}
                            </Badge>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white flex items-center">
                                    <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                                    Delete Domain
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    Are you sure you want to delete{" "}
                                    <strong className="text-white">{domain.name}</strong>? This will:
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                      <li>Remove the domain from your account</li>
                                      <li>Unpin all associated files from IPFS</li>
                                      <li>Mark the NFT as deleted (irreversible)</li>
                                    </ul>
                                    <p className="mt-2 text-red-400 font-medium">This action cannot be undone!</p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteDomain(domain.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? "Deleting..." : "Delete Domain"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">
                          Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                    {domains.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No domains found</p>
                        <p className="text-sm">Register your first domain to get started</p>
                        <Link href="/">
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Register Domain</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Domain Details */}
              <div className="lg:col-span-2">
                {selectedDomain ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        {selectedDomain.name}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View NFT
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="dns" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                          <TabsTrigger value="dns" className="data-[state=active]:bg-gray-600">
                            DNS Records
                          </TabsTrigger>
                          <TabsTrigger value="nft" className="data-[state=active]:bg-gray-600">
                            NFT Details
                          </TabsTrigger>
                          <TabsTrigger value="ipfs" className="data-[state=active]:bg-gray-600">
                            IPFS Storage
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dns" className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">DNS Records</h3>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const purchasedDomain = DomainStorage.getDomain(selectedDomain.name)
                                  if (purchasedDomain) {
                                    setSelectedDomainForEdit(purchasedDomain)
                                    setShowCodeEditor(true)
                                  }
                                }}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Code className="h-4 w-4 mr-1" />
                                Edit Code
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Record
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 border-gray-700">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Add DNS Record</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Add a new DNS record for {selectedDomain.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="type" className="text-white">
                                        Type
                                      </Label>
                                      <Select
                                        value={newRecord.type}
                                        onValueChange={(value) => setNewRecord({ ...newRecord, type: value })}
                                      >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                          <SelectItem value="A">A</SelectItem>
                                          <SelectItem value="AAAA">AAAA</SelectItem>
                                          <SelectItem value="CNAME">CNAME</SelectItem>
                                          <SelectItem value="MX">MX</SelectItem>
                                          <SelectItem value="TXT">TXT</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="name" className="text-white">
                                        Name
                                      </Label>
                                      <Input
                                        id="name"
                                        value={newRecord.name}
                                        onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="@ or subdomain"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="value" className="text-white">
                                        Value
                                      </Label>
                                      <Input
                                        id="value"
                                        value={newRecord.value}
                                        onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="IP address or target"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="ttl" className="text-white">
                                        TTL (seconds)
                                      </Label>
                                      <Input
                                        id="ttl"
                                        type="number"
                                        value={newRecord.ttl}
                                        onChange={(e) =>
                                          setNewRecord({ ...newRecord, ttl: Number.parseInt(e.target.value) })
                                        }
                                        className="bg-gray-700 border-gray-600 text-white"
                                      />
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Add Record</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {showCodeEditor && selectedDomainForEdit ? (
                            <div className="mt-6">
                              <CodeEditor
                                domain={selectedDomainForEdit}
                                onSave={(code) => handleCodeSave(selectedDomainForEdit.name, code)}
                              />
                              <Button
                                onClick={() => setShowCodeEditor(false)}
                                variant="outline"
                                className="mt-4 border-gray-600 text-gray-300 bg-transparent"
                              >
                                Back to DNS Records
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {selectedDomain.records.map((record, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                                >
                                  <div className="flex-1 grid grid-cols-4 gap-4">
                                    <div>
                                      <Badge className="bg-blue-600 text-white">{record.type}</Badge>
                                    </div>
                                    <div className="text-white font-mono">{record.name}</div>
                                    <div className="text-gray-300 font-mono">{record.value}</div>
                                    <div className="text-gray-400">{record.ttl}s</div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="nft" className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-4">NFT Information</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Token ID:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono">{selectedDomain.nftId}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(selectedDomain.nftId)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Blockchain:</span>
                                  <span className="text-white">Sui Network</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Status:</span>
                                  <Badge className="bg-green-600 text-white">Minted</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Owner:</span>
                                  <span className="text-white font-mono">0x1234...5678</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-6">
                              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center">
                                  <Globe className="h-16 w-16 text-white mx-auto mb-2" />
                                  <div className="text-white font-bold text-xl">{selectedDomain.name}</div>
                                </div>
                              </div>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">View on Sui Explorer</Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="ipfs" className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">IPFS Storage</h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-700 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-400">IPFS Hash:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono">{selectedDomain.ipfsHash}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(selectedDomain.ipfsHash)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Gateway URL:</span>
                                  <a
                                    href={`https://ipfs.io/ipfs/${selectedDomain.ipfsHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    View on IPFS
                                    <ExternalLink className="h-4 w-4 ml-1" />
                                  </a>
                                </div>
                              </div>

                              <div className="p-4 bg-gray-700 rounded-lg">
                                <h4 className="text-white font-semibold mb-2">Stored Metadata</h4>
                                <pre className="text-sm text-gray-300 bg-gray-800 p-3 rounded overflow-x-auto">
                                  {JSON.stringify(
                                    {
                                      name: selectedDomain.name,
                                      description: `Decentralized domain ${selectedDomain.name}`,
                                      image: `https://ipfs.io/ipfs/${selectedDomain.ipfsHash}/image.png`,
                                      attributes: [
                                        { trait_type: "Domain", value: selectedDomain.name },
                                        { trait_type: "Status", value: selectedDomain.status },
                                        { trait_type: "Blockchain", value: "Sui" },
                                      ],
                                    },
                                    null,
                                    2,
                                  )}
                                </pre>
                              </div>

                              <Button className="w-full bg-blue-600 hover:bg-blue-700">Update IPFS Metadata</Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-800 border-gray-700 flex items-center justify-center h-80">
                    <p className="text-gray-400">Select a domain to view details</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* DNS History Tab */}
          <TabsContent value="history">
            <DNSHistory />
          </TabsContent>

          {/* Transfer Domain Tab */}
          <TabsContent value="transfer">
            {selectedDomain ? (
              <DomainTransfer
                domain={DomainStorage.getDomain(selectedDomain.name)!}
                onTransferComplete={() => {
                  loadDomains()
                  setActiveTab("domains")
                }}
              />
            ) : (
              <Card className="bg-gray-800 border-gray-700 flex items-center justify-center h-80">
                <div className="text-center">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a domain from the "My Domains" tab to transfer</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
