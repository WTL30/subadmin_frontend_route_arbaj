// "use client"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from "next/navigation"
// import {
//   MdGpsFixed,
//   MdLocationOn,
//   MdSpeed,
//   MdBatteryFull,
//   MdSignalCellular4Bar,
//   MdPerson,
//   MdMap,
//   MdNotifications,
//   MdPhone,
//   MdMessage,
//   MdDirections,
//   MdRefresh,
//   MdClose,
// } from "react-icons/md"
// import { FaCar, FaRoute, FaRocket, FaClock } from "react-icons/fa"
// import Sidebar from "../slidebar/page"

// // Coming Soon Modal Component
// const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 backdrop-blur-sm  bg-opacity-70">
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
//             experience with real-time GPS tracking!
//           </p>

//           {/* Features list */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <h4 className="font-semibold text-gray-800 mb-2">What to expect:</h4>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Real-time vehicle location tracking</li>
//               <li>• Live route monitoring and optimization</li>
//               <li>• Driver behavior analytics</li>
//               <li>• Geofencing and alerts system</li>
//               <li>• Historical trip data and reports</li>
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

// // Mock RealTimeMap Component
// const RealTimeMap = ({ cabs, selectedCab, onCabSelect }) => {
//   return (
//     <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
//       <div className="text-center p-8">
//         <MdMap size={64} className="text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600 text-lg">Interactive Map View</p>
//         <p className="text-gray-500 text-sm mt-2">
//           {selectedCab ? `Showing ${selectedCab.cabNumber}` : `Showing ${cabs.length} cabs`}
//         </p>
//       </div>
//     </div>
//   )
// }

// // Mock TripAnalytics Component
// const TripAnalytics = ({ gpsData }) => {
//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Analytics</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-blue-600">
//             {gpsData.reduce((acc, cab) => acc + cab.distanceTraveled, 0).toFixed(1)} km
//           </div>
//           <div className="text-sm text-gray-600">Total Distance</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-green-600">{gpsData.filter((cab) => cab.tripId).length}</div>
//           <div className="text-sm text-gray-600">Active Trips</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-orange-600">
//             {Math.round(gpsData.reduce((acc, cab) => acc + cab.speed, 0) / gpsData.length)} km/h
//           </div>
//           <div className="text-sm text-gray-600">Average Speed</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const GPSTracking = () => {
//   const router = useRouter()
//   const [gpsData, setGpsData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedCab, setSelectedCab] = useState(null)
//   const [showMapView, setShowMapView] = useState(false)
//   const [mapViewCab, setMapViewCab] = useState(null)
//   const [alerts, setAlerts] = useState([])
//   const [realTimeUpdates, setRealTimeUpdates] = useState(true)

//   // Coming Soon Modal State
//   const [showComingSoonModal, setShowComingSoonModal] = useState(true)

//   // Handle closing the coming soon modal
//   const handleCloseComingSoonModal = () => {
//     setShowComingSoonModal(false)
//     router.push("/AdminDashboard")
//   }

//   useEffect(() => {
//     // Mock GPS data - replace with actual API call
//     const mockGpsData = [
//       {
//         id: 1,
//         cabNumber: "MH12AB1234",
//         driverName: "Rajesh Kumar",
//         driverPhone: "+91 9876543210",
//         location: "Pune, Maharashtra",
//         latitude: 18.5204,
//         longitude: 73.8567,
//         speed: 45,
//         status: "Active",
//         lastUpdate: "2 mins ago",
//         batteryLevel: 85,
//         signalStrength: 4,
//         route: "Katraj to Hinjewadi",
//         estimatedArrival: "15 mins",
//         tripId: "TRP001",
//         passengerCount: 2,
//         destination: "Hinjewadi IT Park",
//         distanceTraveled: 12.5,
//         fuelLevel: 75,
//       },
//       {
//         id: 2,
//         cabNumber: "MH14CD5678",
//         driverName: "Suresh Patil",
//         driverPhone: "+91 9876543211",
//         location: "Mumbai, Maharashtra",
//         latitude: 19.076,
//         longitude: 72.8777,
//         speed: 0,
//         status: "Idle",
//         lastUpdate: "1 min ago",
//         batteryLevel: 92,
//         signalStrength: 5,
//         route: "Parked at Bandra",
//         estimatedArrival: "N/A",
//         tripId: null,
//         passengerCount: 0,
//         destination: null,
//         distanceTraveled: 0,
//         fuelLevel: 90,
//       },
//       {
//         id: 3,
//         cabNumber: "MH09EF9012",
//         driverName: "Amit Sharma",
//         driverPhone: "+91 9876543212",
//         location: "Nashik, Maharashtra",
//         latitude: 19.9975,
//         longitude: 73.7898,
//         speed: 65,
//         status: "Active",
//         lastUpdate: "5 mins ago",
//         batteryLevel: 78,
//         signalStrength: 3,
//         route: "Nashik to Pune",
//         estimatedArrival: "2 hours",
//         tripId: "TRP002",
//         passengerCount: 4,
//         destination: "Pune Railway Station",
//         distanceTraveled: 45.2,
//         fuelLevel: 60,
//       },
//       {
//         id: 4,
//         cabNumber: "MH16GH3456",
//         driverName: "Vikram Singh",
//         driverPhone: "+91 9876543213",
//         location: "Aurangabad, Maharashtra",
//         latitude: 19.8762,
//         longitude: 75.3433,
//         speed: 55,
//         status: "Active",
//         lastUpdate: "3 mins ago",
//         batteryLevel: 67,
//         signalStrength: 4,
//         route: "Aurangabad to Mumbai",
//         estimatedArrival: "4 hours",
//         tripId: "TRP003",
//         passengerCount: 1,
//         destination: "Mumbai Airport",
//         distanceTraveled: 78.9,
//         fuelLevel: 45,
//       },
//     ]

//     // Mock alerts
//     const mockAlerts = [
//       { id: 1, type: "warning", message: "MH09EF9012 - Low fuel level (60%)", timestamp: "5 mins ago" },
//       { id: 2, type: "info", message: "MH16GH3456 - Speed limit exceeded", timestamp: "8 mins ago" },
//       { id: 3, type: "success", message: "MH12AB1234 - Trip completed successfully", timestamp: "12 mins ago" },
//     ]

//     setTimeout(() => {
//       setGpsData(mockGpsData)
//       setAlerts(mockAlerts)
//       setLoading(false)
//     }, 1000)
//   }, [])

//   // Simulate real-time updates
//   useEffect(() => {
//     if (!realTimeUpdates) return
//     const interval = setInterval(() => {
//       setGpsData((prevData) =>
//         prevData.map((cab) => ({
//           ...cab,
//           speed: cab.status === "Active" ? Math.max(0, cab.speed + (Math.random() - 0.5) * 10) : 0,
//           batteryLevel: Math.max(0, cab.batteryLevel - Math.random() * 0.5),
//           lastUpdate: "Just now",
//         })),
//       )
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [realTimeUpdates])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "text-green-600"
//       case "Idle":
//         return "text-yellow-600"
//       case "Offline":
//         return "text-red-600"
//       default:
//         return "text-gray-600"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-500"
//       case "Idle":
//         return "bg-yellow-500"
//       case "Offline":
//         return "bg-red-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const getSignalStrength = (strength) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <div
//         key={i}
//         className={`w-1 ${i < strength ? "bg-green-500" : "bg-gray-300"} mr-1`}
//         style={{ height: `${(i + 1) * 3}px` }}
//       />
//     ))
//   }

//   const getAlertColor = (type) => {
//     switch (type) {
//       case "warning":
//         return "bg-yellow-500"
//       case "error":
//         return "bg-red-500"
//       case "success":
//         return "bg-green-500"
//       default:
//         return "bg-blue-500"
//     }
//   }

//   const handleViewOnMap = (cab) => {
//     setMapViewCab(cab)
//     setShowMapView(true)
//     setSelectedCab(null)
//   }

//   const handleContactDriver = (cab) => {
//     // In a real app, this would initiate a call or message
//     alert(`Contacting ${cab.driverName} at ${cab.driverPhone}`)
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen flex">
//       <Sidebar />

//       {/* Coming Soon Modal */}
//       <ComingSoonModal isOpen={showComingSoonModal} onClose={handleCloseComingSoonModal} featureName="GPS Tracking" />

//       <div className="flex-1 md:ml-64">
//         {/* Header */}
//         <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <nav className="flex items-center text-sm text-gray-500 mb-2">
//                 <span>🏠</span>
//                 <span className="mx-2">›</span>
//                 <span>Live Tracking</span>
//               </nav>
//               <h1 className="text-2xl font-bold text-gray-900">Live Tracking Dashboard</h1>
//             </div>

//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setRealTimeUpdates(!realTimeUpdates)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   realTimeUpdates
//                     ? "bg-green-100 text-green-700 hover:bg-green-200"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 <MdRefresh className="inline mr-2" size={16} />
//                 Real-time {realTimeUpdates ? "ON" : "OFF"}
//               </button>

//               <button
//                 onClick={() => setShowMapView(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 <MdMap className="inline mr-2" size={16} />
//                 Map View
//               </button>

//               <button className="p-2 text-gray-400 hover:text-gray-600">
//                 <MdNotifications size={20} />
//               </button>

//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-gray-600 text-sm font-medium">A</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {loading && (
//             <div className="text-center py-12">
//               <div className="text-gray-500">Loading GPS data...</div>
//             </div>
//           )}

//           {!loading && (
//             <>
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Total Tracked</p>
//                       <p className="text-3xl font-bold text-gray-900 mt-1">{gpsData.length}</p>
//                     </div>
//                     <div className="p-3 bg-blue-100 rounded-lg">
//                       <MdGpsFixed size={24} className="text-blue-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Active Cabs</p>
//                       <p className="text-3xl font-bold text-green-600 mt-1">
//                         {gpsData.filter((cab) => cab.status === "Active").length}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-green-100 rounded-lg">
//                       <FaCar size={24} className="text-green-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Active Trips</p>
//                       <p className="text-3xl font-bold text-purple-600 mt-1">
//                         {gpsData.filter((cab) => cab.tripId).length}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-purple-100 rounded-lg">
//                       <FaRoute size={24} className="text-purple-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Avg Speed</p>
//                       <p className="text-3xl font-bold text-orange-600 mt-1">
//                         {Math.round(gpsData.reduce((acc, cab) => acc + cab.speed, 0) / gpsData.length)} km/h
//                       </p>
//                     </div>
//                     <div className="p-3 bg-orange-100 rounded-lg">
//                       <MdSpeed size={24} className="text-orange-600" />
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Alerts Section */}
//               {alerts.length > 0 && (
//                 <motion.div
//                   className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center">
//                       <MdNotifications size={20} className="mr-2 text-orange-500" />
//                       <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
//                     </div>
//                     <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
//                   </div>
//                   <div className="space-y-3">
//                     {alerts.slice(0, 3).map((alert) => (
//                       <div key={alert.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                         <div className={`w-2 h-2 rounded-full mr-3 ${getAlertColor(alert.type)}`} />
//                         <span className="flex-1 text-sm text-gray-700">{alert.message}</span>
//                         <span className="text-xs text-gray-500">{alert.timestamp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Trip Analytics */}
//               <div className="mb-8">
//                 <TripAnalytics gpsData={gpsData} />
//               </div>

