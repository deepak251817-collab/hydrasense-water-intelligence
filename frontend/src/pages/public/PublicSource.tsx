import { useParams, Link } from "react-router-dom";
import { mockWaterSources } from "../../data/mockData";
import { ArrowLeft, Sparkles, AlertTriangle, Droplets, Thermometer, Info } from "lucide-react";

export default function PublicSource() {
  const { stationId } = useParams();
  const source = mockWaterSources.find((s) => s.id === stationId);

  if (!source) {
    return (
      <div className="py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Station not found</h2>
        <Link to="/public" className="text-cyan-600 mt-4 inline-block hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const isCritical = source.risk === "Critical";
  const statusColor = isCritical ? "bg-red-50 text-red-700 border-red-200" : 
                      source.risk === "Watch" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link to="/public" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">{source.id}</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{source.name}</h1>
              <p className="text-slate-500 mt-1">{source.location}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 ${statusColor}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 bg-current`}></span>
              </span>
              {source.risk.toUpperCase()}
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Droplets className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">pH Level</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{source.pH}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Info className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">Turbidity</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{source.turbidity} NTU</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Info className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">TDS</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{source.tds} ppm</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">Temp</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{source.temperature}°C</span>
            </div>
          </div>
          
          <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
             <div className="flex items-center gap-2 text-slate-500 mb-1 w-full">
                <Info className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">Dissolved Oxygen</span>
             </div>
             <div className="text-xl font-bold text-slate-900 w-full text-left">{source.dissolvedOxygen} mg/L</div>
          </div>

          <div className="mt-8 bg-cyan-50 border border-cyan-100 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="h-24 w-24 text-cyan-600" />
             </div>
             <div className="relative z-10 flex gap-4 items-start">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cyan-900">AI Insight</h3>
                  <p className="mt-1 text-cyan-800 text-sm font-medium">{source.aiInsight || "No insight available."}</p>
                </div>
             </div>
          </div>

          {source.publicWarning && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4 items-start">
               <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                 <AlertTriangle className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-red-900">Public Warning Active</h3>
                 <p className="mt-1 text-red-800 text-sm font-medium">{source.publicMessage}</p>
               </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-6">
            <span>Trend: <strong className="text-slate-600 capitalize">{source.trendDirection}</strong></span>
            <span>Last Updated: {source.updatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
