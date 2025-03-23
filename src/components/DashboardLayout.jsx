"use client"
import { usePathname } from "next/navigation";
import { 
  ChartBarIcon,
  CubeIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#035d4e] text-white fixed h-full">
        <div className="p-6">
          <a href="/home">
          <h2 className="text-2xl font-bold">
            Prod<span className="text-[#3edac0]">Ease</span>
          </h2>
          </a>
        </div>
        <nav className="mt-8 space-y-1 px-4">
          <NavLink href="/dashboard" icon={<ChartBarIcon className="h-5 w-5" />}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/manage-inventory" icon={<CubeIcon className="h-5 w-5" />}>
            Manage Inventory
          </NavLink>
          <NavLink href="/dashboard/add-product" icon={<PlusCircleIcon className="h-5 w-5" />}>
            Add Product
          </NavLink>
          <NavLink href="/dashboard/invoices" icon={<DocumentTextIcon className="h-5 w-5" />}>
            Invoices
          </NavLink>
          
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, icon, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#07a68c] text-white' : 'hover:bg-[#07a68c]/50'
      }`}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}