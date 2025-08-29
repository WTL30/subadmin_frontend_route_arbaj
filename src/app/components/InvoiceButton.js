
// "use client"
// import { useState } from "react"
// import { jsPDF } from "jspdf"
// import autoTable from "jspdf-autotable"

// const InvoiceButton = ({ item, companyLogo, signature, subCompanyName, companyInfo }) => {
//   const [isGenerating, setIsGenerating] = useState(false)

//   const derivePrefix = (name) => {
//     if (!name) return "INV"
//     const nameParts = name.trim().split(" ")
//     return nameParts
//       .map((part) => part.charAt(0).toUpperCase())
//       .join("")
//       .replace(/[^A-Z]/g, "")
//       .slice(0, 3)
//   }

//   // Generate report number in format PREFIX/YYYY-YY
//   const generateReportNumber = (companyName) => {
//     const prefix = derivePrefix(companyName)
//     const now = new Date()
//     const currentMonth = now.getMonth() + 1
//     const currentYear = now.getFullYear()
//     const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1
//     const fyEnd = fyStart + 1
//     const fyStartShort = fyStart.toString().slice(-2)
//     const fyEndShort = fyEnd.toString().slice(-2)
//     const finYear = `${fyStartShort}${fyEndShort}`

//     let reportCounter = Number.parseInt(localStorage.getItem("expenseReportCounter") || "1")
//     const reportNum = reportCounter
//     reportCounter++
//     localStorage.setItem("expenseReportCounter", reportCounter.toString())

//     return `${prefix}${reportNum}/${finYear}`
//   }

//   // Calculate total expenses from the main item object
//   const calculateTotalExpenses = () => {
//     const fuel = Number.parseFloat(item.fuelAmount || "0") || 0
//     const fastTag = Number.parseFloat(item.fastTagAmount || "0") || 0
//     const tyre = Number.parseFloat(item.tyreRepairAmount || "0") || 0
//     const servicing = Number.parseFloat(item.servicingAmount || "0") || 0
//     const other = Number.parseFloat(item.otherAmount || "0") || 0

//     return {
//       fuel: fuel.toFixed(2),
//       fastTag: fastTag.toFixed(2),
//       tyre: tyre.toFixed(2),
//       servicing: servicing.toFixed(2),
//       other: other.toFixed(2),
//       total: (fuel + fastTag + tyre + servicing + other).toFixed(2),
//     }
//   }

//   // Helper function to convert image URL to base64
//   const convertImageToBase64 = (imageUrl) => {
//     return new Promise((resolve, reject) => {
//       if (!imageUrl) {
//         console.log("No image URL provided")
//         resolve(null)
//         return
//       }

//       console.log("Converting image to base64:", imageUrl)

//       // If it's already a data URL, return as is
//       if (imageUrl.startsWith('data:')) {
//         console.log("Image is already base64")
//         resolve(imageUrl)
//         return
//       }

//       // Create a new image element
//       const img = new Image()
//       img.crossOrigin = 'anonymous' // Handle CORS issues

//       img.onload = () => {
//         try {
//           console.log("Image loaded successfully, converting to base64")
//           const canvas = document.createElement('canvas')
//           const ctx = canvas.getContext('2d')

//           // Set canvas dimensions to match image
//           canvas.width = img.naturalWidth || img.width
//           canvas.height = img.naturalHeight || img.height

//           // Draw image on canvas
//           ctx.drawImage(img, 0, 0)

//           // Convert to base64
//           const dataURL = canvas.toDataURL('image/jpeg', 0.8)
//           console.log("Image converted to base64 successfully")
//           resolve(dataURL)
//         } catch (error) {
//           console.error('Failed to convert image to base64:', error)
//           resolve(null)
//         }
//       }

//       img.onerror = (error) => {
//         console.error('Failed to load image:', imageUrl, error)
//         resolve(null)
//       }

//       // Set the image source
//       img.src = imageUrl
//     })
//   }

//   // Generate Professional Expenses Report PDF
//   const generateExpensesPDF = async () => {
//     setIsGenerating(true)
//     try {
//       console.log("Starting PDF generation...")
//       console.log("Company Logo URL:", companyLogo)
//       console.log("Signature URL:", signature)

//       const doc = new jsPDF()
//       const expenses = calculateTotalExpenses()
//       const reportDate = new Date(item.assignedAt).toLocaleDateString() || new Date().toLocaleDateString()
//       const currentReportNumber = generateReportNumber(subCompanyName)

