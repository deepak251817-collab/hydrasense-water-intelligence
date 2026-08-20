import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

const HISTORY = [
  { id: "WC-012", source: "Kitchen Tap",   use: "Drinking",             date: "Aug 20, 2026", result: "Safe",    ph: 7.1, tds: 210 },
  { id: "WC-011", source: "Borewell",       use: "Domestic",             date: "Aug 17, 2026", result: "Caution", ph: 6.9, tds: 480 },
  { id: "WC-010", source: "Filtered Water", use: "Drinking",             date: "Aug 14, 2026", result: "Safe",    ph: 7.2, tds: 95 },
  { id: "WC-009", source: "Storage Tank",   use: "Domestic",             date: "Aug 10, 2026", result: "Safe",    ph: 7.0, tds: 320 },
  { id: "WC-008", source: "Open Well",      use: "Irrigation",           date: "Aug 5, 2026",  result: "Caution", ph: 6.6, tds: 610 },
];

export default function UserHistory() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/user/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Check History</h1>
          <p className="text-sm text-slate-500 mt-1">Your personal water screening log. Results are private.</p>
        </div>
        <Link
          to="/user/check-water"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
        >
          New Check
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">All Checks ({HISTORY.length})</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {HISTORY.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${item.result === "Safe" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                  {item.result === "Safe" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.source}</p>
                  <p className="text-xs text-slate-500">{item.date} · {item.use}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${item.result === "Safe" ? "text-emerald-600" : "text-amber-600"}`}>
                  {item.result}
                </p>
                <p className="text-xs text-slate-400">pH {item.ph} · TDS {item.tds}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-800 flex gap-3">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
        <p>
          <strong>Privacy Notice:</strong> Your personal water test results are private and will not automatically appear in any authority or public monitoring interface.
          An optional "Report Water Quality Concern" feature will be available in Phase 2.
        </p>
      </div>
    </div>
  );
}