//               {/* Vehicle Tracking Cards */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {gpsData.map((cab, index) => (
//                   <motion.div
//                     key={cab.id}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     onClick={() => setSelectedCab(cab)}
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">{cab.cabNumber}</h3>
//                       <div className="flex items-center space-x-2">
//                         <div className={`w-3 h-3 rounded-full ${getStatusBgColor(cab.status)}`} />
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getStatusColor(cab.status)}`}
//                         >
//                           {cab.status}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center text-gray-600">
//                         <MdPerson size={16} className="mr-2" />
//                         <span className="text-sm">{cab.driverName}</span>
//                       </div>
//                       <div className="flex items-center text-gray-600">
//                         <MdLocationOn size={16} className="mr-2" />
//                         <span className="text-sm">{cab.location}</span>
//                       </div>
//                       {cab.tripId && (
//                         <div className="flex items-center text-gray-600">
//                           <FaRoute size={16} className="mr-2" />
//                           <span className="text-sm">Trip: {cab.tripId}</span>
//                         </div>
//                       )}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center text-gray-600">
//                           <MdSpeed size={16} className="mr-2" />
//                           <span className="text-sm font-medium">{Math.round(cab.speed)} km/h</span>
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <MdBatteryFull size={16} className="mr-2" />
//                           <span className="text-sm font-medium">{Math.round(cab.batteryLevel)}%</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <MdSignalCellular4Bar size={16} className="mr-2 text-gray-600" />
//                           <div className="flex items-end">{getSignalStrength(cab.signalStrength)}</div>
//                         </div>
//                         <span className="text-xs text-gray-500">{cab.lastUpdate}</span>
//                       </div>
//                       {cab.passengerCount > 0 && (
//                         <div className="flex items-center text-gray-600">
//                           <MdPerson size={16} className="mr-2" />
//                           <span className="text-sm">Passengers: {cab.passengerCount}</span>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Selected Cab Details Modal */}
//               <AnimatePresence>
//                 {selectedCab && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <motion.div
//                       className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-900">Vehicle Details</h2>
//                         <button
//                           onClick={() => setSelectedCab(null)}
//                           className="text-gray-400 hover:text-gray-600 text-2xl font-light"
//                         >
//                           ×
//                         </button>
//                       </div>
//                       <div className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                           <div className="space-y-6">
//                             <div>
//                               <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedCab.cabNumber}</h3>
//                               <p className="text-gray-600">{selectedCab.driverName}</p>
//                               <p className="text-gray-500 text-sm">{selectedCab.driverPhone}</p>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Status</p>
//                                 <p className={`font-semibold ${getStatusColor(selectedCab.status)}`}>
//                                   {selectedCab.status}
//                                 </p>
//                               </div>
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Speed</p>
//                                 <p className="text-gray-900 font-semibold">{Math.round(selectedCab.speed)} km/h</p>
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Battery</p>
//                                 <p className="text-gray-900 font-semibold">{Math.round(selectedCab.batteryLevel)}%</p>
//                               </div>
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Fuel Level</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.fuelLevel}%</p>
//                               </div>
//                             </div>
//                             {selectedCab.tripId && (
//                               <div className="bg-blue-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Current Trip</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.tripId}</p>
//                                 <p className="text-gray-600 text-sm mt-1">To: {selectedCab.destination}</p>
//                                 <p className="text-gray-600 text-sm">Distance: {selectedCab.distanceTraveled} km</p>
//                               </div>
//                             )}
//                           </div>
//                           <div className="space-y-6">
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Current Location</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.location}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Coordinates</p>
//                               <p className="text-gray-900 font-mono text-sm">
//                                 {selectedCab.latitude}, {selectedCab.longitude}
//                               </p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Route</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.route}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Last Updated</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.lastUpdate}</p>
//                             </div>
//                             {selectedCab.estimatedArrival !== "N/A" && (
//                               <div className="bg-green-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">ETA</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.estimatedArrival}</p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="mt-8 pt-6 border-t border-gray-200">
//                           <div className="flex flex-wrap gap-3">
//                             <button
//                               onClick={() => handleViewOnMap(selectedCab)}
//                               className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                             >
//                               <MdMap className="mr-2" size={16} />
//                               View on Map
//                             </button>
//                             <button
//                               onClick={() => handleContactDriver(selectedCab)}
//                               className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
//                             >
//                               <MdPhone className="mr-2" size={16} />
//                               Call Driver
//                             </button>
//                             <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
//                               <MdMessage className="mr-2" size={16} />
//                               Send Message
//                             </button>
//                             <button className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
//                               <MdDirections className="mr-2" size={16} />
//                               Get Directions
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//               </AnimatePresence>

//               {/* Map View Modal */}
//               <AnimatePresence>
//                 {showMapView && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <motion.div
//                       className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] mx-4"
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-900">
//                           {mapViewCab ? `${mapViewCab.cabNumber} Location` : "All Vehicles Map View"}
//                         </h2>
//                         <button
//                           onClick={() => {
//                             setShowMapView(false)
//                             setMapViewCab(null)
//                           }}
//                           className="text-gray-400 hover:text-gray-600 text-2xl font-light"
//                         >
//                           ×
//                         </button>
//                       </div>
//                       <div className="p-6 h-full">
//                         <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
//                           <RealTimeMap
//                             cabs={gpsData}
//                             selectedCab={mapViewCab}
//                             onCabSelect={(cab) => setMapViewCab(cab)}
//                           />
//                         </div>
//                         {mapViewCab && (
//                           <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <h4 className="font-semibold text-gray-900">{mapViewCab.cabNumber}</h4>
//                                 <p className="text-gray-600 text-sm">{mapViewCab.driverName}</p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-gray-900 font-semibold">{Math.round(mapViewCab.speed)} km/h</p>
//                                 <p className={`text-sm font-medium ${getStatusColor(mapViewCab.status)}`}>
//                                   {mapViewCab.status}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//               </AnimatePresence>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GPSTracking


// "use client"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from "next/navigation"
// import {
//   MdGpsFixed,
//   MdLocationOn,
//   MdSpeed,
//   MdBatteryFull,
//   MdSignalCellular4Bar,
//   MdPerson,
//   MdMap,
//   MdNotifications,
//   MdPhone,
//   MdMessage,
//   MdDirections,
//   MdRefresh,
//   MdClose,
// } from "react-icons/md"
// import { FaCar, FaRoute, FaRocket, FaClock } from "react-icons/fa"
// import Sidebar from "../slidebar/page"

// // Coming Soon Modal Component


// // Mock RealTimeMap Component
// const RealTimeMap = ({ cabs, selectedCab, onCabSelect }) => {
//   return (
//     <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
//       <div className="text-center p-8">
//         <MdMap size={64} className="text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600 text-lg">Interactive Map View</p>
//         <p className="text-gray-500 text-sm mt-2">
//           {selectedCab ? `Showing ${selectedCab.cabNumber}` : `Showing ${cabs.length} cabs`}
//         </p>
//       </div>
//     </div>
//   )
// }

// // Mock TripAnalytics Component
// const TripAnalytics = ({ gpsData }) => {
//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Analytics</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-blue-600">
//             {gpsData.reduce((acc, cab) => acc + cab.distanceTraveled, 0).toFixed(1)} km
//           </div>
//           <div className="text-sm text-gray-600">Total Distance</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-green-600">{gpsData.filter((cab) => cab.tripId).length}</div>
//           <div className="text-sm text-gray-600">Active Trips</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-orange-600">
//             {Math.round(gpsData.reduce((acc, cab) => acc + cab.speed, 0) / gpsData.length)} km/h
//           </div>
//           <div className="text-sm text-gray-600">Average Speed</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const GPSTracking = () => {
//   const router = useRouter()
//   const [gpsData, setGpsData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedCab, setSelectedCab] = useState(null)
//   const [showMapView, setShowMapView] = useState(false)
//   const [mapViewCab, setMapViewCab] = useState(null)
//   const [alerts, setAlerts] = useState([])
//   const [realTimeUpdates, setRealTimeUpdates] = useState(true)

//   // Coming Soon Modal State
 



//   useEffect(() => {
//     // Mock GPS data - replace with actual API call
//     const mockGpsData = [
//       {
//         id: 1,
//         cabNumber: "MH12AB1234",
//         driverName: "Rajesh Kumar",
//         driverPhone: "+91 9876543210",
//         location: "Pune, Maharashtra",
//         latitude: 18.5204,
//         longitude: 73.8567,
//         speed: 45,
//         status: "Active",
//         lastUpdate: "2 mins ago",
//         batteryLevel: 85,
//         signalStrength: 4,
//         route: "Katraj to Hinjewadi",
//         estimatedArrival: "15 mins",
//         tripId: "TRP001",
//         passengerCount: 2,
//         destination: "Hinjewadi IT Park",
//         distanceTraveled: 12.5,
//         fuelLevel: 75,
//       },
//       {
//         id: 2,
//         cabNumber: "MH14CD5678",
//         driverName: "Suresh Patil",
//         driverPhone: "+91 9876543211",
//         location: "Mumbai, Maharashtra",
//         latitude: 19.076,
//         longitude: 72.8777,
//         speed: 0,
//         status: "Idle",
//         lastUpdate: "1 min ago",
//         batteryLevel: 92,
//         signalStrength: 5,
//         route: "Parked at Bandra",
//         estimatedArrival: "N/A",
//         tripId: null,
//         passengerCount: 0,
//         destination: null,
//         distanceTraveled: 0,
//         fuelLevel: 90,
//       },
//       {
//         id: 3,
//         cabNumber: "MH09EF9012",
//         driverName: "Amit Sharma",
//         driverPhone: "+91 9876543212",
//         location: "Nashik, Maharashtra",
//         latitude: 19.9975,
//         longitude: 73.7898,
//         speed: 65,
//         status: "Active",
//         lastUpdate: "5 mins ago",
//         batteryLevel: 78,
//         signalStrength: 3,
//         route: "Nashik to Pune",
//         estimatedArrival: "2 hours",
//         tripId: "TRP002",
//         passengerCount: 4,
//         destination: "Pune Railway Station",
//         distanceTraveled: 45.2,
//         fuelLevel: 60,
//       },
//       {
//         id: 4,
//         cabNumber: "MH16GH3456",
//         driverName: "Vikram Singh",
//         driverPhone: "+91 9876543213",
//         location: "Aurangabad, Maharashtra",
//         latitude: 19.8762,
//         longitude: 75.3433,
//         speed: 55,
//         status: "Active",
//         lastUpdate: "3 mins ago",
//         batteryLevel: 67,
//         signalStrength: 4,
//         route: "Aurangabad to Mumbai",
//         estimatedArrival: "4 hours",
//         tripId: "TRP003",
//         passengerCount: 1,
//         destination: "Mumbai Airport",
//         distanceTraveled: 78.9,
//         fuelLevel: 45,
//       },
//     ]

//     // Mock alerts
//     const mockAlerts = [
//       { id: 1, type: "warning", message: "MH09EF9012 - Low fuel level (60%)", timestamp: "5 mins ago" },
//       { id: 2, type: "info", message: "MH16GH3456 - Speed limit exceeded", timestamp: "8 mins ago" },
//       { id: 3, type: "success", message: "MH12AB1234 - Trip completed successfully", timestamp: "12 mins ago" },
//     ]

//     setTimeout(() => {
//       setGpsData(mockGpsData)
//       setAlerts(mockAlerts)
//       setLoading(false)
//     }, 1000)
//   }, [])

//   // Simulate real-time updates
//   useEffect(() => {
//     if (!realTimeUpdates) return
//     const interval = setInterval(() => {
//       setGpsData((prevData) =>
//         prevData.map((cab) => ({
//           ...cab,
//           speed: cab.status === "Active" ? Math.max(0, cab.speed + (Math.random() - 0.5) * 10) : 0,
//           batteryLevel: Math.max(0, cab.batteryLevel - Math.random() * 0.5),
//           lastUpdate: "Just now",
//         })),
//       )
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [realTimeUpdates])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "text-green-600"
//       case "Idle":
//         return "text-yellow-600"
//       case "Offline":
//         return "text-red-600"
//       default:
//         return "text-gray-600"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-500"
//       case "Idle":
//         return "bg-yellow-500"
//       case "Offline":
//         return "bg-red-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const getSignalStrength = (strength) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <div
//         key={i}
//         className={`w-1 ${i < strength ? "bg-green-500" : "bg-gray-300"} mr-1`}
//         style={{ height: `${(i + 1) * 3}px` }}
//       />
//     ))
//   }

//   const getAlertColor = (type) => {
//     switch (type) {
//       case "warning":
//         return "bg-yellow-500"
//       case "error":
//         return "bg-red-500"
//       case "success":
//         return "bg-green-500"
//       default:
//         return "bg-blue-500"
//     }
//   }

//   const handleViewOnMap = (cab) => {
//     setMapViewCab(cab)
//     setShowMapView(true)
//     setSelectedCab(null)
//   }

//   const handleContactDriver = (cab) => {
//     // In a real app, this would initiate a call or message
//     alert(`Contacting ${cab.driverName} at ${cab.driverPhone}`)
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen flex">
//       <Sidebar />

//       {/* Coming Soon Modal */}

//       <div className="flex-1 md:ml-64">
//         {/* Header */}
//         <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <nav className="flex items-center text-sm text-gray-500 mb-2">
//                 <span>🏠</span>
//                 <span className="mx-2">›</span>
//                 <span>Live Tracking</span>
//               </nav>
//               <h1 className="text-2xl font-bold text-gray-900">Live Tracking Dashboard</h1>
//             </div>

//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setRealTimeUpdates(!realTimeUpdates)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   realTimeUpdates
//                     ? "bg-green-100 text-green-700 hover:bg-green-200"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 <MdRefresh className="inline mr-2" size={16} />
//                 Real-time {realTimeUpdates ? "ON" : "OFF"}
//               </button>

//               <button
//                 onClick={() => setShowMapView(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 <MdMap className="inline mr-2" size={16} />
//                 Map View
//               </button>

//               <button className="p-2 text-gray-400 hover:text-gray-600">
//                 <MdNotifications size={20} />
//               </button>

//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-gray-600 text-sm font-medium">A</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {loading && (
//             <div className="text-center py-12">
//               <div className="text-gray-500">Loading GPS data...</div>
//             </div>
//           )}

//           {!loading && (
//             <>
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Total Tracked</p>
//                       <p className="text-3xl font-bold text-gray-900 mt-1">{gpsData.length}</p>
//                     </div>
//                     <div className="p-3 bg-blue-100 rounded-lg">
//                       <MdGpsFixed size={24} className="text-blue-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Active Cabs</p>
//                       <p className="text-3xl font-bold text-green-600 mt-1">
//                         {gpsData.filter((cab) => cab.status === "Active").length}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-green-100 rounded-lg">
//                       <FaCar size={24} className="text-green-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Active Trips</p>
//                       <p className="text-3xl font-bold text-purple-600 mt-1">
//                         {gpsData.filter((cab) => cab.tripId).length}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-purple-100 rounded-lg">
//                       <FaRoute size={24} className="text-purple-600" />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">Avg Speed</p>
//                       <p className="text-3xl font-bold text-orange-600 mt-1">
//                         {Math.round(gpsData.reduce((acc, cab) => acc + cab.speed, 0) / gpsData.length)} km/h
//                       </p>
//                     </div>
//                     <div className="p-3 bg-orange-100 rounded-lg">
//                       <MdSpeed size={24} className="text-orange-600" />
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Alerts Section */}
//               {alerts.length > 0 && (
//                 <motion.div
//                   className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center">
//                       <MdNotifications size={20} className="mr-2 text-orange-500" />
//                       <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
//                     </div>
//                     <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
//                   </div>
//                   <div className="space-y-3">
//                     {alerts.slice(0, 3).map((alert) => (
//                       <div key={alert.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                         <div className={`w-2 h-2 rounded-full mr-3 ${getAlertColor(alert.type)}`} />
//                         <span className="flex-1 text-sm text-gray-700">{alert.message}</span>
//                         <span className="text-xs text-gray-500">{alert.timestamp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Trip Analytics */}
//               <div className="mb-8">
//                 <TripAnalytics gpsData={gpsData} />
//               </div>

//               {/* Vehicle Tracking Cards */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {gpsData.map((cab, index) => (
//                   <motion.div
//                     key={cab.id}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     onClick={() => setSelectedCab(cab)}
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">{cab.cabNumber}</h3>
//                       <div className="flex items-center space-x-2">
//                         <div className={`w-3 h-3 rounded-full ${getStatusBgColor(cab.status)}`} />
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getStatusColor(cab.status)}`}
//                         >
//                           {cab.status}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center text-gray-600">
//                         <MdPerson size={16} className="mr-2" />
//                         <span className="text-sm">{cab.driverName}</span>
//                       </div>
//                       <div className="flex items-center text-gray-600">
//                         <MdLocationOn size={16} className="mr-2" />
//                         <span className="text-sm">{cab.location}</span>
//                       </div>
//                       {cab.tripId && (
//                         <div className="flex items-center text-gray-600">
//                           <FaRoute size={16} className="mr-2" />
//                           <span className="text-sm">Trip: {cab.tripId}</span>
//                         </div>
//                       )}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center text-gray-600">
//                           <MdSpeed size={16} className="mr-2" />
//                           <span className="text-sm font-medium">{Math.round(cab.speed)} km/h</span>
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <MdBatteryFull size={16} className="mr-2" />
//                           <span className="text-sm font-medium">{Math.round(cab.batteryLevel)}%</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <MdSignalCellular4Bar size={16} className="mr-2 text-gray-600" />
//                           <div className="flex items-end">{getSignalStrength(cab.signalStrength)}</div>
//                         </div>
//                         <span className="text-xs text-gray-500">{cab.lastUpdate}</span>
//                       </div>
//                       {cab.passengerCount > 0 && (
//                         <div className="flex items-center text-gray-600">
//                           <MdPerson size={16} className="mr-2" />
//                           <span className="text-sm">Passengers: {cab.passengerCount}</span>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Selected Cab Details Modal */}
//               <AnimatePresence>
//                 {selectedCab && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <motion.div
//                       className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-900">Vehicle Details</h2>
//                         <button
//                           onClick={() => setSelectedCab(null)}
//                           className="text-gray-400 hover:text-gray-600 text-2xl font-light"
//                         >
//                           ×
//                         </button>
//                       </div>
//                       <div className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                           <div className="space-y-6">
//                             <div>
//                               <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedCab.cabNumber}</h3>
//                               <p className="text-gray-600">{selectedCab.driverName}</p>
//                               <p className="text-gray-500 text-sm">{selectedCab.driverPhone}</p>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Status</p>
//                                 <p className={`font-semibold ${getStatusColor(selectedCab.status)}`}>
//                                   {selectedCab.status}
//                                 </p>
//                               </div>
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Speed</p>
//                                 <p className="text-gray-900 font-semibold">{Math.round(selectedCab.speed)} km/h</p>
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Battery</p>
//                                 <p className="text-gray-900 font-semibold">{Math.round(selectedCab.batteryLevel)}%</p>
//                               </div>
//                               <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Fuel Level</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.fuelLevel}%</p>
//                               </div>
//                             </div>
//                             {selectedCab.tripId && (
//                               <div className="bg-blue-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">Current Trip</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.tripId}</p>
//                                 <p className="text-gray-600 text-sm mt-1">To: {selectedCab.destination}</p>
//                                 <p className="text-gray-600 text-sm">Distance: {selectedCab.distanceTraveled} km</p>
//                               </div>
//                             )}
//                           </div>
//                           <div className="space-y-6">
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Current Location</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.location}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Coordinates</p>
//                               <p className="text-gray-900 font-mono text-sm">
//                                 {selectedCab.latitude}, {selectedCab.longitude}
//                               </p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Route</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.route}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <p className="text-gray-500 text-sm font-medium">Last Updated</p>
//                               <p className="text-gray-900 font-semibold">{selectedCab.lastUpdate}</p>
//                             </div>
//                             {selectedCab.estimatedArrival !== "N/A" && (
//                               <div className="bg-green-50 p-4 rounded-lg">
//                                 <p className="text-gray-500 text-sm font-medium">ETA</p>
//                                 <p className="text-gray-900 font-semibold">{selectedCab.estimatedArrival}</p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="mt-8 pt-6 border-t border-gray-200">
//                           <div className="flex flex-wrap gap-3">
//                             <button
//                               onClick={() => handleViewOnMap(selectedCab)}
//                               className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                             >
//                               <MdMap className="mr-2" size={16} />
//                               View on Map
//                             </button>
//                             <button
//                               onClick={() => handleContactDriver(selectedCab)}
//                               className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
//                             >
//                               <MdPhone className="mr-2" size={16} />
//                               Call Driver
//                             </button>
//                             <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
//                               <MdMessage className="mr-2" size={16} />
//                               Send Message
//                             </button>
//                             <button className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
//                               <MdDirections className="mr-2" size={16} />
//                               Get Directions
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//               </AnimatePresence>

