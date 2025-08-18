
// "use client"
// import { useState, useEffect, useRef, useCallback } from "react"
// import Sidebar from "../slidebar/page"
// import axios from "axios"
// import { MapPin, X, Truck } from "lucide-react"
// import LeafletMap from "../components/LeafletMap"
// import baseURL from "@/utils/api"
// import Image from "next/image"
// import InvoiceButton from "../components/InvoiceButton"
// import { useRouter } from "next/navigation"

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

// // Create a driver location storage
// const driverLocations = {}

// const CabSearch = () => {
//   const router = useRouter()
//   // Add this state
//   const [showAccessDenied, setShowAccessDenied] = useState(false)
//   const [cabNumber, setCabNumber] = useState("")
//   const [cabDetails, setCabDetails] = useState([])
//   const [filteredCabs, setFilteredCabs] = useState([])
//   const [statusFilter, setStatusFilter] = useState("all") // 'all', 'assigned', 'completed', 'untripAssignment'
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [fromDate, setFromDate] = useState("")
//   const [toDate, setToDate] = useState("")
//   const [activeModal, setActiveModal] = useState("")
//   const [selectedDetail, setSelectedDetail] = useState(null)
//   const [cab, setcab] = useState("")
//   const [companyLogo, setCompanyLogo] = useState("")
//   const [signature, setSignature] = useState("")
//   const [companyInfo, setCompanyInfo] = useState("")
//   const [subCompanyName, setCompanyName] = useState("")
//   const [invoiceNumber, setInvoiceNumber] = useState("")
//   const [wsConnected, setWsConnected] = useState(false)
//   const wsRef = useRef(null)
//   const adminId = useRef(`admin-${Date.now()}`)
//   const [showMap, setShowMap] = useState(false)
//   const [selectedDriver, setSelectedDriver] = useState(null)
//   const [notification, setNotification] = useState("")
//   const [routeCoordinates, setRouteCoordinates] = useState({})
//   const [driverRoutes, setDriverRoutes] = useState({})
//   const [mapLoaded, setMapLoaded] = useState(false)
//   const [currentDistance, setCurrentDistance] = useState(0)
//   const [remainingDistance, setRemainingDistance] = useState(0)
//   const [clickedCoordinates, setClickedCoordinates] = useState(null)
//   const [cabData, setCabData] = useState(null)
//   // Add state for image modal
//   const [imageModalOpen, setImageModalOpen] = useState(false)
//   const [selectedImage, setSelectedImage] = useState("")
//   // Add pagination state
//   const [pagination, setPagination] = useState(null)

//   const getFilteredCabs = useCallback(() => {
//     let filtered = cabDetails
//     // Apply status filter
//     if (statusFilter !== "all") {
//       if (statusFilter === "untripAssignment") {
//         // Filter cabs that are assigned and HAVE trip/location details
//         filtered = filtered.filter(
//           (item) =>
//             item.status === "assigned" &&
//             // Has location details in CabDetail
//             item.CabDetail?.location_from &&
//             item.CabDetail?.location_to,
//         )
//       } else {
//         filtered = filtered.filter((item) => item.status === statusFilter)
//       }
//     }
//     // Apply search filter if cabNumber is provided
//     if (cabNumber) {
//       filtered = filtered.filter((item) => item.CabDetail?.cabNumber?.toLowerCase().includes(cabNumber.toLowerCase()))
//     }
//     // Apply date filter if dates are provided
//     if (fromDate || toDate) {
//       const startDate = fromDate || "1970-01-01"
//       const endDate = toDate || "2100-01-01"
//       filtered = filtered.filter((item) => {
//         const assignedDate = new Date(item.assignedAt).toISOString().split("T")[0]
//         return assignedDate >= startDate && assignedDate <= endDate
//       })
//     }
//     return filtered
//   }, [cabDetails, statusFilter, cabNumber, fromDate, toDate])

//   // Track location update interval
//   const locationIntervalRef = useRef(null)
//   // Map reference for Leaflet
//   const mapRef = useRef(null)
//   const markerRef = useRef(null)
//   const routeLayerRef = useRef(null)
//   const routeMarkersRef = useRef([])

//   // Define showNotification callback first since it's used in other functions
//   const showNotification = useCallback((msg) => {
//     setNotification(msg)
//     setTimeout(() => setNotification(""), 3000)
//   }, [])

//   useEffect(() => {
//     setFilteredCabs(getFilteredCabs())
//   }, [getFilteredCabs])

//   useEffect(() => {
//     if (selectedDriver) {
//       console.log("Updated selectedDriver:", selectedDriver)
//     }
//   }, [selectedDriver])

//   // Define cleanupMap callback before it's used
//   const cleanupMap = useCallback(() => {
//     // Clean up Leaflet map if it exists
//     if (mapRef.current && typeof mapRef.current.remove === "function") {
//       mapRef.current.remove()
//     }
//     // Reset references
//     mapRef.current = null
//     markerRef.current = null
//     if (routeLayerRef.current) {
//       routeLayerRef.current = null
//     }
//     // Clear route markers
//     routeMarkersRef.current = []
//   }, [])

//   // Define initializeMap callback before it's used in useEffect
//   const initializeMap = useCallback(() => {
//     if (typeof window === "undefined" || !window.L) {
//       console.log("Leaflet not loaded yet")
//       return
//     }
//     const L = window.L
//     const mapContainer = document.getElementById("map-container")
//     if (!mapContainer) {
//       return
//     }
//     // Set explicit height to ensure the container is visible
//     mapContainer.style.height = "100%"
//     mapContainer.style.width = "100%"
//     // Clean up any existing map
//     cleanupMap()
//     try {
//       // Get the current driver's location
//       const driverLocation = selectedDriver?.driver?.location
//       // Check if driver's location is available
//       if (!driverLocation) {
//         console.error("Driver location is not available.")
//         return // Exit if no location is available
//       }
//       // Create the map using Leaflet and zoom directly to the driver's location
//       const map = L.map("map-container").setView(
//         [driverLocation.latitude, driverLocation.longitude],
//         15, // Zoom level to directly focus on the driver's location
//       )
//       // Add OpenStreetMap tiles
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map)
//       // Create custom marker icon for driver
//       const driverIcon = L.icon({
//         iconUrl: "https://maps.google.com/mapfiles/ms/micons/cabs.png",
//         iconSize: [32, 32],
//         iconAnchor: [16, 32],
//         popupAnchor: [0, -32],
//       })
//       // Create marker for the driver's current position
//       const marker = L.marker([driverLocation.latitude, driverLocation.longitude], {
//         icon: driverIcon,
//       }).addTo(map)
//       // Add popup with driver and route information
//       marker
//         .bindPopup(
//           `
//           <div style="color: #333; padding: 8px; min-width: 200px;">
//             <strong style="font-size: 14px;">${selectedDriver.driver?.name || "Driver"}</strong><br>
//             <div style="margin-top: 5px;">
//               <strong>Cab:</strong> ${selectedDriver.cab?.cabNumber || "N/A"}<br>
//               <strong>Current Location:</strong> (${driverLocation.latitude.toFixed(6)}, ${driverLocation.longitude.toFixed(6)})<br>
//             </div>
//           </div>
//         `,
//         )
//         .openPopup()
//       // Save references for future use
//       mapRef.current = map
//       markerRef.current = marker
//       // Force a resize to ensure the map renders correctly
//       setTimeout(() => {
//         if (mapRef.current) {
//           mapRef.current.invalidateSize()
//         }
//       }, 100)
//     } catch (error) {
//       console.error("Error initializing map:", error)
//       showNotification("Error initializing map")
//     }
//   }, [selectedDriver, cleanupMap, showNotification])

//   // Load Leaflet when component mounts
//   useEffect(() => {
//     if (typeof window !== "undefined" && !window.L) {
//       const link = document.createElement("link")
//       link.rel = "stylesheet"
//       link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
//       document.head.appendChild(link)
//       const script = document.createElement("script")
//       script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
//       script.async = true
//       script.onload = () => {
//         setMapLoaded(true)
//         console.log("Leaflet loaded successfully")
//       }
//       document.body.appendChild(script)
//     } else if (typeof window !== "undefined" && window.L) {
//       setMapLoaded(true)
//     }
//   }, [])

//   const generateInvoiceNumber = useCallback((companyName) => {
//     const prefix = derivePrefix(companyName) // e.g. "REP"
//     const finYear = getFinancialYear() // e.g. "2526"
//     const randomNum = Math.floor(100000 + Math.random() * 900000) // 6-digit random number
//     return `${prefix}${finYear}-${randomNum}`
//   }, [])

