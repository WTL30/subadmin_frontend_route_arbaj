"use client"
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import Sidebar from "../slidebar/page"

const page = () => {
  // Form state with empty initial values
  const [formData, setFormData] = useState({
    // Invoice Info - invoiceNumber will be auto-generated
    invoiceNumber: "",
    invoiceDate: "",
    // Company Info
    companyName: "",
    companyAddress: "",
    customerName: "",
    customerMobile: "",
    customerEmail: "",
    companyGSTIN: "",
    // Client Info
    clientName: "",
    clientMobile: "",
    clientEmail: "",
    clientGSTIN: "",
    // Trip Details
    pickupLocation: "",
    dropLocation: "",
    journeyType: "",
    distance: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    noOfDays: "",
    rentalHours: "",
    fixedKm: "",
    extraHours: "",
    extraDistance: "",
    // Booking Details
    vehicleType: "",
    baseFare: "",
    driverAllowance: "300", // Default value
    serviceChargePercentage: "",
    gstPercentage: "5", // Default 5%
    // Bank Details
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
  })

  const [signatureImage, setSignatureImage] = useState(null)
  const [logoImage, setLogoImage] = useState(null)
  const fileInputRef = useRef(null)
  const logoInputRef = useRef(null)

  // Generate invoice number in format XX/YYYY-YY (e.g., 68/2025-26)
  const generateInvoiceNumber = (increment = true) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const nextYear = currentYear + 1
    const shortNextYear = nextYear.toString().slice(-2)
    // Get counter from localStorage or initialize to 1
    let invoiceCounter = Number.parseInt(localStorage.getItem("invoiceCounter")) || 1
    const invoiceNum = invoiceCounter
    if (increment) {
      // Only increment if specified
      invoiceCounter++
      localStorage.setItem("invoiceCounter", invoiceCounter.toString())
    }
    return `${invoiceNum}/${currentYear}-${shortNextYear}`
  }

  // Set initial invoice number when component mounts
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(false), // Don't increment on initial load
    }))
  }, [])

  // Calculate fixed KM based on rental hours (10 KM per hour)
  useEffect(() => {
    if (formData.journeyType === "Rental Trip" && formData.rentalHours) {
      const fixedKmValue = Number.parseInt(formData.rentalHours) * 10
      setFormData((prev) => ({
        ...prev,
        fixedKm: fixedKmValue.toString(),
      }))
    }
  }, [formData.rentalHours, formData.journeyType])

  // Handle journey type change
  const handleJourneyTypeChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      journeyType: value,
      // Reset trip-related fields when changing journey type
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      noOfDays: "",
      rentalHours: "",
      fixedKm: "",
      extraHours: "",
      extraDistance: "",
    }))
  }

  // Calculate charges based on form inputs
  const calculateCharges = () => {
    const base = Number.parseFloat(formData.baseFare) || 0
    const driverAllowance = Number.parseFloat(formData.driverAllowance) || 0
    const subtotal = base + driverAllowance
    const gst = (subtotal * (Number.parseFloat(formData.gstPercentage) || 0)) / 100
    const serviceCharge = (subtotal * (Number.parseFloat(formData.serviceChargePercentage) || 0)) / 100
    const total = subtotal + gst + serviceCharge
    return {
      subtotal: subtotal.toFixed(2),
      gst: gst.toFixed(2),
      serviceCharge: serviceCharge.toFixed(2),
      total: total.toFixed(2),
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle signature image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSignatureImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle logo image upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Render trip details fields based on journey type
  const renderTripDetailsFields = () => {
    switch (formData.journeyType) {
      case "One Way Trip":
        return (
          <>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Time*</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
          </>
        )
      case "Round Trip":
        return (
          <>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Start Time*</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">End Time*</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">No. of Days*</label>
              <input
                type="number"
                name="noOfDays"
                value={formData.noOfDays}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
          </>
        )
      case "Rental Trip":
        return (
          <>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Date & Time*</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Rental Hours*</label>
              <input
                type="number"
                name="rentalHours"
                value={formData.rentalHours}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Fixed KM*</label>
              <input
                type="number"
                name="fixedKm"
                value={formData.fixedKm}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Extra Hours</label>
              <input
                type="number"
                name="extraHours"
                value={formData.extraHours || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Extra Distance (KM)</label>
              <input
                type="number"
                name="extraDistance"
                value={formData.extraDistance || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  // Generate PDF with exact invoice design
  const generatePDF = () => {
    const doc = new jsPDF()
    const charges = calculateCharges()

    // 1. Invoice Header with logo, title, and invoice info
    if (logoImage) {
      doc.addImage(logoImage, "JPEG", 20, 15, 30, 15)
    }
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("TAX INVOICE", 105, 20, { align: "center" })
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Date: ${formData.invoiceDate || "DD-MM-YYYY"}`, 160, 15)
    doc.text(`Invoice No: ${formData.invoiceNumber || generateInvoiceNumber()}`, 160, 20)

    // 2. Company Info (Left Column)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(`Company Name: ${formData.companyName || "Your Company"}`, 20, 40)
    doc.setFont("helvetica", "normal")
    doc.text(`Company Address: ${formData.companyAddress || "Company Address"}`, 20, 46)
    doc.text(`Name: ${formData.customerName || "Customer Name"}`, 20, 52)
    doc.text(`Mobile: ${formData.customerMobile || "Mobile"} | Email: ${formData.customerEmail || "Email"}`, 20, 58)
    doc.text(`GSTIN: ${formData.companyGSTIN || "GSTIN"}`, 20, 64)

    // 3. Client Info (Right Column - moved to extreme right)
    const rightX = 140
    doc.setFont("helvetica", "bold")
    doc.text(formData.clientName || "Client Name", rightX, 40)
    doc.setFont("helvetica", "normal")
    doc.text(`Mobile: ${formData.clientMobile || "Mobile"}`, rightX, 46)
    doc.text(`Email: ${formData.clientEmail || "Email"}`, rightX, 52)
    doc.text(`GSTIN: ${formData.clientGSTIN || "GSTIN"}`, rightX, 58)

    // 4. Divider Line
    doc.setDrawColor(0)
    doc.setLineWidth(0.3)
    doc.line(20, 68, 190, 68)

    // 5. Trip Details Table
    doc.setFont("helvetica", "bold")
    doc.text("TRIP DETAILS", 20, 76)

    // Prepare trip details table based on journey type
    let tripDetailsBody = []
    if (formData.journeyType === "One Way Trip") {
      tripDetailsBody = [
        [formData.pickupLocation || "Pickup", formData.dropLocation || "Drop", formData.journeyType || "Journey Type"],
        ["Distance (Km)", "Date", "Time"],
        [formData.distance || "0", formData.startDate || "DD-MM-YYYY", formData.startTime || "00:00 am"],
      ]
    } else if (formData.journeyType === "Rental Trip") {
      tripDetailsBody = [
        [formData.pickupLocation || "Pickup", formData.dropLocation || "Drop", formData.journeyType || "Journey Type"],
        ["Distance (Km)", "Date & Time", "Rental Hours"],
        [formData.distance || "0", formData.startDate || "DD-MM-YYYY", formData.rentalHours || "0"],
        ["Fixed KM", "Extra Hours", "Extra Distance"],
        [formData.fixedKm || "0", formData.extraHours || "0", formData.extraDistance || "0"],
      ]
    } else {
      tripDetailsBody = [
        [formData.pickupLocation || "Pickup", formData.dropLocation || "Drop", formData.journeyType || "Journey Type"],
        ["Distance (Km)", "Start Date", "Start Time"],
        [formData.distance || "0", formData.startDate || "DD-MM-YYYY", formData.startTime || "00:00 am"],
        ["End Date", "End Time", "No. of Days"],
        [formData.endDate || "DD-MM-YYYY", formData.endTime || "00:00 pm", formData.noOfDays || "0"],
      ]
    }

    autoTable(doc, {
      startY: 82,
      head: [["Pickup Location", "Drop Location", "Journey Type"]],
      body: tripDetailsBody,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.3,
        lineColor: 0,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      },
      headStyles: {
        textColor: 0,
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
      },
      margin: { left: 20 },
      tableWidth: 170,
    })

    // 6. Booking Details Table
    const tripTableEnd = doc.lastAutoTable.finalY + 5
    doc.line(20, tripTableEnd, 190, tripTableEnd)
    doc.setFont("helvetica", "bold")
    doc.text("BOOKING DETAILS", 20, tripTableEnd + 10)

    autoTable(doc, {
      startY: tripTableEnd + 16,
      head: [["Description", "Amount"]],
      body: [
        [`Vehicle Type: ${formData.vehicleType || "Vehicle"}`, `Rs.${formData.baseFare || "0"}`],
        ["Driver Allowance", `Rs.${formData.driverAllowance || "0"}`],
        ["Subtotal", `Rs.${charges.subtotal}`],
        [`Service Charge (${formData.serviceChargePercentage || "0"}%)`, `Rs.${charges.serviceCharge}`],
        [`GST Tax (${formData.gstPercentage || "5"}%)`, `Rs.${charges.gst}`],
        ["Paid Amount", `Rs.${charges.total}`],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.3,
        lineColor: 0,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      },
      headStyles: {
        textColor: 0,
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 50, halign: "right" },
      },
      margin: { left: 20 },
      tableWidth: 170,
    })

    // 7. Terms & Conditions - centered
    const bookingTableEnd = doc.lastAutoTable.finalY + 5
    doc.line(20, bookingTableEnd, 190, bookingTableEnd)
    doc.setFont("helvetica", "bold")
    doc.text("TERMS AND CONDITIONS", 105, bookingTableEnd + 10, { align: "center" })
    doc.setFont("helvetica", "normal")
    doc.text(
      "1. Extra Kilometer charges applicable beyond agreed distance. Toll, Parking and other charges additional as per actuals.",
      105,
      bookingTableEnd + 16,
      { align: "center" },
    )
    doc.text(
      "2. Payment to be made in full before trip starts. Cancellation should be intimated 2 hours in advance for refund eligibility.",
      105,
      bookingTableEnd + 22,
      { align: "center" },
    )

    // 8. Bank Details and Signature side by side
    const termsEnd = doc.lastAutoTable ? doc.lastAutoTable.finalY + 22 : bookingTableEnd + 22
    // Bank Details Table (left side)
    autoTable(doc, {
      startY: termsEnd + 15,
      body: [
        ["Account Name", formData.accountName || "Account Name"],
        ["Bank Name", formData.bankName || "Bank Name"],
        ["Account Number", formData.accountNumber || "Account Number"],
        ["IFSC CODE", formData.ifscCode || "IFSC"],
        ["Branch Name", formData.branchName || "Branch"],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: "justify",
        lineWidth: 0.3,
        lineColor: 0,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      },
      columnStyles: {
        0: {
          cellWidth: 50,
          fontStyle: "bold",
          halign: "left",
          lineWidth: 0.3,
        },
        1: {
          cellWidth: 60,
          halign: "left",
          lineWidth: 0.3,
        },
      },
      margin: { left: 20 },
      tableWidth: 110,
    })

    // Add signature image if available
    if (signatureImage) {
      doc.addImage(signatureImage, "JPEG", 140, termsEnd + 20, 40, 20)
    }
    doc.text("Authorized Signatory", 140, termsEnd + 45)

    // 9. Footer Note
    doc.setFontSize(8)
    doc.text(
      "Note: This is a computer-generated invoice. Toll, Parking and Extra KM charges will be as per the receipt.",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )

    // Save PDF
    doc.save(`invoice_${formData.invoiceNumber || "temp"}.pdf`)
  }

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    generatePDF()
    // Reset form after generating PDF but keep the auto-generated invoice number
    setFormData((prev) => ({
      ...prev,
      invoiceDate: "",
      companyName: "",
      companyAddress: "",
      customerName: "",
      customerMobile: "",
      customerEmail: "",
      companyGSTIN: "",
      clientName: "",
      clientMobile: "",
      clientEmail: "",
      clientGSTIN: "",
      pickupLocation: "",
      dropLocation: "",
      journeyType: "",
      distance: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      noOfDays: "",
      rentalHours: "",
      fixedKm: "",
      extraHours: "",
      extraDistance: "",
      vehicleType: "",
      baseFare: "",
      driverAllowance: "300",
      serviceChargePercentage: "",
      gstPercentage: "5",
      accountName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
    }))
    // Clear images
    setSignatureImage(null)
    setLogoImage(null)
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (logoInputRef.current) logoInputRef.current.value = ""
    // Generate new invoice number for next invoice
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50  flex">
      <Sidebar />
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 ml-0 md:ml-64">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Invoice Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Invoice Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Invoice Date*</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Upload Company Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    ref={logoInputRef}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 transition-colors"
                  />
                </div>
                {logoImage && (
                  <div className="mt-2">
                    <p className="text-gray-700 mb-2 font-medium">Logo Preview:</p>
                    <img
                      src={logoImage || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="max-w-xs max-h-20 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Company Information */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Company Name*</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Company Address*</label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">GSTIN*</label>
                  <input
                    type="text"
                    name="companyGSTIN"
                    value={formData.companyGSTIN}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Customer Information */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Customer Name*</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Mobile*</label>
                  <input
                    type="tel"
                    name="customerMobile"
                    value={formData.customerMobile}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Client Information */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Client Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Client Name*</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Mobile*</label>
                  <input
                    type="tel"
                    name="clientMobile"
                    value={formData.clientMobile}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">GSTIN</label>
                  <input
                    type="text"
                    name="clientGSTIN"
                    value={formData.clientGSTIN}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Trip Details */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">Trip Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Pickup Location*</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Drop Location*</label>
                  <input
                    type="text"
                    name="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Journey Type*</label>
                  <select
                    name="journeyType"
                    value={formData.journeyType}
                    onChange={handleJourneyTypeChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  >
                    <option value="">Select Journey Type</option>
                    <option value="One Way Trip">One Way Trip</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="Rental Trip">Rental Trip</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Distance (Km)*</label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                {/* Dynamic fields based on journey type */}
                {renderTripDetailsFields()}
              </div>
            </div>
            {/* Booking Details */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Booking Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Vehicle Type*</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Base Fare (₹)*</label>
                  <input
                    type="number"
                    name="baseFare"
                    value={formData.baseFare}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Driver Allowance (₹)</label>
                  <input
                    type="number"
                    name="driverAllowance"
                    value={formData.driverAllowance}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Service Charge (%)</label>
                  <input
                    type="number"
                    name="serviceChargePercentage"
                    value={formData.serviceChargePercentage}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">GST (%)</label>
                  <input
                    type="number"
                    name="gstPercentage"
                    value={formData.gstPercentage}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Bank Details */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">Bank Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Signature Upload */}
            <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">Signature</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Upload Signature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 transition-colors"
                  />
                </div>
                {signatureImage && (
                  <div className="mt-2">
                    <p className="text-gray-700 mb-2 font-medium">Preview:</p>
                    <img
                      src={signatureImage || "/placeholder.svg"}
                      alt="Signature Preview"
                      className="max-w-xs max-h-20 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-8 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-lg"
            >
              Generate Invoice PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default page












// "use client"

// import { jsPDF } from "jspdf"
// import autoTable from "jspdf-autotable"
// import { InvoiceButton } from "../components/InvoiceButton" // Assuming you have a shadcn/ui Button component

// const InvoiceButton = ({
//   item,
//   companyLogo,
//   signature,
//   subCompanyName,
//   companyInfo,
//   expenseReportNumber,
//   derivePrefix, // This function is passed from cab-search/page.jsx
// }) => {
//   // Generate report number in format EXP/YYYY-YY
//   // This function is now local to the button, but uses the same logic
//   const generateReportNumber = (companyName) => {
//     const prefix = derivePrefix(companyName) // e.g. "REP"
//     const now = new Date()
//     const currentMonth = now.getMonth() + 1 // 0-based index, so +1
//     const currentYear = now.getFullYear()
//     const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1
//     const fyEnd = fyStart + 1
//     const fyStartShort = fyStart.toString().slice(-2) // "25"
//     const fyEndShort = fyEnd.toString().slice(-2) // "26"
//     const finYear = `${fyStartShort}${fyEndShort}` // "2526"

//     // Use a simple counter for uniqueness within the session, or a more robust ID from backend
//     let reportCounter = Number.parseInt(localStorage.getItem("expenseReportCounter") || "1")
//     const reportNum = reportCounter
//     reportCounter++
//     localStorage.setItem("expenseReportCounter", reportCounter.toString())

//     return `EXP${reportNum}/${finYear}`
//   }

//   // Calculate total expenses from the item's CabDetail
//   const calculateTotalExpenses = () => {
//     const cabDetail = item.CabDetail || {}
//     const fuel = cabDetail.fuel_amount?.reduce((sum, amount) => sum + Number.parseFloat(amount || "0"), 0) || 0
//     const fastTag = cabDetail.fastTag_amount?.reduce((sum, amount) => sum + Number.parseFloat(amount || "0"), 0) || 0
//     const tyre =
//       cabDetail.tyrePuncture_repairAmount?.reduce((sum, amount) => sum + Number.parseFloat(amount || "0"), 0) || 0
//     const servicing =
//       cabDetail.servicing_amount?.reduce((sum, amount) => sum + Number.parseFloat(amount || "0"), 0) || 0
//     const other =
//       cabDetail.otherProblems_amount?.reduce((sum, amount) => sum + Number.parseFloat(amount || "0"), 0) || 0

//     return {
//       fuel: fuel.toFixed(2),
//       fastTag: fastTag.toFixed(2),
//       tyre: tyre.toFixed(2),
//       servicing: servicing.toFixed(2),
//       other: other.toFixed(2),
//       total: (fuel + fastTag + tyre + servicing + other).toFixed(2),
//     }
//   }

//   // Generate Professional Expenses Report PDF
//   const generateExpensesPDF = () => {
//     const doc = new jsPDF()
//     const expenses = calculateTotalExpenses()
//     const reportDate = new Date(item.assignedAt).toLocaleDateString() || new Date().toLocaleDateString()

//     // Extract company address from companyInfo string
//     const companyInfoLines = companyInfo
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean)
//     const companyAddress = companyInfoLines.length > 1 ? companyInfoLines.slice(1).join(", ") : "N/A"
//     const companyGSTIN = "N/A" // Assuming GSTIN is not in companyInfo string, or needs to be extracted differently

//     // 1. Header with logo and title
//     if (companyLogo) {
//       doc.addImage(companyLogo, "JPEG", 15, 10, 25, 12)
//     }
//     doc.setFontSize(16)
//     doc.setFont("helvetica", "bold")
//     doc.text("EXPENSES REPORT", 105, 15, { align: "center" })
//     doc.setFontSize(9)
//     doc.setFont("helvetica", "normal")
//     doc.text(`Date: ${reportDate}`, 160, 10)
//     doc.text(`Report No: ${expenseReportNumber}`, 160, 15)

//     // 2. Company Information
//     doc.setFontSize(10)
//     doc.setFont("helvetica", "bold")
//     doc.text("COMPANY INFORMATION", 15, 30)
//     doc.setFont("helvetica", "normal")
//     doc.setFontSize(8)
//     doc.text(`Company: ${subCompanyName || "N/A"}`, 15, 36)
//     doc.text(`Address: ${companyAddress}`, 15, 40)
//     doc.text(`GSTIN: ${companyGSTIN}`, 15, 44)

//     // 3. Customer & Trip Details (Side by side)
//     doc.setFontSize(10)
//     doc.setFont("helvetica", "bold")
//     doc.text("CUSTOMER & TRIP DETAILS", 15, 55)

//     autoTable(doc, {
//       startY: 60,
//       head: [["Customer Information", "Trip Details"]],
//       body: [
//         [
//           `Name: ${item.customerName || "N/A"}`,
//           `Pickup: ${item.pickupLocation || item.CabDetail?.location_from || "N/A"}`,
//         ],
//         [`Phone: ${item.customerPhone || "N/A"}`, `Drop: ${item.dropLocation || item.CabDetail?.location_to || "N/A"}`],
//         [
//           `Email: ${item.customerEmail || "N/A"}`,
//           `Distance: ${item.estimatedDistance || item.CabDetail?.location_totalDistance || "0"} KM`,
//         ],
//         [`Trip Type: ${item.tripType || "N/A"}`, `Date: ${new Date(item.assignedAt).toLocaleDateString() || "N/A"}`],
//         [`Vehicle: ${item.vehicleType || "N/A"}`, `Time: ${new Date(item.assignedAt).toLocaleTimeString() || "N/A"}`],
//         [`Fare: ₹${item.estimatedFare || "0"}`, `Status: ${item.status || "N/A"}`],
//       ],
//       theme: "grid",
//       styles: {
//         fontSize: 8,
//         cellPadding: 2,
//         lineWidth: 0.1,
//       },
//       headStyles: {
//         fillColor: [240, 240, 240],
//         textColor: 0,
//         fontStyle: "bold",
//       },
//       columnStyles: {
//         0: { cellWidth: 85 },
//         1: { cellWidth: 85 },
//       },
//       margin: { left: 15 },
//       tableWidth: 170,
//     })

//     // 4. Driver & Cab Information
//     const customerTableEnd = doc.lastAutoTable.finalY + 8
//     doc.setFontSize(10)
//     doc.setFont("helvetica", "bold")
//     doc.text("DRIVER & CAB DETAILS", 15, customerTableEnd)
//     autoTable(doc, {
//       startY: customerTableEnd + 5,
//       body: [
//         ["Driver Name", item.Driver?.name || "N/A", "Cab Number", item.CabDetail?.cabNumber || "N/A"],
//         ["Assigned Date", new Date(item.assignedAt).toLocaleDateString() || "N/A", "Trip Status", item.status || "N/A"],
//       ],
//       theme: "grid",
//       styles: {
//         fontSize: 8,
//         cellPadding: 2,
//         lineWidth: 0.1,
//       },
//       columnStyles: {
//         0: { cellWidth: 42.5, fontStyle: "bold", fillColor: [250, 250, 250] },
//         1: { cellWidth: 42.5 },
//         2: { cellWidth: 42.5, fontStyle: "bold", fillColor: [250, 250, 250] },
//         3: { cellWidth: 42.5 },
//       },
//       margin: { left: 15 },
//       tableWidth: 170,
//     })

//     // 5. Expenses Breakdown
//     const driverTableEnd = doc.lastAutoTable.finalY + 8
//     doc.setFontSize(10)
//     doc.setFont("helvetica", "bold")
//     doc.text("EXPENSES BREAKDOWN", 15, driverTableEnd)
//     autoTable(doc, {
//       startY: driverTableEnd + 5,
//       head: [["Expense Type", "Details", "Amount (₹)"]],
//       body: [
//         ["Fuel", item.CabDetail?.fuel_type || "N/A", expenses.fuel],
//         ["Toll/FastTag", item.CabDetail?.fastTag_paymentMode || "N/A", expenses.fastTag],
//         ["Tyre Repair", item.CabDetail?.tyrePuncture_details || "N/A", expenses.tyre],
//         ["Vehicle Servicing", item.CabDetail?.servicing_details || "N/A", expenses.servicing],
//         ["Other Expenses", item.CabDetail?.otherProblems_details || "N/A", expenses.other],
//       ],
//       theme: "grid",
//       styles: {
//         fontSize: 8,
//         cellPadding: 3,
//         lineWidth: 0.1,
//       },
//       headStyles: {
//         fillColor: [240, 240, 240],
//         textColor: 0,
//         fontStyle: "bold",
//       },
//       columnStyles: {
//         0: { cellWidth: 50, fontStyle: "bold" },
//         1: { cellWidth: 70 },
//         2: { cellWidth: 50, halign: "right" },
//       },
//       margin: { left: 15 },
//       tableWidth: 170,
//     })

//     // 6. Total Summary
//     const expenseTableEnd = doc.lastAutoTable.finalY + 5
//     autoTable(doc, {
//       startY: expenseTableEnd,
//       body: [["TOTAL EXPENSES", `₹${expenses.total}`]],
//       theme: "grid",
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//         lineWidth: 0.2,
//         fontStyle: "bold",
//       },
//       columnStyles: {
//         0: { cellWidth: 120, fillColor: [240, 240, 240], halign: "center" },
//         1: { cellWidth: 50, halign: "right", fillColor: [255, 240, 240] },
//       },
//       margin: { left: 15 },
//       tableWidth: 170,
//     })

//     // 7. Bank Details and Signature (Side by side)
//     const totalTableEnd = doc.lastAutoTable.finalY + 10
//     // Bank Details (Left side) - Placeholder as this data is not in `item`
//     doc.setFontSize(9)
//     doc.setFont("helvetica", "bold")
//     doc.text("BANK DETAILS", 15, totalTableEnd)
//     autoTable(doc, {
//       startY: totalTableEnd + 3,
//       body: [
//         ["Account Name", "N/A"],
//         ["Bank Name", "N/A"],
//         ["Account Number", "N/A"],
//         ["IFSC Code", "N/A"],
//         ["Branch", "N/A"],
//       ],
//       theme: "grid",
//       styles: {
//         fontSize: 7,
//         cellPadding: 2,
//         lineWidth: 0.1,
//       },
//       columnStyles: {
//         0: { cellWidth: 35, fontStyle: "bold", fillColor: [250, 250, 250] },
//         1: { cellWidth: 45 },
//       },
//       margin: { left: 15 },
//       tableWidth: 80,
//     })

//     // Signature (Right side)
//     doc.setFontSize(9)
//     doc.setFont("helvetica", "bold")
//     doc.text("AUTHORIZED SIGNATURE", 120, totalTableEnd)
//     if (signature) {
//       doc.addImage(signature, "JPEG", 120, totalTableEnd + 5, 35, 15)
//     }
//     doc.setFontSize(8)
//     doc.setFont("helvetica", "normal")
//     doc.text("_________________________", 120, totalTableEnd + 25)
//     doc.text("Authorized Signatory", 120, totalTableEnd + 30)
//     doc.text(`Date: ${reportDate}`, 120, totalTableEnd + 35)

//     // 8. Footer
//     doc.setFontSize(7)
//     doc.setFont("helvetica", "normal")
//     doc.text(
//       "This is a computer-generated expenses report. All amounts are in Indian Rupees (₹).",
//       105,
//       doc.internal.pageSize.height - 10,
//       { align: "center" },
//     )

//     // Save PDF
//     doc.save(`expenses_report_${expenseReportNumber}.pdf`)
//   }

//   return (
//     <Button
//       onClick={generateExpensesPDF}
//       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium w-full md:w-auto"
//     >
//       Expenses Report
//     </Button>
//   )
// }

// export default InvoiceButton