//               {/* Map View Modal */}
//               <AnimatePresence>
//                 {showMapView && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <motion.div
//                       className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] mx-4"
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-900">
//                           {mapViewCab ? `${mapViewCab.cabNumber} Location` : "All Vehicles Map View"}
//                         </h2>
//                         <button
//                           onClick={() => {
//                             setShowMapView(false)
//                             setMapViewCab(null)
//                           }}
//                           className="text-gray-400 hover:text-gray-600 text-2xl font-light"
//                         >
//                           ×
//                         </button>
//                       </div>
//                       <div className="p-6 h-full">
//                         <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
//                           <RealTimeMap
//                             cabs={gpsData}
//                             selectedCab={mapViewCab}
//                             onCabSelect={(cab) => setMapViewCab(cab)}
//                           />
//                         </div>
//                         {mapViewCab && (
//                           <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <h4 className="font-semibold text-gray-900">{mapViewCab.cabNumber}</h4>
//                                 <p className="text-gray-600 text-sm">{mapViewCab.driverName}</p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-gray-900 font-semibold">{Math.round(mapViewCab.speed)} km/h</p>
//                                 <p className={`text-sm font-medium ${getStatusColor(mapViewCab.status)}`}>
//                                   {mapViewCab.status}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//               </AnimatePresence>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GPSTracking

//frontend


"use client"

// import { useState, useEffect, useRef } from "react"
// import { 
//   Search, 
//   Settings, 
//   Bell, 
//   Home, 
//   ChevronRight, 
//   Car, 
//   ChevronDown, 
//   Share, 
//   Phone, 
//   MessageCircle, 
//   X,
//   Truck,
//   Route,
//   AlertTriangle,
//   Loader2,
//   Menu,
//   Zap
// } from "lucide-react"
// import Sidebar from "../slidebar/page"

// // Google Maps Component with persistent storage and ignition handling
// const GoogleMapsComponent = ({ cabs, selectedCab, onCabSelect }) => {
//   const mapRef = useRef(null)
//   const mapInstanceRef = useRef(null)
//   const markersRef = useRef([])
//   const [isClient, setIsClient] = useState(false)
//   const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)

