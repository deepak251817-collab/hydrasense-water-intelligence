import { useState } from "react";
import { mockWaterSources } from "../../data/mockData";
import type { WaterSource } from "../../data/mockData";
import { Map, MapPin, Layers } from "lucide-react";

export default function WaterMap() {
  const [selectedSource, setSelectedSource] = useState<WaterSource>(mockWaterSources[0]);

  const getRiskPinColor = (risk: WaterSource["risk"]) => {
    switch (risk) {
      case "Critical":
        return "bg-red-500 text-white ring-red-300";
      case "High":
        return "bg-orange-500 text-white ring-orange-300";
      case "Watch":
        return "bg-amber-500 text-white ring-amber-300";
      case "Stable":
      default:
        return "bg-emerald-500 text-white ring-emerald-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
            <Map className="h-3.5 w-3.5 text-cyan-700" />
            <span>Regional GIS Spatial Matrix</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Hydrological GIS Water Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial distribution and real-time operational risk status across Bengaluru catchment basins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            5 Geo-Referenced Stations
          </span>
        </div>
      </div>

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Interactive Map Canvas Mock */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-md relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Top GIS HUD Overlay */}
          <div className="flex items-center justify-between z-10">
            <div className="rounded-xl bg-slate-900/90 px-3.5 py-2 border border-slate-800 backdrop-blur text-xs font-bold text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Bengaluru Urban Catchment Projection (EPSG:4326)</span>
            </div>

            <div className="rounded-xl bg-slate-900/90 px-3 py-1.5 border border-slate-800 text-[11px] font-mono text-cyan-400">
              12.9716° N, 77.5946° E
            </div>
          </div>

          {/* Graphical Map Canvas with Spatial Node Points */}
          <div className="relative my-auto py-12 flex flex-wrap items-center justify-center gap-6 z-10">
            {mockWaterSources.map((source) => {
              const isSelected = selectedSource.id === source.id;
              const pinColor = getRiskPinColor(source.risk);

              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setSelectedSource(source)}
                  className={`group relative flex flex-col items-center transition-transform duration-200 cursor-pointer ${
                    isSelected ? "scale-115 z-20" : "hover:scale-105"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ring-4 transition-all ${pinColor}`}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="mt-2 rounded-lg bg-slate-900/90 px-2.5 py-1 border border-slate-700 text-center shadow-md">
                    <p className="text-[11px] font-bold text-white whitespace-nowrap">
                      {source.name}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                      {source.healthScore}/100 • {source.risk}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom GIS Controls & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10 border-t border-slate-800/80 pt-4 text-xs">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Stable
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Watch
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Interactive GIS Map Placeholder
            </span>
          </div>
        </div>

        {/* Selected Source Spatial Inspection Detail Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700">
                  Node Telemetry Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                  {selectedSource.name}
                </h3>
              </div>

              <span className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                selectedSource.risk === "Critical" ? "bg-red-100 text-red-700" :
                selectedSource.risk === "High" ? "bg-orange-100 text-orange-700" :
                selectedSource.risk === "Watch" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {selectedSource.risk} Risk
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-bold text-slate-800">{selectedSource.location}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">GPS Coordinates</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedSource.latitude.toFixed(4)}°N, {selectedSource.longitude.toFixed(4)}°E
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Health Rating</span>
                <span className="font-extrabold text-cyan-700">{selectedSource.healthScore}/100</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Turbidity</span>
                <span className="font-bold text-slate-800">{selectedSource.turbidity} NTU</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Dissolved Oxygen</span>
                <span className="font-bold text-slate-800">{selectedSource.dissolvedOxygen} mg/L</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">Last Synchronized</span>
                <span className="font-bold text-slate-800">{selectedSource.updatedTime}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
            Map coordinates will connect to real-time Leaflet/Mapbox GIS layers during Phase 2 IoT telemetry uplink.
          </div>
        </div>
      </div>
    </div>
  );
}
