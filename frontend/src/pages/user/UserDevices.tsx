import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, CheckCircle2, Battery, Wifi } from "lucide-react";

export default function UserDevices() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link to="/user/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">My Devices</h1>
        <p className="text-sm text-slate-500 mt-1">Registered HydraSense personal testing devices.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-50 text-cyan-600 p-3 rounded-xl">
              <Cpu className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">HS-2026-X89</p>
              <h2 className="font-bold text-slate-900">HydraSense Home Tester</h2>
              <p className="text-xs text-slate-500 mt-0.5">Registered Aug 15, 2026</p>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">Calibrated</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <Battery className="h-5 w-5 text-slate-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">84% Battery</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <Wifi className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">BT Connected</p>
          </div>
        </div>
      </div>

      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        <p className="text-sm font-semibold text-slate-500">Device pairing and management will be available in Phase 2.</p>
      </div>
    </div>
  );
}