//       const pageWidth = doc.internal.pageSize.getWidth()
//       const pageHeight = doc.internal.pageSize.getHeight()
//       const margin = 15
//       const contentWidth = pageWidth - (2 * margin)
//       let currentY = margin

//       // Professional Corporate Color Scheme
//       const colors = {
//         primary: [70, 130, 180],      // Light Steel Blue
//         secondary: [100, 149, 237],   // Light Cornflower Blue
//         accent: [135, 206, 235],      // Light Sky Blue
//         text: [25, 25, 25],           // Professional Black
//         lightBorder: [100, 149, 237], // Light Professional Blue Border
//         headerBg: [70, 130, 180],     // Light Steel Blue Header
//         success: [60, 179, 113],      // Light Medium Sea Green
//         white: [255, 255, 255],       // White
//         lightSuccess: [220, 252, 231], // Light Success Background
//         darkBorder: [70, 130, 180],   // Light Professional Border
//         silverGray: [248, 250, 252]   // Professional Light Gray
//       }

//       // Convert images to base64 with proper error handling
//       console.log("Converting images to base64...")
//       const logoBase64 = await convertImageToBase64(companyLogo)
//       const signatureBase64 = await convertImageToBase64(signature)

//       console.log("Logo conversion result:", logoBase64 ? "Success" : "Failed")
//       console.log("Signature conversion result:", signatureBase64 ? "Success" : "Failed")

//       // === OUTER BORDER ===
//       doc.setDrawColor(...colors.darkBorder)
//       doc.setLineWidth(1.2)
//       doc.rect(margin, margin, contentWidth, pageHeight - (2 * margin))

//       // === HEADER SECTION ===
//       const headerHeight = 35
//       // Header background - Professional Dark Blue
//       doc.setFillColor(...colors.headerBg)
//       doc.rect(margin + 1, margin + 1, contentWidth - 2, headerHeight, 'F')

//       // Company Logo (Left side) - INCREASED HEIGHT
//       if (logoBase64) {
//         try {
//           console.log("Adding logo to PDF...")
//           // Increased height from 15 to 22
//           doc.addImage(logoBase64, "JPEG", margin + 8, currentY + 6, 30, 22)
//           console.log("Logo added successfully")
//         } catch (e) {
//           console.error("Failed to add logo to PDF:", e)
//           // Add placeholder text for logo
//           doc.setFontSize(8)
//           doc.setFont("helvetica", "bold")
//           doc.setTextColor(255, 255, 255)
//           doc.text("LOGO", margin + 8, currentY + 16)
//         }
//       } else {
//         console.log("No logo available, adding placeholder")
//         // Add placeholder text for logo
//         doc.setFontSize(8)
//         doc.setFont("helvetica", "bold")
//         doc.setTextColor(255, 255, 255)
//         doc.text("LOGO", margin + 8, currentY + 16)
//       }

//       // Company Details (Right side)
//       const rightStartX = pageWidth - margin - 8
//       doc.setFontSize(12)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(255, 255, 255) // White text on dark header
//       const companyName = subCompanyName || "Fleet Management Company"
//       doc.text(companyName, rightStartX, currentY + 10, { align: "right" })

//       // Company info with proper spacing
//       doc.setFontSize(8)
//       doc.setFont("helvetica", "normal")
//       doc.setTextColor(220, 220, 220) // Light gray text on dark header
//       const companyDetails = companyInfo ||
//         "Complete Fleet Management Solutions\nAddress Line 1, City, State - 000000\nPhone: +91-0000000000"
//       const companyLines = companyDetails.split('\n')
//       let infoY = currentY + 15
//       companyLines.forEach((line) => {
//         if (infoY < currentY + 28) {
//           doc.text(line, rightStartX, infoY, { align: "right" })
//           infoY += 3
//         }
//       })

//       // Date and Report Number (with increased spacing)
//       doc.setFontSize(9)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(255, 255, 255) // White text on dark header
//       doc.text(`Date: ${reportDate}`, rightStartX, currentY + 30, { align: "right" })
//       doc.text(`Report No: ${currentReportNumber}`, rightStartX, currentY + 34, { align: "right" })

//       currentY += headerHeight + 10

