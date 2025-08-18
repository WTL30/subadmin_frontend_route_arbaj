"use client"

import { useState } from "react"
import {
  AlertTriangle, Car, CreditCard, Search, Clock, CheckCircle, XCircle
} from 'lucide-react'
import Sidebar from "../slidebar/page"

const pendingChallans = [
  {
    id: "CH001", vehicleNumber: "MH24DF1234", challanNumber: "MH240001",
    offense: "Over Speeding", amount: 1000, date: "2024-01-15",
    location: "Mumbai-Pune Highway", status: "pending"
  },
  {
    id: "CH002", vehicleNumber: "MH12YD7188", challanNumber: "MH240002",
    offense: "Signal Jump", amount: 500, date: "2024-01-18",
    location: "Bandra West", status: "pending"
  },
  {
    id: "CH003", vehicleNumber: "MH24DF1234", challanNumber: "MH240003",
    offense: "Parking Violation", amount: 200, date: "2024-01-20",
    location: "Andheri East", status: "pending"
  },
  {
    id: "CH004", vehicleNumber: "MH12YD7188", challanNumber: "MH240004",
    offense: "No Helmet", amount: 100, date: "2024-01-22",
    location: "Powai", status: "pending"
  },
  {
    id: "CH005", vehicleNumber: "MH24DF1234", challanNumber: "MH240005",
    offense: "Mobile Usage", amount: 1000, date: "2024-01-25",
    location: "Worli Sea Link", status: "pending"
  },
  {
    id: "CH006", vehicleNumber: "MH12YD7188", challanNumber: "MH240006",
    offense: "Lane Cutting", amount: 300, date: "2024-01-28",
    location: "Eastern Express Highway", status: "pending"
  }
]

const paidChallans = [
  {
    id: "CH007", vehicleNumber: "MH24DF1234", challanNumber: "MH240007",
    offense: "Over Speeding", amount: 500, date: "2024-01-10",
    location: "Western Express Highway", status: "paid", paidDate: "2024-01-12"
  },
  {
    id: "CH008", vehicleNumber: "MH12YD7188", challanNumber: "MH240008",
    offense: "Signal Jump", amount: 500, date: "2024-01-08",
    location: "Dadar", status: "paid", paidDate: "2024-01-10"
  }
]

export default function EChallanPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("")

  const totalPending = pendingChallans.reduce((sum, challan) => sum + challan.amount, 0)
  const totalPaid = paidChallans.reduce((sum, challan) => sum + challan.amount, 0)

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1 text-red-500"><Clock className="h-4 w-4" />Pending</span>
      case "paid":
        return <span className="flex items-center gap-1 text-green-500"><CheckCircle className="h-4 w-4" />Paid</span>
      default:
        return <span>Unknown</span>
    }
  }

  return (
   

    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen flex text-white">
  <Sidebar />
  <div className="p-8 mt-20 md:ml-60 sm:mt-0 flex-1">
  <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            E-Challan Management
          </h1>
          <p className="text-gray-400 mt-2">Manage traffic violations and payments through M-Parivahan</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-[#1e293b] shadow-lg rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Pending Challans</p>
              <p className="text-2xl font-bold text-red-400">{pendingChallans.length}</p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#1e293b] shadow-lg rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Total Pending Amount</p>
              <p className="text-2xl font-bold text-red-400">₹{totalPending}</p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#1e293b] shadow-lg rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Paid Challans</p>
              <p className="text-2xl font-bold text-green-400">{paidChallans.length}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#1e293b] shadow-lg rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Total Paid Amount</p>
              <p className="text-2xl font-bold text-green-400">₹{totalPaid}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Section */}
      <div className="p-6 bg-[#1e293b] rounded-xl space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Recharge Amount</label>
            <input
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="w-full mt-1 p-2 rounded-md bg-[#0f172a] border border-gray-600 text-white"
              placeholder="Enter amount"
            />
          </div>
          <button
            onClick={() => console.log("Recharge:", rechargeAmount)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Recharge Now
          </button>
        </div>
        <div className="flex gap-2">
          {[500, 1000, 2000, 5000].map(amount => (
            <button
              key={amount}
              onClick={() => setRechargeAmount(amount.toString())}
              className="bg-[#334155] text-white px-3 py-1 rounded-md"
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-[#1e293b] rounded-xl">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search by vehicle number, challan number, or offense..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 w-full rounded-md bg-[#0f172a] border border-gray-600 text-white"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            <Search className="h-4 w-4 mr-1" />
            Search
          </button>
        </div>
      </div>

      {/* Challan Tables */}
      <div className="space-y-10">
        {/* Pending Challans */}
        <div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">Pending E-Challans</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[#1e293b] rounded-lg text-left">
              <thead className="bg-[#334155] text-gray-300">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Challan No.</th>
                  <th className="px-4 py-3">Offense</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingChallans.map((c) => (
                  <tr key={c.id} className="border-b border-gray-700 hover:bg-[#273144]">
                    <td className="px-4 py-3">{c.vehicleNumber}</td>
                    <td className="px-4 py-3">{c.challanNumber}</td>
                    <td className="px-4 py-3">{c.offense}</td>
                    <td className="px-4 py-3 text-red-400 font-bold">₹{c.amount}</td>
                    <td className="px-4 py-3">{c.date}</td>
                    <td className="px-4 py-3">{c.location}</td>
                    <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <button className="bg-green-600 hover:bg-green-700 px-3 py-1 text-white rounded-md">
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paid Challans */}
        <div>
          <h2 className="text-xl font-semibold text-green-400 mb-4">Paid E-Challans</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[#1e293b] rounded-lg text-left">
              <thead className="bg-[#334155] text-gray-300">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Challan No.</th>
                  <th className="px-4 py-3">Offense</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Offense Date</th>
                  <th className="px-4 py-3">Paid Date</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paidChallans.map((c) => (
                  <tr key={c.id} className="border-b border-gray-700 hover:bg-[#273144]">
                    <td className="px-4 py-3">{c.vehicleNumber}</td>
                    <td className="px-4 py-3">{c.challanNumber}</td>
                    <td className="px-4 py-3">{c.offense}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">₹{c.amount}</td>
                    <td className="px-4 py-3">{c.date}</td>
                    <td className="px-4 py-3">{c.paidDate}</td>
                    <td className="px-4 py-3">{c.location}</td>
                    <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  
  )
}
