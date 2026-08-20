import { Link } from "react-router-dom";
import { History, CheckCircle2, ShieldAlert, ArrowRight, RotateCcw } from "lucide-react";

export default function MyChecks() {
  const mockSavedChecks = [
    {
      id: "chk-001",
      sourceName: "Hebbal Lake",
      intendedUse: "Domestic Use",
      screeningResult: "Safe for Non-Potable Use",
      status: "Safe",
      date: "Today, 08:30 AM",
      details: "Turbidity 4.8 NTU, pH 7.2. Safe for washing and outdoor maintenance.",
    },
    {
      id: "chk-002",
      sourceName: "Thippagondanahalli Reservoir",
      intendedUse: "Drinking",
      screeningResult: "Not Recommended (Raw Surface Water)",
      status: "Restricted",
      date: "Yesterday, 05:15 PM",
      details: "High turbidity (17.6 NTU) and deteriorating trend. Secondary treatment required.",
    },
    {
      id: "chk-003",
      sourceName: "Jakkur Lake",
      intendedUse: "Irrigation",
      screeningResult: "Acceptable for Crops",
      status: "Safe",
      date: "Aug 18, 2026",
      details: "TDS 348 mg/L within acceptable agricultural threshold.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
            <History className="h-3.5 w-3.5 text-cyan-700" />
            <span>Citizen History</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            My Water Checks
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Review past water screening checks performed on this device.
          </p>
        </div>

        <Link
          to="/public/check-water"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-xs transition-colors self-start"
        >
          <RotateCcw className="h-4 w-4" />
          <span>New Water Check</span>
        </Link>
      </div>

      {/* Checks List */}
      <div className="space-y-4">
        {mockSavedChecks.map((check) => {
          const isSafe = check.status === "Safe";
          return (
            <div
              key={check.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                      {check.intendedUse}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400 font-medium">{check.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {check.sourceName}
                  </h3>
                </div>

                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold self-start ${
                  isSafe ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {isSafe ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                  <span>{check.screeningResult}</span>
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {check.details}
              </p>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2">
                <span>Screening reference ID: {check.id}</span>
                <Link
                  to="/public/check-water"
                  className="inline-flex items-center gap-1 text-cyan-700 font-semibold hover:underline"
                >
                  <span>Re-screen this source</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