//   // Persistent location storage using sessionStorage
//   const getStoredLocation = (imei) => {
//     try {
//       const stored = sessionStorage.getItem(`location_${imei}`)
//       return stored ? JSON.parse(stored) : null
//     } catch {
//       return null
//     }
//   }

//   const storeLocation = (imei, location) => {
//     try {
//       sessionStorage.setItem(`location_${imei}`, JSON.stringify({
//         lat: location.lat,
//         lng: location.lng,
//         timestamp: Date.now()
//       }))
//     } catch (error) {
//       console.warn('Failed to store location:', error)
//     }
//   }

//   const lastKnownLocations = new Map();
  
//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   useEffect(() => {
//     if (!isClient) return

//     const loadGoogleMaps = () => {
//       if (window.google && window.google.maps) {
//         setIsGoogleMapsLoaded(true)
//         initializeMap()
//         return
//       }

//       const script = document.createElement('script')
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCelDo4I5cPQ72TfCTQW-arhPZ7ALNcp8w&libraries=geometry`
//       script.async = true
//       script.defer = true
//       script.onload = () => {
//         setIsGoogleMapsLoaded(true)
//         initializeMap()
//       }
//       script.onerror = () => {
//         console.error('Failed to load Google Maps')
//       }
//       document.head.appendChild(script)
//     }

//     const initializeMap = () => {
//       if (!mapRef.current) return

//       const map = new window.google.maps.Map(mapRef.current, {
//         zoom: 13,
//         center: { lat: 18.5204, lng: 73.8567 },
//         styles: [
//           {
//             featureType: "poi",
//             elementType: "labels",
//             stylers: [{ visibility: "off" }]
//           }
//         ],
//         mapTypeControl: false,
//         streetViewControl: false,
//         fullscreenControl: false,
//       })

//       mapInstanceRef.current = map
//       createMarkers()
//     }

//     loadGoogleMaps()

//     return () => {
//       markersRef.current.forEach(marker => marker.setMap(null))
//       markersRef.current = []
//     }
//   }, [isClient])

//   useEffect(() => {
//     if (mapInstanceRef.current && isGoogleMapsLoaded) {
//       createMarkers()
//     }
//   }, [cabs, selectedCab, isGoogleMapsLoaded])

//   const createMarkers = () => {
//   if (!mapInstanceRef.current || !cabs || cabs.length === 0 || !window.google) return;

//   markersRef.current.forEach(marker => marker.setMap(null));
//   markersRef.current = [];

//   cabs.forEach(cab => {
//     const isSelected = selectedCab?.id === cab.id;

//     // ✅ Enhanced: Use current location, fallback to sessionStorage, then lastKnownLocations
//     let currentLocation = cab.location;
//     if (
//       !currentLocation ||
//       typeof currentLocation.lat !== "number" ||
//       typeof currentLocation.lng !== "number" ||
//       !isFinite(currentLocation.lat) ||
//       !isFinite(currentLocation.lng)
//     ) {
//       // Try sessionStorage first
//       currentLocation = getStoredLocation(cab.imei);
      
//       // If not in sessionStorage, try lastKnownLocations
//       if (!currentLocation) {
//         currentLocation = lastKnownLocations.get(cab.id);
//       }
//     } else {
//       // Store valid location in both places
//       lastKnownLocations.set(cab.id, currentLocation);
//       storeLocation(cab.imei, currentLocation);
//     }

//     if (!currentLocation) return;

//     // ✅ Enhanced marker icon based on ignition status
//     const getMarkerIcon = (status, ignition, isSelected) => {
//       let color = '#6B7280'; // Default gray
      
//       // Enhanced status logic based on ignition
//       if (!ignition) {
//         color = '#F59E0B'; // Yellow for ignition OFF (always idle)
//       } else if (status === 'Moving') {
//         color = '#10B981'; // Green for moving with ignition ON
//       } else if (status === 'Idle') {
//         color = '#F59E0B'; // Yellow for idle with ignition ON
//       }

//       const scale = isSelected ? 1.5 : 1;
//       const strokeWeight = isSelected ? 3 : 2;

//       return {
//         path: window.google.maps.SymbolPath.CIRCLE,
//         fillColor: color,
//         fillOpacity: 0.8,
//         strokeColor: isSelected ? '#3B82F6' : '#FFFFFF',
//         strokeWeight: strokeWeight,
//         scale: 8 * scale,
//       };
//     };

//     const marker = new window.google.maps.Marker({
//       position: currentLocation,
//       map: mapInstanceRef.current,
//       icon: getMarkerIcon(cab.status, cab.ignition, isSelected),
//       title: cab.cabNumber,
//       zIndex: isSelected ? 1000 : 1,
//     });

//     // ✅ Enhanced info window with ignition status
//     const ignitionStatus = cab.ignition ? 'ON' : 'OFF';
//     const ignitionColor = cab.ignition ? '#10B981' : '#EF4444';
    
//     const infoWindow = new window.google.maps.InfoWindow({
//       content: `
//         <div style="padding: 8px; min-width: 200px;">
//           <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${cab.cabNumber}</div>
//           <div style="color: #6B7280; margin-bottom: 8px;">Driver: ${cab.driverName || 'N/A'}</div>
          
//           <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
//             <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; 
//               background-color: ${cab.status === 'Moving' ? '#DEF7EC' : cab.status === 'Idle' ? '#FEF3C7' : '#F3F4F6'};
//               color: ${cab.status === 'Moving' ? '#065F46' : cab.status === 'Idle' ? '#92400E' : '#374151'};">
//               ${cab.status}
//             </span>
//             <span style="font-weight: bold;">${cab.speed || 0} km/h</span>
//           </div>
          
//           <div style="display: flex; align-items: center; margin-bottom: 8px;">
//             <span style="margin-right: 8px;">🔥</span>
//             <span style="font-size: 12px; color: ${ignitionColor}; font-weight: 600;">
//               Ignition: ${ignitionStatus}
//             </span>
//           </div>
          
//           ${cab.lastUpdated ? `<div style="font-size: 10px; color: #9CA3AF; margin-top: 4px;">Updated: ${new Date(cab.lastUpdated).toLocaleTimeString()}</div>` : ''}
//         </div>
//       `
//     });

//     marker.addListener('click', () => {
//       markersRef.current.forEach(m => {
//         if (m.infoWindow) m.infoWindow.close();
//       });

//       infoWindow.open(mapInstanceRef.current, marker);
//       onCabSelect(cab);

//       if (currentLocation) mapInstanceRef.current.panTo(currentLocation);
//     });

//     marker.infoWindow = infoWindow;

//     if (isSelected) {
//       infoWindow.open(mapInstanceRef.current, marker);
//       if (currentLocation) {
//         mapInstanceRef.current.panTo(currentLocation);
//       }
//     }

//     markersRef.current.push(marker);
//   });
// };

//   if (!isClient) {
//     return (
//       <div className="w-full h-full relative">
//         <div className="w-full h-full rounded-lg bg-gray-100"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full h-full relative">
//       <div ref={mapRef} className="w-full h-full rounded-lg" />
      
//       <div className="absolute top-4 right-4 flex flex-col space-y-2">
//         {/* <button 
//           onClick={() => {
//             if (mapInstanceRef.current && cabs && cabs.length > 0 && isGoogleMapsLoaded) {
//               const bounds = new window.google.maps.LatLngBounds()
//               cabs.forEach(cab => {
//                 const location = cab.location || getStoredLocation(cab.imei) || lastKnownLocations.get(cab.id)
//                 if (location) bounds.extend(location)
//               })
//               mapInstanceRef.current.fitBounds(bounds)
//             }
//           }}
//           className="bg-white shadow-md rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
//           disabled={!isGoogleMapsLoaded}
//         >
//           Fit All Cabs
//         </button> */}
        
//         {selectedCab && (
//           <button 
//             onClick={() => {
//               if (mapInstanceRef.current && selectedCab && isGoogleMapsLoaded) {
//                 const location = selectedCab.location || getStoredLocation(selectedCab.imei) || lastKnownLocations.get(selectedCab.id)
//                 if (location) {
//                   mapInstanceRef.current.panTo(location)
//                   mapInstanceRef.current.setZoom(16)
//                 }
//               }
//             }}
//             className="bg-blue-600 text-white shadow-md rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
//             disabled={!isGoogleMapsLoaded}
//           >
//             Center on Selected
//           </button>
//         )}
//       </div>

//       <div className="absolute bottom-4 left-4 bg-white shadow-md rounded-lg p-3">
//         <div className="text-sm font-medium text-gray-900 mb-2">Status Legend</div>
//         <div className="space-y-1">
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//             <span className="text-xs text-gray-600">Moving (Ignition ON)</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//             <span className="text-xs text-gray-600">Idle/Ignition OFF</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 rounded-full bg-gray-500"></div>
//             <span className="text-xs text-gray-600">Parked</span>
//           </div>
//         </div>
//       </div>

//       {!isGoogleMapsLoaded && (
//         <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//               <Route className="w-8 h-8 text-gray-500" />
//             </div>
//             <p className="text-gray-600 font-medium">Loading Google Maps...</p>
//             <p className="text-gray-500 text-sm">Please add your API key</p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const DynamicGPSTracking = () => {
//   const [activeTab, setActiveTab] = useState("Cabs")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCab, setSelectedCab] = useState(null)
//   const [sortBy, setSortBy] = useState("Cab ID")
//   const [showShareModal, setShowShareModal] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
  
//   const [cabs, setCabs] = useState([])
//   const [drivers, setDrivers] = useState([])
//   const [assignments, setAssignments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
  
//   // WebSocket state with better tracking
//   const [wsConnected, setWsConnected] = useState(false)
//   const [wsError, setWsError] = useState(null)
//   const [reconnectAttempts, setReconnectAttempts] = useState(0)
//   const wsRef = useRef(null)
//   const reconnectTimeoutRef = useRef(null)

//   const API_BASE_URL = 'http://localhost:5000/api'
//   const WS_URL = 'ws://localhost:6010'

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       throw new Error("No authentication token found. Please log in again.")
//     }
    
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   }

//   // ✅ Enhanced WebSocket initialization with ignition and speed handling
//   const initializeWebSocket = () => {
//     if (wsRef.current) {
//       wsRef.current.close()
//       wsRef.current = null
//     }

//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current)
//       reconnectTimeoutRef.current = null
//     }

//     try {
//       console.log(`🔌 Attempting WebSocket connection to ${WS_URL}...`)
//       console.log(`📡 Attempt #${reconnectAttempts + 1}`)
      
//       const ws = new WebSocket(WS_URL)
      
//       const connectionTimeout = setTimeout(() => {
//         if (ws.readyState === WebSocket.CONNECTING) {
//           console.log('⏰ WebSocket connection timeout')
//           ws.close()
//         }
//       }, 10000)

//       ws.onopen = () => {
//         clearTimeout(connectionTimeout)
//         console.log('✅ WebSocket connected successfully!')
//         setWsConnected(true)
//         setWsError(null)
//         setReconnectAttempts(0)
        
//         const validCabs = cabs.filter(cab => cab.imei)
//         console.log(`📡 Subscribing to ${validCabs.length} cab IMEIs:`)
        
//         validCabs.forEach(cab => {
//           const subscribeMessage = JSON.stringify({ imei: cab.imei })
//           ws.send(subscribeMessage)
//           console.log(`   ✓ Subscribed to IMEI: ${cab.imei} (${cab.cabNumber})`)
//         })

//         if (validCabs.length === 0) {
//           console.log('⚠️  No valid IMEIs found to subscribe to')
//         }
//       }
      
//       ws.onmessage = (event) => {
//         console.log('📨 Raw WebSocket message received:', event.data)
        
