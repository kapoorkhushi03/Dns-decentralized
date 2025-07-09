"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { DomainStorage, type DNSHistoryRecord } from "@/lib/domain-storage"
import { Search, Download, Trash2, Clock, Globe, Send, Edit, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DNSHistory() {
  const [history, setHistory] = useState<DNSHistoryRecord[]>([])
  const [filteredHistory, setFilteredHistory] = useState<DNSHistoryRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [stats, setStats] = useState<any>({})
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterHistory()
  }, [history, searchTerm, filterAction])

  const loadHistory = () => {
    const historyData = DomainStorage.getDNSHistory()
    const statsData = DomainStorage.getDomainStats()
    setHistory(historyData)
    setStats(statsData)
  }

  const filterHistory = () => {
    let filtered = history

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((record) => record.domainName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by action type
    if (filterAction !== "all") {
      filtered = filtered.filter((record) => record.action === filterAction)
    }

    setFilteredHistory(filtered)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "registered":
        return <Globe className="h-4 w-4" />
      case "transferred":
        return <Send className="h-4 w-4" />
      case "deleted":
        return <Trash2 className="h-4 w-4" />
      case "dns_updated":
        return <Edit className="h-4 w-4" />
      case "renewed":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "registered":
        return "bg-green-600"
      case "transferred":
        return "bg-blue-600"
      case "deleted":
        return "bg-red-600"
      case "dns_updated":
        return "bg-purple-600"
      case "renewed":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `dns-history-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Export Complete",
      description: "DNS history exported successfully",
    })
  }

  const clearHistory = () => {
    DomainStorage.clearDNSHistory()
    loadHistory()
    toast({
      title: "History Cleared",
      description: "All DNS history has been cleared",
    })
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Domains</p>
                <p className="text-2xl font-bold text-white">{stats.totalDomains || 0}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Domains</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeDomains || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Deleted Domains</p>
                <p className="text-2xl font-bold text-red-400">{stats.deletedDomains || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalTransactions || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>DNS History</span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={exportHistory}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 bg-transparent hover:bg-red-600/20"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      Clear DNS History
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      Are you sure you want to clear all DNS history? This action cannot be undone and will remove all
                      activity records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory} className="bg-red-600 hover:bg-red-700">
                      Clear History
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="dns_updated">DNS Updated</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getActionColor(record.action)}`}>
                    {getActionIcon(record.action)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{record.domainName}</span>
                      <Badge className={`${getActionColor(record.action)} text-white`}>
                        {record.action.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{new Date(record.timestamp).toLocaleString()}</p>
                    {record.details && <p className="text-xs text-gray-500 mt-1">{JSON.stringify(record.details)}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-xs text-gray-500 font-mono">{record.userAddress}</p>
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No history records found</p>
                <p className="text-sm">
                  {searchTerm || filterAction !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Domain activity will appear here"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
