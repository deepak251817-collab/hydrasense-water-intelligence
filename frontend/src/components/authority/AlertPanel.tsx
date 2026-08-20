import type { Alert } from "../../data/mockData";
import { AlertCircle, CheckCircle, Eye, RefreshCw, ShieldAlert, AlertTriangle } from "lucide-react";

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onInspect?: (sourceId: string) => void;
}

export default function AlertPanel({
  alerts,
  onAcknowledge,
  onInspect,
}: AlertPanelProps) {
  const getSeverityStyles = (severity: Alert["severity"]) => {
    switch (severity) {
      case "Critical":
        return {
          border: "border-red-200 bg-red-50/40",
          badge: "bg-red-600 text-white",
          dot: "bg-red-600",
          icon: ShieldAlert,
          iconColor: "text-red-600",
        };
      case "High":
        return {
          border: "border-orange-200 bg-orange-50/40",
          badge: "bg-orange-600 text-white",
          dot: "bg-orange-600",
          icon: AlertTriangle,
          iconColor: "text-orange-600",
        };
      case "Warning":
        return {
          border: "border-amber-200 bg-amber-50/40",
          badge: "bg-amber-600 text-white",
          dot: "bg-amber-600",
          icon: AlertTriangle,
          iconColor: "text-amber-600",
        };
      default:
        return {
          border: "border-slate-200 bg-slate-50",
          badge: "bg-slate-600 text-white",
          dot: "bg-slate-600",
          icon: AlertCircle,
          iconColor: "text-slate-600",
        };
    }
  };

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 text-slate-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Active Operations Alerts
          </h2>
          {activeAlerts.length > 0 && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-black text-white">
              {activeAlerts.length} Active
            </span>
          )}
        </div>

        <button 
          type="button"
          title="Refresh Alerts"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Alerts Scroll Area */}
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Operations Baseline Nominal
            </p>
            <p className="text-xs text-slate-400">
              No outstanding unacknowledged alerts across monitored nodes.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const SeverityIcon = styles.icon;

            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 transition-all duration-150 ${styles.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-1.5 shrink-0 bg-white shadow-xs ${styles.iconColor}`}>
                    <SeverityIcon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${styles.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {alert.sourceName}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {alert.timestamp}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs sm:text-sm font-bold text-slate-800">
                      {alert.title}
                    </h4>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                      {alert.description}
                    </p>

                    <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-slate-200/50 pt-2.5">
                      {onInspect && (
                        <button
                          type="button"
                          onClick={() => onInspect(alert.sourceId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect Node</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onAcknowledge(alert.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