//   const derivePrefix = (name) => {
//     if (!name) return "INV"
//     const nameParts = name.trim().split(" ")
//     return nameParts
//       .map((part) => part.charAt(0).toUpperCase())
//       .join("")
//       .replace(/[^A-Z]/g, "")
//       .slice(0, 3) // e.g. "REP" from "R K Enterprise"
//   }

//   const getFinancialYear = () => {
//     const now = new Date()
//     const currentMonth = now.getMonth() + 1 // 0-based index, so +1
//     const currentYear = now.getFullYear()
//     const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1
//     const fyEnd = fyStart + 1
//     const fyStartShort = fyStart.toString().slice(-2) // "25"
//     const fyEndShort = fyEnd.toString().slice(-2) // "26"
//     return `${fyStartShort}${fyEndShort}` // "2526"
//   }

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const id = localStorage.getItem("id")
//         const res = await axios.get(`${baseURL}api/admin/getAllSubAdmins`)
//         const admin = res.data.subAdmins.find((el) => el._id === id)
//         if (admin) {
//           setCompanyLogo(admin.companyLogo)
//           setSignature(admin.signature)
//           setCompanyName(admin.name)
//           setCompanyInfo(admin.companyInfo)
//           setInvoiceNumber(generateInvoiceNumber(admin.name))
//         }
//       } catch (err) {
//         console.error("Failed to fetch admin data:", err)
//       }
//     }
//     fetchAdminData()
//   }, [generateInvoiceNumber])

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       try {
//         const id = localStorage.getItem("id")
//         if (!id) {
//           router.push("/")
//           return
//         }
//         const subAdminsRes = await axios.get(`${baseURL}api/admin/getAllSubAdmins`)
//         const loggedInUser = subAdminsRes.data.subAdmins.find((e) => e._id === id)
//         if (loggedInUser?.status === "Inactive") {
//           localStorage.clear()
//           setShowAccessDenied(true)
//           return
//         }
//       } catch (err) {
//         console.error("Error checking user status:", err)
//       }
//     }
//     checkUserStatus()
//   }, [router])

//   useEffect(() => {
//     const fetchAssignedCabs = async () => {
//       setLoading(true)
//       console.log("token", localStorage.getItem("token"))
//       try {
//         const res = await axios.get(`${baseURL}api/assigncab`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         })

//         console.log("API Response:", res)
//         // ✅ FIX: Access the assignments array from the response
//         const assignments = res.data.assignments || []
//         const paginationData = res.data.pagination || null
//         console.log("API Response:", res.data)
//         console.log("Assignments:", assignments)

//         // Set pagination data
//         setPagination(paginationData)

//         // ✅ FIX: Check if assignments array has data before accessing
//         if (assignments.length > 0) {
//           // Find the first assignment that has cab data
//           const assignmentWithCab = assignments.find((assignment) => assignment.CabDetail)
//           if (assignmentWithCab) {
//             console.log("Cab data found:", assignmentWithCab.CabDetail)
//             setCabData(assignmentWithCab.CabDetail)
//           }
//         }

//         // ✅ FIX: Use assignments array instead of res.data directly
//         setCabDetails(assignments)
//         setFilteredCabs(assignments)

//         // Fetch route coordinates for all cabs
//         const routes = {}
//         const driverRoutesMap = {}
//         for (const assignment of assignments) {
//           if (assignment.CabDetail?.location_from && assignment.CabDetail?.location_to) {
//             const routeData = await fetchRouteCoordinates(
//               assignment.CabDetail.location_from,
//               assignment.CabDetail.location_to,
//             )
//             if (routeData) {
//               routes[assignment.CabDetail?.cabNumber] = routeData
//               // Map driver ID to their assigned route
//               if (assignment.Driver?.id) {
//                 driverRoutesMap[assignment.Driver.id] = {
//                   cabNumber: assignment.CabDetail?.cabNumber,
//                   route: routeData,
//                   from: assignment.CabDetail.location_from,
//                   to: assignment.CabDetail.location_to,
//                   totalDistance: assignment.CabDetail.location_totalDistance || "0",
//                 }
//               }
//             }
//           }
//         }
//         setRouteCoordinates(routes)
//         setDriverRoutes(driverRoutesMap)
//       } catch (err) {
//         console.error("Error fetching assigned cabs:", err)
//         setError("Failed to fetch assigned cabs")
//         setCabDetails([])
//         setFilteredCabs([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchAssignedCabs()
//   }, [])

//   // Fetch route coordinates using OpenStreetMap Nominatim API
//   const fetchRouteCoordinates = async (from, to) => {
//     try {
//       // Fetch coordinates for origin
//       const fromRes = await axios.get(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(from)},India&format=json&limit=1`,
//       )
//       // Fetch coordinates for destination
//       const toRes = await axios.get(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(to)},India&format=json&limit=1`,
//       )
//       if (fromRes.data.length > 0 && toRes.data.length > 0) {
//         return {
//           from: {
//             lat: Number.parseFloat(fromRes.data[0].lat),
//             lng: Number.parseFloat(fromRes.data[0].lon),
//             name: from,
//           },
//           to: {
//             lat: Number.parseFloat(toRes.data[0].lat),
//             lng: Number.parseFloat(toRes.data[0].lon),
//             name: to,
//           },
//         }
//       }
//       return null
//     } catch (error) {
//       console.error("Error fetching route coordinates:", error)
//       return null
//     }
//   }

//   // Calculate distance between two points in kilometers
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371
//     const dLat = deg2rad(lat2 - lat1)
//     const dLon = deg2rad(lon2 - lon1)
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//     const distance = R * c // Distance in km
//     return distance
//   }

//   const deg2rad = (deg) => {
//     return deg * (Math.PI / 180)
//   }

//   useEffect(() => {
//     if (typeof window === "undefined") return
//     const connectWebSocket = () => {
//       if (wsRef.current) return
//       const wsUrl = "ws://localhost:5000/"
//       wsRef.current = new WebSocket(wsUrl)
//       wsRef.current.onopen = () => {
//         setWsConnected(true)
//         wsRef.current.send(
//           JSON.stringify({
//             type: "register",
//             role: "admin",
//             driverId: adminId.current,
//           }),
//         )
//       }
//       wsRef.current.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data)
//           if (data.type === "location_update") {
//             console.log("Received location update:", data)
//             driverLocations[data.driverId] = data.location
//             setSelectedDriver((prev) => {
//               if (!prev || !prev.driver) return prev
//               if (prev.driver.id === data.driverId) {
//                 return {
//                   ...prev,
//                   driver: {
//                     ...prev.driver,
//                     location: {
//                       latitude: Number.parseFloat(data.location.latitude),
//                       longitude: Number.parseFloat(data.location.longitude),
//                       timestamp: data.location.timestamp || new Date().toISOString(),
//                     },
//                   },
//                 }
//               }
//               return prev
//             })
//           }
//         } catch (err) {
//           console.error("Error parsing WebSocket message", err)
//         }
//       }
//       wsRef.current.onerror = (error) => {
//         console.error("WebSocket error:", error)
//         setWsConnected(false)
//         wsRef.current = null
//         setTimeout(connectWebSocket, 5000)
//       }
//       wsRef.current.onclose = () => {
//         console.log("WebSocket closed, reconnecting...")
//         setWsConnected(false)
//         wsRef.current = null
//         setTimeout(connectWebSocket, 5000)
//       }
//     }
//     connectWebSocket()
//     return () => {
//       if (wsRef.current) wsRef.current.close()
//     }
//   }, [])

//   useEffect(() => {
//     if (showMap && selectedDriver && mapLoaded) {
//       initializeMap()
//     }
//   }, [showMap, selectedDriver, mapLoaded, initializeMap])

//   // Calculate position along the route based on progress
//   const calculatePositionAlongRoute = (from, to, progress) => {
//     const latitude = from.lat + (to.lat - from.lat) * progress
//     const longitude = from.lng + (to.lng - from.lng) * progress
//     console.log("Latitude:", latitude)
//     console.log("Longitude:", longitude)
//     return {
//       latitude,
//       longitude,
//       timestamp: new Date().toISOString(),
//     }
//   }

//   // Add this function to handle map ready event
//   const handleMapReady = (map) => {
//     console.log("🗺️ Google Map is ready")
//     mapRef.current = map
//     // Start location tracking for the selected driver
//     if (selectedDriver && selectedDriver.driver) {
//       startLocationTracking(selectedDriver)
//     }
//   }

//   // Update distance calculations based on current location
//   const updateDistanceCalculations = (driverId, location) => {
//     const driverRoute = driverRoutes[driverId]
//     if (!driverRoute || !driverRoute.route) return
//     const route = driverRoute.route
//     // Calculate distance traveled from origin
//     const distanceFromOrigin = calculateDistance(route.from.lat, route.from.lng, location.latitude, location.longitude)
//     // Calculate remaining distance to destination
//     const distanceToDestination = calculateDistance(location.latitude, location.longitude, route.to.lat, route.to.lng)
//     // Calculate total route distance
//     const totalRouteDistance = calculateDistance(route.from.lat, route.from.lng, route.to.lat, route.to.lng)
//     // Update state with the calculated distances
//     setCurrentDistance(distanceFromOrigin.toFixed(2))
//     setRemainingDistance(distanceToDestination.toFixed(2))
//     // Update the driver's route with the new distance information
//     setDriverRoutes((prev) => ({
//       ...prev,
//       [driverId]: {
//         ...prev[driverId],
//         currentDistance: distanceFromOrigin.toFixed(2),
//         remainingDistance: distanceToDestination.toFixed(2),
//         totalRouteDistance: totalRouteDistance.toFixed(2),
//       },
//     }))
//   }

//   // Generate driver location based on assigned route
//   const getDriverLocation = (cab, driverId) => {
//     // Get the driver's assigned route
//     const driverRoute = driverRoutes[driverId]
//     const cabNumber = cab?.cabNumber
//     // First check if we have a specific route for this driver
//     const route = driverRoute ? driverRoute.route : routeCoordinates[cabNumber]
//     // If we don't have route data, return a default location
//     if (!route) {
//       return {
//         latitude: 28.6139, // Default to Delhi
//         longitude: 77.209,
//         timestamp: new Date().toISOString(),
//       }
//     }
//     // If we already have a stored location for this driver, use it with some movement
//     if (driverLocations[driverId]) {
//       const currentLoc = driverLocations[driverId]
//       const fromCoords = route.from
//       const toCoords = route.to
//       // Find how far along the route we are (0 to 1)
//       const totalDistance = Math.sqrt(
//         Math.pow(toCoords.lat - fromCoords.lat, 2) + Math.pow(toCoords.lng - fromCoords.lng, 2),
//       )
//       const currentDistance = Math.sqrt(
//         Math.pow(currentLoc.latitude - fromCoords.lat, 2) + Math.pow(currentLoc.longitude - fromCoords.lng, 2),
//       )
//       let progress = currentDistance / totalDistance
//       // Add some small movement along the route (0.5% to 2% progress)
//       progress += Math.random() * 0.015 + 0.005
//       // If we've gone past the destination, reset to start
//       if (progress >= 1) {
//         progress = 0
//       }
//       // Calculate new position
//       const newLocation = calculatePositionAlongRoute(fromCoords, toCoords, progress)
//       // Update distance calculations for this new location
//       updateDistanceCalculations(driverId, newLocation)
//       return newLocation
//     }
//     // If no stored location, start at the origin with a small random offset
//     const initialLocation = {
//       latitude: route.from.lat + (Math.random() * 0.01 - 0.005),
//       longitude: route.from.lng + (Math.random() * 0.01 - 0.005),
//       timestamp: new Date().toISOString(),
//     }
//     // Initialize distance calculations
//     updateDistanceCalculations(driverId, initialLocation)
//     return initialLocation
//   }

//   // Update map marker position
//   const updateMapMarker = (location) => {
//     if (!markerRef.current || !mapRef.current) return
//     const newPosition = [location.latitude, location.longitude]
//     markerRef.current.setLatLng(newPosition)
//     mapRef.current.panTo(newPosition) // Pan to the new driver location
//     mapRef.current.setZoom(15) // Set zoom level to 15 for better visibility
//   }

//   const handleLocationClick = (item) => {
//     // Make sure we have a valid driver
//     if (!item.Driver) {
//       showNotification("⚠️ No driver information available")
//       return
//     }
//     // Get the latest location from WebSocket if available
//     const latestLocation = driverLocations[item.Driver?.id] || item.Driver.location
//     console.log("driver location", item)
//     // Set the selected driver with all necessary information
//     setSelectedDriver({
//       driver: {
//         ...item.Driver,
//         // Use the latest location from WebSocket or fallback to the provided location
//         location: latestLocation
//           ? {
//               latitude: Number.parseFloat(latestLocation.latitude || 16.705),
//               longitude: Number.parseFloat(latestLocation.longitude || 74.2433),
//               timestamp: latestLocation.timestamp || new Date().toISOString(),
//             }
//           : {
//               latitude: 16.705,
//               longitude: 74.2433,
//               timestamp: new Date().toISOString(),
//             },
//       },
//       cab: {
//         ...item.CabDetail,
//         // Ensure route information is properly formatted
//         location: {
//           from: item.CabDetail?.location_from,
//           to: item.CabDetail?.location_to,
//           totalDistance:
//             item.CabDetail?.location_totalDistance ||
//             calculateRouteDistance(item.CabDetail?.location_from, item.CabDetail?.location_to),
//         },
//       },
//     })
//     // Show the map modal
//     setShowMap(true)
//   }

//   const calculateRouteDistance = (from, to) => {
//     // Define some common routes and their distances
//     const commonRoutes = {
//       "Pune-Mumbai": 375,
//       "Mumbai-Kolhapur": 375,
//       "Kolhapur-Pune": 230,
//       "Pune-Kolhapur": 230,
//       "Mumbai-Pune": 150,
//       "Pune-Mumbai": 150,
//       "Mumbai-Delhi": 1400,
//       "Delhi-Mumbai": 1400,
//       "Kolhapur-Bangalore": 500,
//       "Bangalore-Kolhapur": 500,
//     }
//     if (!from || !to) return "0"
//     const routeKey = `${from}-${to}`
//     if (commonRoutes[routeKey]) {
//       return commonRoutes[routeKey].toString()
//     }
//     // Default distance if route not found
//     return "300"
//   }

//   const startLocationTracking = (driver) => {
//     // Clear any existing interval
//     if (locationIntervalRef.current) {
//       clearInterval(locationIntervalRef.current)
//     }
//     // Immediately fetch the first location
//     fetchDriverLocation(driver)
//     // Then set up regular updates every 5 seconds
//     locationIntervalRef.current = setInterval(() => {
//       fetchDriverLocation(driver)
//     }, 5000)
//   }

//   const fetchDriverLocation = async (driver) => {
//     try {
//       if (!driver.driver?.id) {
//         showNotification("Driver ID not found")
//         return
//       }
//       showNotification(`Fetching location for ${driver.driver?.name}...`)
//       // Get location based on the assigned route
//       const location = getDriverLocation(driver.cab, driver.driver.id)
//       // Store the location
//       driverLocations[driver.driver.id] = location
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         const locationMessage = {
//           type: "location",
//           driverId: driver.driver?.id,
//           role: "driver",
//           location: location,
//         }
//         wsRef.current.send(JSON.stringify(locationMessage))
//         // Also update the selected driver if this is the one being viewed
//         if (selectedDriver && selectedDriver.driver?.id === driver.driver?.id) {
//           setSelectedDriver((prev) => {
//             if (!prev) return prev
//             return {
//               ...prev,
//               driver: {
//                 ...prev.driver,
//                 location: location,
//               },
//             }
//           })
//           // Update map marker if using Leaflet directly
//           if (markerRef.current && mapRef.current) {
//             updateMapMarker(location) // Automatically zooms in on the new location
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching driver location:", error)
//       showNotification("Error fetching driver location")
//     }
//   }

//   const closeMap = () => {
//     // Stop location tracking when map is closed
//     if (locationIntervalRef.current) {
//       clearInterval(locationIntervalRef.current)
//       locationIntervalRef.current = null
//     }
//     // No need to clean up Leaflet map as we're using React component
//     setShowMap(false)
//     setSelectedDriver(null)
//   }

//   const handleSearch = () => {
//     setError(null)
//     if (!cabNumber) {
//       setError("Please enter a cab number")
//       return
//     }
//     const filtered = cabDetails.filter((item) =>
//       item.CabDetail?.cabNumber?.toLowerCase().includes(cabNumber.toLowerCase()),
//     )
//     setFilteredCabs(filtered)
//     if (filtered.length === 0) setError("Cab details not found")
//   }

//   const handleDateFilter = () => {
//     if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
//       setError("To date must be after From date")
//       return
//     }
//     const filtered = cabDetails.filter((item) => {
//       const assignedDate = new Date(item.assignedAt).toISOString().split("T")[0]
//       const startDate = fromDate || "1970-01-01"
//       const endDate = toDate || "2100-01-01"
//       return assignedDate >= startDate && assignedDate <= endDate
//     })
//     setFilteredCabs(filtered)
//     if (filtered.length === 0) setError("No cabs found in the selected date range")
//   }

//   const openModal = (type, data, item = null) => {
//     if (type === "customer" && item) {
//       setSelectedDetail({ type: "customer", data: item })
//       setActiveModal("Details")
//       return
//     }
//     if (!data) {
//       console.error(`No data found for type: ${type}`)
//       return
//     }
//     setSelectedDetail({ type, data })
//     setActiveModal("Details")
//   }

//   const closeModal = () => {
//     setActiveModal("")
//     setSelectedDetail(null)
//   }

//   // Open image modal
//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl)
//     setImageModalOpen(true)
//   }

//   // Close image modal
//   const closeImageModal = () => {
//     setSelectedImage("")
//     setImageModalOpen(false)
//   }

//   // Helper function to display images in a gallery format
//   const renderImageGallery = (images) => {
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return <p className="text-gray-500">No images available</p>
//     }
//     return (
//       <div className="flex flex-wrap gap-2 mt-2">
//         {images.map((image, index) => (
//           <div key={index} onClick={() => openImageModal(image)} className="cursor-pointer">
//             <Image
//               src={image || "/placeholder.svg"}
//               alt={`Image ${index + 1}`}
//               width={200}
//               height={400}
//               className="w-24 h-24 object-cover rounded border border-gray-300 hover:border-yellow-500 transition-all"
//             />
//           </div>
//         ))}
//       </div>
//     )
//   }

//   // Helper function to calculate and display total amount
//   const renderAmountTotal = (amounts) => {
//     if (!amounts || !Array.isArray(amounts)) {
//       return null
//     }
//     // Filter out null values and calculate total
//     const validAmounts = amounts.filter((amount) => amount !== null)
//     const total = validAmounts.reduce((sum, amount) => sum + Number(amount), 0)
//     return (
//       <div className="mt-3 pt-3 border-t border-gray-200">
//         <div className="flex justify-between items-center">
//           <span className="font-medium">Total Amount:</span>
//           <span className="text-lg font-bold text-green-600">₹{total.toLocaleString()}</span>
//         </div>
//       </div>
//     )
//   }

//   // Format date and time for display
//   const formatDateTime = (timestamp) => {
//     if (!timestamp) return "N/A"
//     const date = new Date(timestamp)
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     })
//   }

