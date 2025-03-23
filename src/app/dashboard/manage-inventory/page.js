"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { firestore } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function ManageInventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(firestore, "products"));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle stock update
  const handleStockUpdate = async () => {
    if (!editProduct || !newStock) return;

    try {
      const productRef = doc(firestore, "products", editProduct.id);
      await updateDoc(productRef, {
        stock: Number(newStock),
      });
      toast.success("Stock updated successfully");
      setEditProduct(null);
      setNewStock("");
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      await deleteDoc(doc(firestore, "products", deleteProduct.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      toast.success("Product deleted successfully");
      setDeleteProduct(null);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.upc.includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Inventory</h1>
          <button
            onClick={() => router.push("/dashboard/add-product")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search products by name, UPC, or SKU"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">UPC</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Vendor</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4 font-mono">{product.upc}</td>
                  <td className="px-6 py-4">{product.sku || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        product.stock < 10
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">${product.price?.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.vendor || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditProduct(product);
                          setNewStock(product.stock);
                        }}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteProduct(product)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No products found matching your search
            </div>
          )}
        </div>

        {/* Edit Stock Modal */}
        {editProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Update Stock</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Stock
                  </label>
                  <p className="font-mono">{editProduct.stock}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Stock
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditProduct(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStockUpdate}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
              <p className="mb-4">
                Are you sure you want to delete {deleteProduct.name}?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteProduct(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
