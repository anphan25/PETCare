'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-white/10 backdrop-blur-md mt-auto border-t border-white/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 lg:px-12 max-w-7xl mx-auto gap-6">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/logo-transparent.png"
            alt="PETCare Logo"
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(71,102,58,0.2)] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col -mb-1">
            <span className="text-lg sm:text-xl font-black text-forest -tracking-[0.05em] leading-none">
              PET<span className="text-sage-dark font-light">Care</span>
            </span>
          </div>
        </Link>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-light tracking-wide">
          {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Pet Care Tips'].map((label) => (
            <Link
              key={label}
              href="/"
              className="text-surface-variant opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="text-xs font-light tracking-wide text-surface-variant opacity-60">
          © 2026 PETCare Ethereal Sanctuary. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
