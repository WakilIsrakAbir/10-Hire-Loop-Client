"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "motion/react";

// Animated counter component that smoothly rolls numbers up when entering viewport
function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1], // Smooth custom cubic bezier
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
      return controls.stop;
    }
  }, [isInView, value, motionVal]);

  return (
    <span ref={ref} className="tabular-nums font-bold">
      {displayValue}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const stats = [
    {
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      num: 50,
      suffix: "K",
      label: "Active Jobs",
      badge: "+18% this month",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      num: 12,
      suffix: "K",
      label: "Verified Companies",
      badge: "Global tech leaders",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
      num: 2,
      suffix: "M+",
      label: "Job Seekers",
      badge: "Worldwide talent",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      num: 97,
      suffix: "%",
      label: "Satisfaction Rate",
      badge: "5-star rating",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto mt-10 sm:mt-14 bg-[url('/globe.png')] bg-contain bg-top bg-no-repeat flex flex-col justify-between pt-24 sm:pt-32 pb-6 sm:pb-8 px-3 sm:px-6">
      
      {/* Ambient Pulsing Glow behind globe */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-gradient-to-tr from-[#7C3AED]/30 to-[#5B60F6]/35 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* Heading Animation */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 tracking-wide uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          Real-time Platform Growth
        </motion.span>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal text-slate-200 tracking-tight leading-[1.3] drop-shadow-md">
          Assisting over{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            15,000 job seekers
          </span>
          <br />
          find their dream positions.
        </h2>
      </motion.div>

      {/* 4 Animated Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between p-4 sm:p-5 lg:p-6 rounded-2xl bg-[#141217]/85 hover:bg-[#18161E]/95 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-colors duration-300 shadow-2xl min-h-[145px] sm:min-h-[170px] overflow-hidden"
          >
            {/* Subtle card top gradient shine on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Top row: Icon + Animated badge */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/30 flex items-center justify-center transition-colors duration-300"
              >
                {stat.icon}
              </motion.div>
            </div>

            {/* Number Counter & Label */}
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1 group-hover:text-indigo-200 transition-colors duration-200">
                <AnimatedCounter value={stat.num} suffix={stat.suffix} />
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
