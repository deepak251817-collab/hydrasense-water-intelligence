import type { WaterSource } from "../../data/mockData";
import { BrainCircuit, Sparkles, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface PredictionCardProps {
  selectedSource: WaterSource;
}

export default function PredictionCard({ selectedSource }: PredictionCardProps) {
  const getAIDetails = (source: WaterSource) => {
    switch (source.risk) {
      case "Critical":
        return {
          riskLevel: "CRITICAL",
          confidence: "91%",
          badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
          indicators: [
            { label: "Turbidity Surge", value: "+88%", isUp: true, isBad: true },
            { label: "DO Depletion", value: "-58%", isUp: false, isBad: true },
            { label: "pH Acid Shift", value: "-18%", isUp: false, isBad: true },
          ],
          explanation: "Severe biochemical divergence. Dissolved oxygen is critically depleted alongside massive organic turbidity influx. Immediate localized aeration and source containment mandated.",
        };
      case "High":
        return {
          riskLevel: "HIGH",
          confidence: "87%",
          badgeClass: "bg-orange-500/20 text-orange-400 border-orange-500/30",
          indicators: [
            { label: "Turbidity", value: "+32%", isUp: true, isBad: true },
            { label: "TDS", value: "+21%", isUp: true, isBad: true },
            { label: "DO", value: "-18%", isUp: false, isBad: true },
          ],
          explanation: "Water-quality indicators are moving away from the recent stable pattern. Targeted field inspection is recommended.",
        };
      case "Watch":
        return {
          riskLevel: "WATCH",
          confidence: "74%",
          badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          indicators: [
            { label: "TDS Drift", value: "+12%", isUp: true, isBad: true },
            { label: "Turbidity", value: "+8%", isUp: true, isBad: true },
            { label: "Temperature", value: "+2%", isUp: true, isBad: false },
          ],
          explanation: "Slight positive drift in conductivity and suspended solids. Catchment runoff filters should be inspected during routine rounds.",
        };
      case "Stable":
      default:
        return {
          riskLevel: "STABLE",
          confidence: "94%",
          badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          indicators: [
            { label: "Turbidity Variance", value: "+1.2%", isUp: true, isBad: false },
            { label: "TDS Drift", value: "-1.8%", isUp: false, isBad: false },
            { label: "DO Stability", value: "+0.4%", isUp: true, isBad: false },
          ],
          explanation: "All biochemical indicators remain aligned with historical baseline profiles. No hazardous deterioration projected in the next 72-hour forecast window.",
        };
    }
  };

  const details = getAIDetails(selectedSource);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-md flex flex-col justify-between h-full border border-slate-800">
      {/* Decorative Blur Accent */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400 border border-cyan-500/20">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                AI Predictive Intelligence
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Placeholder Engine • {selectedSource.name}
              </p>
            </div>
          </div>

          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        </div>

        {/* Prediction Status & Confidence */}
        <div className="mt-6">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Predicted Risk Profile
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black tracking-tight text-white">
              {details.riskLevel}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${details.badgeClass}`}>
              {details.confidence} confidence
            </span>
          </div>
        </div>

        {/* Contributing Indicators */}
        <div className="mt-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">
            Contributing Indicators
          </span>
          <div className="grid grid-cols-3 gap-2">
            {details.indicators.map((indicator, idx) => (
              <div key={idx} className="rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-400 block truncate">
                  {indicator.label}
                </span>
                <div className="mt-1 flex items-center justify-center gap-1">
                  {indicator.isUp ? (
                    <TrendingUp className={`h-3 w-3 ${indicator.isBad ? "text-red-400" : "text-emerald-400"}`} />
                  ) : (
                    <TrendingDown className={`h-3 w-3 ${indicator.isBad ? "text-red-400" : "text-emerald-400"}`} />
                  )}
                  <span className="text-xs font-black text-white">{indicator.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Natural Language Explanation */}
        <div className="mt-6 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
            <AlertCircle className="h-3 w-3" />
            <span>Operational AI Explanation</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 font-medium">
            "{details.explanation}"
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-800/80 pt-3 text-[10px] text-slate-500 font-semibold flex items-center justify-between">
        <span>Mock UI Representation</span>
        <span>Target: Field Inspection</span>
      </div>
    </div>
  );
}
