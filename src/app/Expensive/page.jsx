// "use client"

// import { useState, useEffect } from "react"
// import Sidebar from "../slidebar/page"
// import * as XLSX from "xlsx"
// import { saveAs } from "file-saver"
// import baseURL from "@/utils/api"
// import { useRouter } from "next/navigation"
// import axios from "axios"

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

// const CabExpenses = () => {
//   const router = useRouter()
//   const [showAccessDenied, setShowAccessDenied] = useState(false)
//   const [allExpenses, setAllExpenses] = useState([])
//   const [filteredExpenses, setFilteredExpenses] = useState([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [fromDate, setFromDate] = useState("")
//   const [toDate, setToDate] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [isInitialLoad, setIsInitialLoad] = useState(true)

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

//   const exportToExcel = () => {
//     if (filteredExpenses.length === 0) {
//       alert("No data to export!")
//       return
//     }

//     setLoading(true)
//     setTimeout(() => {
//       try {
//         const formattedData = filteredExpenses.map((cab, index) => ({
//           ID: index + 1,
//           "Cab Number": cab.cabNumber || "N/A",
//           Date: cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A",
//           "Fuel (₹)": cab.breakdown.fuel || 0,
//           "FastTag (₹)": cab.breakdown.fastTag || 0,
//           "Tyre Repair (₹)": cab.breakdown.tyrePuncture || 0,
//           "Other Expenses (₹)": cab.breakdown.otherProblems || 0,
//           "Total Expense (₹)": cab.totalExpense,
//         }))

//         const worksheet = XLSX.utils.json_to_sheet(formattedData)
//         const workbook = XLSX.utils.book_new()
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Cab Expenses")
//         const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
//         const data = new Blob([excelBuffer], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         })

//         saveAs(data, "CabExpenses.xlsx")
//         alert("Export successful!")
//       } catch (error) {
//         console.error("Error exporting data:", error)
//         alert("Failed to export data")
//       } finally {
//         setLoading(false)
//       }
//     }, 500)
//   }

//   useEffect(() => {
//     const fetchAllExpenses = async () => {
//       setLoading(true)
//       try {
//         const response = await fetch(`${baseURL}api/cabs/cabExpensive`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         const data = await response.json()
//         if (response.ok) {
//           setAllExpenses(data.data || [])
//           setFilteredExpenses(data.data || [])
//         } else {
//           setAllExpenses([])
//           setFilteredExpenses([])
//         }
//       } catch (error) {
//         console.error("Error fetching expenses:", error)
//       } finally {
//         setTimeout(() => {
//           setLoading(false)
//           setIsInitialLoad(false)
//         }, 500)
//       }
//     }

//     fetchAllExpenses()
//   }, [])

//   const applyFilters = () => {
//     setLoading(true)
//     setTimeout(() => {
//       let results = [...allExpenses]

//       if (searchQuery.trim()) {
//         results = results.filter((expense) => expense.cabNumber.toLowerCase().includes(searchQuery.toLowerCase()))
//       }

//       if (fromDate && toDate) {
//         const fromDateObj = new Date(fromDate)
//         const toDateObj = new Date(toDate)
//         toDateObj.setHours(23, 59, 59, 999)

//         results = results.filter((expense) => {
//           const expenseDate = new Date(expense.cabDate)
//           return expenseDate >= fromDateObj && expenseDate <= toDateObj
//         })
//       }

//       setFilteredExpenses(results)
//       setLoading(false)
//     }, 500)
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     applyFilters()
//   }

//   const handleDateFilter = () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both start and end dates")
//       return
//     }
//     applyFilters()
//   }

//   const resetFilters = () => {
//     setLoading(true)
//     setTimeout(() => {
//       setSearchQuery("")
//       setFromDate("")
//       setToDate("")
//       setFilteredExpenses(allExpenses)
//       setLoading(false)
//     }, 500)
//   }

//   if (loading && isInitialLoad) {
//     return (
//       <div className="flex bg-gray-900 min-h-screen text-white">
//         <Sidebar />
//         <div className="flex-1 p-6 mt-20 sm:mt-0 md:ml-60 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//             <p>Loading...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }
//   return (
//     <div className="flex min-h-screen bg-gray-800">
//       <Sidebar />

//       <div className="flex-1 md:ml-60 p-4 md:p-6 text-white mt-20 sm:mt-0 transition-all duration-300">
//         {showAccessDenied && <AccessDeniedModal />}

//         <h1 className="text-xl md:text-2xl font-bold mb-4">Expenses</h1>

//         <div className="space-y-4 mb-6">
//           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//             <input
//               type="text"
//               placeholder="Search by Cab Number"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="border p-2 rounded w-full sm:w-64 text-white bg-gray-700"
//             />
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
//               disabled={loading || isInitialLoad}
//             >
//               {loading ? "Searching..." : "Search"}
//             </button>
//           </form>

