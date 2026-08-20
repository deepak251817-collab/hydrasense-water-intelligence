import { Waves } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "light" | "dark";
  to?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "light", to = "/public", size = "md" }: LogoProps) {
  const isDark = variant === "dark";
  
  const sizeConfig = {
    sm: { icon: "h-4 w-4", text: "text-sm", sub: "text-[8px]" },
    md: { icon: "h-5 w-5", text: "text-base", sub: "text-[10px]" },
    lg: { icon: "h-6 w-6", text: "text-lg", sub: "text-[11px]" },
  }[size];

  return (
    <Link to={to} className="flex items-center gap-2.5 group select-none">
      <div className={`rounded-xl p-2 transition-transform duration-200 group-hover:scale-105 ${
        isDark ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-cyan-600 text-white shadow-sm"
      }`}>
        <Waves className={`${sizeConfig.icon} ${isDark ? "text-cyan-400" : "text-white"}`} />
      </div>
      <div>
        <div className={`font-extrabold tracking-tight leading-none ${
          isDark ? "text-white" : "text-slate-900"
        } ${sizeConfig.text}`}>
          HydraSense
        </div>
        <p className={`font-semibold uppercase tracking-[0.16em] leading-tight mt-0.5 ${
          isDark ? "text-cyan-400" : "text-cyan-700"
        } ${sizeConfig.sub}`}>
          Water Intelligence
        </p>
      </div>
    </Link>
  );
}