//       // === COMPACT CUSTOMER & TRIP INFO TABLE ===
//       autoTable(doc, {
//         startY: currentY,
//         head: [["Customer Information", "Trip Details"]],
//         body: [
//           [
//             `Name: ${item.customerName || "N/A"}`,
//             `Pickup: ${item.pickupLocation || item.locationFrom || "N/A"}`,
//           ],
//           [
//             `Phone: ${item.customerPhone || "N/A"}`,
//             `Drop: ${item.dropLocation || item.locationTo || "N/A"}`,
//           ],
//           [
//             `Email: ${item.customerEmail || "N/A"}`,
//             `Distance: ${item.estimatedDistance || item.totalDistance || "0"} KM`,
//           ],
//           [
//             `Trip Type: ${item.tripType || "N/A"}`,
//             `Trip Date: ${new Date(item.assignedAt).toLocaleDateString() || "N/A"}`
//           ],
//           [
//             `Vehicle: ${item.vehicleType || "N/A"}`,
//             `Fare: ${item.estimatedFare || "0"}`
//           ],
//         ],
//         theme: "striped",
//         styles: {
//           fontSize: 8,
//           cellPadding: 2.5,
//           lineWidth: 0.2,
//           textColor: colors.text,
//           lineColor: colors.lightBorder,
//         },
//         headStyles: {
//           fillColor: colors.secondary,
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//           fontSize: 9,
//         },
//         alternateRowStyles: {
//           fillColor: colors.silverGray,
//         },
//         columnStyles: {
//           0: { cellWidth: (contentWidth - 8) / 2 },
//           1: { cellWidth: (contentWidth - 8) / 2 },
//         },
//         margin: { left: margin + 4, right: margin + 4 },
//         tableWidth: contentWidth - 8,
//       })

//       currentY = doc.lastAutoTable.finalY + 4

//       const cardWidth = (contentWidth - 16) / 2
//       const cardHeight = 30 // increased from 26 to fit extra spacing
//       const cardSpacing = 8

//       // Driver Card
//       doc.setDrawColor(...colors.lightBorder)
//       doc.setLineWidth(0.5)
//       doc.setFillColor(...colors.white)
//       doc.rect(margin + 4, currentY, cardWidth, cardHeight, 'FD')

//       // Driver card header
//       doc.setFillColor(...colors.secondary)
//       doc.rect(margin + 4, currentY, cardWidth, 7, 'F')
//       doc.setFontSize(8)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(255, 255, 255) // White text on professional blue header
//       doc.text("Driver Information", margin + 4 + cardWidth / 2, currentY + 4, { align: "center" })

//       // Driver Info lines with extra spacing
//       doc.setFontSize(8)
//       doc.setFont("helvetica", "normal")
//       doc.setTextColor(...colors.text)
//       doc.text(`Name: ${item.Driver?.name || "N/A"}`, margin + 7, currentY + 10)
//       doc.text(`License: ${item.Driver?.licenseNo || "N/A"}`, margin + 7, currentY + 16)
//       doc.text(`Phone: ${item.Driver?.phone || "N/A"}`, margin + 7, currentY + 22)
//       doc.text(`Experience: ${item.Driver?.experience || "N/A"} years`, margin + 7, currentY + 28)

//       // Vehicle Card
//       const vehicleCardX = margin + 4 + cardWidth + cardSpacing
//       doc.setDrawColor(...colors.lightBorder)
//       doc.setFillColor(...colors.white)
//       doc.rect(vehicleCardX, currentY, cardWidth, cardHeight, 'FD')

//       // Vehicle card header
//       doc.setFillColor(...colors.secondary)
//       doc.rect(vehicleCardX, currentY, cardWidth, 7, 'F')
//       doc.setFontSize(8)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(255, 255, 255) // White text on professional blue header
//       doc.text("Vehicle Information", vehicleCardX + cardWidth / 2, currentY + 4, { align: "center" })

//       // Vehicle Info lines with extra spacing
//       doc.setFontSize(8)
//       doc.setFont("helvetica", "normal")
//       doc.setTextColor(...colors.text)
//       doc.text(`Cab Number: ${item.CabsDetail?.cabNumber || "N/A"}`, vehicleCardX + 2, currentY + 10)
//       doc.text(`Model: ${item.vehicleType || "N/A"}`, vehicleCardX + 2, currentY + 16)
//       doc.text(`Year: ${item.CabsDetail?.year || "N/A"}`, vehicleCardX + 2, currentY + 22)
//       doc.text(`Fuel Type: ${item.CabsDetail?.fuel_type || "N/A"}`, vehicleCardX + 2, currentY + 28)

//       currentY += cardHeight + 4

//       // === EXPENSES BREAKDOWN ===
//       doc.setFontSize(10)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(...colors.secondary) // Professional blue for section header
//       doc.text("EXPENSES BREAKDOWN", margin + 6, currentY + 2)

