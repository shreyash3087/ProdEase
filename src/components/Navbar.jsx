"use client"
import React, { useEffect, useState } from "react";
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  ShoppingCartIcon, 
  UserCircleIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { signOut } from "../../lib/firebase";

function NavLink({ href, icon, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        isActive ? "bg-purple-900" : "hover:bg-purple-800"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (pathname === "/" || pathname === "/auth") return null;

  return (
    <div className="bg-gradient-to-r from-purple-700 to-purple-800 text-white shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-wide">
              Prod<span className="text-purple-300">Ease</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/dashboard" icon={<ChartBarIcon className="h-5 w-5" />}>
              Dashboard
            </NavLink>
            <NavLink href="/inventory" icon={<HomeIcon className="h-5 w-5" />}>
              Inventory
            </NavLink>
            <NavLink href="/invoices" icon={<DocumentTextIcon className="h-5 w-5" />}>
              Invoices
            </NavLink>
            <NavLink href="/orders" icon={<ShoppingCartIcon className="h-5 w-5" />}>
              Orders
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-lg hover:bg-purple-500 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="h-8 w-px bg-purple-400"></div>
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-purple-500 p-2 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <UserCircleIcon className="h-7 w-7" />
                <span className="hidden md:inline">Logout</span>
              </button>
            ) : (
              <Link 
                href="/auth"
                className="flex items-center space-x-2 hover:bg-purple-500 p-2 rounded-lg transition-colors"
                aria-label="Login"
              >
                <UserCircleIcon className="h-7 w-7" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;