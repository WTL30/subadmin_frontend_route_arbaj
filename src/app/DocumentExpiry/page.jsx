"use client"

import { useState } from "react"
import { FileText, Calendar, AlertTriangle, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react'
import Sidebar from "../slidebar/page"
const documentData = [
  {
    id: "DOC001",
    vehicleNumber: "MH24DF1234",
    documentType: "Registration Certificate",
    expiryDate: "2024-08-15",
    status: "expiring",
    daysLeft: 23,
    amount: "₹500"
  },
  {
    id: "DOC002",
    vehicleNumber: "MH24DF5678",
    documentType: "Insurance",
    expiryDate: "2024-07-30",
    status: "critical",
    daysLeft: 7,
    amount: "₹12000"
  },
  {
    id: "DOC003",
    vehicleNumber: "MH12YD7188",
    documentType: "Pollution Certificate",
    expiryDate: "2024-09-10",
    status: "expiring",
    daysLeft: 49,
    amount: "₹300"
  },
  {
    id: "DOC004",
    vehicleNumber: "MH24DF9012",
    documentType: "Fitness Certificate",
    expiryDate: "2024-12-25",
    status: "valid",
    daysLeft: 155,
    amount: "₹800"
  }
]

const challanData = [
  {
    id: "CH001",
    vehicleNumber: "MH24DF1234",
    challanNumber: "MH240001234",
    violation: "Over Speeding",
    amount: "₹2000",
    date: "2024-07-20",
    status: "pending",
    location: "Mumbai-Pune Highway"
  },
  {
    id: "CH002",
    vehicleNumber: "MH24DF5678",
    challanNumber: "MH240001235",
    violation: "Signal Jump",
    amount: "₹1000",
    date: "2024-07-18",
    status: "pending",
    location: "Bandra West"
  },
  {
    id: "CH003",
    vehicleNumber: "MH12YD7188",
    challanNumber: "MH240001236",
    violation: "Parking Violation",
    amount: "₹500",
    date: "2024-07-15",
    status: "paid",
    location: "Andheri East"
  }
]

export default function DocumentExpiry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("documents")

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-600 text-white"
      case "expiring":
        return "bg-orange-500 text-white"
      case "valid":
        return "bg-green-600 text-white"
      case "pending":
        return "bg-yellow-500 text-black"
      case "paid":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredDocuments = documentData.filter(doc =>
    doc.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredChallans = challanData.filter(challan =>
    challan.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challan.violation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
  

    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen flex text-white">
  <Sidebar />
  <div className="p-8 mt-20 md:ml-60 sm:mt-0 flex-1">
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Document Management & E-Challan
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 flex items-center py-2 px-4 rounded-md">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-500">4</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-500">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Challans</p>
                <p className="text-2xl font-bold text-yellow-500">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Amount Due</p>
                <p className="text-2xl font-bold text-white">₹3500</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search by vehicle number or document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white rounded-md py-2 px-4 w-full"
            />
          </div>
          <button className="border-gray-700 text-gray-300 flex items-center py-2 px-4 rounded-md border">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 p-2 rounded-md">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 py-2 text-center ${activeTab === "documents" ? "bg-blue-600 text-white" : "text-gray-400"}`}
            >
              Document Expiry
            </button>
            <button
              onClick={() => setActiveTab("challans")}
              className={`flex-1 py-2 text-center ${activeTab === "challans" ? "bg-blue-600 text-white" : "text-gray-400"}`}
            >
              E-Challans
            </button>
          </div>

          {activeTab === "documents" && (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-gray-800 border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{doc.vehicleNumber}</h3>
                        <p className="text-gray-400">{doc.documentType}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Expires: {doc.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`bg-${getStatusColor(doc.status)} px-3 py-1 rounded-full text-sm`}>
                          {doc.status === "critical" ? "Critical" : 
                           doc.status === "expiring" ? "Expiring Soon" : "Valid"}
                        </span>
                        <p className="text-sm text-gray-400 mt-1">
                          {doc.daysLeft} days left
                        </p>
                        <p className="text-sm font-semibold text-white">
                          Renewal: {doc.amount}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md">
                          Renew
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "challans" && (
            <div className="grid gap-4">
              {filteredChallans.map((challan) => (
                <div key={challan.id} className="bg-gray-800 border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-600 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{challan.vehicleNumber}</h3>
                        <p className="text-gray-400">{challan.violation}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-400">
                            Challan: {challan.challanNumber}
                          </span>
                          <span className="text-sm text-gray-400">
                            Date: {challan.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Location: {challan.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`bg-${getStatusColor(challan.status)} px-3 py-1 rounded-full text-sm`}>
                          {challan.status === "pending" ? "Pending" : "Paid"}
                        </span>
                        <p className="text-lg font-semibold text-white mt-1">
                          {challan.amount}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md">
                          <Eye className="w-4 h-4" />
                        </button>
                        {challan.status === "pending" && (
                          <button className="text-sm bg-green-600 text-white py-2 px-4 rounded-md">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


    
  )
}
