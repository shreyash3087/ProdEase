import Link from "next/link";
import { 
  ShoppingCartIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="pt-20 pb-12">
      <section className="text-center py-20 bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Simplify Retail Management with
            <br />
            <span className="text-purple-200">ProdEase</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Smart inventory tracking and automated invoicing solutions
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg">
              Get Started Free
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Powerful Features for Retail Success
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Real-Time Inventory"
            icon={<ShoppingCartIcon className="h-8 w-8 text-blue-600" />}
            description="Track stock levels with barcode scanning and automated alerts"
          />
          <FeatureCard 
            title="Instant Invoicing"
            icon={<DocumentTextIcon className="h-8 w-8 text-blue-600" />}
            description="Generate professional invoices in seconds"
          />
          <FeatureCard 
            title="Vendor Tracking"
            icon={<UserCircleIcon className="h-8 w-8 text-blue-600" />}
            description="Manage suppliers and purchase orders efficiently"
          />
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <StatCard 
            title="Low Stock Items"
            value="15"
            description="Needing restock"
            color="text-red-500"
          />
          <StatCard 
            title="Weekly Sales"
            value="$8,420"
            description="Revenue generated"
            color="text-green-500"
          />
          <StatCard 
            title="Active Vendors"
            value="23"
            description="Partnerships"
            color="text-yellow-500"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, icon, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 mb-4 bg-blue-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ title, value, description, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
      <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}