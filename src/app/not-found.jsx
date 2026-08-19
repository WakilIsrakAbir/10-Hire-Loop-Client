import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex items-center justify-center px-6 py-24 overflow-hidden bg-[#0A0A0C]">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#5B60F6]/25 to-[#7C3AED]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#5B60F6]/15 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Glowing 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-indigo-500/10 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5B60F6]"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Error 404
          </span>
        </div>

        {/* Large Gradient 404 Number */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 select-none drop-shadow-2xl">
          404
        </h1>

        {/* Main Heading */}
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Back to Home
          </Link>

          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Browse Jobs
          </Link>
        </div>

        {/* Quick Links Footer Hint */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-slate-500">
          <Link href="/company" className="hover:text-slate-300 transition-colors">
            Company
          </Link>
          <span>•</span>
          <Link href="/pricing" className="hover:text-slate-300 transition-colors">
            Pricing
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-slate-300 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
