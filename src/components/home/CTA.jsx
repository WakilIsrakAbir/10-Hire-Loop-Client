"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function CTA() {
  return (
    <section className="relative w-full max-w-6xl mx-auto mt-4 sm:mt-6 mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Container with cta-bg.png */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0a090e]/80 border border-white/5 backdrop-blur-2xl flex flex-col items-center justify-center text-center pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-8 shadow-2xl">
        
        {/* Wireframe Dome Mesh Image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <Image
            src="/cta-bg.png"
            alt="Mesh grid background"
            fill
            priority
            className="object-contain sm:object-cover object-top opacity-50 mix-blend-screen"
          />
        </div>

        {/* Soft Ambient Center Purple Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#5B60F6]/30 via-[#7C3AED]/25 to-[#A855F7]/20 blur-[130px] rounded-full pointer-events-none -z-10"
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.14] mb-4 sm:mb-5 drop-shadow-md"
          >
            Your next role is
            <br />
            already looking for you
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-slate-300/90 font-normal max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed drop-shadow"
          >
            Build a profile in three minutes. The matches start arriving tomorrow morning.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {/* Primary Button */}
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-white text-[#0A0A0C] font-semibold text-sm hover:bg-slate-100 transition-all duration-200 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
            >
              Create a free account
            </Link>

            {/* Secondary Button */}
            <Link
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#141217]/85 hover:bg-[#1C1A24] text-white font-medium text-sm border border-white/15 hover:border-white/30 backdrop-blur-xl transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            >
              View pricing
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
