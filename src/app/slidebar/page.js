"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, Truck } from "lucide-react"
import { MdOutlineAssignmentTurnedIn, MdDashboard } from "react-icons/md"
import { RiMoneyRupeeCircleLine } from "react-icons/ri"
import { FiUser, FiTruck, FiSettings } from "react-icons/fi"
import { FaFileInvoice } from "react-icons/fa";
import { BsFillTaxiFrontFill } from "react-icons/bs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import axios from "axios"
import baseURL from "@/utils/api"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [companyLogo, setCompanyLogo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeItem, setActiveItem] = useState("/AdminDashboard")
  const [companyEmail,setCompanyEmail]=useState('')
  const router = useRouter()

  const handleLogout = () => {
    setLoggingOut(true)
    setTimeout(() => {
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      toast.success("Logout successful!")
      router.push("/components/login")
    }, 1000)
  }

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id")
      if (!id) return

      try {
        const res = await axios.get(`${baseURL}api/admin/getSubAdmin/${id}`)
        console.log("SubAdmin Data:",res.data.subAdmin)
        const subAdmin = res.data.subAdmin
        if (subAdmin) {
          console.log("SubAdmin Data:", subAdmin.name)
          setCompanyLogo(subAdmin.companyLogo)
          setCompanyName(subAdmin.name || "FleetView")
          setCompanyEmail(subAdmin.email||"Admin@Example.com")
        }
      } catch (error) {
        console.error("Error fetching sub-admin:", error)
        setCompanyName("FleetView")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setActiveItem(window.location.pathname)
  }, [])

  const menuItems = useMemo(
    () => [
      { icon: <MdDashboard size={20} />, label: "Dashboard", link: "/AdminDashboard" },
      { icon: <FiUser size={20} />, label: "Driver Details", link: "/DriverDetails" },
      { icon: <BsFillTaxiFrontFill size={20} />, label: "Vehicle Details", link: "/CabDetails" },
      { icon: <MdOutlineAssignmentTurnedIn size={20} />, label: "Assign Vehicle", link: "/AssignCab" },
      { icon: <FiTruck size={20} />, label: "View Vehicle", link: "/CabInfo" },
      { icon: <FiSettings size={20} />, label: "Servicing", link: "/Servicing" },
      { icon: <RiMoneyRupeeCircleLine size={20} />, label: "Expenses", link: "/Expensive" },
      { icon: <FiTruck size={20} />, label: "FastTag Recharge", link: "/FastTagPayments" },
      { icon: <FiTruck size={20} />, label: "Live Tracking", link: "/GPSTracking" },
      { icon: <FiSettings size={20} />, label: "Predictive Maintenance", link: "/PredictiveMaintenance" },
      { icon: <FaFileInvoice size={20}/>,label:"Invoice ", link:"/InvoicePDF"}

    ],
    [],
  )

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-yellow-400" />
            <span className="text-white text-lg font-bold">{companyName}</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl p-1">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Logout Loading */}
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-900 text-lg font-semibold">Logging out...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-screen transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full w-64 flex flex-col bg-gray-900 shadow-lg border-r border-gray-700">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 px-6 py-4 border-b border-gray-700">
            <Truck className="h-8 w-8 text-yellow-400" />
            <span className="text-white text-xl font-bold">{companyName}</span>
          </div>

          {/* Mobile spacer */}
          <div className="h-16 lg:hidden" />

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {loading
                ? menuItems.map((_, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 rounded-lg">
                      <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
                      <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
                    </li>
                  ))
                : menuItems.map((item, i) => {
                    const isActive = activeItem === item.link
                    return (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setActiveItem(item.link)
                            router.push(item.link)
                            if (window.innerWidth < 1024) setIsOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-yellow-400 text-gray-900 font-semibold"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <span className={`${isActive ? "text-gray-900" : "text-gray-400"}`}>{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </button>
                      </li>
                    )
                  })}
            </ul>
          </div>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-3 p-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{companyName[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{companyName}</p>
                <p className="text-gray-400 text-xs truncate">{companyEmail}</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
