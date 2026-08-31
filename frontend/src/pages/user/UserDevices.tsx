import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, CheckCircle2, Battery, Wifi, Loader, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductDevice, ApiError } from "../../lib/api";
import { productApi } from "../../lib/api";
import { getToken, clearAuth } from "../../lib/auth";

export default function UserDevices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<ProductDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      const token = getToken();
      if (!token) {
        navigate("/user/login");
        return;
      }

      try {
        setLoading(true);
        const userDevices = await productApi.getDevices(token);
        setDevices(userDevices);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.detail || "Failed to load devices");
        if (apiError.statusCode === 401) {
          clearAuth();
          navigate("/user/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700";
      case "PENDING_ACTIVATION":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && devices.length === 0 && !error && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Cpu className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No devices registered yet</p>
          <p className="text-xs text-slate-500 mt-1">Register a device using its product code to get started</p>
        </div>
      )}

      {!loading && devices.map((device) => (
        <div key={device.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`${getStatusColor(device.status)} p-3 rounded-xl`}>
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-mono text-slate-400">{device.device_id}</p>
                <h2 className="font-bold text-slate-900">HydraSense Tester</h2>
                <p className="text-xs text-slate-500 mt-0.5">Product Code: {device.product_code}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(device.status)}`}>
              {device.status}
            </span>
          </div>
          
          {device.status === "ACTIVE" && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Ready</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Battery className="h-5 w-5 text-slate-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Monitoring</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Wifi className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Connected</p>
              </div>
            </div>
          )}

          {device.status === "PENDING_ACTIVATION" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                This device is pending activation. Complete the setup process to begin using it.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
