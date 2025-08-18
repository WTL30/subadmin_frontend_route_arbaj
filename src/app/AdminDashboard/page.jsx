// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts"
// import Sidebar from "../slidebar/page"
// import { MdOutlineDirectionsCar, MdOutlineAccountBalanceWallet, MdPerson, MdGpsFixed, MdPayment, MdWarning, MdDescription } from "react-icons/md"
// import { BsClipboardCheck } from "react-icons/bs"
// import { FaCar, FaExclamationTriangle, FaFileAlt } from "react-icons/fa"
// import { motion, useAnimation } from "framer-motion"
// import { useInView } from "react-intersection-observer"
// import baseURL from "@/utils/api"
// import { useRouter } from "next/navigation"

// const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 1.5 }) => {
//   const controls = useAnimation()
//   const [count, setCount] = useState(0)
//   const [ref, inView] = useInView({ triggerOnce: true })

//   useEffect(() => {
//     if (inView) {
//       controls.start({
//         count: value,
//         transition: { duration },
//       })
//     }
//   }, [inView, value, controls, duration])

//   return (
//     <motion.span ref={ref} animate={controls} onUpdate={(latest) => setCount(Math.floor(latest.count))}>
//       {prefix}
//       {count}
//       {suffix}
//     </motion.span>
//   )
// }

// const AccessDeniedModal = () => {
//   const router = useRouter()

//   const handleClose = () => {
//     router.push("/")
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
//       <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-sm w-full">
//         <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
//         <p className="mb-6">Your access has been restricted. Please contact the administrator.</p>
//         <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
//           Close
//         </button>
//       </div>
//     </div>
//   )
// }

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalDrivers: 0,
//     totalCabs: 0,
//     assignedCabs: 0,
//     totalExpenses: 0,
//     gpsTracking: 0,
//     fastTagPayments: 0,
//     eChallan: 0,
//     documentExpiry: 0,
//   })

//   const [expenseData, setExpenseData] = useState([])
//   const [expenseBreakdown, setExpenseBreakdown] = useState([])
//   const [documentExpiryData, setDocumentExpiryData] = useState([])
//   const [recentEChallans, setRecentEChallans] = useState([])
//   const [recentFastTagPayments, setRecentFastTagPayments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const router = useRouter()
//   const [showAccessDenied, setShowAccessDenied] = useState(false)

//   useEffect(() => {
//     const checkUserStatusAndFetchData = async () => {
//       const token = localStorage.getItem("token")
//       const id = localStorage.getItem("id")

//       if (!token || !id) {
//         router.push("/login")
//         return
//       }

//       try {
//         const res = await axios.get(`${baseURL}api/admin/getSubAdmin/${id}`)
//         if (res.data?.status === "Inactive") {
//           localStorage.clear()
//           setShowAccessDenied(true)
//           return
//         }
//       } catch (err) {
//         console.error("Error checking user status:", err)
//         router.push("/login")
//       }
//     }
//     checkUserStatusAndFetchData()
//   }, [router])

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const token = localStorage.getItem("token")
//         if (!token) {
//           setError("No authentication token found. Please log in.")
//           return
//         }

//         const headers = { headers: { Authorization: `Bearer ${token}` } }

//         const [driversRes, cabsRes, assignedCabsRes, expensesRes] = await Promise.allSettled([
//           axios.get(`${baseURL}api/driver/profile`, headers),
//           axios.get(`${baseURL}api/cabDetails`, headers),
//           axios.get(`${baseURL}api/assigncab`, headers),
//           axios.get(`${baseURL}api/cabs/cabExpensive`, headers),
//         ])

//         const driversData = driversRes.status === "fulfilled" ? driversRes.value.data : []
//         const cabsData = cabsRes.status === "fulfilled" ? cabsRes.value.data : []
//         const assignedCabsData = assignedCabsRes.status === "fulfilled" ? assignedCabsRes.value.data : []
//         const expensesData = expensesRes.status === "fulfilled" ? expensesRes.value.data?.data || [] : []

//         const currentlyAssignedCabs = assignedCabsData.filter((cab) => cab.status === "assigned")
//         const totalExpenses = expensesData.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0)

//         // Mock data for new features (replace with actual API calls)
//         const gpsTrackingActive = Math.floor(cabsData.length * 0.85) // 85% of cabs have GPS tracking
//         const fastTagPaymentsCount = Math.floor(Math.random() * 50) + 20 // Random between 20-70
//         const eChallanCount = Math.floor(Math.random() * 15) + 5 // Random between 5-20
//         const documentExpiryCount = Math.floor(Math.random() * 10) + 2 // Random between 2-12

//         const monthlyExpenseData = expensesData.map((exp, index) => ({
//           month: exp.cabNumber || `Cab ${index + 1}`,
//           expense: exp.totalExpense || 0,
//         }))

//         const aggregatedBreakdown = expensesData.reduce((acc, exp) => {
//           const breakdown = exp.breakdown || {}
//           acc.fuel = (acc.fuel || 0) + (breakdown.fuel || 0)
//           acc.fasttag = (acc.fasttag || 0) + (breakdown.fastTag || breakdown.fasttag || 0)
//           acc.tyre = (acc.tyre || 0) + (breakdown.tyre || breakdown.tyrePuncture || 0)
//           acc.other = (acc.other || 0) + (breakdown.other || breakdown.otherProblems || 0)
//           return acc
//         }, {})

//         const formattedBreakdown = [
//           { name: "Fuel", value: aggregatedBreakdown.fuel || 0 },
//           { name: "FastTag", value: aggregatedBreakdown.fasttag || 0 },
//           { name: "TyrePuncture", value: aggregatedBreakdown.tyre || 0 },
//           { name: "OtherProblems", value: aggregatedBreakdown.other || 0 },
//         ]

//         // Mock data for document expiry
//         const mockDocumentExpiry = [
//           { document: "Insurance", expiring: 3, color: "#EF4444" },
//           { document: "RC", expiring: 1, color: "#F59E0B" },
//           { document: "Fitness", expiring: 5, color: "#10B981" },
//           { document: "Permit", expiring: 2, color: "#6366F1" },
//         ]

//         // Mock data for recent e-challans
//         const mockRecentEChallans = [
//           { cabNumber: "MH12AB1234", amount: 500, date: "2024-01-20", violation: "Speed Limit" },
//           { cabNumber: "MH14CD5678", amount: 1000, date: "2024-01-19", violation: "Signal Jump" },
//           { cabNumber: "MH09EF9012", amount: 200, date: "2024-01-18", violation: "Parking" },
//         ]

