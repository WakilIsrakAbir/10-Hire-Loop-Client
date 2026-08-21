"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function RecruiterSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/recruiter",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      active: pathname === "/dashboard/recruiter",
    },
    {
      id: "company",
      label: "My Company",
      href: "/dashboard/recruiter/company",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      active: pathname.startsWith("/dashboard/recruiter/company"),
    },
    {
      id: "jobs",
      label: "Manage Jobs",
      href: "/dashboard/recruiter/jobs",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      active: pathname.startsWith("/dashboard/recruiter/jobs"),
    },
    {
      id: "billing",
      label: "Subscription & Billing",
      href: "/dashboard/recruiter/billing",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      active: pathname.startsWith("/dashboard/recruiter/billing"),
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/recruiter/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      active: pathname.startsWith("/dashboard/recruiter/settings"),
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#101013] border-r border-white/5 flex flex-col justify-between py-6 px-4 hidden md:flex">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="px-2">
          <Link href="/" className="inline-block group">
            <Image
              src="/logo.png"
              alt="HireLoop"
              width={130}
              height={32}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "Recruiter"}
              className="w-10 h-10 rounded-xl object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm uppercase shadow-md shadow-indigo-500/20">
              {user?.name ? user.name.charAt(0) : "R"}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">
              {user?.name || "Alex Sterling"}
            </h4>
            <p className="text-[10px] text-zinc-400 truncate">Recruiter</p>
            <div className="mt-1">
              <span className="inline-block text-[9px] font-semibold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 tracking-wider">
                PREMIUM ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                  item.active
                    ? "bg-white/10 text-white font-semibold shadow-inner"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={item.active ? "text-white" : "text-zinc-500"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="pt-4 border-t border-white/5 px-2">
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
