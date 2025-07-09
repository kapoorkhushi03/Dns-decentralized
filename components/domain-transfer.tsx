"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { DomainStorage, type PurchasedDomain } from "@/lib/domain-storage"
import { Send, AlertTriangle, CheckCircle, Clock, ExternalLink, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DomainTransferProps {
  domain: PurchasedDomain
  onTransferComplete: () => void
}

export default function DomainTransfer({ domain, onTransferComplete }: DomainTransferProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferError, setTransferError] = useState("")
  const { toast } = useToast()

  const validateSuiAddress = (address: string): boolean => {
    // Basic Sui address validation (starts with 0x and is 64 characters long)
    const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/
    return suiAddressRegex.test(address)
  }

  const handleTransfer = async () => {
    if (!recipientAddress) {
      setTransferError("Please enter a recipient address")
      return
    }

    if (!validateSuiAddress(recipientAddress)) {
      setTransferError("Please enter a valid Sui address (0x followed by 64 hex characters)")
      return
    }

    if (recipientAddress === "0x1234567890123456789012345678901234567890123456789012345678901234") {
      setTransferError("Cannot transfer to the current owner address")
      return
    }

    setIsTransferring(true)
    setTransferError("")

    try {
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Perform the transfer
      const success = DomainStorage.transferDomain(domain.name, recipientAddress)

      if (success) {
        toast({
          title: "Transfer Successful",
          description: `${domain.name} has been transferred to ${recipientAddress.slice(0, 10)}...`,
        })

        // Reset form
        setRecipientAddress("")

        // Notify parent component
        onTransferComplete()
      } else {
        setTransferError("Transfer failed. Please try again.")
      }
    } catch (error) {
      console.error("Transfer error:", error)
      setTransferError("An error occurred during transfer. Please try again.")
    } finally {
      setIsTransferring(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      {/* Domain Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Transfer Domain Ownership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{domain.name}</h3>
                <p className="text-sm text-gray-400">Expires: {new Date(domain.expiresAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white mb-2">{domain.status}</Badge>
                <p className="text-xs text-gray-400">NFT ID: {domain.nftId}</p>
              </div>
            </div>
          </div>

          {/* Current Owner Info */}
          <div className="mb-6">
            <Label className="text-white mb-2 block">Current Owner</Label>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white font-mono">
                0x1234567890123456789012345678901234567890123456789012345678901234
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard("0x1234567890123456789012345678901234567890123456789012345678901234")}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Transfer Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient" className="text-white">
                Recipient Sui Address
              </Label>
              <Input
                id="recipient"
                value={recipientAddress}
                onChange={(e) => {
                  setRecipientAddress(e.target.value)
                  setTransferError("")
                }}
                placeholder="0x..."
                className="bg-gray-700 border-gray-600 text-white mt-1"
                disabled={isTransferring}
              />
              {transferError && <p className="text-red-400 text-sm mt-1">{transferError}</p>}
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-semibold">Important Notice</h4>
                  <ul className="text-yellow-200 text-sm mt-1 space-y-1">
                    <li>• Domain ownership transfer is permanent and cannot be undone</li>
                    <li>• You will lose all control over this domain after transfer</li>
                    <li>• Ensure the recipient address is correct before proceeding</li>
                    <li>• Transfer may take a few minutes to complete on the blockchain</li>
                  </ul>
                </div>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!recipientAddress || !validateSuiAddress(recipientAddress) || isTransferring}
                >
                  {isTransferring ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Transfer Domain
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                    Confirm Domain Transfer
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    <div className="space-y-3">
                      <p>
                        You are about to transfer ownership of <strong className="text-white">{domain.name}</strong> to:
                      </p>
                      <div className="bg-gray-700 p-3 rounded font-mono text-sm break-all">{recipientAddress}</div>
                      <p className="text-red-400 font-medium mt-2">This action is permanent and cannot be reversed!</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleTransfer} className="bg-red-600 hover:bg-red-700">
                    Confirm Transfer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Transfer History */}
      {domain.transferHistory && domain.transferHistory.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Transfer History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {domain.transferHistory.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transfer.status === "completed"
                          ? "bg-green-600"
                          : transfer.status === "pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                    >
                      {transfer.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : transfer.status === "pending" ? (
                        <Clock className="h-4 w-4 text-white" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">Transfer</span>
                        <Badge
                          className={`${
                            transfer.status === "completed"
                              ? "bg-green-600"
                              : transfer.status === "pending"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          } text-white`}
                        >
                          {transfer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        From: {transfer.fromAddress.slice(0, 10)}...{transfer.fromAddress.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-400">
                        To: {transfer.toAddress.slice(0, 10)}...{transfer.toAddress.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(transfer.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <a
                      href={`https://explorer.sui.io/txblock/${transfer.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                    >
                      View Transaction
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