//       autoTable(doc, {
//         startY: currentY + 5,
//         head: [["Expense Type", "Details", "Amount "]],
//         body: [
//           ["Fuel", item.fuelDetails || "N/A", expenses.fuel],
//           ["Toll/FastTag", item.fastTagDetails || "N/A", expenses.fastTag],
//           ["Tyre Repair", item.tyreRepairDetails || "N/A", expenses.tyre],
//           ["Vehicle Servicing", item.servicingDetails || "N/A", expenses.servicing],
//           ["Other Expenses", item.otherExpenseDetails || "N/A", expenses.other],
//         ],
//         theme: "striped",
//         styles: {
//           fontSize: 8,
//           cellPadding: 2.5,
//           lineWidth: 0.2,
//           textColor: colors.text,
//           lineColor: colors.lightBorder,
//         },
//         headStyles: {
//           fillColor: colors.secondary,
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//           fontSize: 9,
//         },
//         alternateRowStyles: {
//           fillColor: colors.silverGray,
//         },
//         columnStyles: {
//           0: { cellWidth: 40, fontStyle: "bold" },
//           1: { cellWidth: contentWidth - 88 },
//           2: { cellWidth: 40, halign: "right", fontStyle: "bold" },
//         },
//         margin: { left: margin + 4, right: margin + 4 },
//         tableWidth: contentWidth - 8,
//       })

//       currentY = doc.lastAutoTable.finalY + 4

//       // === TOTAL SECTION ===
//       const totalBoxHeight = 15
//       const totalBoxWidth = contentWidth - 8
//       // Professional Forest Green for total section
//       doc.setFillColor(...colors.success)
//       doc.setDrawColor(...colors.success)
//       doc.rect(margin + 4, currentY, totalBoxWidth, totalBoxHeight, 'FD')

//       doc.setFontSize(11)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(255, 255, 255) // White text on green background
//       doc.text("TOTAL EXPENSES:", margin + 8, currentY + 6)

//       // Properly calculate right position for total amount
//       const totalAmount = `${expenses.total}`
//       const rightPosition = margin + 4 + totalBoxWidth - 8
//       doc.text(totalAmount, rightPosition, currentY + 6, { align: "right" })

//       doc.setFontSize(7)
//       doc.text("All amounts in Indian Rupees ", margin + 8, currentY + 11)

//       currentY += totalBoxHeight + 6

//       // === COMPACT SIGNATURE SECTION ===
//       const signatureBoxWidth = 60
//       const signatureBoxHeight = 32 // Increased from 28 to accommodate larger signature
//       const signatureBoxX = pageWidth - margin - signatureBoxWidth - 4

//       // Light background only, no border
//       doc.setFillColor(...colors.silverGray)
//       doc.rect(signatureBoxX, currentY, signatureBoxWidth, signatureBoxHeight, 'F')

//       doc.setFontSize(9)
//       doc.setFont("helvetica", "bold")
//       doc.setTextColor(...colors.text)

//       // Signature Image - INCREASED HEIGHT
//       if (signatureBase64) {
//         try {
//           console.log("Adding signature to PDF...")
//           // Increased height from 12 to 18 and adjusted Y position
//           doc.addImage(signatureBase64, "JPEG", signatureBoxX + 8, currentY + 4, 44, 18)
//           console.log("Signature added successfully")
//         } catch (e) {
//           console.error("Failed to add signature to PDF:", e)
//           // Add placeholder text for signature
//           doc.setFontSize(8)
//           doc.setTextColor(...colors.text)
//           doc.text("Signature", signatureBoxX + signatureBoxWidth / 2, currentY + 12, { align: "center" })
//         }
//       } else {
//         console.log("No signature available, adding placeholder")
//         // Add placeholder text for signature
//         doc.setFontSize(8)
//         doc.setTextColor(...colors.text)
//         doc.text("Signature", signatureBoxX + signatureBoxWidth / 2, currentY + 12, { align: "center" })
//       }

//       // Signature line - Professional Blue (adjusted position for larger signature)
//       doc.setDrawColor(...colors.secondary)
//       doc.setLineWidth(0.5)
//       doc.line(signatureBoxX + 8, currentY + 24, signatureBoxX + 52, currentY + 24)

//       doc.setFontSize(7)
//       doc.setFont("helvetica", "normal")
//       doc.setTextColor(...colors.text)
//       doc.text("Authorized Signatory", signatureBoxX + signatureBoxWidth / 2, currentY + 27, { align: "center" })
//       doc.text(`Date: ${reportDate}`, signatureBoxX + signatureBoxWidth / 2, currentY + 30, { align: "center" })

