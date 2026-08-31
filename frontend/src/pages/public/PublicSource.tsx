import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, Loader } from "lucide-react";
import type { MonitoringStation, ApiError } from "../../lib/api";
import { publicApi } from "../../lib/api";

export default function PublicSource() {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<MonitoringStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) return;

    const fetchStation = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getStationByCode(stationId);
        setStation(data);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.detail || "Failed to load station data");
        setStation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [stationId]);

  if (loading) {
    return (
      <div className="py-12 px-4 text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto text-cyan-600 mb-4" />
        <p className="text-slate-600">Loading station data...</p>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="py-12 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Station not found</h2>
        <p className="text-sm text-slate-500 mt-2">{error || "This station could not be found."}</p>
        <Link to="/public" className="text-cyan-600 mt-4 inline-block hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  // Map warning status to visual styling
  const getWarningStyles = (warning: string) => {
    switch (warning) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200";
      case "WARNING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CAUTION":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

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
              <p className="text-sm font-semibold text-slate-500">{station.station_code}</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{station.station_name}</h1>
              <p className="text-slate-500 mt-1">{station.location}</p>
              <p className="text-xs text-slate-400 mt-2">{station.zone}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 ${getWarningStyles(station.public_warning)}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 bg-current`}></span>
              </span>
              {station.public_warning}
            </div>
          </div>
          
          {/* Public message */}
          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
            <p className="text-sm text-cyan-900 font-medium">{station.public_message}</p>
          </div>

          {/* Water source info */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Water Source</h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">{station.water_source.name}</span> 
                <span className="text-slate-500 ml-2">({station.water_source.source_type})</span>
              </p>
              {station.water_source.description && (
                <p className="text-sm text-slate-500 mt-2">{station.water_source.description}</p>
              )}
            </div>
          </div>

          {/* Location coordinates */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase">Latitude</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{station.latitude.toFixed(4)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase">Longitude</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{station.longitude.toFixed(4)}</p>
            </div>
          </div>

          {/* Placeholder sections for future phases */}
          <div className="mt-8 space-y-6">
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
              <h3 className="font-semibold text-slate-700 mb-2">Current Measurements</h3>
              <p className="text-sm text-slate-600">Real-time sensor readings will be available in Phase 3 when live MQTT integration is complete.</p>
            </div>

            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
              <h3 className="font-semibold text-slate-700 mb-2">AI Insight</h3>
              <p className="text-sm text-slate-600">Automated water quality analysis and risk predictions will be available in Phase 4 when AI models are deployed.</p>
            </div>

            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
              <h3 className="font-semibold text-slate-700 mb-2">Historical Trend</h3>
              <p className="text-sm text-slate-600">Historical data visualization and trend analysis will be available in Phase 4.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-slate-500 text-center">
        <p>Data last updated: {new Date(station.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