//   // Function to render customer details
//   const renderCustomerDetails = (item) => {
//     if (!item.customerName && !item.customerPhone) {
//       return <p className="text-gray-500">No customer details available</p>
//     }
//     return (
//       <div className="space-y-3">
//         <div>
//           <h3 className="text-lg font-semibold mb-3 text-gray-900">Customer Information</h3>
//           <div className="grid grid-cols-1 gap-3">
//             <div>
//               <span className="text-gray-600 font-medium">Name:</span>
//               <span className="ml-2 text-gray-900">{item.customerName || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Phone:</span>
//               <span className="ml-2 text-gray-900">{item.customerPhone || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Pickup:</span>
//               <span className="ml-2 text-gray-900">{item.pickupLocation || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Drop:</span>
//               <span className="ml-2 text-gray-900">{item.dropLocation || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Trip Type:</span>
//               <span className="ml-2 text-gray-900">{item.tripType || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Vehicle Type:</span>
//               <span className="ml-2 text-gray-900">{item.vehicleType || "N/A"}</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Distance:</span>
//               <span className="ml-2 text-gray-900">{item.estimatedDistance || "N/A"} KM</span>
//             </div>
//             <div>
//               <span className="text-gray-600 font-medium">Estimated Fare:</span>
//               <span className="ml-2 text-green-600 font-semibold">₹{item.estimatedFare || "N/A"}</span>
//             </div>
//             {item.scheduledPickupTime && (
//               <div>
//                 <span className="text-gray-600 font-medium">Pickup Time:</span>
//                 <span className="ml-2 text-gray-900">{new Date(item.scheduledPickupTime).toLocaleString()}</span>
//               </div>
//             )}
//             {item.specialInstructions && (
//               <div>
//                 <span className="text-gray-600 font-medium">Instructions:</span>
//                 <span className="ml-2 text-gray-900">{item.specialInstructions}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Function to render the appropriate content based on detail type
//   const renderDetailContent = () => {
//     if (!selectedDetail || !selectedDetail.type || !selectedDetail.data) {
//       return <p>No details available</p>
//     }
//     const { type, data } = selectedDetail
//     // Handle customer details
//     if (type === "customer") {
//       return renderCustomerDetails(data)
//     }
//     switch (type) {
//       case "fuel":
//         return (
//           <>
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Payment Details</h3>
//               <p>
//                 <span className="text-gray-600">Payment Type:</span> {data.fuel_type || "N/A"}
//               </p>
//               {data.fuel_receiptImage && Array.isArray(data.fuel_receiptImage) && data.fuel_receiptImage.length > 0 && (
//                 <>
//                   <h3 className="text-lg font-medium mt-4 mb-2">Fuel Receipts</h3>
//                   {renderImageGallery(data.fuel_receiptImage)}
//                 </>
//               )}
//               {data.fuel_transactionImage &&
//                 Array.isArray(data.fuel_transactionImage) &&
//                 data.fuel_transactionImage.length > 0 && (
//                   <>
//                     <h3 className="text-lg font-medium mt-4 mb-2">Transaction Images</h3>
//                     {renderImageGallery(data.fuel_transactionImage)}
//                   </>
//                 )}
//               {data.fuel_amount && renderAmountTotal(data.fuel_amount)}
//             </div>
//           </>
//         )
//       case "fastTag":
//         return (
//           <>
//             <div className="mb-4">
//               <p>
//                 <span className="text-gray-600">Payment Mode:</span> {data.fastTag_paymentMode || "N/A"}
//               </p>
//               {data.fastTag_amount && renderAmountTotal(data.fastTag_amount)}
//             </div>
//           </>
//         )
//       case "tyrePuncture":
//         return (
//           <>
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Repair Details</h3>
//               {data.tyrePuncture_image &&
//                 Array.isArray(data.tyrePuncture_image) &&
//                 data.tyrePuncture_image.length > 0 &&
//                 renderImageGallery(data.tyrePuncture_image)}
//               {data.tyrePuncture_repairAmount && renderAmountTotal(data.tyrePuncture_repairAmount)}
//             </div>
//           </>
//         )
//       case "vehicleServicing":
//         return (
//           <>
//             <div className="mb-4">
//               <p>
//                 <span className="text-gray-600">Service Required:</span> {data.servicing_requiredService ? "Yes" : "No"}
//               </p>
//               <p>
//                 <span className="text-gray-600">Details:</span> {data.servicing_details || "N/A"}
//               </p>
//               <p>
//                 <span className="text-gray-600">KM Travelled:</span> {data.servicing_kmTravelled || "N/A"}
//               </p>
//               {/* Service Images */}
//               {data.servicing_image && Array.isArray(data.servicing_image) && data.servicing_image.length > 0 && (
//                 <>
//                   <h3 className="text-lg font-semibold mt-4 mb-2">OdoMeter Images</h3>
//                   {renderImageGallery(data.servicing_image)}
//                 </>
//               )}
//               {/* Receipt Images */}
//               {data.servicing_receiptImage &&
//                 Array.isArray(data.servicing_receiptImage) &&
//                 data.servicing_receiptImage.length > 0 && (
//                   <>
//                     <h3 className="text-lg font-semibold mt-4 mb-2">Vehicle Receipt Images</h3>
//                     {renderImageGallery(data.servicing_receiptImage)}
//                   </>
//                 )}
//               {/* Total Service Amount */}
//               {data.servicing_amount && Array.isArray(data.servicing_amount) && data.servicing_amount.length > 0 && (
//                 <p>
//                   <span className="text-gray-600">Total Amount:</span> ₹
//                   {data.servicing_amount.reduce((acc, curr) => acc + Number(curr || 0), 0)}
//                 </p>
//               )}
//             </div>
//           </>
//         )
//       case "otherProblems":
//         return (
//           <>
//             <div className="mb-4">
//               <p>
//                 <span className="text-gray-600">Details:</span> {data.otherProblems_details || "N/A"}
//               </p>
//               {data.otherProblems_image &&
//                 Array.isArray(data.otherProblems_image) &&
//                 data.otherProblems_image.length > 0 && (
//                   <>
//                     <h3 className="text-lg font-medium mt-4 mb-2">Problem Images</h3>
//                     {renderImageGallery(data.otherProblems_image)}
//                   </>
//                 )}
//               {data.otherProblems_amount && renderAmountTotal(data.otherProblems_amount)}
//             </div>
//           </>
//         )
//       default:
//         return <p>No details available</p>
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex bg-gray-50 min-h-screen">
//         <Sidebar />
//         <div className="flex-1 p-6 mt-20 sm:mt-0 md:ml-60 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />
//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-6 md:ml-60 mt-20 sm:mt-0 transition-all duration-300">
//         {showAccessDenied && <AccessDeniedModal />}
//         {notification && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="bg-yellow-500 text-black px-6 py-3 rounded-md shadow-lg transition-all duration-300 animate-fadeIn">
//               {notification}
//             </div>
//           </div>
//         )}
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-yellow-500 p-2 rounded-lg">
//             <Truck className="h-6 w-6 text-black" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Cab Search</h1>
//         </div>
//         {/* Pagination Info */}
//         {pagination && (
//           <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <span>
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <span>Total: {pagination.totalCount} assignments</span>
//             </div>
//           </div>
//         )}
//         {/* WebSocket Connection Indicator */}
//         <div className="flex items-center gap-2 mb-4">
//           <div className={`h-3 w-3 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}></div>
//           <span className="text-sm text-gray-600">{wsConnected ? "Connected" : "Disconnected"}</span>
//         </div>
//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//           <div className="space-y-4">
//             {/* Search by Cab Number */}
//             <div className="flex flex-col sm:flex-row gap-2">
//               <input
//                 type="text"
//                 placeholder="Enter Cab Number"
//                 value={cabNumber}
//                 onChange={(e) => setCabNumber(e.target.value)}
//                 className="border border-gray-300 p-3 text-black rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg whitespace-nowrap transition-colors font-medium"
//                 disabled={loading}
//               >
//                 {loading ? "Searching..." : "Search"}
//               </button>
//             </div>
//             {/* Filter by Date */}
//             <div className="flex flex-col sm:flex-row gap-2">
//               <div className="flex-1 flex flex-col sm:flex-row gap-2">
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   className="border border-gray-300 text-black p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   className="border border-gray-300 p-3 text-black rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//               </div>
//               <button
//                 onClick={handleDateFilter}
//                 className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg whitespace-nowrap transition-colors font-medium"
//               >
//                 Filter by Date
//               </button>
//             </div>
//           </div>
//         </div>
//         {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
//         {/* Status Filter Buttons */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           <button
//             onClick={() => setStatusFilter("all")}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               statusFilter === "all"
//                 ? "bg-yellow-500 text-black"
//                 : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setStatusFilter("assigned")}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               statusFilter === "assigned"
//                 ? "bg-red-500 text-white"
//                 : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             Assigned
//           </button>
//           <button
//             onClick={() => setStatusFilter("completed")}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               statusFilter === "completed"
//                 ? "bg-green-500 text-white"
//                 : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             Completed
//           </button>
//           <button
//             onClick={() => setStatusFilter("untripAssignment")}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               statusFilter === "untripAssignment"
//                 ? "bg-blue-500 text-white"
//                 : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             Untrip Assignment
//           </button>
//         </div>
//         {/* Loading State */}
//         {loading ? (
//           <div className="animate-pulse space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="bg-white h-16 rounded-lg shadow-sm"></div>
//             ))}
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block bg-white shadow-sm rounded-lg overflow-hidden border">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">#</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cab No</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Route</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredCabs.length > 0 ? (
//                     filteredCabs.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {item.CabDetail?.cabNumber || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{item.Driver?.name || "N/A"}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {item.customerName ? (
//                             <div>
//                               <div className="font-medium">{item.customerName}</div>
//                               <div className="text-gray-500 text-xs">{item.customerPhone}</div>
//                             </div>
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString() : "N/A"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {item.CabDetail?.location_from || item.pickupLocation || "N/A"} →{" "}
//                           {item.CabDetail?.location_to || item.dropLocation || "N/A"}
//                         </td>
//                         <td className="px-6 py-4">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               item?.status === "assigned"
//                                 ? "bg-red-100 text-red-800"
//                                 : item?.status === "completed"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {item?.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <select
//                             className="border border-gray-300 text-black p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                             onChange={(e) => {
//                               if (e.target.value === "customer") {
//                                 openModal("customer", null, item)
//                               } else if (e.target.value) {
//                                 openModal(e.target.value, item.CabDetail)
//                               }
//                             }}
//                           >
//                             <option value="">Select</option>
//                             <option value="customer">Customer Details</option>
//                             <option value="fuel">Fuel</option>
//                             <option value="fastTag">FastTag</option>
//                             <option value="tyrePuncture">Tyre</option>
//                             <option value="vehicleServicing">Servicing</option>
//                             <option value="otherProblems">Other Problems</option>
//                           </select>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               className={`text-green-600 transition-all duration-300 hover:scale-110 hover:shadow-md p-1 rounded ${
//                                 item.Driver?.location ? "animate-pulse" : ""
//                               }`}
//                               onClick={() => handleLocationClick(item)}
//                               title="Track Location"
//                               disabled={!wsConnected}
//                             >
//                               <MapPin size={16} />
//                             </button>
//                             {item.Driver?.location && <span className="text-xs text-green-600 font-medium">Live</span>}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <InvoiceButton
//                             item={item}
//                             cabData={cabData}
//                             companyLogo={companyLogo}
//                             signature={signature}
//                             companyInfo={companyInfo}
//                             subCompanyName={subCompanyName}
//                             invoiceNumber={invoiceNumber}
//                             derivePrefix={derivePrefix}
//                           />
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
//                         No results found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-4">
//               {filteredCabs.length > 0 ? (
//                 filteredCabs.map((item, index) => (
//                   <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
//                     <div className="grid grid-cols-2 gap-3 mb-4">
//                       <div>
//                         <p className="text-sm text-gray-500">Cab No</p>
//                         <p className="font-medium text-gray-900">{item.CabDetail?.cabNumber || "N/A"}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Driver</p>
//                         <p className="text-gray-900">{item.Driver?.name || "N/A"}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Customer</p>
//                         <p className="text-gray-900">{item.customerName || "N/A"}</p>
//                         {item.customerPhone && <p className="text-xs text-gray-500">{item.customerPhone}</p>}
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Assigned Date</p>
//                         <p className="text-gray-900">
//                           {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString() : "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Distance</p>
//                         <p className="text-gray-900">
//                           {item.CabDetail?.location_totalDistance || item.estimatedDistance || "0"} KM
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Fare</p>
//                         <p className="text-green-600 font-semibold">₹{item.estimatedFare || "N/A"}</p>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500">Route</p>
//                       <p className="text-gray-900">
//                         {item.CabDetail?.location_from || item.pickupLocation || "N/A"} →{" "}
//                         {item.CabDetail?.location_to || item.dropLocation || "N/A"}
//                       </p>
//                     </div>
//                     <div className="mb-4">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           item?.status === "assigned"
//                             ? "bg-red-100 text-red-800"
//                             : item?.status === "completed"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {item?.status}
//                       </span>
//                     </div>
//                     <div className="flex gap-2 mb-3">
//                       <select
//                         className="flex-1 border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                         onChange={(e) => {
//                           if (e.target.value === "customer") {
//                             openModal("customer", null, item)
//                           } else if (e.target.value) {
//                             openModal(e.target.value, item.CabDetail)
//                           }
//                         }}
//                       >
//                         <option value="">View Details</option>
//                         <option value="customer">Customer Details</option>
//                         <option value="fuel">Fuel Details</option>
//                         <option value="fastTag">FastTag Details</option>
//                         <option value="tyrePuncture">Tyre Details</option>
//                         <option value="vehicleServicing">Servicing Details</option>
//                         <option value="otherProblems">Other Problems</option>
//                       </select>
//                       <button
//                         className={`text-green-600 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 ${
//                           item.Driver?.location ? "animate-pulse" : ""
//                         }`}
//                         onClick={() => handleLocationClick(item)}
//                         title="Track Location"
//                         disabled={!wsConnected}
//                       >
//                         <MapPin size={16} />
//                       </button>
//                     </div>
//                     <InvoiceButton
//                       item={item}
//                       cabData={cabData}
//                       companyLogo={companyLogo}
//                       signature={signature}
//                       companyInfo={companyInfo}
//                       subCompanyName={subCompanyName}
//                       invoiceNumber={invoiceNumber}
//                       derivePrefix={derivePrefix}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-8 text-center bg-white rounded-lg shadow-sm border">
//                   <p className="text-gray-500">No results found</p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//         {/* Details Modal */}
//         {activeModal && selectedDetail && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold capitalize text-gray-900">{selectedDetail.type} Details</h2>
//                 <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
//                   <X size={20} />
//                 </button>
//               </div>
//               {renderDetailContent()}
//               <button
//                 onClick={closeModal}
//                 className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Image Modal */}
//         {imageModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-lg p-4 max-w-2xl w-full shadow-xl">
//               <div className="flex justify-end mb-3">
//                 <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700 transition-colors">
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 <Image
//                   src={selectedImage || "/placeholder.svg"}
//                   alt="Preview"
//                   width={200}
//                   height={400}
//                   className="max-w-full max-h-[70vh] object-contain mx-auto"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Map Modal */}
//         {showMap && selectedDriver && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
//               <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {selectedDriver.driver?.name || "Driver"} - {selectedDriver.cab?.cabNumber || "N/A"}
//                 </h2>
//                 <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-700">
//                   <X size={24} />
//                 </button>
//               </div>
//               {/* Route information panel */}
//               <div className="bg-gray-50 p-4 border-b">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">From: {selectedDriver.cab?.location?.from || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="h-6 border-l-2 border-dashed border-gray-400 ml-1.5"></div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">To: {selectedDriver.cab?.location?.to || "N/A"}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex-1" style={{ height: "500px" }}>
//                 <LeafletMap
//                   location={selectedDriver.driver?.location}
//                   driverName={selectedDriver.driver?.name}
//                   cabNumber={selectedDriver.cab?.cabNumber}
//                   routeFrom={selectedDriver.cab?.location?.from}
//                   routeTo={selectedDriver.cab?.location?.to}
//                   onMapReady={(map) => {
//                     console.log("Map is ready", map)
//                     // Force a resize to ensure the map renders correctly
//                     setTimeout(() => {
//                       if (map) {
//                         map.panTo({
//                           lat: Number.parseFloat(selectedDriver.driver?.location?.latitude) || 16.705,
//                           lng: Number.parseFloat(selectedDriver.driver?.location?.longitude) || 74.2433,
//                         })
//                       }
//                     }, 100)
//                   }}
//                 />
//               </div>
//               <div className="p-4 bg-gray-50 border-t">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-900">
//                       Driver: {selectedDriver.driver?.name || "N/A"}
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       Cab Number: {selectedDriver.cab?.cabNumber || "N/A"}
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       Distance:{" "}
//                       {selectedDriver.cab?.location?.totalDistance ||
//                         driverRoutes[selectedDriver.driver?.id]?.totalDistance ||
//                         "0"}{" "}
//                       KM
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-900">
//                       <strong>Current Location:</strong>{" "}
//                       {selectedDriver.driver?.location?.latitude?.toFixed(6) || "N/A"},{" "}
//                       {selectedDriver.driver?.location?.longitude?.toFixed(6) || "N/A"}
//                     </p>
//                     <p className="text-sm text-gray-900">
//                       <strong>Last Updated:</strong>{" "}
//                       {selectedDriver.driver?.location?.timestamp
//                         ? new Date(selectedDriver.driver.location.timestamp).toLocaleTimeString()
//                         : "N/A"}
//                     </p>
//                     <p className="text-sm text-gray-900">
//                       <strong>Connection Status:</strong>{" "}
//                       <span className={wsConnected ? "text-green-600" : "text-red-600"}>
//                         {wsConnected ? "Connected" : "Disconnected"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CabSearch


