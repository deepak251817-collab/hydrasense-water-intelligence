import { useState } from "react";
import { mockAlerts } from "../../data/mockData";
import type { Alert } from "../../data/mockData";
import AlertPanel from "../../components/authority/AlertPanel";
import { ShieldAlert, RotateCcw, Sliders } from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleReset = () => {
    setAlerts(mockAlerts.map((a) => ({ ...a, acknowledged: false })));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800 border border-red-200">
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            <span>Operational Incident Alerts</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Operations Alert Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated environmental limit violations and predictive model deterioration warnings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs transition-colors self-start"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Operations Alarms</span>
        </button>
      </div>

      {/* Grid: Alert Center and Threshold Protocol */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertPanel alerts={alerts} onAcknowledge={handleAcknowledge} />
        </div>

        {/* Alarm Thresholds Reference Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="h-4.5 w-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Trigger Threshold Rules
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                <div className="flex items-center justify-between font-bold text-red-900">
                  <span>Critical Tier</span>
                  <span className="text-[10px] uppercase font-black">Level 1</span>
                </div>
                <p className="text-[11px] text-red-800 mt-1">
                  Turbidity &gt; 25 NTU, DO &lt; 3.5 mg/L, or AI Risk &gt; 90%
                </p>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3">
                <div className="flex items-center justify-between font-bold text-orange-900">
                  <span>High Risk Tier</span>
                  <span className="text-[10px] uppercase font-black">Level 2</span>
                </div>
                <p className="text-[11px] text-orange-800 mt-1">
                  Turbidity &gt; 15 NTU, TDS &gt; 500 mg/L, or AI Risk &gt; 75%
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Advisory Watch Tier</span>
                  <span className="text-[10px] uppercase font-black">Level 3</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Consecutive drift &gt; +10% across 4 cycles
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-400">
            Escalation triggers dispatch automated SMS/webhook packets to designated regional field officers.
          </div>
        </div>
      </div>
    </div>
  );
}
