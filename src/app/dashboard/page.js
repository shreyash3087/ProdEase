"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { ClipLoader } from "react-spinners";

function Spinner() {
  return (
    <div className="flex w-full justify-center items-center h-screen">
      <ClipLoader color="#7C3AED" size={40} />
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Spinner />;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Inventory Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<CubeIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Low Stock Items"
          value={products.filter((p) => p.stock < 10).length}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Total Inventory Value"
          value={products
            .reduce((sum, p) => sum + p.price * p.stock, 0)
            .toLocaleString("en-IN", { style: "currency", currency: "INR" })}
          icon={<CurrencyRupeeIcon className="h-6 w-6" />}
        />
      </div>

      <InventoryTable products={products} />
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

function InventoryTable({ products }) {
  if (products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
        <CubeIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p>No products found in inventory</p>
        <a
          href="/dashboard/add-product"
          className="text-[#60ffe4] hover:underline mt-2 inline-block"
        >
          Add your first product
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-purple-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Product
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              UPC
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4 font-mono">{product.upc}</td>
              <td className="px-6 py-4">
                <StockIndicator stock={product.stock} />
              </td>
              <td className="px-6 py-4">
                {product.price?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockIndicator({ stock }) {
  const status =
    stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock";
  const color = stock === 0 ? "red" : stock < 10 ? "yellow" : "green";

  return (
    <div className="flex items-center space-x-2">
      <div className={`h-3 w-3 rounded-full bg-${color}-500`}></div>
      <span>{stock} units</span>
      <span className="text-sm text-gray-500">({status})</span>
    </div>
  );
}