//       // === FOOTER ===
//       const footerY = pageHeight - margin - 8
//       // Footer separator - Professional Blue
//       doc.setDrawColor(...colors.secondary)
//       doc.setLineWidth(0.3)
//       doc.line(margin + 4, footerY - 3, pageWidth - margin - 4, footerY - 3)

//       doc.setFontSize(6)
//       doc.setFont("helvetica", "normal")
//       doc.setTextColor(...colors.text)
//       const footerText =
//         "This is a computer-generated expenses report. All amounts are subject to verification and approval. " +
//         `Report generated on: ${new Date().toLocaleString("en-IN")} | For queries, contact the fleet management team.`

//       const footerLines = doc.splitTextToSize(footerText, contentWidth - 8)
//       doc.text(footerLines, pageWidth / 2, footerY - 1, { align: "center" })

//       // Save PDF
//       console.log("Saving PDF...")
//       doc.save(`expenses_report_${currentReportNumber}.pdf`)
//       console.log("PDF saved successfully")

//     } catch (error) {
//       console.error("PDF generation error:", error)
//       alert(`Failed to generate expense report PDF: ${error.message}`)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <button
//       onClick={generateExpensesPDF}
//       disabled={isGenerating}
//       className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm transition-all duration-200 font-medium w-full md:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       {isGenerating ? (
//         <span className="flex items-center gap-2 justify-center">
//           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//           </svg>
//           Generating Report...
//         </span>
//       ) : (
//         "Report Expenses"
//       )}
//     </button>
//   )
// }

// export default InvoiceButton



