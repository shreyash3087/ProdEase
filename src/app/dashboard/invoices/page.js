"use client";
import { useState } from "react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { firestore } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "../../../../lib/firebase";
import "react-toastify/dist/ReactToastify.css";

export default function Invoices() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "N/A",
    email: "N/A",
    phone: "N/A",
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
  const generatePDF = async () => {
    try {
      applyPlugin(jsPDF);
      const pdfDoc = new jsPDF(); // Renamed variable to pdfDoc

      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Fetch user data from Firestore
      const userDocRef = doc(firestore, "users", user.uid); // Now using the correct Firestore doc
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User data not found");
        return;
      }

      const companyName = userDoc.data()?.companyName || "Your Company Name";
      const companyAddress =
        userDoc.data()?.companyAddress || "Your Company Address";

      // Invoice Header
      pdfDoc.setFontSize(18);
      pdfDoc.text("Invoice", 10, 10);
      pdfDoc.setFontSize(12);
      pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);

      // Company Details
      pdfDoc.setFontSize(12);
      pdfDoc.text(`Company Name: ${companyName}`, 10, 30);
      pdfDoc.text(`Company Name: ${companyAddress}`, 10, 40);

      // Customer Details
      pdfDoc.text(`Customer: ${customerDetails.name}`, 10, 60);
      pdfDoc.text(`Email: ${customerDetails.email}`, 10, 70);
      pdfDoc.text(`Phone: ${customerDetails.phone}`, 10, 80);

      // Invoice Items Table
      pdfDoc.autoTable({
        startY: 100,
        head: [["Product", "Price", "Quantity", "Total"]],
        body: invoiceItems.map((item) => [
          item.name,
          `Rs.${item.price.toFixed(2)}`,
          item.quantity,
          `Rs.${item.total.toFixed(2)}`,
        ]),
        headStyles: {
          fillColor: "#2c3e50",
          textColor: "#ffffff",
          fontSize: 10,
        },
        bodyStyles: {
          textColor: "#000000",
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: "#f5f5f5",
        },
      });

      const finalY = pdfDoc.autoTable.previous?.finalY || 150;

      // Invoice Summary
      pdfDoc.setFontSize(12);
      pdfDoc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`, 140, finalY + 10);
      pdfDoc.text(`Tax (10%): Rs.${tax.toFixed(2)}`, 140, finalY + 20);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text(`Total: Rs.${total.toFixed(2)}`, 140, finalY + 30);

      // Save the PDF
      pdfDoc.save(`invoice_${Date.now()}.pdf`);
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error("Error:", err);
    }
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
        const productRef = doc(firestore, "products", item.id);
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
            className="mb-4 py-2 px-4 bg-[#0a9b83] text-white rounded-lg hover:bg-[#0a9b83]"
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
            className="py-2 px-4 bg-[#0a9b83] text-white rounded-lg hover:bg-[#3d6f67]"
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
