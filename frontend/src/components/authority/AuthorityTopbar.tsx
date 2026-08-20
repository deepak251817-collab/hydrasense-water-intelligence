import { Bell, Search, ShieldCheck, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface AuthorityTopbarProps {
  onMenuClick: () => void;
}

export default function AuthorityTopbar({ onMenuClick }: AuthorityTopbarProps) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/authority":
        return "Command Center";
      case "/authority/sources":
        return "Monitored Water Sources";
      case "/authority/monitoring":
        return "Real-Time Telemetry & Probes";
      case "/authority/alerts":
        return "Active Alert Operations";
      case "/authority/incidents":
        return "Water Incident Management";
      case "/authority/inspections":
        return "Field Inspection Log";
      case "/authority/laboratory":
        return "Laboratory Verification";
      case "/authority/map":
        return "Hydrological GIS Map";
      case "/authority/analytics":
        return "Predictive Analytics & Trends";
      default:
        return "Authority Command Center";
    }
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Environmental Operations
          </p>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-44 lg:w-56 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400 text-slate-700"
            placeholder="Search source or sensor..."
          />
        </div>

        {/* Authorized Operator Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Authorized Operator</span>
        </div>

        {/* Notifications */}
        <button 
          title="Active Alerts"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
