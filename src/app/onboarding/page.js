"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";

export default function Onboarding() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    companyAddress: "",
    companyType: "retail",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/");
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().onboardingComplete) {
        router.push("/home");
      }
    };

    checkOnboarding();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        onboardingComplete: true,
        updatedAt: new Date(),
      });

      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Address</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={formData.companyAddress}
              onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Type</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={formData.companyType}
              onChange={(e) => setFormData({...formData, companyType: e.target.value})}
            >
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}