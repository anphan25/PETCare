import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-white/10 backdrop-blur-md mt-auto border-t border-white/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 lg:px-12 max-w-7xl mx-auto gap-6">
        <div className="text-lg font-semibold text-sage-dark">PETCare</div>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-light tracking-wide">
          <NavLink to="/" className="text-surface-variant opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300">Privacy Policy</NavLink>
          <NavLink to="/" className="text-surface-variant opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300">Terms of Service</NavLink>
          <NavLink to="/" className="text-surface-variant opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300">Contact Us</NavLink>
          <NavLink to="/" className="text-surface-variant opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300">Pet Care Tips</NavLink>
        </div>
        <div className="text-xs font-light tracking-wide text-surface-variant opacity-60">
          © 2026 PETCare Ethereal Sanctuary. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
