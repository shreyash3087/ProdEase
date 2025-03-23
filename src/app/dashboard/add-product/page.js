"use client";
import { useState } from "react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddProduct() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    upc: "",
    sku: "",
    stock: 0,
    price: 0,
    vendor: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  const handleScan = async (upc) => {
    if (!upc) {
      return;
    }

    setShowScanner(false);
    setScanLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/upcLookup?upc=${upc}`);
      if (response.data?.products?.length > 0) {
        const product = response.data.products[0];
        const price = product.stores?.length > 0 ? product.stores[0].price : 0;

        setFormData((prev) => ({
          ...prev,
          upc,
          name: product.title?.trim() || "",
          price: Number(price) || 0,
          vendor: product.brand?.trim() || "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, upc }));
        setError("Product not found - fill remaining fields manually");
      }
    } catch (err) {
      setError("Failed to fetch product details");
      console.error("API error:", err);
    } finally {
      setScanLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const docId = formData.name
        ? formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .substring(0, 50)
        : `product_${formData.upc}`;
      await setDoc(doc(firestore, "products", docId), {
        ...formData,
        createdAt: new Date(),
        stock: Number(formData.stock),
        price: Number(formData.price),
      });
      toast.success(`Product Added Successfully!`, { position: "top-right" });
    } catch (err) {
      setError(err.message);
      console.error("Firestore error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-full border border-green-100 flex mx-auto bg-white rounded-xl shadow-sm">
        <div className=" p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Add New Product
          </h1>

          {/* Scan Button */}
          {!showScanner && (
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="w-full py-3 px-6 bg-[#07a68c] text-white rounded-lg hover:bg-[#7ce4d3] cursor-pointer transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm3 1a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm0 5a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Scan Product Barcode
              </button>
            </div>
          )}

          {/* Loading State */}
          {scanLoading && (
            <div className="mb-6 text-center text-[#07a68c]">
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2">Looking up product details...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Product Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPC
                {formData.upc && (
                  <span className="ml-2 text-green-600 text-sm">✓ Scanned</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                  value={formData.upc}
                  onChange={(e) =>
                    setFormData({ ...formData, upc: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2 bg-[#07a68c] text-white rounded-lg hover:bg-[#07a68c] transition-colors"
                >
                  Scan
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Scan the Product's UPC
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor/Supplier
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#07a68c] focus:border-transparent"
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#07a68c] cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-[#498b80] transition-colors disabled:opacity-50"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
        <div className="w-full">
        {!showScanner && (
          <div className="text-sm text-center flex w-full border-l-[1px] m-4 border-gray-400 justify-center h-full items-center">
            Click on Scan to Start the Barcode Reader
          </div>
        )}
          {showScanner && (
            <div className="mb-8 bg-gray-100 p-4 rounded-lg relative">
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-[#07a68c] z-10"
              >
                ✕
              </button>
              <BarcodeScannerComponent
                width="100%"
                height="300"
                onUpdate={(err, result) => {
                  if (result?.text) {
                    handleScan(result.text);
                  }
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
        </div>
      </div>
    </DashboardLayout>
  );
}
