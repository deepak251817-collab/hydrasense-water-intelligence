import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../shared/Logo";
import { 
  CheckCircle2, 
  Droplet, 
  AlertTriangle, 
  History, 
  Menu, 
  X, 
  Shield, 
  Home 
} from "lucide-react";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/public", label: "Home", icon: Home, exact: true },
    { to: "/public/check-water", label: "Check Water", icon: CheckCircle2 },
    { to: "/public/sources", label: "Nearby Sources", icon: Droplet },
    { to: "/public/warnings", label: "Warnings", icon: AlertTriangle, badge: "3" },
    { to: "/public/my-checks", label: "My Checks", icon: History },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path || location.pathname === "/public/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo variant="light" to="/public" size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "bg-cyan-50 text-cyan-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-cyan-600" : "text-slate-400"}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Authority Switcher */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/authority"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Shield className="h-3.5 w-3.5 text-cyan-600" />
            <span>Authority Portal</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/authority"
            className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Shield className="h-3.5 w-3.5 text-cyan-600" />
            <span>Authority</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to, link.exact);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-cyan-50 text-cyan-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? "text-cyan-600" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
