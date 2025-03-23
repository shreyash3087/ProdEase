"use client";
import { useState } from "react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { firestore } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { jsPDF } from "jspdf";
import { applyPlugin } from 'jspdf-autotable'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Invoices() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  // Add product to invoice via barcode scan
  const handleScan = async (upc) => {
    if (!upc) {
      toast.error("Invalid UPC format");
      return;
    }

    setShowScanner(false);
    console.log(upc, "Scanned UPC");

    try {
      // Query Firestore to find the product with the matching UPC
      const productsRef = collection(firestore, "products");
      const q = query(productsRef, where("upc", "==", upc));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there's only one product with the given UPC
        const productDoc = querySnapshot.docs[0];
        const product = productDoc.data();
        setInvoiceItems((prev) => [
          ...prev,
          {
            ...product,
            id: productDoc.id, // Store the document ID for future reference
            quantity: 1,
            total: product.price,
          },
        ]);
        toast.success("Product added to invoice");
      } else {
        toast.error("Product not found in inventory");
      }
    } catch (err) {
      toast.error("Failed to fetch product details");
      console.error("Error:", err);
    }
  };

  // Update quantity of an item
  const updateQuantity = (index, quantity) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total = quantity * updatedItems[index].price;
    setInvoiceItems(updatedItems);
  };

  // Remove item from invoice
  const removeItem = (index) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Generate PDF invoice
  const generatePDF = () => {
    applyPlugin(jsPDF);
    const doc = new jsPDF();
  
    // Colors
    const primaryColor = "#2c3e50";
    const secondaryColor = "#3498db";
    const accentColor = "#e74c3c";
  
    // Company Info
    const company = {
      name: "Tech Solutions Inc.",
      address: "123 Business Street\nNew York, NY 10001",
      phone: "(555) 123-4567",
      email: "sales@techsolutions.com",
    };
  
    // Styling
    doc.setFont("helvetica");
    doc.setFontSize(8);
  
    // Header Section
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 40, "F");
    
    // Logo
    if (company.logo) {
      doc.addImage(company.logo, "PNG", 10, 10, 30, 30);
    }
  
    // Company Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(company.name, 150, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(company.address, 150, 22);
    doc.text(`Phone: ${company.phone}`, 150, 30);
    doc.text(`Email: ${company.email}`, 150, 38);
  
    // Invoice Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("INVOICE", 10, 60);
    doc.setFontSize(10);
    doc.text(`Invoice #: ${Math.floor(1000 + Math.random() * 9000)}`, 10, 67);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 74);
  
    // Client Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 10, 90);
    doc.setFont("helvetica", "normal");
    doc.text(customerDetails.name, 10, 97);
    doc.text(customerDetails.address || "123 Client Street", 10, 104);
    doc.text(customerDetails.email, 10, 111);
    doc.text(customerDetails.phone, 10, 118);
  
    // Table Header
    const headers = [["Product", "Price", "Quantity", "Total"]];
    const body = invoiceItems.map(item => [
      item.name,
      `$₹{item.price.toFixed(2)}`,
      item.quantity,
      `$₹{item.total.toFixed(2)}`
    ]);
  
    // Add Table
    doc.autoTable({
      startY: 130,
      head: headers,
      body: body,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 10
      },
      columnStyles: {
        0: {cellWidth: 60},
        1: {cellWidth: 40},
        2: {cellWidth: 30},
        3: {cellWidth: 40}
      },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: "right"
      },
      bodyStyles: {
        textColor: 40
      },
      alternateRowStyles: {
        fillColor: 245
      },
      columns: [
        {header: "Product", dataKey: "product"},
        {header: "Price", dataKey: "price"},
        {header: "Quantity", dataKey: "quantity"},
        {header: "Total", dataKey: "total"}
      ]
    });
  
    // Summary Section
    const finalY = doc.autoTable.previous?finalY + 10:50;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Payment Summary", 140, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.setFontSize(10);
    
    doc.text("Subtotal:", 140, finalY + 10);
    doc.text(`$₹{subtotal.toFixed(2)}`, 180, finalY + 10);
    
    doc.text("Tax (10%):", 140, finalY + 18);
    doc.text(`$₹{tax.toFixed(2)}`, 180, finalY + 18);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentColor);
    doc.text("Total:", 140, finalY + 26);
    doc.text(`$₹{total.toFixed(2)}`, 180, finalY + 26);
  
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Thank you for your business!", 10, 280);
    doc.text("Terms: Payment due within 30 days", 10, 285);
    doc.text("Late payments subject to 5% monthly interest", 10, 290);
  
    // Save
    doc.save(`invoice_${Date.now()}.pdf`);
  };

  const saveInvoice = async () => {
    setLoading(true);
    try {
      // Save the invoice to Firestore
      await setDoc(doc(collection(firestore, "invoices")), {
        customer: customerDetails,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        createdAt: new Date(),
      });

      // Update stock for each product in the invoice
      for (const item of invoiceItems) {
        const productRef = doc(firestore, "products", item.id); // Use the document ID
        await updateDoc(productRef, {
          stock: increment(-item.quantity),
        });
      }

      toast.success("Invoice saved successfully");
      router.push("/invoices");
    } catch (err) {
      toast.error("Failed to save invoice");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Create Invoice
        </h1>
        {showScanner && (
          <div className="mb-8 bg-gray-100 p-4 rounded-lg relative">
            <button
              onClick={() => setShowScanner(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-purple-600 z-10"
            >
              ✕
            </button>
            <BarcodeScannerComponent
              width="80%"
              height="150"
              onUpdate={(err, result) => {
                if (result?.text) handleScan(result.text);
              }}
              torch={true}
              facingMode="environment"
              stopStream={!showScanner}
            />
            <p className="text-center mt-4 text-gray-600">
              Point camera at product barcode
            </p>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              className="p-2 border border-gray-300 rounded-lg"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Customer Email"
              className="p-2 border border-gray-300 rounded-lg"
              value={customerDetails.email}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  email: e.target.value,
                })
              }
            />
            <input
              type="tel"
              placeholder="Customer Phone"
              className="p-2 border border-gray-300 rounded-lg"
              value={customerDetails.phone}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  phone: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
          <button
            onClick={() => setShowScanner(true)}
            className="mb-4 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Scan Product
          </button>
          {invoiceItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                ₹{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  className="w-16 p-2 border border-gray-300 rounded-lg"
                />
                <p className="font-medium">₹{item.total.toFixed(2)}</p>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Invoice Summary</h2>
          <div className="space-y-2">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Tax (10%): ₹{tax.toFixed(2)}</p>
            <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={generatePDF}
            className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Download PDF
          </button>
          <button
            onClick={saveInvoice}
            disabled={loading || invoiceItems.length === 0}
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Invoice"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}