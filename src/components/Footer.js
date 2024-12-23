"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const isRegister = pathname && pathname.startsWith("/register"); 
  const isLogin = pathname && pathname.startsWith("/login");
  return (
    <footer className={`py-10 bg-[#0e1e1b] text-white  ${isLogin || isRegister?"hidden":"block"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">ProdEase</h3>
            <p className="text-gray-400">
              Your ultimate hub for managing products with efficiency and ease.
            </p>
            
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Download App</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Partner with Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-200">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500">
          &copy; 2024 ProdEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
