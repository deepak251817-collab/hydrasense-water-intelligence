import type { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  subtext: string;
  trend?: {
    type: "positive" | "negative" | "neutral" | "warning" | "critical";
    label: string;
  };
  accentColor?: "cyan" | "emerald" | "amber" | "orange" | "red";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  accentColor = "cyan",
}: StatCardProps) {
  const getAccentColors = () => {
    switch (accentColor) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-600",
        };
      case "amber":
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-600",
        };
      case "orange":
        return {
          bg: "bg-orange-500/10",
          text: "text-orange-600",
        };
      case "red":
        return {
          bg: "bg-red-500/10",
          text: "text-red-600",
        };
      case "cyan":
      default:
        return {
          bg: "bg-cyan-500/10",
          text: "text-cyan-600",
        };
    }
  };

  const colors = getAccentColors();

  const getTrendColor = () => {
    if (!trend) return "text-slate-500";
    switch (trend.type) {
      case "positive":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "negative":
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`rounded-xl p-2.5 ${colors.bg} ${colors.text}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getTrendColor()}`}>
            {trend.label}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400 font-medium">
        {subtext}
      </p>
    </div>
  );
}