//         try {
//           const gpsData = JSON.parse(event.data)
//           console.log('🛰️  Parsed GPS Data:', gpsData)
          
//           if (!gpsData.imei || gpsData.lat === undefined || gpsData.lon === undefined) {
//             console.warn('⚠️  Invalid GPS data structure:', gpsData)
//             return
//           }

//           // ✅ Enhanced: Update cab location with ignition and speed from WebSocket
//           setCabs(prevCabs => {
//             const updatedCabs = prevCabs.map(cab => {
//               if (cab.imei === gpsData.imei) {
//                 console.log(`🎯 Updating cab ${cab.cabNumber} (${gpsData.imei}):`)
//                 console.log(`   📍 Old position: ${cab.location?.lat}, ${cab.location?.lng}`)
//                 console.log(`   📍 New position: ${gpsData.lat}, ${gpsData.lon}`)
                
//                 const newLocation = {
//                   lat: gpsData.lat,
//                   lng: gpsData.lon
//                 }

//                 // ✅ Store location in sessionStorage for persistence
//                 try {
//                   sessionStorage.setItem(`location_${cab.imei}`, JSON.stringify({
//                     ...newLocation,
//                     timestamp: Date.now()
//                   }))
//                 } catch (error) {
//                   console.warn('Failed to store location:', error)
//                 }
                
//                 // ✅ Enhanced status determination based on ignition and speed from WebSocket
//                 const speed = gpsData.speed || 0
//                 const ignition = gpsData.ignition !== undefined ? gpsData.ignition : true
                
//                 let newStatus = 'Parked'
//                 if (!ignition) {
//                   newStatus = 'Idle' // If ignition is off, always idle regardless of speed
//                 } else if (speed > 5) {
//                   newStatus = 'Moving'
//                 } else if (speed > 0) {
//                   newStatus = 'Idle'
//                 } else {
//                   newStatus = 'Parked'
//                 }
                
//                 const updatedCab = {
//                   ...cab,
//                   location: newLocation,
//                   speed: speed,
//                   ignition: ignition, // ✅ Add ignition status from WebSocket
//                   status: newStatus,
//                   lastUpdated: new Date().toISOString(),
//                   hasGPSData: true
//                 }
                
//                 console.log(`   ✅ Updated cab data:`, {
//                   cabNumber: updatedCab.cabNumber,
//                   speed: updatedCab.speed,
//                   ignition: updatedCab.ignition,
//                   status: updatedCab.status
//                 })
                
//                 return updatedCab
//               }
//               return cab
//             })
            
//             return updatedCabs
//           })
          
//         } catch (parseError) {
//           console.error('❌ Error parsing GPS data:', parseError)
//           console.error('📋 Raw data that failed to parse:', event.data)
//         }
//       }
      
//       ws.onclose = (event) => {
//         clearTimeout(connectionTimeout)
//         console.log(`🔌 WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`)
//         setWsConnected(false)
        
//         if (reconnectAttempts < 5) {
//           const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
//           console.log(`🔄 Scheduling reconnection attempt ${reconnectAttempts + 1} in ${delay}ms`)
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             setReconnectAttempts(prev => prev + 1)
//             if (cabs.length > 0) {
//               initializeWebSocket()
//             }
//           }, delay)
//         } else {
//           console.log('❌ Max reconnection attempts reached')
//           setWsError('Failed to connect after multiple attempts')
//         }
//       }
      
//       ws.onerror = (error) => {
//         clearTimeout(connectionTimeout)
//         console.error('❌ WebSocket error:', error)
//         setWsConnected(false)
//         setWsError('WebSocket connection error')
//       }
      
//       wsRef.current = ws
      
//     } catch (err) {
//       console.error('❌ Failed to initialize WebSocket:', err)
//       setWsConnected(false)
//       setWsError(err.message)
//     }
//   }

//   const reconnectWebSocket = () => {
//     console.log('🔄 Manual WebSocket reconnection triggered')
//     setReconnectAttempts(0)
//     setWsError(null)
//     initializeWebSocket()
//   }

//   // Fetch data from APIs
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           throw new Error("Authentication token not found. Please log in again.")
//         }

//         const headers = getAuthHeaders()

//         const [cabsResponse, driversResponse, assignmentsResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/cabDetails`, { 
//             method: 'GET',
//             headers: headers
//           }),
//           fetch(`${API_BASE_URL}/driver/profile`, { 
//             method: 'GET',
//             headers: headers
//           }),
//           fetch(`${API_BASE_URL}/assigncab`, { 
//             method: 'GET',
//             headers: headers
//           })
//         ])

//         if (cabsResponse.status === 401 || driversResponse.status === 401 || assignmentsResponse.status === 401) {
//           localStorage.removeItem("token")
//           throw new Error("Authentication failed. Please log in again.")
//         }

//         if (!cabsResponse.ok || !driversResponse.ok || !assignmentsResponse.ok) {
//           throw new Error('Failed to fetch data from one or more APIs')
//         }

//         const cabsData = await cabsResponse.json()
//         const driversData = await driversResponse.json()
//         const assignmentsData = await assignmentsResponse.json()

//         console.log('📊 Fetched data:', {
//           cabs: cabsData.length,
//           drivers: driversData.length,
//           assignments: assignmentsData.assignments?.length || 0
//         })

//         const processedCabs = processCabData(cabsData, driversData, assignmentsData)
        
//         setCabs(processedCabs)
//         setDrivers(driversData)
//         setAssignments(assignmentsData)
        
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
    
//     const interval = setInterval(fetchData, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     if (cabs.length > 0 && !wsRef.current) {
//       console.log(`🚀 Initializing WebSocket with ${cabs.length} cabs`)
//       initializeWebSocket()
//     }
    
//     return () => {
//       if (wsRef.current) {
//         console.log('🧹 Cleaning up WebSocket connection')
//         wsRef.current.close()
//         wsRef.current = null
//       }
      
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current)
//         reconnectTimeoutRef.current = null
//       }
//     }
//   }, [cabs.length])

//   // ✅ Enhanced process cab data to include ignition status and persistent location
//   const processCabData = (cabsData, driversData, assignmentsData) => {
//     return cabsData.map(cab => {
//       const assignmentList = assignmentsData.assignments || []
//       const assignment = assignmentList.find(assign => assign.cabId === cab.id)

//       let driverName = 'Unassigned'
//       if (assignment?.driverId) {
//         const driver = driversData.find(d => d.id === assignment.driverId)
//         driverName = driver?.name || 'Unknown Driver'
//       }

//       // ✅ Enhanced location handling with sessionStorage fallback
//       let location = null
//       let hasGPSData = false
//       let status = 'Parked'
      
//       if (cab.lastKnownLat && cab.lastKnownLng) {
//         location = {
//           lat: parseFloat(cab.lastKnownLat),
//           lng: parseFloat(cab.lastKnownLng)
//         }
//         hasGPSData = true
//         status = 'Parked'
        
//         if (cab.lastGPSUpdate) {
//           const lastUpdate = new Date(cab.lastGPSUpdate)
//           const now = new Date()
//           const hoursOld = (now - lastUpdate) / (1000 * 60 * 60)
          
//           if (hoursOld > 24) {
//             status = 'GPS Stale'
//           }
//         }
//       } else {
//         // ✅ Fallback to stored location if no current GPS
//         const storedLocation = sessionStorage.getItem(`location_${cab.imei}`)
//         if (storedLocation) {
//           try {
//             location = JSON.parse(storedLocation)
//             hasGPSData = true
//             status = 'Parked' // Default status for stored locations
//           } catch (error) {
//             console.warn('Failed to parse stored location:', error)
//           }
//         }
//       }

//       if (hasGPSData && status !== 'GPS Stale') {
//         if (assignment) {
//           if (assignment.status === 'assigned') {
//             status = 'Idle'
//           } else if (assignment.actualPickupTime && !assignment.dropTime) {
//             status = 'Moving'
//           }
//         }
//       }

//       return {
//         id: cab.id,
//         cabNumber: cab.cabNumber,
//         registrationNumber: cab.registrationNumber,
//         imei: cab.imei,
//         status,
//         speed: 0,
//         ignition: true, // ✅ Default ignition status (will be updated by WebSocket)
//         driverName,
//         location,
//         isOnTrip: assignment?.actualPickupTime && !assignment?.dropTime,
//         assignment,
//         insuranceExpiry: cab.insuranceExpiry,
//         cabImage: cab.cabImage,
//         lastUpdated: cab.lastGPSUpdate || null,
//         hasGPSData
//       }
//     })
//   }

//   // ✅ Enhanced statistics calculations considering ignition
//   const totalCabs = cabs.length
//   const onTrip = cabs.filter(cab => cab.status === "Moving" && cab.ignition).length
//   const idle = cabs.filter(cab => cab.status === "Idle" || !cab.ignition).length
//   const issues = cabs.filter(cab => {
//     if (!cab.insuranceExpiry) return false
//     const expiryDate = new Date(cab.insuranceExpiry)
//     const today = new Date()
//     const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
//     return daysUntilExpiry <= 30
//   }).length

//   const filteredCabs = cabs.filter(cab =>
//     cab.cabNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cab.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cab.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const filteredDrivers = drivers.filter(driver =>
//     driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     driver.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleShareClick = () => {
//     setShowShareModal(true)
//   }

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       alert("Link copied to clipboard!")
//     })
//   }

//   const handleCabSelect = (cab) => {
//     setSelectedCab(cab)
//   }

//   const handleRetry = () => {
//     setError(null)
//     window.location.reload()
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen flex">
//       <Sidebar></Sidebar>
//       <div className="flex-1 md:ml-64">
//         <div className="flex-1 flex flex-col">
//           {/* ✅ Enhanced Header with mobile menu */}
//           <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <button 
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="md:hidden p-1"
//                 >
//                   <Menu size={20} />
//                 </button>
//                 <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
//                   <Home size={16} />
//                   <ChevronRight size={16} />
//                   <span>Live tracking</span>
//                 </div>
//               </div>
              
//               {/* Enhanced WebSocket Status Indicator */}
//               <div className="flex items-center space-x-2 md:space-x-4">
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                   <span className={`text-xs md:text-sm font-medium ${wsConnected ? 'text-green-600' : 'text-red-600'}`}>
//                     {wsConnected ? 'GPS Live' : 'GPS Offline'}
//                   </span>
//                   {wsError && (
//                     <button
//                       onClick={reconnectWebSocket}
//                       className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//                       title={wsError}
//                     >
//                       Reconnect
//                     </button>
//                   )}
//                 </div>
//                 <Bell size={20} className="text-gray-400" />
//                 <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-medium">AD</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col md:flex-row">
//             {/* ✅ Enhanced Left Panel - Mobile responsive */}
//             <div className="w-full md:w-1/2 bg-white md:border-r border-gray-200 flex flex-col max-h-96 md:max-h-none">
//               {/* Tabs */}
//               <div className="flex border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveTab("Cabs")}
//                   className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-medium ${
//                     activeTab === "Cabs"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Cabs ({totalCabs})
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("Drivers")}
//                   className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-medium ${
//                     activeTab === "Drivers"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Drivers ({drivers.length})
//                 </button>
//               </div>

//               {/* Search and Stats */}
//               <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//                 <div className="relative mb-4 md:mb-6">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <Settings className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 </div>

