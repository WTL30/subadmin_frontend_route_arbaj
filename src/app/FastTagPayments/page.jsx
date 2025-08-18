"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Plus, Search, Filter, Download, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { MdClose } from "react-icons/md"
import { FaRocket, FaClock } from "react-icons/fa"
import Sidebar from "../slidebar/page"

// Coming Soon Modal Component
const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm bg-opacity-70">
      <motion.div
        className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={24} />
          </button>

          {/* Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <FaRocket className="text-white text-2xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{featureName}</h2>

          {/* Subtitle */}
          <h3 className="text-lg font-semibold text-black-600 mb-4 flex items-center justify-center">
            <FaClock className="mr-2" />
            Coming Soon!
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're working hard to bring you this amazing feature. Stay tuned for updates and get ready for seamless
            FastTag payment management!
          </p>

          {/* Features list */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">What to expect:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Automated FastTag recharge system</li>
              <li>• Real-time balance monitoring</li>
              <li>• Transaction history and analytics</li>
              <li>• Low balance alerts and notifications</li>
              <li>• Bulk recharge for multiple vehicles</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
            >
              Got it!
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const fasttagData = [
  {
    id: "FT001",
    cabNumber: "MH24DF1234",
    tagId: "TAG123456789",
    balance: 1250,
    lastRecharge: "2024-01-20",
    status: "Active",
    transactions: 15,
  },
  {
    id: "FT002",
    cabNumber: "MH24DF5678",
    tagId: "TAG987654321",
    balance: 850,
    lastRecharge: "2024-01-18",
    status: "Active",
    transactions: 12,
  },
  {
    id: "FT003",
    cabNumber: "MH12YD7188",
    tagId: "TAG456789123",
    balance: 150,
    lastRecharge: "2024-01-15",
    status: "Low Balance",
    transactions: 8,
  },
]

const recentTransactions = [
  {
    id: "TXN001",
    cabNumber: "MH24DF1234",
    amount: 45,
    tollPlaza: "Mumbai-Pune Expressway",
    date: "2024-01-23",
    time: "14:30",
    status: "Success",
  },
  {
    id: "TXN002",
    cabNumber: "MH24DF5678",
    amount: 35,
    tollPlaza: "Bandra-Worli Sea Link",
    date: "2024-01-23",
    time: "12:15",
    status: "Success",
  },
  {
    id: "TXN003",
    cabNumber: "MH12YD7188",
    amount: 25,
    tollPlaza: "Eastern Express Highway",
    date: "2024-01-23",
    time: "10:45",
    status: "Success",
  },
  {
    id: "TXN004",
    cabNumber: "MH24DF1234",
    amount: 55,
    tollPlaza: "Mumbai-Nashik Highway",
    date: "2024-01-22",
    time: "16:20",
    status: "Success",
  },
]

export default function FastTagPayments() {
  const router = useRouter()
  const [selectedCab, setSelectedCab] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false)

  // Coming Soon Modal State
  const [showComingSoonModal, setShowComingSoonModal] = useState(true)

  // Handle closing the coming soon modal
  const handleCloseComingSoonModal = () => {
    setShowComingSoonModal(false)
    router.push("/AdminDashboard")
  }

  const handleRecharge = () => {
    console.log("Recharging", selectedCab, "with amount", rechargeAmount)
    setIsRechargeDialogOpen(false)
    setSelectedCab("")
    setRechargeAmount("")
  }

  const totalBalance = fasttagData.reduce((sum, item) => sum + item.balance, 0)
  const todayTransactions = recentTransactions.length
  const lowBalanceCabs = fasttagData.filter((item) => item.balance < 500).length

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={handleCloseComingSoonModal}
        featureName="FastTag Payments"
      />

      <div className="p-8 mt-20 md:ml-60 sm:mt-0 flex-1">
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              {/* <button className="bg-transparent hover:text-gray-600 text-gray-500 p-2 rounded">
                <ArrowLeft className="w-5 h-5" />
              </button> */}
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FastTag Payments</h1>
              <p className="text-gray-600">Manage FastTag recharges and monitor transactions</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Balance",
                value: `₹${totalBalance}`,
                icon: <CreditCard className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50",
              },
              {
                title: "Today's Transactions",
                value: todayTransactions,
                icon: <RefreshCw className="w-6 h-6 text-green-600" />,
                bg: "bg-green-50",
              },
              {
                title: "Low Balance Alerts",
                value: lowBalanceCabs,
                icon: <CreditCard className="w-6 h-6 text-orange-600" />,
                bg: "bg-orange-50",
              },
              {
                title: "Active Tags",
                value: fasttagData.length,
                icon: <CreditCard className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50",
              },
            ].map(({ title, value, icon, bg }, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FastTag Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">FastTag Status</h2>
                <button
                  onClick={() => setIsRechargeDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Recharge
                </button>
              </div>

              {isRechargeDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-md shadow-xl">
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">Recharge FastTag</h3>
                    <p className="text-gray-600 mb-4">Select a cab and enter the recharge amount</p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cab" className="text-gray-900 block mb-2 font-medium">
                          Select Cab
                        </label>
                        <select
                          id="cab"
                          value={selectedCab}
                          onChange={(e) => setSelectedCab(e.target.value)}
                          className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" disabled>
                            Choose a cab
                          </option>
                          {fasttagData.map((cab) => (
                            <option key={cab.id} value={cab.cabNumber}>
                              {cab.cabNumber} - Balance: ₹{cab.balance}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="amount" className="text-gray-900 block mb-2 font-medium">
                          Recharge Amount
                        </label>
                        <input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                      <button
                        onClick={() => setIsRechargeDialogOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRecharge}
                        disabled={!selectedCab || !rechargeAmount}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedCab && rechargeAmount
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Recharge Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {fasttagData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.cabNumber}</p>
                        <p className="text-gray-500 text-sm">Tag: {item.tagId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.balance}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{transaction.cabNumber}</p>
                      <p className="text-gray-600 text-sm">{transaction.tollPlaza}</p>
                      <p className="text-gray-500 text-xs">
                        {transaction.date} at {transaction.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{transaction.amount}</p>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    placeholder="Search transactions..."
                    className="pl-10 bg-white border border-gray-300 text-gray-900 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="bg-white border border-gray-300 text-gray-900 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">All Cabs</option>
                  {fasttagData.map((cab) => (
                    <option key={cab.id} value={cab.cabNumber}>
                      {cab.cabNumber}
                    </option>
                  ))}
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 text-gray-700 font-medium">Cab Number</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Toll Plaza</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Date</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Time</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-900">{tx.cabNumber}</td>
                      <td className="p-4 text-gray-900">{tx.tollPlaza}</td>
                      <td className="p-4 text-gray-900 font-medium">₹{tx.amount}</td>
                      <td className="p-4 text-gray-600">{tx.date}</td>
                      <td className="p-4 text-gray-600">{tx.time}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            tx.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
