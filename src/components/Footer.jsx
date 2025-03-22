"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="hover:text-blue-300 transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, children }) {
  return (
    <Link
      href={href}
      className="text-blue-200 hover:text-white transition-colors"
    >
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        {children}
      </svg>
    </Link>
  );
}

function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return null;
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-purple-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ProdEase</h3>
            <p className="text-sm text-purple-200">
              Streamlining retail operations with smart inventory management
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/security">Security</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Connect</h4>
            <div className="flex space-x-4">
              <SocialIcon href="#">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </SocialIcon>
              <SocialIcon href="#">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
              </SocialIcon>
              <SocialIcon href="#">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.68.001 2.54-1.701 4.383-3.919 4.383zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white text-center text-sm text-white">
          © {new Date().getFullYear()} ProdEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