//                 {/* ✅ Enhanced Statistics Grid - Mobile responsive */}
//                 <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
//                   <div className="bg-yellow-50 p-3 md:p-4 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs md:text-sm text-gray-600">Total Cabs</p>
//                         <p className="text-lg md:text-2xl font-bold text-yellow-600">{totalCabs}</p>
//                       </div>
//                       <Truck className="text-yellow-500" size={20} />
//                     </div>
//                   </div>
//                   <div className="bg-green-50 p-3 md:p-4 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs md:text-sm text-gray-600">Moving</p>
//                         <p className="text-lg md:text-2xl font-bold text-green-600">{onTrip}</p>
//                       </div>
//                       <Route className="text-green-500" size={20} />
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs md:text-sm text-gray-600">Idle</p>
//                         <p className="text-lg md:text-2xl font-bold text-gray-600">{idle}</p>
//                       </div>
//                       <Car className="text-gray-500" size={20} />
//                     </div>
//                   </div>
//                   <div className="bg-red-50 p-3 md:p-4 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs md:text-sm text-gray-600">Issues</p>
//                         <p className="text-lg md:text-2xl font-bold text-red-600">{issues}</p>
//                       </div>
//                       <AlertTriangle className="text-red-500" size={20} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sorting */}
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-600">Sorting:</span>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option>Cab ID</option>
//                     <option>Driver Name</option>
//                     <option>Status</option>
//                   </select>
//                 </div>

//                 {/* ✅ Enhanced List with ignition indicators */}
//                 <div className="space-y-2 mb-6">
//                   {activeTab === "Cabs"
//                     ? filteredCabs.map((cab) => (
//                         <div
//                           key={cab.id}
//                           className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
//                             selectedCab?.id === cab.id
//                               ? "border-blue-500 bg-blue-50"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           onClick={() => setSelectedCab(cab)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <div className="flex flex-col items-center space-y-1">
//                                 <div
//                                   className={`w-3 h-3 rounded-full ${
//                                     cab.status === "Moving" && cab.ignition
//                                       ? "bg-green-500"
//                                       : cab.status === "Idle" || !cab.ignition
//                                         ? "bg-yellow-500"
//                                         : "bg-gray-500"
//                                   }`}
//                                 />
//                                 {/* ✅ Ignition indicator */}
//                                 <div className={`text-xs ${cab.ignition ? 'text-green-600' : 'text-red-600'}`}>
//                                   {cab.ignition ? '🔥' : '⚫'}
//                                 </div>
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-900 text-sm md:text-base">{cab.cabNumber}</p>
//                                 <p className="text-xs md:text-sm text-gray-600">{cab.status}</p>
//                                 <p className="text-xs text-gray-500">{cab.driverName}</p>
//                                 {/* ✅ Enhanced info with ignition status */}
//                                 <div className="flex items-center space-x-2 text-xs text-gray-400">
//                                   <span>Ignition: {cab.ignition ? 'ON' : 'OFF'}</span>
//                                   {cab.lastUpdated && (
//                                     <span>• {new Date(cab.lastUpdated).toLocaleTimeString()}</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-bold text-gray-900 text-sm md:text-base">{cab.speed}</p>
//                               <p className="text-xs md:text-sm text-gray-500">km/h</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     : filteredDrivers.map((driver) => (
//                         <div
//                           key={driver.id}
//                           className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all cursor-pointer hover:shadow-sm"
//                         >
//                           <div className="flex items-center space-x-3">
//                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//                               {driver.profileImage ? (
//                                 <img 
//                                   src={driver.profileImage} 
//                                   alt={driver.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <span className="font-semibold text-gray-700 text-xs md:text-sm">
//                                   {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="flex-1">
//                               <p className="font-semibold text-gray-900 text-sm md:text-base">{driver.name}</p>
//                               <p className="text-xs md:text-sm text-gray-600">Phone: {driver.phone}</p>
//                               <p className="text-xs text-gray-500">License: {driver.licenseNo}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                 </div>
//               </div>

//               {/* ✅ Enhanced Selected Cab Details Card with ignition info */}
//               {selectedCab && (
//                 <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
//                   <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-2">
//                         <Car className="text-green-600" size={18} />
//                         <h3 className="font-bold text-gray-900 text-base md:text-lg">{selectedCab.cabNumber}</h3>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <span className="text-lg md:text-xl font-bold text-gray-900">{selectedCab.speed}</span>
//                         <span className="text-xs md:text-sm text-gray-500">km/h</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2 mb-3">
//                       <div
//                         className={`inline-block px-2 py-1 rounded text-xs md:text-sm font-medium ${
//                           selectedCab.status === "Moving" && selectedCab.ignition
//                             ? "bg-green-100 text-green-800"
//                             : selectedCab.status === "Idle" || !selectedCab.ignition
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {selectedCab.status}
//                       </div>
//                       {/* ✅ Ignition status badge */}
//                       <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
//                         selectedCab.ignition ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         <Zap size={12} />
//                         <span>Ignition {selectedCab.ignition ? 'ON' : 'OFF'}</span>
//                       </div>
//                     </div>

//                     <div className="space-y-1 md:space-y-2 mb-4">
//                       <p className="text-gray-700 text-sm">
//                         <span className="font-medium">Driver:</span> {selectedCab.driverName}
//                       </p>
//                       <p className="text-gray-700 text-sm">
//                         <span className="font-medium">Registration:</span> {selectedCab.registrationNumber}
//                       </p>
//                       <p className="text-gray-700 text-sm">
//                         <span className="font-medium">IMEI:</span> {selectedCab.imei}
//                       </p>
//                       {selectedCab.lastUpdated && (
//                         <p className="text-gray-700 text-sm">
//                           <span className="font-medium">Last Update:</span> {new Date(selectedCab.lastUpdated).toLocaleString()}
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex space-x-2">
//                       <button className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
//                         <Phone size={14} />
//                         <span className="text-xs md:text-sm font-medium">Call</span>
//                       </button>
//                       <button className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
//                         <MessageCircle size={14} />
//                         <span className="text-xs md:text-sm font-medium">Message</span>
//                       </button>
//                       <button
//                         onClick={handleShareClick}
//                         className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                       >
//                         <Share size={14} />
//                         <span className="text-xs md:text-sm font-medium">Share</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Panel - Map Area - Mobile responsive */}
//             <div className="flex-1 p-3 md:p-6 min-h-96 md:min-h-0">
//               <GoogleMapsComponent 
//                 cabs={cabs} 
//                 selectedCab={selectedCab} 
//                 onCabSelect={handleCabSelect}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ✅ Enhanced Share Modal - Mobile responsive */}
//         {showShareModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//             <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-base md:text-lg font-semibold text-gray-900">Share Location</h3>
//                 <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">Live Location</h4>
//                   <p className="text-xs md:text-sm text-gray-600 mb-3">
//                     Share real-time location of {selectedCab?.cabNumber} with {selectedCab?.driverName}
//                   </p>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       value={`https://fleetview.com/track/${selectedCab?.cabNumber}`}
//                       readOnly
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs md:text-sm"
//                     />
//                     <button
//                       onClick={() => copyToClipboard(`https://fleetview.com/track/${selectedCab?.cabNumber}`)}
//                       className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex space-x-3">
//                   <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs md:text-sm">
//                     WhatsApp
//                   </button>
//                   <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs md:text-sm">
//                     SMS
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default DynamicGPSTracking




"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Settings,
  Bell,
  Home,
  ChevronRight,
  Car,
  Share,
  Phone,
  MessageCircle,
  X,
  Truck,
  Route,
  AlertTriangle,
  Menu,
  Zap,
  MapPin,
  CheckCircle,
} from "lucide-react"
import Sidebar from "../slidebar/page"

// Function to convert decimal coordinates to DMS format (degrees, minutes, seconds)
const convertToDMS = (coordinate, isLatitude) => {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1)

  const direction = isLatitude ? (coordinate >= 0 ? "N" : "S") : coordinate >= 0 ? "E" : "W"

  return `${degrees}°${minutes}'${seconds}"${direction}`
}

// Enhanced Google Maps Component with custom markers
const GoogleMapsComponent = ({ cabs, selectedCab, onCabSelect }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [isClient, setIsClient] = useState(false)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)

  // Persistent location storage using sessionStorage
  const getStoredLocation = (imei) => {
    try {
      const stored = sessionStorage.getItem(`location_${imei}`)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const storeLocation = (imei, location) => {
    try {
      sessionStorage.setItem(
        `location_${imei}`,
        JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          timestamp: Date.now(),
        }),
      )
    } catch (error) {
      console.warn("Failed to store location:", error)
    }
  }

  const lastKnownLocations = new Map()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true)
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKjmBSUJ3XR8uD10vG2ptzqLJAZnOlzqI&libraries=geometry`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsGoogleMapsLoaded(true)
        initializeMap()
      }
      script.onerror = () => {
        console.error("Failed to load Google Maps")
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 18.5204, lng: 73.8567 },
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      mapInstanceRef.current = map
      createMarkers()
    }

    loadGoogleMaps()

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
  }, [isClient])

  useEffect(() => {
    if (mapInstanceRef.current && isGoogleMapsLoaded) {
      createMarkers()
    }
  }, [cabs, selectedCab, isGoogleMapsLoaded])

  const createMarkers = () => {
    if (!mapInstanceRef.current || !cabs || cabs.length === 0 || !window.google) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    cabs.forEach((cab) => {
      const isSelected = selectedCab?.id === cab.id

      // Use current location, fallback to sessionStorage, then lastKnownLocations
      let currentLocation = cab.location
      if (
        !currentLocation ||
        typeof currentLocation.lat !== "number" ||
        typeof currentLocation.lng !== "number" ||
        !isFinite(currentLocation.lat) ||
        !isFinite(currentLocation.lng)
      ) {
        currentLocation = getStoredLocation(cab.imei)

        if (!currentLocation) {
          currentLocation = lastKnownLocations.get(cab.id)
        }
      } else {
        lastKnownLocations.set(cab.id, currentLocation)
        storeLocation(cab.imei, currentLocation)
      }

      if (!currentLocation) return

      // Get vehicle icon based on status and heading
      const getVehicleIcon = (status, ignition, isSelected, heading = 0) => {
        let iconUrl

        // Choose icon based on vehicle status and selection
        if (isSelected) {
          // Use car icon for selected cab
          iconUrl = "https://maps.google.com/mapfiles/kml/shapes/cabs.png"
        } else {
          // For non-selected cabs, use status-based icons
          if (!ignition) {
            iconUrl = "https://maps.google.com/mapfiles/kml/shapes/caution.png" // Caution for ignition OFF
          } else if (status === "Moving") {
            iconUrl = "https://maps.google.com/mapfiles/kml/shapes/cabs.png" // Cab for moving
          } else if (status === "Idle") {
            iconUrl = "https://maps.google.com/mapfiles/kml/shapes/parking_lot.png" // Parking for idle
          } else {
            iconUrl = "https://maps.google.com/mapfiles/kml/shapes/truck.png" // Default
          }
        }

        return {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(isSelected ? 40 : 32, isSelected ? 40 : 32),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(isSelected ? 20 : 16, isSelected ? 20 : 16),
        }
      }

      const marker = new window.google.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        icon: getVehicleIcon(cab.status, cab.ignition, isSelected, cab.heading || 0),
        title: cab.cabNumber,
        zIndex: isSelected ? 1000 : 1,
        animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
      })

      // Enhanced info window with professional styling
      const ignitionStatus = cab.ignition ? "ON" : "OFF"
      const ignitionColor = cab.ignition ? "#10B981" : "#EF4444"

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; min-width: 280px; font-family: 'Inter', sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="font-weight: 700; font-size: 18px; color: #1F2937;">${cab.cabNumber}</div>
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                ${cab.speed || 0} km/h
              </div>
            </div>
            
            <div style="color: #6B7280; margin-bottom: 12px; font-size: 14px;">
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="margin-right: 8px;">👤</span>
                <span>Driver: ${cab.driverName || "N/A"}</span>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;
                 background: ${cab.status === "Moving" ? "linear-gradient(135deg, #10B981, #059669)" : cab.status === "Idle" ? "linear-gradient(135deg, #F59E0B, #D97706)" : "linear-gradient(135deg, #6B7280, #4B5563)"};
                color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${cab.status}
              </span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: ${cab.ignition ? "#F0FDF4" : "#FEF2F2"}; border-radius: 8px;">
              <span style="margin-right: 8px; font-size: 16px;">${cab.ignition ? "🔥" : "⚫"}</span>
              <span style="font-size: 13px; color: ${ignitionColor}; font-weight: 600;">
                Ignition: ${ignitionStatus}
              </span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 11px; color: #9CA3AF;">
                📍 ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}
              </div>
              ${cab.lastUpdated ? `<div style="font-size: 10px; color: #9CA3AF;">${new Date(cab.lastUpdated).toLocaleTimeString()}</div>` : ""}
            </div>
          </div>
        `,
      })

      marker.addListener("click", () => {
        markersRef.current.forEach((m) => {
          if (m.infoWindow) m.infoWindow.close()
        })
        infoWindow.open(mapInstanceRef.current, marker)
        onCabSelect(cab)
        if (currentLocation) mapInstanceRef.current.panTo(currentLocation)
      })

      marker.infoWindow = infoWindow

      if (isSelected) {
        infoWindow.open(mapInstanceRef.current, marker)
        if (currentLocation) {
          mapInstanceRef.current.panTo(currentLocation)
        }
      }

      markersRef.current.push(marker)
    })
  }

  if (!isClient) {
    return (
      <div className="w-full h-full relative">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-xl shadow-lg" style={{ minHeight: "350px" }} />

      {/* Enhanced floating controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-3">
        {selectedCab && (
          <button
            onClick={() => {
              if (mapInstanceRef.current && selectedCab && isGoogleMapsLoaded) {
                const location =
                  selectedCab.location || getStoredLocation(selectedCab.imei) || lastKnownLocations.get(selectedCab.id)
                if (location) {
                  mapInstanceRef.current.panTo(location)
                  mapInstanceRef.current.setZoom(16)
                }
              }
            }}
            className="bg-white backdrop-blur-sm bg-opacity-90 text-blue-600 shadow-lg rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 transition-all duration-200 border border-blue-100 hover:shadow-xl transform hover:scale-105"
            disabled={!isGoogleMapsLoaded}
          >
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>Center View</span>
            </div>
          </button>
        )}
      </div>

      {/* Enhanced status legend */}
      <div className="absolute bottom-4 left-4 bg-white backdrop-blur-sm bg-opacity-95 shadow-xl rounded-xl p-4 border border-gray-100">
        <div className="text-sm font-bold text-gray-900 mb-3 flex items-center">
          <Route className="mr-2" size={16} />
          Status Legend
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-xs text-gray-700 font-medium">Moving (Ignition ON)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-sm"></div>
            <span className="text-xs text-gray-700 font-medium">Idle/Ignition OFF</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 shadow-sm"></div>
            <span className="text-xs text-gray-700 font-medium">Parked</span>
          </div>
        </div>
      </div>

      {!isGoogleMapsLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
              <Route className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Loading Maps...</p>
            <p className="text-gray-500 text-sm">Initializing GPS tracking</p>
          </div>
        </div>
      )}
    </div>
  )
}