"use client"
import { useState } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const InvoiceButton = ({ item, companyLogo, signature, subCompanyName, companyInfo, servicingData }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const derivePrefix = (name) => {
    if (!name) return "INV"
    const nameParts = name.trim().split(" ")
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .replace(/[^A-Z]/g, "")
      .slice(0, 3)
  }

  // Generate report number in format PREFIX/YYYY-YY
  const generateReportNumber = (companyName) => {
    const prefix = derivePrefix(companyName)
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1
    const fyEnd = fyStart + 1
    const fyStartShort = fyStart.toString().slice(-2)
    const fyEndShort = fyEnd.toString().slice(-2)
    const finYear = `${fyStartShort}${fyEndShort}`

    let reportCounter = Number.parseInt(localStorage.getItem("expenseReportCounter") || "1")
    const reportNum = reportCounter
    reportCounter++
    localStorage.setItem("expenseReportCounter", reportCounter.toString())

    return `${prefix}${reportNum}/${finYear}`
  }

  // Calculate total expenses from the main item object
  const calculateTotalExpenses = () => {
    // Handle array values by summing them up
    const sumArray = (arr) => {
      if (!arr || !Array.isArray(arr)) return 0;
      return arr.reduce((sum, val) => sum + (Number.parseFloat(val) || 0), 0);
    };

    const fuel = sumArray(item.fuelAmount);
    const fastTag = sumArray(item.fastTagAmount);
    const tyre = sumArray(item.tyreRepairAmount);
    
    // Use servicing data from props if available (nested structure: servicingData.servicing.servicingAmount)
    const servicing = servicingData?.servicing?.servicingAmount 
      ? Number.parseFloat(servicingData.servicing.servicingAmount) || 0
      : sumArray(item.servicingAmount);
      
    const other = sumArray(item.otherAmount);

    return {
      fuel: fuel.toFixed(2),
      fastTag: fastTag.toFixed(2),
      tyre: tyre.toFixed(2),
      servicing: servicing.toFixed(2),
      other: other.toFixed(2),
      total: (fuel + fastTag + tyre + servicing + other).toFixed(2),
    };
  }

  // Helper function to convert image URL to base64
  const convertImageToBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
      if (!imageUrl) {
        console.log("No image URL provided")
        resolve(null)
        return
      }

      console.log("Converting image to base64:", imageUrl)

      // If it's already a data URL, return as is
      if (imageUrl.startsWith('data:')) {
        console.log("Image is already base64")
        resolve(imageUrl)
        return
      }

      // Create a new image element
      const img = new Image()
      img.crossOrigin = 'anonymous' // Handle CORS issues

      img.onload = () => {
        try {
          console.log("Image loaded successfully, converting to base64")
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Set canvas dimensions to match image
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height

          // Draw image on canvas
          ctx.drawImage(img, 0, 0)

          // Convert to base64
          const dataURL = canvas.toDataURL('image/jpeg', 0.8)
          console.log("Image converted to base64 successfully")
          resolve(dataURL)
        } catch (error) {
          console.error('Failed to convert image to base64:', error)
          resolve(null)
        }
      }

      img.onerror = (error) => {
        console.error('Failed to load image:', imageUrl, error)
        resolve(null)
      }

      // Set the image source
      img.src = imageUrl
    })
  }

  // Generate Professional Expenses Report PDF
  const generateExpensesPDF = async () => {
    setIsGenerating(true)
    try {
      console.log("Starting PDF generation...")
      console.log("Company Logo URL:", companyLogo)
      console.log("Signature URL:", signature)

      const doc = new jsPDF()
      const expenses = calculateTotalExpenses()
      const reportDate = new Date(item.assignedAt).toLocaleDateString() || new Date().toLocaleDateString()
      const currentReportNumber = generateReportNumber(subCompanyName)

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - (2 * margin)
      let currentY = margin

      // Professional Corporate Color Scheme
      const colors = {
        primary: [70, 130, 180],      // Light Steel Blue
        secondary: [100, 149, 237],   // Light Cornflower Blue
        accent: [135, 206, 235],      // Light Sky Blue
        text: [25, 25, 25],           // Professional Black
        lightBorder: [100, 149, 237], // Light Professional Blue Border
        headerBg: [70, 130, 180],     // Light Steel Blue Header
        success: [60, 179, 113],      // Light Medium Sea Green
        white: [255, 255, 255],       // White
        lightSuccess: [220, 252, 231], // Light Success Background
        darkBorder: [70, 130, 180],   // Light Professional Border
        silverGray: [248, 250, 252]   // Professional Light Gray
      }

      // Convert images to base64 with proper error handling
      console.log("Converting images to base64...")
      const logoBase64 = await convertImageToBase64(companyLogo)
      const signatureBase64 = await convertImageToBase64(signature)

      console.log("Logo conversion result:", logoBase64 ? "Success" : "Failed")
      console.log("Signature conversion result:", signatureBase64 ? "Success" : "Failed")

      // === OUTER BORDER ===
      doc.setDrawColor(...colors.darkBorder)
      doc.setLineWidth(1.2)
      doc.rect(margin, margin, contentWidth, pageHeight - (2 * margin))

      // === HEADER SECTION ===
      const headerHeight = 35
      // Header background - Professional Dark Blue
      doc.setFillColor(...colors.headerBg)
      doc.rect(margin + 1, margin + 1, contentWidth - 2, headerHeight, 'F')

      // Company Logo (Left side) - INCREASED HEIGHT
      if (logoBase64) {
        try {
          console.log("Adding logo to PDF...")
          // Increased height from 15 to 22
          doc.addImage(logoBase64, "JPEG", margin + 8, currentY + 6, 30, 22)
          console.log("Logo added successfully")
        } catch (e) {
          console.error("Failed to add logo to PDF:", e)
          // Add placeholder text for logo
          doc.setFontSize(8)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(255, 255, 255)
          doc.text("LOGO", margin + 8, currentY + 16)
        }
      } else {
        console.log("No logo available, adding placeholder")
        // Add placeholder text for logo
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(255, 255, 255)
        doc.text("LOGO", margin + 8, currentY + 16)
      }

      // Company Details (Right side)
      const rightStartX = pageWidth - margin - 8
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text on dark header
      const companyName = subCompanyName || "Fleet Management Company"
      doc.text(companyName, rightStartX, currentY + 10, { align: "right" })

      // Company info with proper spacing
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(220, 220, 220) // Light gray text on dark header
      const companyDetails = companyInfo ||
        "Complete Fleet Management Solutions\nAddress Line 1, City, State - 000000\nPhone: +91-0000000000"
      const companyLines = companyDetails.split('\n')
      let infoY = currentY + 15
      companyLines.forEach((line) => {
        if (infoY < currentY + 28) {
          doc.text(line, rightStartX, infoY, { align: "right" })
          infoY += 3
        }
      })

      // Date and Report Number (with increased spacing)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text on dark header
      doc.text(`Date: ${reportDate}`, rightStartX, currentY + 30, { align: "right" })
      doc.text(`Report No: ${currentReportNumber}`, rightStartX, currentY + 34, { align: "right" })

      currentY += headerHeight + 10

      // === COMPACT CUSTOMER & TRIP INFO TABLE ===
      autoTable(doc, {
        startY: currentY,
        head: [["Customer Information", "Trip Details"]],
        body: [
          [
            `Name: ${item.customerName || "N/A"}`,
            `Pickup: ${item.pickupLocation || item.locationFrom || "N/A"}`,
          ],
          [
            `Phone: ${item.customerPhone || "N/A"}`,
            `Drop: ${item.dropLocation || item.locationTo || "N/A"}`,
          ],
          [
            `Email: ${item.customerEmail || "N/A"}`,
            `Distance: ${item.estimatedDistance || item.totalDistance || "0"} KM`,
          ],
          [
            `Trip Type: ${item.tripType || "N/A"}`,
            `Trip Date: ${new Date(item.assignedAt).toLocaleDateString() || "N/A"}`
          ],
          [
            `Vehicle: ${item.vehicleType || "N/A"}`,
            `Fare: ${item.estimatedFare || "0"}`
          ],
        ],
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineWidth: 0.2,
          textColor: colors.text,
          lineColor: colors.lightBorder,
        },
        headStyles: {
          fillColor: colors.secondary,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: colors.silverGray,
        },
        columnStyles: {
          0: { cellWidth: (contentWidth - 8) / 2 },
          1: { cellWidth: (contentWidth - 8) / 2 },
        },
        margin: { left: margin + 4, right: margin + 4 },
        tableWidth: contentWidth - 8,
      })

      currentY = doc.lastAutoTable.finalY + 4

      const cardWidth = (contentWidth - 16) / 2
      const cardHeight = 30 // increased from 26 to fit extra spacing
      const cardSpacing = 8

      // Driver Card
      doc.setDrawColor(...colors.lightBorder)
      doc.setLineWidth(0.5)
      doc.setFillColor(...colors.white)
      doc.rect(margin + 4, currentY, cardWidth, cardHeight, 'FD')

      // Driver card header
      doc.setFillColor(...colors.secondary)
      doc.rect(margin + 4, currentY, cardWidth, 7, 'F')
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text on professional blue header
      doc.text("Driver Information", margin + 4 + cardWidth / 2, currentY + 4, { align: "center" })

      // Driver Info lines with extra spacing
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.text)
      doc.text(`Name: ${item.Driver?.name || "N/A"}`, margin + 7, currentY + 10)
      doc.text(`License: ${item.Driver?.licenseNo || "N/A"}`, margin + 7, currentY + 16)
      doc.text(`Phone: ${item.Driver?.phone || "N/A"}`, margin + 7, currentY + 22)
      doc.text(`Experience: ${item.Driver?.experience || "N/A"} years`, margin + 7, currentY + 28)

      // Vehicle Card
      const vehicleCardX = margin + 4 + cardWidth + cardSpacing
      doc.setDrawColor(...colors.lightBorder)
      doc.setFillColor(...colors.white)
      doc.rect(vehicleCardX, currentY, cardWidth, cardHeight, 'FD')

      // Vehicle card header
      doc.setFillColor(...colors.secondary)
      doc.rect(vehicleCardX, currentY, cardWidth, 7, 'F')
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text on professional blue header
      doc.text("Vehicle Information", vehicleCardX + cardWidth / 2, currentY + 4, { align: "center" })

      // Vehicle Info lines with extra spacing
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.text)
      doc.text(`Cab Number: ${item.CabsDetail?.cabNumber || "N/A"}`, vehicleCardX + 2, currentY + 10)
      doc.text(`Model: ${item.vehicleType || "N/A"}`, vehicleCardX + 2, currentY + 16)
      doc.text(`Year: ${item.CabsDetail?.year || "N/A"}`, vehicleCardX + 2, currentY + 22)
      doc.text(`Fuel Type: ${item.CabsDetail?.fuel_type || "N/A"}`, vehicleCardX + 2, currentY + 28)

      currentY += cardHeight + 4

      // === EXPENSES BREAKDOWN ===
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...colors.secondary) // Professional blue for section header
      doc.text("EXPENSES BREAKDOWN", margin + 6, currentY + 2)

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Expense Type", "Amount "]],
        body: [
          ["Fuel", expenses.fuel],
          ["Toll/FastTag", expenses.fastTag],
          ["Tyre Repair", expenses.tyre],
          ["Vehicle Servicing", expenses.servicing],
          ["Other Expenses", expenses.other],
        ],
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineWidth: 0.2,
          textColor: colors.text,
          lineColor: colors.lightBorder,
        },
        headStyles: {
          fillColor: colors.secondary,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: colors.silverGray,
        },
        columnStyles: {
          0: { cellWidth: contentWidth - 48, fontStyle: "bold" },
          1: { cellWidth: 40, halign: "right", fontStyle: "bold" },
        },
        margin: { left: margin + 4, right: margin + 4 },
        tableWidth: contentWidth - 8,
      })

      console.log("servicing amount", expenses.servicing )

      currentY = doc.lastAutoTable.finalY + 4

      // === TOTAL SECTION ===
      const totalBoxHeight = 15
      const totalBoxWidth = contentWidth - 8
      // Professional Forest Green for total section
      doc.setFillColor(...colors.success)
      doc.setDrawColor(...colors.success)
      doc.rect(margin + 4, currentY, totalBoxWidth, totalBoxHeight, 'FD')

      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text on green background
      doc.text("TOTAL EXPENSES:", margin + 8, currentY + 6)

      // Properly calculate right position for total amount
      const totalAmount = `${expenses.total}`
      const rightPosition = margin + 4 + totalBoxWidth - 8
      doc.text(totalAmount, rightPosition, currentY + 6, { align: "right" })

      doc.setFontSize(7)
      doc.text("All amounts in Indian Rupees ", margin + 8, currentY + 11)

      currentY += totalBoxHeight + 6

      // === COMPACT SIGNATURE SECTION ===
      const signatureBoxWidth = 60
      const signatureBoxHeight = 32 // Increased from 28 to accommodate larger signature
      const signatureBoxX = pageWidth - margin - signatureBoxWidth - 4

      // Light background only, no border
      doc.setFillColor(...colors.silverGray)
      doc.rect(signatureBoxX, currentY, signatureBoxWidth, signatureBoxHeight, 'F')

      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...colors.text)

      // Signature Image - INCREASED HEIGHT
      if (signatureBase64) {
        try {
          console.log("Adding signature to PDF...")
          // Increased height from 12 to 18 and adjusted Y position
          doc.addImage(signatureBase64, "JPEG", signatureBoxX + 8, currentY + 4, 44, 18)
          console.log("Signature added successfully")
        } catch (e) {
          console.error("Failed to add signature to PDF:", e)
          // Add placeholder text for signature
          doc.setFontSize(8)
          doc.setTextColor(...colors.text)
          doc.text("Signature", signatureBoxX + signatureBoxWidth / 2, currentY + 12, { align: "center" })
        }
      } else {
        console.log("No signature available, adding placeholder")
        // Add placeholder text for signature
        doc.setFontSize(8)
        doc.setTextColor(...colors.text)
        doc.text("Signature", signatureBoxX + signatureBoxWidth / 2, currentY + 12, { align: "center" })
      }

      // Signature line - Professional Blue (adjusted position for larger signature)
      doc.setDrawColor(...colors.secondary)
      doc.setLineWidth(0.5)
      doc.line(signatureBoxX + 8, currentY + 24, signatureBoxX + 52, currentY + 24)

      doc.setFontSize(7)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.text)
      doc.text("Authorized Signatory", signatureBoxX + signatureBoxWidth / 2, currentY + 27, { align: "center" })
      doc.text(`Date: ${reportDate}`, signatureBoxX + signatureBoxWidth / 2, currentY + 30, { align: "center" })

      // === FOOTER ===
      const footerY = pageHeight - margin - 8
      // Footer separator - Professional Blue
      doc.setDrawColor(...colors.secondary)
      doc.setLineWidth(0.3)
      doc.line(margin + 4, footerY - 3, pageWidth - margin - 4, footerY - 3)

      doc.setFontSize(6)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.text)
      const footerText =
        "This is a computer-generated expenses report. All amounts are subject to verification and approval. " +
        `Report generated on: ${new Date().toLocaleString("en-IN")} | For queries, contact the fleet management team.`

      const footerLines = doc.splitTextToSize(footerText, contentWidth - 8)
      doc.text(footerLines, pageWidth / 2, footerY - 1, { align: "center" })

      // Save PDF
      console.log("Saving PDF...")
      doc.save(`expenses_report_${currentReportNumber}.pdf`)
      console.log("PDF saved successfully")

    } catch (error) {
      console.error("PDF generation error:", error)
      alert(`Failed to generate expense report PDF: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generateExpensesPDF}
      disabled={isGenerating}
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm transition-all duration-200 font-medium w-full md:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generating Report...
        </span>
      ) : (
        "Report Expenses"
      )}
    </button>
  )
}

export default InvoiceButton