//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white">
//               <span>From:</span>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="border p-2 rounded text-white bg-gray-700"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white">
//               <span>To:</span>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="border p-2 rounded text-white bg-gray-700"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2">
//               <button
//                 onClick={handleDateFilter}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                 disabled={loading || isInitialLoad}
//               >
//                 Filter by Date
//               </button>
//               <button
//                 onClick={resetFilters}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//                 disabled={loading || isInitialLoad}
//               >
//                 Reset Filters
//               </button>
//               <button
//                 onClick={exportToExcel}
//                 disabled={loading || filteredExpenses.length === 0}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
//               >
//                 {loading ? "Exporting..." : "Export to Excel"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {loading || isInitialLoad ? (
//           <div className="animate-pulse space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="bg-gray-700 h-16 rounded-md"></div>
//             ))}
//           </div>
//         ) : (
//           <>
//             <div className="hidden md:block bg-gray-700 shadow-lg rounded-lg overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-800 text-white">
//                     <th className="p-3 text-left">Cab Number</th>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Breakdown</th>
//                     <th className="p-3 text-left">Total (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredExpenses.length > 0 ? (
//                     filteredExpenses.map((cab, index) => (
//                       <tr key={`${cab.cabNumber}-${index}`} className="border-b border-gray-600 hover:bg-gray-600">
//                         <td className="p-3 font-medium">{cab.cabNumber}</td>
//                         <td className="p-3">{cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A"}</td>
//                         <td className="p-3 text-sm">
//                           <ul className="space-y-1">
//                             <li>Fuel: ₹{cab.breakdown.fuel}</li>
//                             <li>FastTag: ₹{cab.breakdown.fastTag}</li>
//                             <li>Tyre: ₹{cab.breakdown.tyrePuncture}</li>
//                             <li>Other: ₹{cab.breakdown.otherProblems}</li>
//                           </ul>
//                         </td>
//                         <td className="p-3 font-medium">₹{cab.totalExpense}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="p-4 text-center">
//                         No expenses found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="md:hidden space-y-3">
//               {filteredExpenses.length > 0 ? (
//                 filteredExpenses.map((cab, index) => (
//                   <div key={`${cab.cabNumber}-${index}`} className="bg-gray-700 p-4 rounded-lg shadow">
//                     <div className="grid grid-cols-2 gap-4 mb-3">
//                       <div>
//                         <p className="text-gray-400 text-sm">Cab Number</p>
//                         <p className="font-medium">{cab.cabNumber}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-400 text-sm">Date</p>
//                         <p>{cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A"}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-400 text-sm">Total</p>
//                         <p className="font-medium">₹{cab.totalExpense}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-gray-400 text-sm mb-1">Breakdown</p>
//                       <div className="bg-gray-800 p-3 rounded">
//                         <p>Fuel: ₹{cab.breakdown.fuel}</p>
//                         <p>FastTag: ₹{cab.breakdown.fastTag}</p>
//                         <p>Tyre: ₹{cab.breakdown.tyrePuncture}</p>
//                         <p>Other: ₹{cab.breakdown.otherProblems}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-4 text-center text-white bg-gray-700 rounded-lg">No expenses found</div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CabExpenses



"use client"

import { useState, useEffect } from "react"
import Sidebar from "../slidebar/page"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import baseURL from "@/utils/api"
import { useRouter } from "next/navigation"
import axios from "axios"

const AccessDeniedModal = () => {
  const router = useRouter()

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Access Denied</h2>
        <p className="mb-6 text-gray-600">Your access has been restricted. Please contact the administrator.</p>
        <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Close
        </button>
      </div>
    </div>
  )
}