//         // Mock data for recent FastTag payments
//         const mockFastTagPayments = [
//           { cabNumber: "MH12AB1234", amount: 150, date: "2024-01-20", tollPlaza: "Mumbai-Pune Expressway" },
//           { cabNumber: "MH14CD5678", amount: 85, date: "2024-01-20", tollPlaza: "Bandra-Worli Sea Link" },
//           { cabNumber: "MH09EF9012", amount: 120, date: "2024-01-19", tollPlaza: "Eastern Express Highway" },
//         ]

//         setStats({
//           totalDrivers: driversData.length || 0,
//           totalCabs: cabsData.length || 0,
//           assignedCabs: currentlyAssignedCabs.length || 0,
//           totalExpenses: totalExpenses || 0,
//           gpsTracking: gpsTrackingActive,
//           fastTagPayments: fastTagPaymentsCount,
//           eChallan: eChallanCount,
//           documentExpiry: documentExpiryCount,
//         })

//         setExpenseData(monthlyExpenseData)
//         setExpenseBreakdown(formattedBreakdown)
//         setDocumentExpiryData(mockDocumentExpiry)
//         setRecentEChallans(mockRecentEChallans)
//         setRecentFastTagPayments(mockFastTagPayments)
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         setError("Failed to fetch dashboard data. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   // Navigation handlers for the new cards
//   const handleGPSTrackingClick = () => {
//     router.push("/GPSTracking")
//   }

//   const handleFastTagPaymentsClick = () => {
//     router.push("/FastTagPayments")
//   }

//   const handleEChallanClick = () => {
//     router.push("/EChallan")
//   }

//   const handleDocumentExpiryClick = () => {
//     router.push("/DocumentExpiry")
//   }

//   const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#A020F0"]

//   return (
//     <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen flex text-white">
//       <Sidebar />
//       <div className="p-8 mt-20 md:ml-60 sm:mt-0 flex-1">
//         {showAccessDenied && <AccessDeniedModal />}
//         <motion.h1
//           className="text-xl md:text-2xl font-bold mb-4 text-white"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           Admin Dashboard
//         </motion.h1>

//         {loading && <p className="text-center text-gray-300">Loading dashboard data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && !error && (
//           <>
//             {/* First Row - Original Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               {[
//                 { label: "Total Drivers", value: stats.totalDrivers, icon: <MdPerson size={28} />, color: "bg-blue-600" },
//                 { label: "Total Cabs", value: stats.totalCabs, icon: <MdOutlineDirectionsCar size={28} />, color: "bg-green-600" },
//                 { label: "Assigned Cabs", value: stats.assignedCabs, icon: <BsClipboardCheck size={28} />, color: "bg-yellow-600" },
//                 { label: "Total Expenses", value: stats.totalExpenses, icon: <MdOutlineAccountBalanceWallet size={28} />, prefix: "₹", color: "bg-red-600" },
//               ].map((card, index) => (
//                 <motion.div
//                   key={index}
//                   className="p-5 bg-gray-800 shadow-lg rounded-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <div className={`p-4 ${card.color} text-white rounded-full`}>{card.icon}</div>
//                   <div className="text-white">
//                     <h2 className="text-lg font-semibold">{card.label}</h2>
//                     <p className="text-2xl font-bold">
//                       <AnimatedCounter value={card.value} prefix={card.prefix || ""} />
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Second Row - New Stats with Navigation */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               {[
//                 { 
//                   label: "GPS Tracking", 
//                   value: stats.gpsTracking, 
//                   icon: <MdGpsFixed size={28} />, 
//                   color: "bg-purple-600", 
//                   suffix: " Active",
//                   onClick: handleGPSTrackingClick
//                 },
//                 { 
//                   label: "FastTag Payments", 
//                   value: stats.fastTagPayments, 
//                   icon: <MdPayment size={28} />, 
//                   color: "bg-indigo-600", 
//                   suffix: " Today",
//                   onClick: handleFastTagPaymentsClick
//                 },
//                 { 
//                   label: "E-Challan (M-Parivahan)", 
//                   value: stats.eChallan, 
//                   icon: <MdWarning size={28} />, 
//                   color: "bg-orange-600", 
//                   suffix: " Pending",
//                   onClick: handleEChallanClick
//                 },
//                 { 
//                   label: "Document Expiry", 
//                   value: stats.documentExpiry, 
//                   icon: <MdDescription size={28} />, 
//                   color: "bg-teal-600", 
//                   suffix: " Expiring",
//                   onClick: handleDocumentExpiryClick
//                 }
//               ].map((card, index) => (
//                 <motion.div
//                   key={index}
//                   className="p-5 bg-gray-800 shadow-lg rounded-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   onClick={card.onClick}
//                 >
//                   <div className={`p-4 ${card.color} text-white rounded-full`}>{card.icon}</div>
//                   <div className="text-white">
//                     <h2 className="text-lg font-semibold">{card.label}</h2>
//                     <p className="text-2xl font-bold">
//                       <AnimatedCounter value={card.value} suffix={card.suffix || ""} />
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               {/* Expense Chart */}
//               <motion.div
//                 className="p-6 bg-gray-800 shadow-lg rounded-lg"
//                 initial={{ opacity: 0, x: -50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <h3 className="text-lg font-semibold mb-4 text-white">Monthly Expenses by Cab</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={expenseData}>
//                     <XAxis dataKey="month" tick={{ fill: '#ffffff', fontSize: 12 }} />
//                     <YAxis tick={{ fill: '#ffffff', fontSize: 12 }} />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
//                       labelStyle={{ color: '#ffffff' }}
//                     />
//                     <Bar dataKey="expense" fill="#6366F1" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </motion.div>

//               {/* Expense Breakdown Pie Chart */}
//               <motion.div
//                 className="p-6 bg-gray-800 shadow-lg rounded-lg"
//                 initial={{ opacity: 0, x: 50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <h3 className="text-lg font-semibold mb-4 text-white">Expense Breakdown</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={expenseBreakdown}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {expenseBreakdown.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </motion.div>
//             </div>

//             {/* Document Expiry Chart */}
//             <motion.div
//               className="p-6 bg-gray-800 shadow-lg rounded-lg mb-8"
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//             >
//               <h3 className="text-lg font-semibold mb-4 text-white">Document Expiry Status</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={documentExpiryData} layout="horizontal">
//                   <XAxis type="number" tick={{ fill: '#ffffff', fontSize: 12 }} />
//                   <YAxis dataKey="document" type="category" tick={{ fill: '#ffffff', fontSize: 12 }} />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
//                     labelStyle={{ color: '#ffffff' }}
//                   />
//                   <Bar dataKey="expiring" fill="#F59E0B" radius={[0, 4, 4, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </motion.div>

//             {/* Recent Activities */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Recent E-Challans */}
//               <motion.div
//                 className="p-6 bg-gray-800 shadow-lg rounded-lg"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
//                   <MdWarning className="mr-2 text-orange-500" /> Recent E-Challans
//                 </h3>
//                 <div className="space-y-3">
//                   {recentEChallans.map((challan, index) => (
//                     <div key={index} className="p-3 bg-gray-700 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold text-white">{challan.cabNumber}</p>
//                           <p className="text-sm text-gray-300">{challan.violation}</p>
//                           <p className="text-xs text-gray-400">{challan.date}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-red-400">₹{challan.amount}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Recent FastTag Payments */}
//               <motion.div
//                 className="p-6 bg-gray-800 shadow-lg rounded-lg"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//               >
//                 <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
//                   <MdPayment className="mr-2 text-indigo-500" /> Recent FastTag Payments
//                 </h3>
//                 <div className="space-y-3">
//                   {recentFastTagPayments.map((payment, index) => (
//                     <div key={index} className="p-3 bg-gray-700 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold text-white">{payment.cabNumber}</p>
//                           <p className="text-sm text-gray-300">{payment.tollPlaza}</p>
//                           <p className="text-xs text-gray-400">{payment.date}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-green-400">₹{payment.amount}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard



// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
// import Sidebar from "../slidebar/page"
// import {
//   MdOutlineDirectionsCar,
//   MdOutlineAccountBalanceWallet,
//   MdPerson,
//   MdGpsFixed,
//   MdPayment,
//   MdWarning,
//   MdDescription,
//   MdClose,
// } from "react-icons/md"
// import { BsClipboardCheck } from "react-icons/bs"
// import { FaRocket, FaClock } from "react-icons/fa"
// import { motion, useAnimation } from "framer-motion"
// import { useInView } from "react-intersection-observer"
// import baseURL from "@/utils/api"
// import { useRouter } from "next/navigation"
// import { Bell, User } from "lucide-react"
// import AddDriver from "../DriverDetails/component/AddDriver"

// const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 1.5 }) => {
//   const controls = useAnimation()
//   const [count, setCount] = useState(0)
//   const [ref, inView] = useInView({ triggerOnce: true })

//   useEffect(() => {
//     if (inView) {
//       controls.start({
//         count: value,
//         transition: { duration },
//       })
//     }
//   }, [inView, value, controls, duration])

//   return (
//     <motion.span ref={ref} animate={controls} onUpdate={(latest) => setCount(Math.floor(latest.count))}>
//       {prefix}
//       {count}
//       {suffix}
//     </motion.span>
//   )
// }

// const AccessDeniedModal = () => {
//   const router = useRouter()
//   const handleClose = () => {
//     router.push("/")
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
//       <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full">
//         <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
//         <p className="mb-6">Your access has been restricted. Please contact the administrator.</p>
//         <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
//           Close
//         </button>
//       </div>
//     </div>
//   )
// }

// const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50  bg-black/50 backdrop-blur-sm flex items-center justify-center  bg-opacity-70">
//       <motion.div
//         className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
//         initial={{ opacity: 0, scale: 0.8, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.8, y: 20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="text-center">
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <MdClose size={24} />
//           </button>

//           {/* Icon */}
//           <div className="mb-6">
//             <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
//               <FaRocket className="text-white text-2xl" />
//             </div>
//           </div>

//           {/* Title */}
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">{featureName}</h2>

//           {/* Subtitle */}
//           <h3 className="text-lg font-semibold text-black-600 mb-4 flex items-center justify-center">
//             <FaClock className="mr-2" />
//             Coming Soon!
//           </h3>

//           {/* Description */}
//           <p className="text-gray-600 mb-6 leading-relaxed">
//             We're working hard to bring you this amazing feature. Stay tuned for updates and get ready for an enhanced
//             experience!
//           </p>

//           {/* Features list */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <h4 className="font-semibold text-gray-800 mb-2">What to expect:</h4>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Real-time monitoring and tracking</li>
//               <li>• Advanced analytics and reporting</li>
//               <li>• Seamless integration with existing systems</li>
//               <li>• User-friendly interface</li>
//             </ul>
//           </div>

//           {/* Action buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
//             >
//               Got it!
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalDrivers: 0,
//     totalCabs: 0,
//     assignedCabs: 0,
//     totalExpenses: 0,
//     gpsTracking: 0,
//     fastTagPayments: 0,
//     eChallan: 0,
//     documentExpiry: 0,
//   })
//   const [expenseData, setExpenseData] = useState([])
//   const [expenseBreakdown, setExpenseBreakdown] = useState([])
//   const [documentExpiryData, setDocumentExpiryData] = useState([])
//   const [recentEChallans, setRecentEChallans] = useState([])
//   const [recentFastTagPayments, setRecentFastTagPayments] = useState([])
//   const [recentServicing, setRecentServicing] = useState([]) // New state for actual servicing data
//   const [drivers, setDrivers] = useState([]) // New state for drivers data
//   const [assignments, setAssignments] = useState([]) // New state for assignments data
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const router = useRouter()
//   const [isDriverModel, setIsDriverModel] = useState(false)
//   const [showAccessDenied, setShowAccessDenied] = useState(false)
//   const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false)

//   // Coming Soon Modal State
//   const [showComingSoonModal, setShowComingSoonModal] = useState(false)
//   const [selectedFeature, setSelectedFeature] = useState("")

//   useEffect(() => {
//     const checkUserStatusAndFetchData = async () => {
//       const token = localStorage.getItem("token")
//       const id = localStorage.getItem("id")
//       if (!token || !id) {
//         router.push("/login")
//         return
//       }

//       try {
//         const res = await axios.get(`${baseURL}api/admin/getSubAdmin/${id}`)
//         if (res.data?.status === "Inactive") {
//           localStorage.clear()
//           setShowAccessDenied(true)
//           return
//         }
//       } catch (err) {
//         console.error("Error checking user status:", err)
//         router.push("/login")
//       }
//     }

//     checkUserStatusAndFetchData()
//   }, [router])

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true)
//         setError(null)
//         const token = localStorage.getItem("token")
//         if (!token) {
//           setError("No authentication token found. Please log in.")
//           return
//         }

//         const headers = { headers: { Authorization: `Bearer ${token}` } }

//         const [driversRes, cabsRes, assignedCabsRes, expensesRes, servicingRes] = await Promise.allSettled([
//           axios.get(`${baseURL}api/driver/profile`, headers),
//           axios.get(`${baseURL}api/cabDetails`, headers),
//           axios.get(`${baseURL}api/assigncab`, headers),
//           axios.get(`${baseURL}api/cabs/cabExpensive`, headers),
//           axios.get(`${baseURL}api/servicing`, headers), // Fetch actual servicing data
//         ])
//         console.log("Assigned cabs response:", assignedCabsRes.value.data.assignments)
//         // Safe data extraction with proper error handling
//         const driversData = driversRes.status === "fulfilled" && Array.isArray(driversRes.value.data)
//           ? driversRes.value.data
//           : []

//         const cabsData = cabsRes.status === "fulfilled" && Array.isArray(cabsRes.value.data)
//           ? cabsRes.value.data
//           : []

//         const assignedCabsData = assignedCabsRes.status === "fulfilled" && Array.isArray(assignedCabsRes.value.data.assignments)
//           ? assignedCabsRes.value.data.assignments
//           : []

//         const expensesData = expensesRes.status === "fulfilled" && expensesRes.value.data?.data && Array.isArray(expensesRes.value.data.data)
//           ? expensesRes.value.data.data
//           : []

//         const servicingData = servicingRes.status === "fulfilled" && servicingRes.value.data?.services && Array.isArray(servicingRes.value.data.services)
//           ? servicingRes.value.data.services
//           : []

//         // Store drivers and assignments for servicing data processing
//         setDrivers(driversData)
//         console.log("Assigned cabs data:", assignedCabsData)
//         setAssignments(assignedCabsData)

//         // Now safely filter the assignedCabsData since we've ensured it's an array
//         const currentlyAssignedCabs = assignedCabsData.filter((cab) => cab.status === "assigned")
//         const totalExpenses = expensesData.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0)

//         // Process servicing data to merge with driver and cab information
//         const processedServicing = servicingData.map((service) => {
//           // const assignment = assignedCabsData.find((a) => a.cab?._id === service.cab?._id)
//           const assignment = assignedCabsData.find((a) => a.cab?.id === service.cabId || a.cabId === service.cabId)

//           let serviceDriver = service.Driver

//           if (!serviceDriver || typeof serviceDriver === "string") {
//             const driverId = service.driver || service.driverId
//             serviceDriver = driversData.find((d) => d.id === driverId) || assignment?.driver
//           }
//           const serviceCab = service.CabDetail || assignment?.cab

//           // return {
//           //   ...service,
//           //   cab: service.cab || assignment?.cab,
//           //   driver: serviceDriver,
//           // }
//           return {
//             ...service,
//             cab: serviceCab,
//             driver: serviceDriver,
//           }
//         })

//         // Get only the 4 most recent servicing records
//         const recentServicingData = processedServicing
//           .sort((a, b) => new Date(b.serviceDate || b.createdAt) - new Date(a.serviceDate || a.createdAt))
//           .slice(0, 4)

//         setRecentServicing(recentServicingData)

//         // Mock data for new features (replace with actual API calls)
//         const gpsTrackingActive = Math.floor(cabsData.length * 0.85) // 85% of cabs have GPS tracking
//         const fastTagPaymentsCount = Math.floor(Math.random() * 50) + 20 // Random between 20-70
//         const eChallanCount = Math.floor(Math.random() * 15) + 5 // Random between 5-20
//         const documentExpiryCount = Math.floor(Math.random() * 10) + 2 // Random between 2-12

//         const monthlyExpenseData = expensesData.map((exp, index) => ({
//           month: exp.cabNumber || `Cab ${index + 1}`,
//           expense: exp.totalExpense || 0,
//         }))

//         const aggregatedBreakdown = expensesData.reduce((acc, exp) => {
//           const breakdown = exp.breakdown || {}
//           acc.fuel = (acc.fuel || 0) + (breakdown.fuel || 0)
//           acc.fasttag = (acc.fasttag || 0) + (breakdown.fastTag || breakdown.fasttag || 0)
//           acc.tyre = (acc.tyre || 0) + (breakdown.tyre || breakdown.tyrePuncture || 0)
//           acc.other = (acc.other || 0) + (breakdown.other || breakdown.otherProblems || 0)
//           return acc
//         }, {})

//         const formattedBreakdown = [
//           { name: "Fuel", value: aggregatedBreakdown.fuel || 0 },
//           { name: "FastTag", value: aggregatedBreakdown.fasttag || 0 },
//           { name: "TyrePuncture", value: aggregatedBreakdown.tyre || 0 },
//           { name: "OtherProblems", value: aggregatedBreakdown.other || 0 },
//         ]

//         // Mock data for document expiry
//         const mockDocumentExpiry = [
//           { document: "Insurance", expiring: 3, color: "#EF4444" },
//           { document: "RC", expiring: 1, color: "#F59E0B" },
//           { document: "Fitness", expiring: 5, color: "#10B981" },
//           { document: "Permit", expiring: 2, color: "#6366F1" },
//         ]

//         // Mock data for recent e-challans
//         const mockRecentEChallans = [
//           { cabNumber: "MH12AB1234", amount: 500, date: "2024-01-20", violation: "Speed Limit" },
//           { cabNumber: "MH14CD5678", amount: 1000, date: "2024-01-19", violation: "Signal Jump" },
//           { cabNumber: "MH09EF9012", amount: 200, date: "2024-01-18", violation: "Parking" },
//         ]

//         // Mock data for recent FastTag payments
//         const mockFastTagPayments = [
//           { cabNumber: "MH12AB1234", amount: 150, date: "2024-01-20", tollPlaza: "Mumbai-Pune Expressway" },
//           { cabNumber: "MH14CD5678", amount: 85, date: "2024-01-20", tollPlaza: "Bandra-Worli Sea Link" },
//           { cabNumber: "MH09EF9012", amount: 120, date: "2024-01-19", tollPlaza: "Eastern Express Highway" },
//         ]

//         setStats({
//           totalDrivers: driversData.length || 0,
//           totalCabs: cabsData.length || 0,
//           assignedCabs: currentlyAssignedCabs.length || 0,
//           totalExpenses: totalExpenses || 0,
//           gpsTracking: gpsTrackingActive,
//           fastTagPayments: fastTagPaymentsCount,
//           eChallan: eChallanCount,
//           documentExpiry: documentExpiryCount,
//         })

//         setExpenseData(monthlyExpenseData)
//         setExpenseBreakdown(formattedBreakdown)
//         setDocumentExpiryData(mockDocumentExpiry)
//         setRecentEChallans(mockRecentEChallans)
//         setRecentFastTagPayments(mockFastTagPayments)
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         setError("Failed to fetch dashboard data. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   // Updated navigation handlers for the new cards
//   const handleFeatureClick = (featureName) => {
//     setSelectedFeature(featureName)
//     setShowComingSoonModal(true)
//   }

//   const handleCloseComingSoonModal = () => {
//     setShowComingSoonModal(false)
//     setSelectedFeature("")
//   }


  // const handleGPSLink=()=>{
  //   router.push('../GPSTracking')
  // }

//   // Function to get status badge for servicing
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       pending: "bg-blue-50 text-blue-600 border border-blue-200",
//       completed: "bg-green-50 text-green-600 border border-green-200",
//       assigned: "bg-yellow-50 text-yellow-600 border border-yellow-200",
//     }
//     const statusText = {
//       pending: "Upcoming",
//       completed: "Completed",
//       assigned: "Assigned",
//     }
//     return (
//       <span
//         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || statusColors.pending}`}
//       >
//         {statusText[status] || "Upcoming"}
//       </span>
//     )
//   }

//   const COLORS = ["#F59E0B", "#10B981", "#EF4444", "#6366F1", "#8B5CF6"]

//   return (
//     <div className="bg-gray-50 min-h-screen flex">
//       <Sidebar />
//       <div className="flex-1 lg:ml-64">
//         {showAccessDenied && <AccessDeniedModal />}

//         {/* Coming Soon Modal */}
//         <ComingSoonModal
//           isOpen={showComingSoonModal}
//           onClose={handleCloseComingSoonModal}
//           featureName={selectedFeature}
//         />

//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
//                 <span>🏠</span>
//                 <span>›</span>
//                 <span>Dashboard</span>
//               </nav>
//               <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 ml-4">
//                 <Bell className="h-5 w-5 text-gray-600" />
//                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                   <User className="h-4 w-4 text-gray-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-4 lg:p-8">
//           {loading && <p className="text-center text-gray-600">Loading dashboard data...</p>}
//           {error && <p className="text-center text-red-500">{error}</p>}

//           {!loading && !error && (
//             <>
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
//                 {[
//                   {
//                     label: "Total Drivers",
//                     value: stats.totalDrivers,
//                     icon: <MdPerson size={20} className="text-gray-600" />,
//                     bgColor: "bg-white",
//                   },
//                   {
//                     label: "Total Vehicles",
//                     value: stats.totalCabs,
//                     icon: <MdOutlineDirectionsCar size={20} className="text-gray-600" />,
//                     bgColor: "bg-white",
//                   },
//                   {
//                     label: "Assigned Vehicles",
//                     value: stats.assignedCabs,
//                     icon: <BsClipboardCheck size={20} className="text-gray-600" />,
//                     bgColor: "bg-white",
//                   },
//                   {
//                     label: "Total Expenses",
//                     value: stats.totalExpenses,
//                     icon: <MdOutlineAccountBalanceWallet size={20} className="text-gray-600" />,
//                     prefix: "₹",
//                     bgColor: "bg-white",
//                   },
//                 ].map((card, index) => (
//                   <motion.div
//                     key={index}
//                     className={`${card.bgColor} p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-gray-600 text-xs lg:text-sm font-medium">{card.label}</div>
//                       {card.icon}
//                     </div>
//                     <div className="text-2xl lg:text-3xl font-bold text-gray-900">
//                       <AnimatedCounter value={card.value} prefix={card.prefix || ""} />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Main Content Grid */}
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
//                 {/* Recent Servicing Table - Now Dynamic */}
//                 <div className="xl:col-span-2">
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 lg:p-6 border-b border-gray-200">
//                       <h3 className="text-lg font-semibold text-gray-900">Recent Servicing</h3>
//                       <p className="text-sm text-gray-600 mt-1">A log of the most recent services for your fleet.</p>
//                     </div>
//                     {recentServicing.length === 0 ? (
//                       <div className="text-center py-12">
//                         <svg
//                           className="w-12 h-12 text-gray-400 mx-auto mb-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                           />
//                         </svg>
//                         <p className="text-gray-500 font-medium">No recent servicing found</p>
//                         <p className="text-gray-400 text-sm mt-1">Servicing records will appear here once available</p>
//                       </div>
//                     ) : (
//                       <div className="overflow-x-auto">
//                         <table className="w-full">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Cab ID
//                               </th>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Service
//                               </th>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Driver
//                               </th>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Date
//                               </th>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Cost
//                               </th>
//                               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Status
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {recentServicing.map((service, index) => (
//                               <tr key={service._id || index} className="hover:bg-gray-50">
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                   {service.cab?.cabNumber || "N/A"}
//                                 </td>
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {service.serviceType || "General Service"}
//                                 </td>
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {service.driver?.name || "N/A"}
//                                 </td>
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {service.serviceDate
//                                     ? new Date(service.serviceDate).toLocaleDateString()
//                                     : service.createdAt
//                                       ? new Date(service.createdAt).toLocaleDateString()
//                                       : "N/A"}
//                                 </td>
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {service.servicingAmount ? `₹${service.servicingAmount.toLocaleString()}` : "N/A"}
//                                 </td>
//                                 <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
//                                   {getStatusBadge(service.status)}
//                                 </td>
//                               </tr>
//                             ))}
//                             {/* Add empty rows to fill space when there are fewer than 4 records */}
//                             {recentServicing.length < 4 &&
//                               Array.from({ length: 4 - recentServicing.length }).map((_, index) => (
//                                 <tr key={`empty-${index}`} className="bg-gray-50/30">
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
//                                 </tr>
//                               ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Charts Column */}
//                 <div className="space-y-6 lg:space-y-8">
//                   {/* Expense by Category */}
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense by Category</h3>
//                     <p className="text-sm text-gray-600 mb-4">A donut chart showing the breakdown of expenses.</p>
//                     <ResponsiveContainer width="100%" height={200}>
//                       <PieChart>
//                         <Pie data={expenseData} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="expense">
//                           {expenseData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "white",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Features Row */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">
//                 {[
//                   {
//                     label: "GPS Tracking",
//                     value: stats.totalCabs,
//                     icon: <MdGpsFixed size={20} className="text-purple-600" />,
//                     suffix: " Active",
//                     onClick: () => handleGPSLink(),
//                     bgColor: "bg-purple-50",
//                     borderColor: "border-purple-200",
//                   },
//                   {
//                     label: "FastTag Payments",
//                     value: stats.fastTagPayments,
//                     icon: <MdPayment size={20} className="text-indigo-600" />,
//                     suffix: " Today",
//                     onClick: () => handleFeatureClick("FastTag Payments"),
//                     bgColor: "bg-indigo-50",
//                     borderColor: "border-indigo-200",
//                   },
//                   {
//                     label: "E-Challan (M-Parivahan)",
//                     value: stats.eChallan,
//                     icon: <MdWarning size={20} className="text-orange-600" />,
//                     suffix: " Pending",
//                     onClick: () => handleFeatureClick("E-Challan Management"),
//                     bgColor: "bg-orange-50",
//                     borderColor: "border-orange-200",
//                   },
//                   {
//                     label: "Document Expiry",
//                     value: stats.documentExpiry,
//                     icon: <MdDescription size={20} className="text-teal-600" />,
//                     suffix: " Expiring",
//                     onClick: () => handleFeatureClick("Document Expiry Tracking"),
//                     bgColor: "bg-teal-50",
//                     borderColor: "border-teal-200",
//                   },
//                 ].map((card, index) => (
//                   <motion.div
//                     key={index}
//                     className={`${card.bgColor} ${card.borderColor} p-4 lg:p-6 rounded-lg border hover:shadow-md transition-all cursor-pointer transform hover:scale-105`}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     onClick={card.onClick}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-gray-700 text-xs lg:text-sm font-medium">{card.label}</div>
//                       {card.icon}
//                     </div>
//                     <div className="text-xl lg:text-2xl font-bold text-gray-900">
//                       <AnimatedCounter value={card.value} suffix={card.suffix || ""} />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Upcoming Features Section - Fixed */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
//                 {/* Recent E-Challans - Coming Soon Feature */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                   <div className="p-4 lg:p-6 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                         <MdWarning className="mr-2 text-orange-500" /> Recent E-Challans
//                       </h3>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         <FaClock className="mr-1" size={10} />
//                         Coming Soon
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Track and manage e-challans from M-Parivahan system</p>
//                   </div>
//                   <div className="p-4 lg:p-6">
//                     <div className="text-center py-8">
//                       <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4">
//                         <MdWarning className="text-orange-600 text-2xl" />
//                       </div>
//                       <h4 className="text-lg font-semibold text-gray-900 mb-2">E-Challan Integration</h4>
//                       <p className="text-gray-600 text-sm mb-4">
//                         Automatically fetch and track e-challans from the M-Parivahan system for all your vehicles.
//                       </p>
//                       <button
//                         onClick={() => handleFeatureClick("E-Challan Management")}
//                         className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
//                       >
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent FastTag Payments - Coming Soon Feature */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                   <div className="p-4 lg:p-6 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                         <MdPayment className="mr-2 text-indigo-500" /> Recent FastTag Payments
//                       </h3>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         <FaClock className="mr-1" size={10} />
//                         Coming Soon
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Monitor FastTag transactions and toll payments</p>
//                   </div>
//                   <div className="p-4 lg:p-6">
//                     <div className="text-center py-8">
//                       <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
//                         <MdPayment className="text-indigo-600 text-2xl" />
//                       </div>
//                       <h4 className="text-lg font-semibold text-gray-900 mb-2">FastTag Integration</h4>
//                       <p className="text-gray-600 text-sm mb-4">
//                         Real-time tracking of FastTag payments and toll transactions across all your vehicles.
//                       </p>
//                       <button
//                         onClick={() => handleFeatureClick("FastTag Payments")}
//                         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
//                       >
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {isDriverModel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setIsDriverModel(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <AddDriver
//               isOpen={isAddDriverModalOpen}
//               onClose={() => setIsAddDriverModalOpen(false)}
//             //  onDriverAdded={fetchDrivers}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AdminDashboard



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Sidebar from "../slidebar/page"
import {
  MdOutlineDirectionsCar,
  MdOutlineAccountBalanceWallet,
  MdPerson,
  MdGpsFixed,
  MdPayment,
  MdWarning,
  MdDescription,
  MdClose,
} from "react-icons/md"
import { BsClipboardCheck } from "react-icons/bs"
import { FaRocket, FaClock } from "react-icons/fa"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import baseURL from "@/utils/api"
import { useRouter } from "next/navigation"
import { Bell, User } from "lucide-react"
import AddDriver from "../DriverDetails/component/AddDriver"

const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 1.5 }) => {
  const controls = useAnimation()
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start({
        count: value,
        transition: { duration },
      })
    }
  }, [inView, value, controls, duration])

  return (
    <motion.span ref={ref} animate={controls} onUpdate={(latest) => setCount(Math.floor(latest.count))}>
      {prefix}
      {count}
      {suffix}
    </motion.span>
  )
}

const AccessDeniedModal = () => {
  const router = useRouter()
  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="mb-6">Your access has been restricted. Please contact the administrator.</p>
        <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Close
        </button>
      </div>
    </div>
  )
}

const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50  bg-black/50 backdrop-blur-sm flex items-center justify-center  bg-opacity-70">
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
            We're working hard to bring you this amazing feature. Stay tuned for updates and get ready for an enhanced
            experience!
          </p>

          {/* Features list */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">What to expect:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time monitoring and tracking</li>
              <li>• Advanced analytics and reporting</li>
              <li>• Seamless integration with existing systems</li>
              <li>• User-friendly interface</li>
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalCabs: 0,
    assignedCabs: 0,
    totalExpenses: 0,
    gpsTracking: 0,
    fastTagPayments: 0,
    eChallan: 0,
    documentExpiry: 0,
  })
  const [expenseData, setExpenseData] = useState([])
  const [expenseBreakdown, setExpenseBreakdown] = useState([])
  const [documentExpiryData, setDocumentExpiryData] = useState([])
  const [recentEChallans, setRecentEChallans] = useState([])
  const [recentFastTagPayments, setRecentFastTagPayments] = useState([])
  const [recentServicing, setRecentServicing] = useState([]) // New state for actual servicing data
  const [drivers, setDrivers] = useState([]) // New state for drivers data
  const [assignments, setAssignments] = useState([]) // New state for assignments data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [isDriverModel, setIsDriverModel] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false)

  // Coming Soon Modal State
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState("")

  useEffect(() => {
    const checkUserStatusAndFetchData = async () => {
      const token = localStorage.getItem("token")
      const id = localStorage.getItem("id")
      if (!token || !id) {
        router.push("/login")
        return
      }

      try {
        const res = await axios.get(`${baseURL}api/admin/getSubAdmin/${id}`)
        if (res.data?.status === "Inactive") {
          localStorage.clear()
          setShowAccessDenied(true)
          return
        }
      } catch (err) {
        console.error("Error checking user status:", err)
        router.push("/login")
      }
    }

    checkUserStatusAndFetchData()
  }, [router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Authentication token not found. Please log in again.")
          return
        }

        const headers = { headers: { Authorization: `Bearer ${token}` } }

        const [driversRes, cabsRes, assignedCabsRes, expensesRes, servicingRes] = await Promise.allSettled([
          axios.get(`${baseURL}api/driver/profile`, headers),
          axios.get(`${baseURL}api/cabDetails`, headers),
          axios.get(`${baseURL}api/assigncab`, headers),
          axios.get(`${baseURL}api/cabs/cabExpensive`, headers),
          axios.get(`${baseURL}api/servicing`, headers), // Fetch actual servicing data
        ])

        console.log("servicingresult", servicingRes)
        console.log("Assigned cabs response:", assignedCabsRes)
        console.log(
          "Assigned cabs full data:",
          assignedCabsRes.status === "fulfilled" ? assignedCabsRes.value.data : "Request failed",
        )

        // Safe data extraction with proper error handling
        const driversData =
          driversRes.status === "fulfilled" && Array.isArray(driversRes.value.data) ? driversRes.value.data : []

        const cabsData = cabsRes.status === "fulfilled" && Array.isArray(cabsRes.value.data) ? cabsRes.value.data : []

        let assignedCabsData = []
        if (assignedCabsRes.status === "fulfilled") {
          const responseData = assignedCabsRes.value.data
          console.log("Raw assigned cabs response data:", responseData)

          // Handle different possible response structures
          if (Array.isArray(responseData)) {
            assignedCabsData = responseData
          } else if (responseData && Array.isArray(responseData.assignments)) {
            assignedCabsData = responseData.assignments
          } else if (responseData && Array.isArray(responseData.data)) {
            assignedCabsData = responseData.data
          } else {
            console.warn("Unexpected assigned cabs response structure:", responseData)
          }
        }

        const expensesData =
          expensesRes.status === "fulfilled" &&
          expensesRes.value.data?.data &&
          Array.isArray(expensesRes.value.data.data)
            ? expensesRes.value.data.data
            : []

        const servicingData =
          servicingRes.status === "fulfilled" &&
          servicingRes.value.data?.services &&
          Array.isArray(servicingRes.value.data.services)
            ? servicingRes.value.data.services
            : []

        // Store drivers and assignments for servicing data processing
        setDrivers(driversData)
        console.log("Processed assigned cabs data:", assignedCabsData)
        setAssignments(assignedCabsData)

        const currentlyAssignedCabs = assignedCabsData.filter((cab) => {
          const status = cab.status?.toLowerCase?.() || ""
          const isAssigned = status === "assigned" || status === "active" || status === "in-use"
          console.log(
            `Cab ${cab.id || cab._id || "unknown"} status: "${cab.status}" -> ${isAssigned ? "COUNTED" : "IGNORED"}`,
          )
          return isAssigned
        })

        console.log(`Total assigned cabs found: ${currentlyAssignedCabs.length}`)

        const totalExpenses = expensesData.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0)

        // Process servicing data to merge with driver and cab information
        const processedServicing = servicingData.map((service) => {
          // const assignment = assignedCabsData.find((a) => a.cab?._id === service.cab?._id)
          const assignment = assignedCabsData.find((a) => a.cab?.id === service.cabId || a.cabId === service.cabId)

          let serviceDriver = service.Driver

          if (!serviceDriver || typeof serviceDriver === "string") {
            const driverId = service.driver || service.driverId
            serviceDriver = driversData.find((d) => d.id === driverId) || assignment?.driver
          }
          const serviceCab = service.CabDetail || assignment?.cab

          // return {
          //   ...service,
          //   cab: service.cab || assignment?.cab,
          //   driver: serviceDriver,
          // }
          return {
            ...service,
            cab: serviceCab,
            driver: serviceDriver,
          }
        })

        // Get only the 4 most recent servicing records
        const recentServicingData = processedServicing
          .sort((a, b) => new Date(b.serviceDate || b.createdAt) - new Date(a.serviceDate || a.createdAt))
          .slice(0, 4)

        setRecentServicing(recentServicingData)

        // Mock data for new features (replace with actual API calls)
        const gpsTrackingActive = Math.floor(cabsData.length * 0.85) // 85% of cabs have GPS tracking
        const fastTagPaymentsCount = Math.floor(Math.random() * 50) + 20 // Random between 20-70
        const eChallanCount = Math.floor(Math.random() * 15) + 5 // Random between 5-20
        const documentExpiryCount = Math.floor(Math.random() * 10) + 2 // Random between 2-12

        const monthlyExpenseData = expensesData.map((exp, index) => ({
          month: exp.cabNumber || `Cab ${index + 1}`,
          expense: exp.totalExpense || 0,
        }))

        const aggregatedBreakdown = expensesData.reduce((acc, exp) => {
          const breakdown = exp.breakdown || {}
          acc.fuel = (acc.fuel || 0) + (breakdown.fuel || 0)
          acc.fasttag = (acc.fasttag || 0) + (breakdown.fastTag || breakdown.fasttag || 0)
          acc.tyre = (acc.tyre || 0) + (breakdown.tyre || breakdown.tyrePuncture || 0)
          acc.other = (acc.other || 0) + (breakdown.other || breakdown.otherProblems || 0)
          return acc
        }, {})

        const formattedBreakdown = [
          { name: "Fuel", value: aggregatedBreakdown.fuel || 0 },
          { name: "FastTag", value: aggregatedBreakdown.fasttag || 0 },
          { name: "TyrePuncture", value: aggregatedBreakdown.tyre || 0 },
          { name: "OtherProblems", value: aggregatedBreakdown.other || 0 },
        ]

        // Mock data for document expiry
        const mockDocumentExpiry = [
          { document: "Insurance", expiring: 3, color: "#EF4444" },
          { document: "RC", expiring: 1, color: "#F59E0B" },
          { document: "Fitness", expiring: 5, color: "#10B981" },
          { document: "Permit", expiring: 2, color: "#6366F1" },
        ]

        // Mock data for recent e-challans
        const mockRecentEChallans = [
          { cabNumber: "MH12AB1234", amount: 500, date: "2024-01-20", violation: "Speed Limit" },
          { cabNumber: "MH14CD5678", amount: 1000, date: "2024-01-19", violation: "Signal Jump" },
          { cabNumber: "MH09EF9012", amount: 200, date: "2024-01-18", violation: "Parking" },
        ]

        // Mock data for recent FastTag payments
        const mockFastTagPayments = [
          { cabNumber: "MH12AB1234", amount: 150, date: "2024-01-20", tollPlaza: "Mumbai-Pune Expressway" },
          { cabNumber: "MH14CD5678", amount: 85, date: "2024-01-20", tollPlaza: "Bandra-Worli Sea Link" },
          { cabNumber: "MH09EF9012", amount: 120, date: "2024-01-19", tollPlaza: "Eastern Express Highway" },
        ]

        setStats({
          totalDrivers: driversData.length || 0,
          totalCabs: cabsData.length || 0,
          assignedCabs: currentlyAssignedCabs.length || 0, // This should now show the correct count
          totalExpenses: totalExpenses || 0,
          gpsTracking: gpsTrackingActive,
          fastTagPayments: fastTagPaymentsCount,
          eChallan: eChallanCount,
          documentExpiry: documentExpiryCount,
        })

        setExpenseData(monthlyExpenseData)
        setExpenseBreakdown(formattedBreakdown)
        setDocumentExpiryData(mockDocumentExpiry)
        setRecentEChallans(mockRecentEChallans)
        setRecentFastTagPayments(mockFastTagPayments)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to fetch dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Updated navigation handlers for the new cards
  const handleFeatureClick = (featureName) => {
    setSelectedFeature(featureName)
    setShowComingSoonModal(true)
  }

  const handleCloseComingSoonModal = () => {
    setShowComingSoonModal(false)
    setSelectedFeature("")
  }

  // Function to get status badge for servicing
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-blue-50 text-blue-600 border border-blue-200",
      completed: "bg-green-50 text-green-600 border border-green-200",
      assigned: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    }
    const statusText = {
      pending: "Upcoming",
      completed: "Completed",
      assigned: "Assigned",
    }
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || statusColors.pending}`}
      >
        {statusText[status] || "Upcoming"}
      </span>
    )
  }

  const handleGPSLink=()=>{
    router.push('../GPSTracking')
  }
  const COLORS = ["#F59E0B", "#10B981", "#EF4444", "#6366F1", "#8B5CF6"]

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {showAccessDenied && <AccessDeniedModal />}

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={showComingSoonModal}
          onClose={handleCloseComingSoonModal}
          featureName={selectedFeature}
        />

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span>🏠</span>
                <span>›</span>
                <span>Dashboard</span>
              </nav>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 ml-4">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {loading && <p className="text-center text-gray-600">Loading dashboard data...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                {[
                  {
                    label: "Total Drivers",
                    value: stats.totalDrivers,
                    icon: <MdPerson size={20} className="text-gray-600" />,
                    bgColor: "bg-white",
                  },
                  {
                    label: "Total Vehicles",
                    value: stats.totalCabs,
                    icon: <MdOutlineDirectionsCar size={20} className="text-gray-600" />,
                    bgColor: "bg-white",
                  },
                  {
                    label: "Assigned Vehicles",
                    value: stats.assignedCabs,
                    icon: <BsClipboardCheck size={20} className="text-gray-600" />,
                    bgColor: "bg-white",
                  },
                  {
                    label: "Total Expenses",
                    value: stats.totalExpenses,
                    icon: <MdOutlineAccountBalanceWallet size={20} className="text-gray-600" />,
                    prefix: "₹",
                    bgColor: "bg-white",
                  },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className={`${card.bgColor} p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-600 text-xs lg:text-sm font-medium">{card.label}</div>
                      {card.icon}
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      <AnimatedCounter value={card.value} prefix={card.prefix || ""} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Servicing Table - Now Dynamic */}
                <div className="xl:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Servicing</h3>
                      <p className="text-sm text-gray-600 mt-1">A log of the most recent services for your fleet.</p>
                    </div>
                    {recentServicing.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-gray-500 font-medium">No recent servicing found</p>
                        <p className="text-gray-400 text-sm mt-1">Servicing records will appear here once available</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cab ID
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cost
                              </th>
                              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {recentServicing.map((service, index) => (
                              <tr key={service._id || index} className="hover:bg-gray-50">
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {service.CabsDetail?.cabNumber || "N/A"}
                                </td>
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {service.serviceType || "General Service"}
                                </td>
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {service.driver?.name || "N/A"}
                                </td>
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {service.serviceDate
                                    ? new Date(service.serviceDate).toLocaleDateString()
                                    : service.createdAt
                                      ? new Date(service.createdAt).toLocaleDateString()
                                      : "N/A"}
                                </td>
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {service.servicingAmount ? `₹${service.servicingAmount.toLocaleString()}` : "N/A"}
                                </td>
                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                  {getStatusBadge(service.status)}
                                </td>
                              </tr>
                            ))}
                            {/* Add empty rows to fill space when there are fewer than 4 records */}
                            {recentServicing.length < 4 &&
                              Array.from({ length: 4 - recentServicing.length }).map((_, index) => (
                                <tr key={`empty-${index}`} className="bg-gray-50/30">
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charts Column */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Expense by Category */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense by Category</h3>
                    <p className="text-sm text-gray-600 mb-4">A donut chart showing the breakdown of expenses.</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={expenseData} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="expense">
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Additional Features Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">
                {[
                  {
                    label: "GPS Tracking",
                    value: stats.gpsTracking,
                    icon: <MdGpsFixed size={20} className="text-purple-600" />,
                    suffix: " Active",
                    onClick: () => handleGPSLink(),
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-200",
                  },
                  {
                    label: "FastTag Payments",
                    value: stats.fastTagPayments,
                    icon: <MdPayment size={20} className="text-indigo-600" />,
                    suffix: " Today",
                    onClick: () => handleFeatureClick("FastTag Payments"),
                    bgColor: "bg-indigo-50",
                    borderColor: "border-indigo-200",
                  },
                  {
                    label: "E-Challan (M-Parivahan)",
                    value: stats.eChallan,
                    icon: <MdWarning size={20} className="text-orange-600" />,
                    suffix: " Pending",
                    onClick: () => handleFeatureClick("E-Challan Management"),
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                  },
                  {
                    label: "Document Expiry",
                    value: stats.documentExpiry,
                    icon: <MdDescription size={20} className="text-teal-600" />,
                    suffix: " Expiring",
                    onClick: () => handleFeatureClick("Document Expiry Tracking"),
                    bgColor: "bg-teal-50",
                    borderColor: "border-teal-200",
                  },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className={`${card.bgColor} ${card.borderColor} p-4 lg:p-6 rounded-lg border hover:shadow-md transition-all cursor-pointer transform hover:scale-105`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={card.onClick}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-700 text-xs lg:text-sm font-medium">{card.label}</div>
                      {card.icon}
                    </div>
                    <div className="text-xl lg:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={card.value} suffix={card.suffix || ""} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upcoming Features Section - Fixed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                {/* Recent E-Challans - Coming Soon Feature */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MdWarning className="mr-2 text-orange-500" /> Recent E-Challans
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaClock className="mr-1" size={10} />
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Track and manage e-challans from M-Parivahan system</p>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4">
                        <MdWarning className="text-orange-600 text-2xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">E-Challan Integration</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Automatically fetch and track e-challans from the M-Parivahan system for all your vehicles.
                      </p>
                      <button
                        onClick={() => handleFeatureClick("E-Challan Management")}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent FastTag Payments - Coming Soon Feature */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MdPayment className="mr-2 text-indigo-500" /> Recent FastTag Payments
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaClock className="mr-1" size={10} />
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Monitor FastTag transactions and toll payments</p>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
                        <MdPayment className="text-indigo-600 text-2xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">FastTag Integration</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Real-time tracking of FastTag payments and toll transactions across all your vehicles.
                      </p>
                      <button
                        onClick={() => handleFeatureClick("FastTag Payments")}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isDriverModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsDriverModel(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AddDriver
              isOpen={isAddDriverModalOpen}
              onClose={() => setIsAddDriverModalOpen(false)}
              //  onDriverAdded={fetchDrivers}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
