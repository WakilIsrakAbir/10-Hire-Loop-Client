"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function Footer() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (pathname.startsWith("/dashboard/recruiter")) {
    return null;
  }

  return (
    <footer className="relative bg-[#09090B] border-t border-white/10 text-slate-400 overflow-hidden">
      {/* Background Decorative Ambient Grid / Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:5rem] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-48 bg-[#5B60F6]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12">
        {/* Top Section: Brand Info + 3 Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-12">
          
          {/* Left Column: Brand Info */}
          <div className="max-w-xs space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="hireloop logo"
                width={140}
                height={36}
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Right Section: 3 Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 lg:gap-24">
            
            {/* Product Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#818CF8] tracking-wider">
                Product
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors duration-200">
                    Job discovery
                  </Link>
                </li>
                <li>
                  <Link href="/ai-worker" className="hover:text-white transition-colors duration-200">
                    Worker AI
                  </Link>
                </li>
                <li>
                  <Link href="/company" className="hover:text-white transition-colors duration-200">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/salaries" className="hover:text-white transition-colors duration-200">
                    Salary data
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigations Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#818CF8] tracking-wider">
                Navigations
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors duration-200">
                    Help center
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-white transition-colors duration-200">
                    Career library
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#818CF8] tracking-wider">
                Resources
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/brand" className="hover:text-white transition-colors duration-200">
                    Brand Guideline
                  </Link>
                </li>
                <li>
                  <Link href="/newsroom" className="hover:text-white transition-colors duration-200">
                    Newsroom
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Social Icons on Left & Copyright / Legal on Right */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-slate-500">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.98-.12-2.48.02-3.55.13-1 .85-6.19.85-6.19s-.22-.43-.22-1.07c0-1 .58-1.75 1.3-1.75.62 0 .91.46.91 1.02 0 .62-.39 1.55-.6 2.41-.17.72.36 1.31 1.07 1.31 1.28 0 2.27-1.35 2.27-3.3 0-1.73-1.24-2.93-3.02-2.93-2.06 0-3.27 1.54-3.27 3.14 0 .62.24 1.29.54 1.65.06.07.07.13.05.2-.06.24-.19.78-.22.89-.03.14-.12.17-.27.1-1-.47-1.63-1.93-1.63-3.1 0-2.53 1.84-4.85 5.3-4.85 2.78 0 4.95 1.98 4.95 4.63 0 2.76-1.74 4.98-4.16 4.98-.81 0-1.58-.42-1.84-.92l-.5 1.91c-.18.7-.67 1.57-.99 2.1A12 12 0 1 0 12 0z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          {/* Right Side Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p>Copyright 2024 —Programming Hero</p>
            <div className="flex items-center gap-3">
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                Terms & Policy
              </Link>
              <span>-</span>
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                Privacy Guideline
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
