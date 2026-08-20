import { useState } from "react";
import { mockSensorProbes, mockWaterSources } from "../../data/mockData";
import SensorHealth from "../../components/authority/SensorHealth";
import WaterTrendChart from "../../components/authority/WaterTrendChart";
import { Radio, Cpu } from "lucide-react";

export default function LiveMonitoring() {
  const [selectedSourceId, setSelectedSourceId] = useState("source-tg-halli");
  const selectedSource =
    mockWaterSources.find((s) => s.id === selectedSourceId) || mockWaterSources[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
            <Radio className="h-3.5 w-3.5 text-cyan-700 animate-pulse" />
            <span>High-Frequency Telemetry Stream</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Live IoT Sensor Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time optical and potentiometric probe array streaming via MQTT Mesh Uplink.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-cyan-500"
          >
            {mockWaterSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name} ({source.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Charts & Diagnostics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <WaterTrendChart selectedSource={selectedSource} />

          {/* Real-time Telemetry Packet Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  MQTT Telemetry Stream (Simulated Node Packets)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                STREAM ACTIVE • 5000ms POLLING
              </span>
            </div>

            <div className="mt-4 font-mono text-[11px] bg-slate-950 p-4 rounded-xl text-slate-300 overflow-x-auto max-h-[220px] space-y-2 border border-slate-800">
              <p className="text-emerald-400">[08:30:12.110] [UPLINK] Node_TG_Halli: {"{ ph: 6.91, turb_ntu: 17.62, tds_ppm: 412.0, temp_c: 28.1, do_mgl: 4.9 }"}</p>
              <p className="text-cyan-400">[08:30:17.112] [CRC_OK] Packet 0xFA481 verified (RSSI: -64 dBm, Batt: 89%)</p>
              <p className="text-amber-400">[08:30:22.115] [ANOMALY] Turbidity differential exceeds rate threshold (+0.8 NTU/cycle)</p>
              <p className="text-emerald-400">[08:30:27.118] [UPLINK] Node_TG_Halli: {"{ ph: 6.90, turb_ntu: 17.68, tds_ppm: 414.0, temp_c: 28.2, do_mgl: 4.88 }"}</p>
            </div>
          </div>
        </div>

        <div>
          <SensorHealth probes={mockSensorProbes} />
        </div>
      </div>
    </div>
  );
}