"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Sidebar from "../slidebar/page"
import axios from "axios"
import { MapPin, X, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import LeafletMap from "../components/LeafletMap"
import InvoiceButton from "../components/InvoiceButton"
import baseURL from "@/utils/api"
import Image from "next/image"
import { useRouter } from "next/navigation"

const AccessDeniedModal = () => {
  const router = useRouter()
  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="mb-6">Your access has been restricted. Please contact the administrator.</p>
        <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Close
        </button>
      </div>
    </div>
  )
}

const CabSearch = () => {
  const router = useRouter()
  const [completingTrips, setCompletingTrips] = useState({})
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [cabNumber, setCabNumber] = useState("")
  const [cabDetails, setCabDetails] = useState([])
  const [filteredCabs, setFilteredCabs] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [activeModal, setActiveModal] = useState("")
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [companyLogo, setCompanyLogo] = useState("")
  const [signature, setSignature] = useState("")
  const [companyInfo, setCompanyInfo] = useState("")
  const [subCompanyName, setCompanyName] = useState("")
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef(null)
  const adminId = useRef(`admin-${Date.now()}`)
  const [showMap, setShowMap] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [notification, setNotification] = useState("")
  const [routeCoordinates, setRouteCoordinates] = useState({})
  const [driverRoutes, setDriverRoutes] = useState({})
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentDistance, setCurrentDistance] = useState(0)
  const [remainingDistance, setRemainingDistance] = useState(0)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10) // Fixed to 10 records per page

  const getFilteredCabs = useCallback(() => {
    let filtered = cabDetails
    if (statusFilter !== "all") {
      if (statusFilter === "untripAssignment") {
        filtered = filtered.filter(
          (item) =>
            (!item.locationFrom || item.locationFrom === "N/A") &&
            (!item.locationTo || item.locationTo === "N/A") &&
            (!item.customerName || item.customerName === "N/A"),
        )
      } else {
        filtered = filtered.filter((item) => item.status === statusFilter)
      }
    }

    if (cabNumber) {
      filtered = filtered.filter((item) => item.CabsDetail?.cabNumber?.toLowerCase().includes(cabNumber.toLowerCase()))
    }

    if (fromDate || toDate) {
      const startDate = fromDate || "1970-01-01"
      const endDate = toDate || "2100-01-01"
      filtered = filtered.filter((item) => {
        const assignedDate = new Date(item.assignedAt).toISOString().split("T")[0]
        return assignedDate >= startDate && assignedDate <= endDate
      })
    }

    return filtered
  }, [cabDetails, statusFilter, cabNumber, fromDate, toDate])

  const locationIntervalRef = useRef(null)

  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const routeMarkersRef = useRef([])

  const showNotification = useCallback((msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3000)
  }, [])

  useEffect(() => {
    setFilteredCabs(getFilteredCabs())
  }, [getFilteredCabs])

  const handleCompleteTrip = async (assignmentId) => {
    try {
      setCompletingTrips((prev) => ({ ...prev, [assignmentId]: true }))

      const token = localStorage.getItem("token")

      const response = await fetch(`${baseURL}api/assigncab/complete-by-admin/${assignmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to complete trip")
      }

      const result = await response.json()

      setCabDetails((prevDetails) =>
        prevDetails.map((item) => (item.id === assignmentId ? { ...item, status: result.assignment.status } : item)),
      )

      setFilteredCabs((prevFiltered) =>
        prevFiltered.map((item) => (item.id === assignmentId ? { ...item, status: result.assignment.status } : item)),
      )

      setNotification("Trip completed successfully!")
      setTimeout(() => setNotification(""), 3000)
    } catch (error) {
      console.error("Error completing trip:", error)
      setError("Failed to complete trip. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setCompletingTrips((prev) => ({ ...prev, [assignmentId]: false }))
    }
  }

  useEffect(() => {
    if (selectedDriver) {
      console.log("Updated selectedDriver:", selectedDriver)
    }
  }, [selectedDriver])

  const cleanupMap = useCallback(() => {
    if (mapRef.current && typeof mapRef.current.remove === "function") {
      mapRef.current.remove()
    }
    mapRef.current = null
    markerRef.current = null
    if (routeLayerRef.current) {
      routeLayerRef.current = null
    }
    routeMarkersRef.current = []
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => {
        setMapLoaded(true)
        console.log("Leaflet loaded successfully")
      }
      document.body.appendChild(script)
    } else if (typeof window !== "undefined" && window.L) {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (typeof window === "undefined") return

        const id = localStorage.getItem("id")
        if (!id) {
          router.push("/login")
          return
        }

        console.log("Fetching admin data for ID:", id)

        const res = await axios.get(`${baseURL}api/admin/getAllSubAdmins`)
        const admin = res.data.subAdmins.find((el) => el.id.toString() === id.toString())

        if (admin) {
          setCompanyLogo(admin.companyLogo)
          setSignature(admin.signature)
          setCompanyName(admin.name)
          setCompanyInfo(admin.companyInfo)
        }
      } catch (err) {
        console.error("Failed to fetch admin data:", err)
        setError("Failed to load admin data. Please check your API connection.")
      }
    }

    fetchAdminData()
  }, [router])

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (typeof window === "undefined") return

        const id = localStorage.getItem("id")
        if (!id) {
          router.push("/login")
          return
        }

        const subAdminsRes = await axios.get(`${baseURL}api/admin/getAllSubAdmins`)
        const loggedInUser = subAdminsRes.data.subAdmins.find((e) => e.id.toString() === id.toString())

        if (loggedInUser?.status === "Inactive") {
          localStorage.clear()
          setShowAccessDenied(true)
          return
        }
      } catch (err) {
        console.error("User status check failed:", err)
        setError("Failed to verify user status")
      }
    }

    checkUserStatus()
  }, [router])

  const handlePageChange = async (page) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      // Explicitly pass limit=10 to ensure 10 records per page
      const res = await axios.get(`${baseURL}api/assigncab?page=${page}&limit=${recordsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const assignments = Array.isArray(res.data.assignments) ? res.data.assignments : []
      setCabDetails(assignments)
      setFilteredCabs(assignments)
      setCurrentPage(page)

      if (res.data.pagination) {
        setPagination(res.data.pagination)
      }
    } catch (err) {
      console.error("Failed to fetch page:", err)
      setError("Failed to load page. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchAssignedCabs = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

        // Explicitly set limit to 10 records per page
        const res = await axios.get(`${baseURL}api/assigncab?page=1&limit=${recordsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log("API Response:", res.data)

        const assignments = Array.isArray(res.data.assignments) ? res.data.assignments : []
        console.log("assignment", assignments)
        setCabDetails(assignments)
        setFilteredCabs(assignments)
        setCurrentPage(1)

        if (res.data.pagination) {
          setPagination(res.data.pagination)
        }
      } catch (err) {
        console.error("Failed to fetch assigned cabs:", err)
        setError("Failed to load assigned cabs. Please check your connection and try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedCabs()
  }, [recordsPerPage])

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = baseURL.replace("http", "ws").replace("https", "wss")
        wsRef.current = new WebSocket(`${wsUrl}ws`)

        wsRef.current.onopen = () => {
          console.log("WebSocket connected")
          setWsConnected(true)
          wsRef.current.send(
            JSON.stringify({
              type: "admin_connect",
              adminId: adminId.current,
            }),
          )
        }

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log("WebSocket message:", data)

            if (data.type === "location_update" && data.driverId && data.location) {
              setCabDetails((prevCabs) =>
                prevCabs.map((cab) =>
                  cab.Driver?.id === data.driverId
                    ? { ...cab, Driver: { ...cab.Driver, location: data.location } }
                    : cab,
                ),
              )
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err)
          }
        }

        wsRef.current.onclose = () => {
          console.log("WebSocket disconnected")
          setWsConnected(false)
          setTimeout(connectWebSocket, 5000)
        }

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          setWsConnected(false)
        }
      } catch (err) {
        console.error("Failed to connect WebSocket:", err)
        setWsConnected(false)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const handleSearch = async () => {
    if (!cabNumber.trim()) {
      setError("Please enter a cab number to search")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      // Include limit in search as well
      const res = await axios.get(`${baseURL}api/assigncab?cabNumber=${encodeURIComponent(cabNumber)}&limit=${recordsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const assignments = Array.isArray(res.data.assignments) ? res.data.assignments : Array.isArray(res.data) ? res.data : []
      setCabDetails(assignments)
      setFilteredCabs(assignments)

      // Update pagination if available
      if (res.data.pagination) {
        setPagination(res.data.pagination)
      }

      if (assignments.length === 0) {
        setError("No cabs found with the specified number")
      }
    } catch (err) {
      console.error("Search failed:", err)
      setError("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = () => {
    if (!fromDate && !toDate) {
      setError("Please select at least one date to filter")
      return
    }
    setError(null)
    // Reset to first page when filtering
    setCurrentPage(1)
  }

  const openModal = (type, detail, fullItem = null) => {
    setActiveModal(type)
    if (type === "customer") {
      setSelectedDetail({ type, data: fullItem })
    } else {
      setSelectedDetail({ type, data: detail })
    }
  }

  const closeModal = () => {
    setActiveModal("")
    setSelectedDetail(null)
  }

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl)
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
    setSelectedImage("")
  }

  const handleLocationClick = (item) => {
    if (!wsConnected) {
      showNotification("WebSocket not connected. Cannot track location.")
      return
    }

    const driverData = {
      driver: {
        id: item.Driver?.id,
        name: item.Driver?.name,
        location: item.Driver?.location || {
          latitude: 19.076,
          longitude: 72.8777,
          timestamp: new Date().toISOString(),
        },
      },
      cab: {
        cabNumber: item.CabsDetail?.cabNumber,
        location: {
          from: item.locationFrom || item.pickupLocation,
          to: item.locationTo || item.dropLocation,
          totalDistance: item.totalDistance || item.estimatedDistance,
        },
      },
    }

    setSelectedDriver(driverData)
    setShowMap(true)
  }

  const renderDetailContent = () => {
    if (!selectedDetail) return null

    const { type, data } = selectedDetail

    switch (type) {
      case "customer":
        return (
          <div className="space-y-3 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <p className="text-gray-900">{data?.customerName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">{data?.customerPhone || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <p className="text-gray-900">{data?.pickupLocation || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drop Location</label>
              <p className="text-gray-900">{data?.dropLocation || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trip Type</label>
              <p className="text-gray-900">{data?.tripType || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <p className="text-gray-900">{data?.vehicleType || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Fare</label>
              <p className="text-green-600 font-semibold">₹{data?.estimatedFare || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
              <p className="text-gray-900">{data?.specialInstructions || "None"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
              <p className="text-gray-900">{data?.adminNotes || "None"}</p>
            </div>
          </div>
        )

      case "fuel":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <p className="text-gray-900">{data?.fuelType || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="space-y-1">
                {data?.fuelAmount?.map((amount, index) => (
                  <p key={index} className="text-green-600 font-semibold">
                    ₹{amount}
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Receipt Images</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {data?.fuelReceiptImage?.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Fuel receipt ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => openImageModal(image)}
                  />
                )) || <p className="text-gray-500">No images</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction Images</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {data?.fuelTransactionImage?.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Fuel transaction ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => openImageModal(image)}
                  />
                )) || <p className="text-gray-500">No images</p>}
              </div>
            </div>
          </div>
        )

      case "fastTag":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
              <p className="text-gray-900">{data?.fastTagPaymentMode || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="space-y-1">
                {data?.fastTagAmount?.map((amount, index) => (
                  <p key={index} className="text-green-600 font-semibold">
                    ₹{amount}
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Details</label>
              <p className="text-gray-900">{data?.fastTagCardDetails || "N/A"}</p>
            </div>
          </div>
        )

      case "tyrePuncture":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Repair Amount</label>
              <div className="space-y-1">
                {data?.tyreRepairAmount?.map((amount, index) => (
                  <p key={index} className="text-green-600 font-semibold">
                    ₹{amount}
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {data?.tyreImage?.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Tyre repair ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => openImageModal(image)}
                  />
                )) || <p className="text-gray-500">No images</p>}
              </div>
            </div>
          </div>
        )

      case "vehicleServicing":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Service</label>
              <p className="text-gray-900">{data?.servicingRequired ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Details</label>
              <p className="text-gray-900">{data?.servicingDetails || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="space-y-1">
                {data?.servicingAmount?.map((amount, index) => (
                  <p key={index} className="text-green-600 font-semibold">
                    ₹{amount}
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meter Reading</label>
              <div className="space-y-1">
                {data?.servicingMeter?.map((meter, index) => (
                  <p key={index} className="text-gray-900">
                    {meter} km
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">KM Travelled</label>
              <p className="text-gray-900">{data?.servicingKmTravelled || "N/A"} km</p>
            </div>
          </div>
        )

      case "otherProblems":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Details</label>
              <p className="text-gray-900">{data?.otherDetails || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="space-y-1">
                {data?.otherAmount?.map((amount, index) => (
                  <p key={index} className="text-green-600 font-semibold">
                    ₹{amount}
                  </p>
                )) || <p className="text-gray-900">N/A</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {data?.otherImage?.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Other problem ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => openImageModal(image)}
                  />
                )) || <p className="text-gray-500">No images</p>}
              </div>
            </div>
          </div>
        )

      default:
        return <p>No details available</p>
    }
  }

  if (loading && cabDetails.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 md:ml-60 mt-20 sm:mt-0 transition-all duration-300">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white h-16 rounded-lg shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 md:ml-60 mt-20 sm:mt-0 transition-all duration-300 max-w-full overflow-hidden">
        {showAccessDenied && <AccessDeniedModal />}

        {notification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-md shadow-lg transition-all duration-300 animate-fadeIn">
              {notification}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Truck className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cab Search</h1>
        </div>

        {pagination && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>
                  Showing {(pagination.currentPage - 1) * recordsPerPage + 1} to{" "}
                  {Math.min(pagination.currentPage * recordsPerPage, pagination.totalCount)} of{" "}
                  {pagination.totalCount} assignments ({recordsPerPage} per page)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          pageNum === currentPage
                            ? "bg-yellow-500 text-black"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className={`h-3 w-3 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-600">{wsConnected ? "Connected" : "Disconnected"}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter Cab Number"
                value={cabNumber}
                onChange={(e) => setCabNumber(e.target.value)}
                className="border border-gray-300 p-3 text-black rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg whitespace-nowrap transition-colors font-medium"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 text-black p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 p-3 text-black rounded-lg w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleDateFilter}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg whitespace-nowrap transition-colors font-medium"
              >
                Filter by Date
              </button>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-yellow-500 text-black"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("assigned")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "assigned"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "completed"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter("untripAssignment")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "untripAssignment"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Untrip Assignment
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white h-16 rounded-lg shadow-sm"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table with proper scrolling */}
            <div className="hidden lg:block bg-white shadow-sm rounded-lg border">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[60px]">#</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Cab No</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Driver</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[160px]">Customer</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Date</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Pickup</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Drop</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Status</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Trip</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[140px]">Details</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[80px]">Location</th>
                      <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCabs.length > 0 ? (
                      filteredCabs.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-4 text-sm text-gray-900">
                            {(currentPage - 1) * recordsPerPage + index + 1}
                          </td>
                          <td className="px-3 py-4 text-sm font-medium text-gray-900">
                            <div className="max-w-[120px] truncate" title={item.CabsDetail?.cabNumber || "N/A"}>
                              {item.CabsDetail?.cabNumber || "N/A"}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div className="max-w-[120px] truncate" title={item.Driver?.name || "N/A"}>
                              {item.Driver?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            {item.customerName ? (
                              <div className="max-w-[160px]">
                                <div className="font-medium truncate" title={item.customerName}>
                                  {item.customerName}
                                </div>
                                <div className="text-gray-500 text-xs truncate" title={item.customerPhone}>
                                  {item.customerPhone}
                                </div>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div className="max-w-[100px]">
                              {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString("en-GB") : "N/A"}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div className="max-w-[200px] truncate" title={item.locationFrom || item.pickupLocation || "N/A"}>
                              {item.locationFrom || item.pickupLocation || "N/A"}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div className="max-w-[200px] truncate" title={item.locationTo || item.dropLocation || "N/A"}>
                              {item.locationTo || item.dropLocation || "N/A"}
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item?.status === "assigned"
                                  ? "bg-red-100 text-red-800"
                                  : item?.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item?.status}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            {item?.status === "completed" ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Done
                              </span>
                            ) : (
                              <button
                                onClick={() => handleCompleteTrip(item.id)}
                                disabled={completingTrips[item.id]}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              >
                                {completingTrips[item.id] ? "..." : "Complete"}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-4">
                            <select
                              className="border border-gray-300 text-black p-1 rounded text-xs focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-w-[120px]"
                              onChange={(e) => {
                                if (e.target.value === "customer") {
                                  openModal("customer", null, item)
                                } else if (e.target.value) {
                                  openModal(e.target.value, item)
                                }
                              }}
                            >
                              <option value="">Select</option>
                              <option value="customer">Customer</option>
                              <option value="fuel">Fuel</option>
                              <option value="fastTag">FastTag</option>
                              <option value="tyrePuncture">Tyre</option>
                              <option value="vehicleServicing">Service</option>
                              <option value="otherProblems">Other</option>
                            </select>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                className={`text-green-600 transition-all duration-300 hover:scale-110 hover:shadow-md p-1 rounded ${
                                  item.Driver?.location ? "animate-pulse" : ""
                                }`}
                                onClick={() => handleLocationClick(item)}
                                title="Track Location"
                                disabled={!wsConnected}
                              >
                                <MapPin size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="min-w-[120px]">
                              <InvoiceButton
                                item={item}
                                companyLogo={companyLogo}
                                signature={signature}
                                companyInfo={companyInfo}
                                subCompanyName={subCompanyName}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-6 py-8 text-center text-gray-500">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredCabs.length > 0 ? (
                filteredCabs.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Cab No</p>
                        <p className="font-medium text-gray-900">{item.CabsDetail?.cabNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Driver</p>
                        <p className="text-gray-900">{item.Driver?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="text-gray-900">{item.customerName || "N/A"}</p>
                        {item.customerPhone && <p className="text-xs text-gray-500">{item.customerPhone}</p>}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Date</p>
                        <p className="text-gray-900">
                          {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="text-gray-900">{item.totalDistance || item.estimatedDistance || "0"} KM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fare</p>
                        <p className="text-green-600 font-semibold">₹{item.estimatedFare || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Pickup</p>
                      <p className="text-gray-900">{item.locationFrom || item.pickupLocation || "N/A"}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Drop</p>
                      <p className="text-gray-900">{item.locationTo || item.dropLocation || "N/A"}</p>
                    </div>
                    <div className="mb-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item?.status === "assigned"
                            ? "bg-red-100 text-red-800"
                            : item?.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item?.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <select
                        className="flex-1 border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        onChange={(e) => {
                          if (e.target.value === "customer") {
                            openModal("customer", null, item)
                          } else if (e.target.value) {
                            openModal(e.target.value, item)
                          }
                        }}
                      >
                        <option value="">View Details</option>
                        <option value="customer">Customer Details</option>
                        <option value="fuel">Fuel Details</option>
                        <option value="fastTag">FastTag Details</option>
                        <option value="tyrePuncture">Tyre Details</option>
                        <option value="vehicleServicing">Servicing Details</option>
                        <option value="otherProblems">Other Problems</option>
                      </select>
                      <button
                        className={`text-green-600 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 ${
                          item.Driver?.location ? "animate-pulse" : ""
                        }`}
                        onClick={() => handleLocationClick(item)}
                        title="Track Location"
                        disabled={!wsConnected}
                      >
                        <MapPin size={16} />
                      </button>
                    </div>
                    <div className="mb-4">
                      {item?.status === "completed" ? (
                        <span className="inline-flex px-3 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800 w-full justify-center">
                          Trip Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteTrip(item.id)}
                          disabled={completingTrips[item.id]}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                        >
                          {completingTrips[item.id] ? "Completing..." : "Complete Trip"}
                        </button>
                      )}
                    </div>
                    <InvoiceButton
                      item={item}
                      companyLogo={companyLogo}
                      signature={signature}
                      companyInfo={companyInfo}
                      subCompanyName={subCompanyName}
                    />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-lg shadow-sm border">
                  <p className="text-gray-500">No results found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Bottom Pagination - Additional pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 7) {
                      pageNum = i + 1
                    } else if (currentPage <= 4) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 3) {
                      pageNum = pagination.totalPages - 6 + i
                    } else {
                      pageNum = currentPage - 3 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          pageNum === currentPage
                            ? "bg-yellow-500 text-black"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={currentPage >= pagination.totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal && selectedDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize text-gray-900">{selectedDetail.type} Details</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              {renderDetailContent()}
              <button
                onClick={closeModal}
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {imageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 max-w-2xl w-full shadow-xl">
              <div className="flex justify-end mb-3">
                <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={400}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}

        {showMap && selectedDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDriver.driver?.name || "Driver"} - {selectedDriver.cab?.cabNumber || "N/A"}
                </h2>
                <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">From: {selectedDriver.cab?.location?.from || "N/A"}</p>
                  </div>
                </div>
                <div className="h-6 border-l-2 border-dashed border-gray-400 ml-1.5"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">To: {selectedDriver.cab?.location?.to || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1" style={{ height: "500px" }}>
                <LeafletMap
                  location={selectedDriver.driver?.location}
                  driverName={selectedDriver.driver?.name}
                  cabNumber={selectedDriver.cab?.cabNumber}
                  routeFrom={selectedDriver.cab?.location?.from}
                  routeTo={selectedDriver.cab?.location?.to}
                  onMapReady={(map) => {
                    console.log("Map is ready", map)
                    setTimeout(() => {
                      if (map) {
                        map.panTo({
                          lat: Number.parseFloat(selectedDriver.driver?.location?.latitude) || 16.705,
                          lng: Number.parseFloat(selectedDriver.driver?.location?.longitude) || 74.2433,
                        })
                      }
                    }, 100)
                  }}
                />
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Driver: {selectedDriver.driver?.name || "N/A"}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Cab Number: {selectedDriver.cab?.cabNumber || "N/A"}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Distance:{" "}
                      {selectedDriver.cab?.location?.totalDistance ||
                        driverRoutes[selectedDriver.driver?.id]?.totalDistance ||
                        "0"}{" "}
                      KM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <strong>Current Location:</strong>{" "}
                      {selectedDriver.driver?.location?.latitude?.toFixed(6) || "N/A"},{" "}
                      {selectedDriver.driver?.location?.longitude?.toFixed(6) || "N/A"}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Last Updated:</strong>{" "}
                      {selectedDriver.driver?.location?.timestamp
                        ? new Date(selectedDriver.driver.location.timestamp).toLocaleTimeString()
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Connection Status:</strong>{" "}
                      <span className={wsConnected ? "text-green-600" : "text-red-600"}>
                        {wsConnected ? "Connected" : "Disconnected"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CabSearch