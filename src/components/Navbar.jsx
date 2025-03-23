"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Bell, User } from "react-feather";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (
    pathname === "/" ||
    pathname === "/auth" ||
    pathname.startsWith("/dashboard")
  )
    return null;

  const isActive = (href) => pathname === href;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/home"
          className="text-2xl font-extrabold text-[#4cae9e] flex items-center"
        >
          ProdEase
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink href="/dashboard" isActive={isActive("/dashboard")}>
            Dashboard
          </NavLink>
          <NavLink
            href="/dashboard/manage-inventory"
            isActive={isActive("/dashboard/manage-inventory")}
          >
            Inventory
          </NavLink>
          <NavLink
            href="/dashboard/invoices"
            isActive={isActive("/dashboard/invoices")}
          >
            Invoices
          </NavLink>
          <NavLink
            href="/dashboard/orders"
            isActive={isActive("/dashboard/orders")}
          >
            Orders
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="text-gray-800 hover:text-[#4cae9e] transition-colors">
            <Bell size={24} />
          </button>
          <div className="h-6 w-px bg-gray-300" />

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-[#4cae9e] px-4 py-2 rounded-lg text-white hover:bg-[#347c70] transition-colors flex items-center gap-2"
            >
              <User size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/auth"
              className="bg-[#4cae9e] px-4 py-2 rounded-lg text-white hover:bg-[#347c70] transition-colors flex items-center gap-2"
            >
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 hover:text-[#4cae9e]"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-4 pb-4 flex flex-col gap-2">
          <MobileNavLink href="/dashboard" isActive={isActive("/dashboard")}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink
            href="/dashboard/manage-inventory"
            isActive={isActive("/dashboard/manage-inventory")}
          >
            Inventory
          </MobileNavLink>
          <MobileNavLink
            href="/dashboard/invoices"
            isActive={isActive("/dashboard/invoices")}
          >
            Invoices
          </MobileNavLink>
          <MobileNavLink
            href="/dashboard/orders"
            isActive={isActive("/dashboard/orders")}
          >
            Orders
          </MobileNavLink>

          <div className="mt-4 border-t pt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-[#4cae9e] text-white py-2 rounded-lg hover:bg-[#347c70] transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="w-full bg-[#4cae9e] text-white py-2 rounded-lg hover:bg-[#347c70] transition-colors block text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
}

// Helper components
const NavLink = ({ href, children, isActive }) => (
  <Link
    href={href}
    className={`${
      isActive ? "text-[#4cae9e]" : "text-gray-800 hover:text-[#4cae9e]"
    } transition-colors`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, isActive }) => (
  <Link
    href={href}
    className={`${
      isActive
        ? "text-[#4cae9e] font-medium"
        : "text-gray-800 hover:text-[#4cae9e]"
    } py-2 transition-colors`}
  >
    {children}
  </Link>
);

export default Navbar;