const DynamicGPSTracking = () => {
  const [activeTab, setActiveTab] = useState("Cabs")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCab, setSelectedCab] = useState(null)
  const [sortBy, setSortBy] = useState("Cab ID")
  const [showShareModal, setShowShareModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const [cabs, setCabs] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // WebSocket state with better tracking
  const [wsConnected, setWsConnected] = useState(false)
  const [wsError, setWsError] = useState(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const API_BASE_URL = "http://localhost:5000/api"
  const WS_URL = "ws://localhost:6010"

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No authentication token found. Please log in again.")
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Enhanced WebSocket initialization with ignition and speed handling
  const initializeWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    try {
      console.log(`🔌 Attempting WebSocket connection to ${WS_URL}...`)
      console.log(`📡 Attempt #${reconnectAttempts + 1}`)

      const ws = new WebSocket(WS_URL)

      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.log("⏰ WebSocket connection timeout")
          ws.close()
        }
      }, 10000)

      ws.onopen = () => {
        clearTimeout(connectionTimeout)
        console.log("✅ WebSocket connected successfully!")
        setWsConnected(true)
        setWsError(null)
        setReconnectAttempts(0)

        const validCabs = cabs.filter((cab) => cab.imei)
        console.log(`📡 Subscribing to ${validCabs.length} cab IMEIs:`)

        validCabs.forEach((cab) => {
          const subscribeMessage = JSON.stringify({ imei: cab.imei })
          ws.send(subscribeMessage)
          console.log(`   ✓ Subscribed to IMEI: ${cab.imei} (${cab.cabNumber})`)
        })

        if (validCabs.length === 0) {
          console.log("⚠️  No valid IMEIs found to subscribe to")
        }
      }

      ws.onmessage = (event) => {
        console.log("📨 Raw WebSocket message received:", event.data)

        try {
          const gpsData = JSON.parse(event.data)
          console.log("🛰️  Parsed GPS Data:", gpsData)

          if (!gpsData.imei || gpsData.lat === undefined || gpsData.lon === undefined) {
            console.warn("⚠️  Invalid GPS data structure:", gpsData)
            return
          }

          // Enhanced: Update cab location with ignition and speed from WebSocket
          setCabs((prevCabs) => {
            const updatedCabs = prevCabs.map((cab) => {
              if (cab.imei === gpsData.imei) {
                console.log(`🎯 Updating cab ${cab.cabNumber} (${gpsData.imei}):`)
                console.log(`   📍 Old position: ${cab.location?.lat}, ${cab.location?.lng}`)
                console.log(`   📍 New position: ${gpsData.lat}, ${gpsData.lon}`)

                const newLocation = {
                  lat: gpsData.lat,
                  lng: gpsData.lon,
                }

                // Store location in sessionStorage for persistence
                try {
                  sessionStorage.setItem(
                    `location_${cab.imei}`,
                    JSON.stringify({
                      ...newLocation,
                      timestamp: Date.now(),
                    }),
                  )
                } catch (error) {
                  console.warn("Failed to store location:", error)
                }

                // Enhanced status determination based on ignition and speed from WebSocket
                const speed = gpsData.speed || 0
                const ignition = gpsData.ignition !== undefined ? gpsData.ignition : true

                let newStatus = "Parked"
                if (!ignition) {
                  newStatus = "Idle" // If ignition is off, always idle regardless of speed
                } else if (speed > 5) {
                  newStatus = "Moving"
                } else if (speed > 0) {
                  newStatus = "Idle"
                } else {
                  newStatus = "Parked"
                }

                const updatedCab = {
                  ...cab,
                  location: newLocation,
                  speed: speed,
                  ignition: ignition, // Add ignition status from WebSocket
                  status: newStatus,
                  heading: gpsData.heading || 0, // Add heading for marker rotation
                  lastUpdated: new Date().toISOString(),
                  hasGPSData: true,
                }

                console.log(`   ✅ Updated cab data:`, {
                  cabNumber: updatedCab.cabNumber,
                  speed: updatedCab.speed,
                  ignition: updatedCab.ignition,
                  status: updatedCab.status,
                })

                return updatedCab
              }
              return cab
            })

            return updatedCabs
          })
        } catch (parseError) {
          console.error("❌ Error parsing GPS data:", parseError)
          console.error("📋 Raw data that failed to parse:", event.data)
        }
      }

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout)
        console.log(`🔌 WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`)
        setWsConnected(false)

        if (reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
          console.log(`🔄 Scheduling reconnection attempt ${reconnectAttempts + 1} in ${delay}ms`)

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1)
            if (cabs.length > 0) {
              initializeWebSocket()
            }
          }, delay)
        } else {
          console.log("❌ Max reconnection attempts reached")
          setWsError("Failed to connect after multiple attempts")
        }
      }

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout)
        console.error("❌ WebSocket error:", error)
        setWsConnected(false)
        setWsError("WebSocket connection error")
      }

      wsRef.current = ws
    } catch (err) {
      console.error("❌ Failed to initialize WebSocket:", err)
      setWsConnected(false)
      setWsError(err.message)
    }
  }

  const reconnectWebSocket = () => {
    console.log("🔄 Manual WebSocket reconnection triggered")
    setReconnectAttempts(0)
    setWsError(null)
    initializeWebSocket()
  }

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        const headers = getAuthHeaders()

        const [cabsResponse, driversResponse, assignmentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/cabDetails`, {
            method: "GET",
            headers: headers,
          }),
          fetch(`${API_BASE_URL}/driver/profile`, {
            method: "GET",
            headers: headers,
          }),
          fetch(`${API_BASE_URL}/assigncab`, {
            method: "GET",
            headers: headers,
          }),
        ])

        if (cabsResponse.status === 401 || driversResponse.status === 401 || assignmentsResponse.status === 401) {
          localStorage.removeItem("token")
          throw new Error("Authentication failed. Please log in again.")
        }

        if (!cabsResponse.ok || !driversResponse.ok || !assignmentsResponse.ok) {
          throw new Error("Failed to fetch data from one or more APIs")
        }

        const cabsData = await cabsResponse.json()
        const driversData = await driversResponse.json()
        const assignmentsData = await assignmentsResponse.json()

        console.log("📊 Fetched data:", {
          cabs: cabsData.length,
          drivers: driversData.length,
          assignments: assignmentsData.assignments?.length || 0,
        })

        const processedCabs = processCabData(cabsData, driversData, assignmentsData)

        setCabs(processedCabs)
        setDrivers(driversData)
        setAssignments(assignmentsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (cabs.length > 0 && !wsRef.current) {
      console.log(`🚀 Initializing WebSocket with ${cabs.length} cabs`)
      initializeWebSocket()
    }

    return () => {
      if (wsRef.current) {
        console.log("🧹 Cleaning up WebSocket connection")
        wsRef.current.close()
        wsRef.current = null
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [cabs.length])

  // Enhanced process cab data to include ignition status and persistent location
  const processCabData = (cabsData, driversData, assignmentsData) => {
    return cabsData.map((cab) => {
      const assignmentList = assignmentsData.assignments || []
      const assignment = assignmentList.find((assign) => assign.cabId === cab.id)

      let driverName = "Unassigned"
      if (assignment?.driverId) {
        const driver = driversData.find((d) => d.id === assignment.driverId)
        driverName = driver?.name || "Unknown Driver"
      }

      // Enhanced location handling with sessionStorage fallback
      let location = null
      let hasGPSData = false
      let status = "Parked"

      if (cab.lastKnownLat && cab.lastKnownLng) {
        location = {
          lat: Number.parseFloat(cab.lastKnownLat),
          lng: Number.parseFloat(cab.lastKnownLng),
        }
        hasGPSData = true
        status = "Parked"

        if (cab.lastGPSUpdate) {
          const lastUpdate = new Date(cab.lastGPSUpdate)
          const now = new Date()
          const hoursOld = (now - lastUpdate) / (1000 * 60 * 60)

          if (hoursOld > 24) {
            status = "GPS Stale"
          }
        }
      } else {
        // Fallback to stored location if no current GPS
        const storedLocation = sessionStorage.getItem(`location_${cab.imei}`)
        if (storedLocation) {
          try {
            location = JSON.parse(storedLocation)
            hasGPSData = true
            status = "Parked" // Default status for stored locations
          } catch (error) {
            console.warn("Failed to parse stored location:", error)
          }
        }
      }

      if (hasGPSData && status !== "GPS Stale") {
        if (assignment) {
          if (assignment.status === "assigned") {
            status = "Idle"
          } else if (assignment.actualPickupTime && !assignment.dropTime) {
            status = "Moving"
          }
        }
      }

      return {
        id: cab.id,
        cabNumber: cab.cabNumber,
        registrationNumber: cab.registrationNumber,
        imei: cab.imei,
        status,
        speed: 0,
        ignition: true, // Default ignition status (will be updated by WebSocket)
        heading: 0, // Default heading
        driverName,
        location,
        isOnTrip: assignment?.actualPickupTime && !assignment?.dropTime,
        assignment,
        insuranceExpiry: cab.insuranceExpiry,
        cabImage: cab.cabImage,
        lastUpdated: cab.lastGPSUpdate || null,
        hasGPSData,
      }
    })
  }

  // Enhanced statistics calculations considering ignition
  const totalCabs = cabs.length
  const onTrip = cabs.filter((cab) => cab.status === "Moving" && cab.ignition).length
  const idle = cabs.filter((cab) => cab.status === "Idle" || !cab.ignition).length
  const issues = cabs.filter((cab) => {
    if (!cab.insuranceExpiry) return false
    const expiryDate = new Date(cab.insuranceExpiry)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }).length

  const filteredCabs = cabs.filter(
    (cab) =>
      cab.cabNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cab.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cab.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const handleCabSelect = (cab) => {
    setSelectedCab(cab)
  }

  const handleRetry = () => {
    setError(null)
    window.location.reload()
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with professional styling */}
          <div className="bg-white backdrop-blur-sm bg-opacity-95 border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <Home size={16} />
                  <ChevronRight size={16} />
                  <span className="font-medium">Live Tracking Dashboard</span>
                </div>
              </div>

              {/* Enhanced WebSocket Status Indicator */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                  <div
                    className={`w-3 h-3 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"} shadow-sm`}
                  ></div>
                  <span
                    className={`text-xs md:text-sm font-semibold ${wsConnected ? "text-green-700" : "text-red-700"}`}
                  >
                    {wsConnected ? "GPS Live" : "GPS Offline"}
                  </span>
                  {wsError && (
                    <button
                      onClick={reconnectWebSocket}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium"
                      title={wsError}
                    >
                      Reconnect
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Bell size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row">
            {/* Enhanced Left Panel - Professional styling */}
            <div className="w-full md:w-1/2 bg-white md:border-r border-gray-200 flex flex-col max-h-[50vh] md:max-h-none overflow-auto">
              {/* Enhanced Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab("Cabs")}
                  className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === "Cabs"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Car size={16} />
                    <span>Cabs ({totalCabs})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("Drivers")}
                  className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === "Drivers"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>👤</span>
                    <span>Drivers ({drivers.length})</span>
                  </div>
                </button>
              </div>

              {/* Search and Stats */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="relative mb-4 md:mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search cabs, drivers, or registration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                  <Settings
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    size={20}
                  />
                </div>

                {/* Enhanced Statistics Grid with gradients and animations */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-yellow-700 font-medium">Total Cabs</p>
                        <p className="text-lg md:text-2xl font-bold text-yellow-800">{totalCabs}</p>
                      </div>
                      <div className="p-2 bg-yellow-200 rounded-lg">
                        <Truck className="text-yellow-700" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-green-700 font-medium">Moving</p>
                        <p className="text-lg md:text-2xl font-bold text-green-800">{onTrip}</p>
                      </div>
                      <div className="p-2 bg-green-200 rounded-lg">
                        <Route className="text-green-700" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-700 font-medium">Idle</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-800">{idle}</p>
                      </div>
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <Car className="text-gray-700" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-red-700 font-medium">Issues</p>
                        <p className="text-lg md:text-2xl font-bold text-red-800">{issues}</p>
                      </div>
                      <div className="p-2 bg-red-200 rounded-lg">
                        <AlertTriangle className="text-red-700" size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Sorting */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  >
                    <option>Cab ID</option>
                    <option>Driver Name</option>
                    <option>Status</option>
                  </select>
                </div>

                {/* Enhanced List with professional styling */}
                <div className="space-y-3 mb-6">
                  {activeTab === "Cabs"
                    ? filteredCabs.map((cab) => (
                        <div
                          key={cab.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
                            selectedCab?.id === cab.id
                              ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md"
                              : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedCab(cab)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex flex-col items-center space-y-1">
                                <div
                                  className={`w-4 h-4 rounded-full shadow-sm ${
                                    cab.status === "Moving" && cab.ignition
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : cab.status === "Idle" || !cab.ignition
                                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                        : "bg-gradient-to-r from-gray-400 to-gray-600"
                                  }`}
                                />
                                {/* Enhanced ignition indicator */}
                                <div className={`text-sm ${cab.ignition ? "text-green-600" : "text-red-600"}`}>
                                  {cab.ignition ? "🔥" : "⚫"}
                                </div>
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm md:text-base">{cab.cabNumber}</p>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                      cab.status === "Moving" && cab.ignition
                                        ? "bg-green-100 text-green-800"
                                        : cab.status === "Idle" || !cab.ignition
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {cab.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 font-medium">{cab.driverName}</p>
                                {/* Enhanced info with ignition status */}
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                  <span className={`font-medium ${cab.ignition ? "text-green-600" : "text-red-600"}`}>
                                    Ignition: {cab.ignition ? "ON" : "OFF"}
                                  </span>
                                  {cab.lastUpdated && <span>• {new Date(cab.lastUpdated).toLocaleTimeString()}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm md:text-base">{cab.speed}</p>
                              <p className="text-xs md:text-sm text-gray-500">km/h</p>
                            </div>
                          </div>
                        </div>
                      ))
                    : filteredDrivers.map((driver) => (
                        <div
                          key={driver.id}
                          className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-lg bg-white hover:bg-gray-50 transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-md">
                              {driver.profileImage ? (
                                <img
                                  src={driver.profileImage || "/placeholder.svg"}
                                  alt={driver.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-white text-sm">
                                  {driver.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm md:text-base">{driver.name}</p>
                              <p className="text-xs md:text-sm text-gray-600">📞 {driver.phone}</p>
                              <p className="text-xs text-gray-500">🆔 {driver.licenseNo}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              {/* Enhanced Selected Cab Details Card */}
              {selectedCab && (
                <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Car className="text-blue-600" size={18} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg">{selectedCab.cabNumber}</h3>
                      </div>
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full">
                        <span className="text-lg md:text-xl font-bold">{selectedCab.speed}</span>
                        <span className="text-xs md:text-sm">km/h</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                          selectedCab.status === "Moving" && selectedCab.ignition
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            : selectedCab.status === "Idle" || !selectedCab.ignition
                              ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                        }`}
                      >
                        {selectedCab.status}
                      </div>
                      {/* Enhanced ignition status badge */}
                      <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedCab.ignition
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                        }`}
                      >
                        <Zap size={12} />
                        <span>Ignition {selectedCab.ignition ? "ON" : "OFF"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">Driver:</span> {selectedCab.driverName}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">Registration:</span> {selectedCab.registrationNumber}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">IMEI:</span> {selectedCab.imei}
                      </p>
                      {selectedCab.lastUpdated && (
                        <p className="text-gray-700 text-sm">
                          <span className="font-semibold">Last Update:</span>{" "}
                          {new Date(selectedCab.lastUpdated).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 rounded-lg transition-all duration-200 transform hover:scale-105">
                        <Phone size={14} />
                        <span className="text-xs md:text-sm font-semibold text-green-800">Call</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-lg transition-all duration-200 transform hover:scale-105">
                        <MessageCircle size={14} />
                        <span className="text-xs md:text-sm font-semibold text-blue-800">Message</span>
                      </button>
                      <button
                        onClick={handleShareClick}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <Share size={14} />
                        <span className="text-xs md:text-sm font-semibold text-purple-800">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Enhanced Map Area */}
            <div className="flex-1 p-4 md:p-6 h-[50vh] md:h-auto md:min-h-[calc(100vh-4rem)]">
              <GoogleMapsComponent cabs={cabs} selectedCab={selectedCab} onCabSelect={handleCabSelect} />
            </div>
          </div>
        </div>

        {/* Enhanced Share Modal with Google Maps link */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Share className="mr-2 text-blue-600" size={24} />
                  Share Location
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Google Maps Link Section */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <MapPin className="mr-2 text-blue-600" size={16} />
                    Live Location
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Current location of <span className="font-semibold">{selectedCab?.cabNumber}</span> with{" "}
                    <span className="font-semibold">{selectedCab?.driverName}</span>
                  </p>

                  {selectedCab?.location && (
                    <div className="space-y-3">
                      {/* Google Maps Link */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={
                            selectedCab?.location
                              ? `https://www.google.com/maps/place/${convertToDMS(selectedCab.location.lat, true)}+${convertToDMS(selectedCab.location.lng, false)}/@${selectedCab.location.lat},${selectedCab.location.lng},17z`
                              : ""
                          }
                          readOnly
                          className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-lg bg-gray-50 text-sm font-mono overflow-x-auto"
                        />
                        <button
                          onClick={() => {
                            if (selectedCab?.location) {
                              const dmsLat = convertToDMS(selectedCab.location.lat, true)
                              const dmsLng = convertToDMS(selectedCab.location.lng, false)
                              copyToClipboard(
                                `https://www.google.com/maps/place/${dmsLat}+${dmsLng}/@${selectedCab.location.lat},${selectedCab.location.lng},17z`,
                              )
                            }
                          }}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                            copySuccess ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {copySuccess ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle size={16} />
                              <span>Copied!</span>
                            </div>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </div>

                      {/* Open in Google Maps button */}
                      <a
                        href={
                          selectedCab?.location
                            ? `https://www.google.com/maps/place/${convertToDMS(selectedCab.location.lat, true)}+${convertToDMS(selectedCab.location.lng, false)}/@${selectedCab.location.lat},${selectedCab.location.lng},17z`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-sm shadow-lg"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>

                {/* Quick Share Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (selectedCab?.location) {
                        const dmsLat = convertToDMS(selectedCab.location.lat, true)
                        const dmsLng = convertToDMS(selectedCab.location.lng, false)
                        const mapsUrl = `https://www.google.com/maps/place/${dmsLat}+${dmsLng}/@${selectedCab.location.lat},${selectedCab.location.lng},17z`
                        copyToClipboard(mapsUrl)
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(`Track ${selectedCab.cabNumber}: ${mapsUrl}`)}`,
                          "_blank",
                        )
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-sm transform hover:scale-105 shadow-lg"
                  >
                    📱 WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      if (selectedCab?.location) {
                        const dmsLat = convertToDMS(selectedCab.location.lat, true)
                        const dmsLng = convertToDMS(selectedCab.location.lng, false)
                        const mapsUrl = `https://www.google.com/maps/place/${dmsLat}+${dmsLng}/@${selectedCab.location.lat},${selectedCab.location.lng},17z`
                        copyToClipboard(mapsUrl)
                        window.open(
                          `sms:?&body=${encodeURIComponent(`Track ${selectedCab.cabNumber}: ${mapsUrl}`)}`,
                          "_blank",
                        )
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm transform hover:scale-105 shadow-lg"
                  >
                    💬 SMS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DynamicGPSTracking
