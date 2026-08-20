import { Link } from "react-router-dom";
import { mockWaterSources } from "../../data/mockData";
import PublicSourceCard from "../../components/public/PublicSourceCard";
import WarningBanner from "../../components/public/WarningBanner";
import { 
  CheckCircle2, 
  Droplets, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Activity
} from "lucide-react";

export default function Home() {
  const stableCount = mockWaterSources.filter((s) => s.risk === "Stable").length;
  const advisoryCount = mockWaterSources.filter((s) => s.risk !== "Stable").length;

  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-cyan-950 p-8 sm:p-12 lg:p-16 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Water Intelligence</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Understand your water before you use it.
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed sm:text-lg">
            Check the current measured condition of a water sample or view public warnings for monitored water sources.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to="/public/check-water"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all duration-150 shadow-md hover:shadow-lg"
            >
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>Check Water</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/public/sources"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur border border-white/20 hover:bg-white/15 transition-all duration-150"
            >
              <Droplets className="h-4.5 w-4.5 text-cyan-300" />
              <span>View Monitored Sources</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Water Status Snapshot */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monitored Water Bodies
            </span>
            <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {mockWaterSources.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Active Municipal Nodes
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Lakes, reservoirs, and public community ponds
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Stable Condition
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {stableCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Safe baseline
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Hebbal Lake and Ulsoor Lake nominal
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Under Public Advisory
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {advisoryCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">
              Caution Advised
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Elevated turbidity, TDS or organic influx
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sensor Screening
            </span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              24/7
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Live Telemetry
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Automatic probe updates every 15 minutes
          </p>
        </div>
      </section>

      {/* Active Public Warnings Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Active Public Water Warnings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current ecological advisories issued for monitored Bengaluru water bodies.
            </p>
          </div>
          <Link
            to="/public/warnings"
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1"
          >
            <span>View all warnings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <WarningBanner sources={mockWaterSources} />
      </section>

      {/* Featured Monitored Water Sources */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Monitored Water Bodies
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Public status summary and intended use suitability screening.
            </p>
          </div>
          <Link
            to="/public/sources"
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1"
          >
            <span>Explore all sources</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockWaterSources.slice(0, 3).map((source) => (
            <PublicSourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  );
}
