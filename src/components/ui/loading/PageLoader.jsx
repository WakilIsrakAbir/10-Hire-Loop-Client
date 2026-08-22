"use client";

import React from "react";
import Image from "next/image";

/**
 * Premium Glowing Page Loader with HireLoop Branding
 * Used for full-screen loading, route authentication checks, and role redirection.
 */
export default function PageLoader({
  message = "Loading HireLoop...",
  subMessage = "Please wait a moment while we prepare your session",
  fullScreen = true,
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${
        fullScreen
          ? "min-h-screen w-full bg-[#070709] text-white fixed inset-0 z-50"
          : "min-h-[380px] w-full py-12 text-white"
      }`}
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#5B60F6]/20 via-[#7C3AED]/15 to-transparent blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Main Glassmorphic Capsule */}
      <div className="relative z-10 flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-[#141217]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 max-w-sm w-full mx-4 text-center">
        {/* Orbital Glowing Spinner Ring with Center Brand Logo */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] opacity-30 blur-md animate-pulse" />

          {/* Outer Spinning Gradient Border */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#5B60F6] border-r-[#7C3AED] animate-spin" style={{ animationDuration: "1.4s" }} />

          {/* Inner Counter-spinning subtle ring */}
          <div className="absolute inset-1.5 rounded-full border border-transparent border-b-purple-400/50 border-l-indigo-400/50 animate-spin" style={{ animationDuration: "2.2s", animationDirection: "reverse" }} />

          {/* Center Logo Icon */}
          <div className="relative z-10 w-11 h-11 rounded-2xl bg-[#0e0d11] border border-white/10 flex items-center justify-center p-2 shadow-inner">
            <Image
              src="/logo.png"
              alt="HireLoop"
              width={36}
              height={36}
              className="h-6 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Dynamic Glowing Message */}
        <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>{message}</span>
        </h3>

        {/* Sub-message */}
        {subMessage && (
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {subMessage}
          </p>
        )}

        {/* Micro Loading Progress Dots */}
        <div className="flex items-center gap-1.5 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
