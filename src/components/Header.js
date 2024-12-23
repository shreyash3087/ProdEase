"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "react-feather";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();  
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const isRegister = pathname && pathname.startsWith("/register"); 
  const isLogin = pathname && pathname.startsWith("/login");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-token');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.user !== null);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);
  
  useEffect(() => {
    if (pathname === '/dashboard') {

     setIsAuthenticated(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/'); 
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={`bg-white shadow-lg sticky top-0 z-50 ${isLogin || isRegister ? "hidden" : "block"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-extrabold text-[#4cae9e] flex items-center"
          >
            <img src="/logo.png" alt="Logo" width={40} /> ProdEase
          </Link>
        </div>

        <div className="hidden md:flex space-x-4 justify-center items-center">
          <Link
            href="/"
            className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/about"
              className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
            >
              About
            </Link>
          )}
          <Link
            href="/"
            className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout} 
                className="bg-[#4cae9e] px-4 py-2 hover:bg-[#347c70] text-white transition duration-300 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#4cae9e] px-4 py-2 hover:bg-[#347c70] text-white transition duration-300 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        className={`md:hidden overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-col space-y-2 px-4 pb-4">
          <Link
            href="/"
            className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/about"
              className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
            >
              About
            </Link>
          )}
          <Link
            href="/"
            className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="text-gray-800 hover:text-[#4cae9e] transition duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout} 
                className="bg-[#4cae9e] p-4 transition text-white duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#4cae9e] p-4 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  );
}
