import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MonitoringStation, ApiError } from "../../lib/api";
import { authorityApi } from "../../lib/api";
import { getToken, clearAuth } from "../../lib/auth";
import { Map, MapPin, Layers, ArrowRight, Loader } from "lucide-react";

export default function WaterMap() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      const token = getToken();
      if (!token) {
        navigate("/user/login");
        return;
      }

      try {
        setLoading(true);
        const data = await authorityApi.getAllStations(token);
        setStations(data);
        if (data.length > 0) {
          setSelectedStation(data[0]);
        }
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.detail || "Failed to load stations");
        if (apiError.statusCode === 401) {
          clearAuth();
          navigate("/user/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [navigate]);

  // Map public_warning to risk level for UI
  const getWarningRisk = (warning: string): "Stable" | "Watch" | "High" | "Critical" => {
    switch (warning) {
      case "CRITICAL": return "Critical";
      case "WARNING": return "High";
      case "CAUTION": return "Watch";
      default: return "Stable";
    }
  };

  const getRiskPinColor = (warning: string) => {
    const risk = getWarningRisk(warning);
    switch (risk) {
      case "Critical":
        return "bg-red-500 text-white ring-red-400";
      case "High":
        return "bg-orange-500 text-white ring-orange-400";
      case "Watch":
        return "bg-amber-500 text-white ring-amber-400";
      case "Stable":
      default:
        return "bg-emerald-500 text-white ring-emerald-400";
    }
  };

  const getRiskBadge = (warning: string) => {
    const risk = getWarningRisk(warning);
    switch (risk) {
      case "Critical": return "bg-red-100 text-red-700";
      case "High":     return "bg-orange-100 text-orange-700";
      case "Watch":    return "bg-amber-100 text-amber-700";
      case "Stable":
      default:         return "bg-emerald-100 text-emerald-700";
    }
  };

  // Generate relative positions based on station count and code
  const getStationPosition = (_stationCode: string, index: number): { top: string; left: string } => {
    const positions = [
      { top: "18%", left: "70%" },
      { top: "45%", left: "45%" },
      { top: "72%", left: "22%" },
    ];
    return positions[index] || { top: "50%", left: "50%" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (error || stations.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
        <p className="text-slate-600 font-semibold">{error || "No monitoring stations found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
            <Map className="h-3.5 w-3.5 text-cyan-700" />
            <span>Water Intelligence Map</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Monitoring Stations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status across all monitoring nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            {stations.length} Active Station{stations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Map + Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Canvas */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 shadow-md relative min-h-[500px] overflow-hidden flex flex-col">
          
          {/* Top HUD */}
          <div className="flex items-center justify-between px-5 py-4 z-10">
            <div className="rounded-xl bg-slate-900/90 px-3.5 py-2 border border-slate-800 backdrop-blur text-xs font-bold text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Monitoring Network</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 px-3 py-1.5 border border-slate-800 text-[11px] font-mono text-cyan-400">
              Active Status
            </div>
          </div>

          {/* River graphic background */}
          <div className="flex-1 relative">
            {/* Stylized river path */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 320"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {/* River path from top-right (upstream) to bottom-left (downstream) */}
              <path
                d="M 290 40 Q 260 100 200 140 Q 150 180 120 220 Q 80 260 60 290"
                stroke="#22d3ee"
                strokeWidth="6"
                strokeOpacity="0.25"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 290 40 Q 260 100 200 140 Q 150 180 120 220 Q 80 260 60 290"
                stroke="#22d3ee"
                strokeWidth="16"
                strokeOpacity="0.07"
                fill="none"
                strokeLinecap="round"
              />
              {/* Grid dots */}
              {Array.from({ length: 12 }).map((_, ri) =>
                Array.from({ length: 9 }).map((_, ci) => (
                  <circle
                    key={`${ri}-${ci}`}
                    cx={ci * 50 + 10}
                    cy={ri * 28 + 10}
                    r="1"
                    fill="#334155"
                  />
                ))
              )}
            </svg>

            {/* Station Markers */}
            {stations.map((station, index) => {
              const isSelected = selectedStation?.id === station.id;
              const pos = getStationPosition(station.station_code, index);
              const pinColor = getRiskPinColor(station.public_warning);

              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => setSelectedStation(station)}
                  style={pos ? { top: pos.top, left: pos.left } : {}}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-200 cursor-pointer ${
                    isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full shadow-xl ring-4 transition-all ${pinColor} ${isSelected ? "ring-offset-2 ring-offset-slate-950" : ""}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className={`mt-2 rounded-lg px-2.5 py-1 border text-center shadow-lg transition-all ${
                    isSelected
                      ? "bg-white border-white/30"
                      : "bg-slate-900/90 border-slate-700"
                  }`}>
                    <p className={`text-[11px] font-bold whitespace-nowrap ${isSelected ? "text-slate-900" : "text-white"}`}>
                      {station.station_code}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-slate-600" : "text-cyan-400"}`}>
                      {getWarningRisk(station.public_warning)}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Upstream / Downstream labels */}
            <div className="absolute top-4 right-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Upstream</div>
            <div className="absolute bottom-4 left-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Downstream</div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-4 text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Stable</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Caution</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Warning</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical</span>
            </div>
            <span className="font-mono text-slate-500">Interactive GIS Placeholder — Mapbox Ready</span>
          </div>
        </div>

        {/* Station Summary Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
          {selectedStation && (
            <>
              <div className="px-6 py-5 border-b border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700">Station Summary</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight">{selectedStation.station_name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStation.station_code} — {selectedStation.location}</p>
              </div>

              <div className="px-6 py-4 flex-1 space-y-1">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Status</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${getRiskBadge(selectedStation.public_warning)}`}>
                    {getWarningRisk(selectedStation.public_warning)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Zone</span>
                  <span className="text-sm font-bold text-slate-800">{selectedStation.zone}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Water Source</span>
                  <span className="text-sm font-bold text-slate-800">{selectedStation.water_source.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Latitude</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedStation.latitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Longitude</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedStation.longitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-slate-500 font-medium">Last Update</span>
                  <span className="text-xs font-bold text-slate-800">
                    {new Date(selectedStation.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-5">
                <Link
                  to={`/authority/stations/${selectedStation.station_code}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Station list below map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => setSelectedStation(station)}
            className={`rounded-2xl border p-5 text-left transition-all hover:shadow-md ${
              selectedStation?.id === station.id
                ? "border-cyan-400 bg-cyan-50 shadow-sm"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-500">{station.station_code}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${getRiskBadge(station.public_warning)}`}>
                {getWarningRisk(station.public_warning)}
              </span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{station.station_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{station.location}</p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <span className="font-semibold text-slate-700">{station.zone}</span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-cyan-600">{station.water_source.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
