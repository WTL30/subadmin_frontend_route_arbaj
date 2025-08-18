// import { pdf } from '@react-pdf/renderer';
// import InvoicePDF from '../../components/InvoicePDF'; // Adjust this path as needed
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const {
//       item,
//       cabData,
//       companyInfo,
//       companyLogo,
//       signature,
//       subCompanyName,
//       invoiceNumber,
//       derivePrefix,
//     } = body;

//     const invoiceId =
//       invoiceNumber ||
//       `${derivePrefix}-${String(item.invoiceSerial || 0).padStart(5, '0')}`;

//     const invoiceDocument = (
//       <InvoicePDF
//         cabData={cabData}
//         trip={item}
//         companyLogo={companyLogo}
//         signature={signature}
//         companyPrefix={derivePrefix}
//         companyInfo={companyInfo}
//         companyName={subCompanyName}
//         invoiceNumber={invoiceId}
//         invoiceDate={new Date().toLocaleDateString('en-IN')}
//       />
//     );

//     const buffer = await pdf(invoiceDocument).toBuffer();

//     return new NextResponse(buffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename=Invoice-${item?.cab?.cabNumber}.pdf`,
//       },
//     });
//   } catch (error) {
//     console.error('Server PDF generation error:', error);
//     return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
//   }
// }



import { pdf } from "@react-pdf/renderer"
import InvoicePDF from "../../components/InvoicePDF" // Adjust this path as needed
import { NextResponse } from "next/server"

// Helper function to get financial year
const getFinancialYear = () => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 0-based index, so +1
  const currentYear = now.getFullYear()
  const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1
  const fyEnd = fyStart + 1
  const fyStartShort = fyStart.toString().slice(-2) // "25"
  const fyEndShort = fyEnd.toString().slice(-2) // "26"
  return `${fyStartShort}${fyEndShort}` // "2526"
}

// Helper function to derive prefix (now on server)
const derivePrefix = (name) => {
  if (!name) return "INV"
  const nameParts = name.trim().split(" ")
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .replace(/[^A-Z]/g, "")
    .slice(0, 3) // e.g. "REP" from "R K Enterprise"
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      item,
      companyInfo,
      companyLogo,
      signature,
      subCompanyName,
      // derivePrefix is no longer received from client
    } = body

    // Generate report number dynamically on the server
    const prefix = derivePrefix(subCompanyName) // Use the local derivePrefix function
    const finYear = getFinancialYear()
    // Use a simple counter for uniqueness within the session, or a more robust ID from backend
    // For a real application, this should come from a database to ensure uniqueness across sessions/servers
    global.expenseReportCounter = (global.expenseReportCounter || 0) + 1 // Increment global counter
    const reportNum = global.expenseReportCounter

    const reportNumber = `${prefix}${reportNum}/${finYear}` // Adjusted format to match EXP/YYYY-YY

    const invoiceDocument = (
      <InvoicePDF
        trip={item} // Pass the entire item as trip
        cabData={item.CabDetail} // Pass CabDetail separately if needed, though InvoicePDF now primarily uses trip
        companyLogo={companyLogo}
        signature={signature}
        companyInfo={companyInfo}
        companyName={subCompanyName}
        reportNumber={reportNumber} // Pass the generated report number
      />
    )

    const buffer = await pdf(invoiceDocument).toBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=ExpenseReport-${item?.CabDetail?.cabNumber || "N/A"}.pdf`,
      },
    })
  } catch (error) {
    console.error("Server PDF generation error:", error)
    // Return a more descriptive error message to the client
    return NextResponse.json({ error: `Failed to generate PDF: ${error.message || error.toString()}` }, { status: 500 })
  }
}