const CabExpenses = () => {
  const router = useRouter()
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [allExpenses, setAllExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [cabNumbers, setCabNumbers] = useState({}) // To store cabId to cabNumber mapping

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const id = localStorage.getItem("id")
        if (!id) {
          router.push("/")
          return
        }

        const subAdminsRes = await axios.get(`${baseURL}api/admin/getAllSubAdmins`)
        const loggedInUser = subAdminsRes.data.subAdmins.find((e) => e._id === id)

        if (loggedInUser?.status === "Inactive") {
          localStorage.clear()
          setShowAccessDenied(true)
          return
        }
      } catch (err) {
        console.error("Error checking user status:", err)
      }
    }

    checkUserStatus()
  }, [router])

  useEffect(() => {
    const fetchCabNumbers = async () => {
      try {
        const response = await axios.get(`${baseURL}api/cabDetails`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        const cabMap = {}
        response.data.forEach(cab => {
          cabMap[cab.id] = cab.cabNumber
        })
        setCabNumbers(cabMap)
      } catch (error) {
        console.error("Error fetching cab details:", error)
      }
    }

    fetchCabNumbers()
  }, [])

  const getCabNumber = (cabId) => {
    return cabNumbers[cabId] || `Cab ${cabId}`
  }

  const exportToExcel = () => {
    if (filteredExpenses.length === 0) {
      alert("No data to export!")
      return
    }

    setLoading(true)
    setTimeout(() => {
      try {
        const formattedData = filteredExpenses.map((cab, index) => ({
          ID: index + 1,
          "Cab Number": getCabNumber(cab.cabId),
          Date: cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A",
          "Fuel (₹)": cab.breakdown.fuel || 0,
          "FastTag (₹)": cab.breakdown.fastTag || 0,
          "Tyre Repair (₹)": cab.breakdown.tyrePuncture || 0,
          "Other Expenses (₹)": cab.breakdown.otherProblems || 0,
          "Total Expense (₹)": cab.totalExpense,
        }))

        const worksheet = XLSX.utils.json_to_sheet(formattedData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cab Expenses")
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        saveAs(data, "CabExpenses.xlsx")
        alert("Export successful!")
      } catch (error) {
        console.error("Error exporting data:", error)
        alert("Failed to export data")
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  useEffect(() => {
    const fetchAllExpenses = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${baseURL}api/cabs/cabExpensive`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })

        if (response.data.success) {
          setAllExpenses(response.data.data || [])
          setFilteredExpenses(response.data.data || [])
        } else {
          setAllExpenses([])
          setFilteredExpenses([])
        }
      } catch (error) {
        console.error("Error fetching expenses:", error)
        setAllExpenses([])
        setFilteredExpenses([])
      } finally {
        setTimeout(() => {
          setLoading(false)
          setIsInitialLoad(false)
        }, 500)
      }
    }

    fetchAllExpenses()
  }, [])

  const applyFilters = () => {
    setLoading(true)
    setTimeout(() => {
      let results = [...allExpenses]

      if (searchQuery.trim()) {
        results = results.filter(expense => 
          getCabNumber(expense.cabId).toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate)
        const toDateObj = new Date(toDate)
        toDateObj.setHours(23, 59, 59, 999)

        results = results.filter(expense => {
          const expenseDate = new Date(expense.cabDate)
          return expenseDate >= fromDateObj && expenseDate <= toDateObj
        })
      }

      setFilteredExpenses(results)
      setLoading(false)
    }, 500)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const handleDateFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both start and end dates")
      return
    }
    applyFilters()
  }

  const resetFilters = () => {
    setLoading(true)
    setTimeout(() => {
      setSearchQuery("")
      setFromDate("")
      setToDate("")
      setFilteredExpenses(allExpenses)
      setLoading(false)
    }, 500)
  }

  if (loading && isInitialLoad) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 mt-20 sm:mt-0 md:ml-60 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 md:ml-60 p-4 md:p-6 mt-20 sm:mt-0 transition-all duration-300">
        {showAccessDenied && <AccessDeniedModal />}

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Expenses</h1>
          <p className="text-gray-600">Manage and track your cab expenses</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Expenses</h2>
          
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by Cab Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800 bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                disabled={loading || isInitialLoad}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {/* Date Filter */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800 bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDateFilter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                  disabled={loading || isInitialLoad}
                >
                  Filter by Date
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                  disabled={loading || isInitialLoad}
                >
                  Reset Filters
                </button>
                <button
                  onClick={exportToExcel}
                  disabled={loading || filteredExpenses.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Exporting..." : "Export to Excel"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Expense Records ({filteredExpenses.length})
            </h2>
          </div>

          {loading || isInitialLoad ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-16 rounded-md"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cab Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Breakdown
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((cab, index) => (
                        <tr key={`${cab.cabId}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{getCabNumber(cab.cabId)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 space-y-1">
                              <div className="flex">
                                <span className="w-20">Fuel:</span>
                                <span className="font-medium">₹{cab.breakdown.fuel || 0}</span>
                              </div>
                              <div className="flex">
                                <span className="w-20">FastTag:</span>
                                <span className="font-medium">₹{cab.breakdown.fastTag || 0}</span>
                              </div>
                              <div className="flex">
                                <span className="w-20">Tyre:</span>
                                <span className="font-medium">₹{cab.breakdown.tyrePuncture || 0}</span>
                              </div>
                              <div className="flex">
                                <span className="w-20">Other:</span>
                                <span className="font-medium">₹{cab.breakdown.otherProblems || 0}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">₹{cab.totalExpense}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-lg font-medium">No expenses found</p>
                            <p className="text-sm">Try adjusting your search criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((cab, index) => (
                    <div key={`${cab.cabId}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{getCabNumber(cab.cabId)}</h3>
                          <p className="text-sm text-gray-600">
                            {cab.cabDate ? new Date(cab.cabDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{cab.totalExpense}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Expense Breakdown</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fuel:</span>
                            <span className="font-medium text-gray-900">₹{cab.breakdown.fuel || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">FastTag:</span>
                            <span className="font-medium text-gray-900">₹{cab.breakdown.fastTag || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tyre:</span>
                            <span className="font-medium text-gray-900">₹{cab.breakdown.tyrePuncture || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Other:</span>
                            <span className="font-medium text-gray-900">₹{cab.breakdown.otherProblems || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">No expenses found</p>
                    <p className="text-sm text-gray-600">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CabExpenses