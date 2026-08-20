import { Link } from "react-router-dom";
import { CheckCircle2, Droplets, ArrowRight, Activity, History } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, Jane. Your HydraSense device is active.</p>
        </div>
        <Link 
          to="/user/check-water"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <Droplets className="h-4 w-4" />
          <span>New Water Check</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm">Device Status</h3>
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                 <CheckCircle2 className="h-5 w-5" />
              </div>
           </div>
           <p className="text-3xl font-extrabold text-slate-900 mt-auto">Connected</p>
           <p className="text-xs text-slate-500 mt-1">HS-2026-X89</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm">Total Checks</h3>
              <div className="bg-cyan-50 text-cyan-600 p-2 rounded-lg">
                 <Activity className="h-5 w-5" />
              </div>
           </div>
           <p className="text-3xl font-extrabold text-slate-900 mt-auto">12</p>
           <p className="text-xs text-slate-500 mt-1">Lifetime water checks</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm">Last Check</h3>
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                 <History className="h-5 w-5" />
              </div>
           </div>
           <p className="text-3xl font-extrabold text-slate-900 mt-auto">3 Days Ago</p>
           <p className="text-xs text-slate-500 mt-1">Tap Water • Safe</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent History</h2>
          <Link to="/user/history" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1">
             View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
           {[1, 2, 3].map((_, i) => (
             <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${i === 0 ? "bg-emerald-100 text-emerald-700" : i === 1 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                     <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{i === 0 ? "Kitchen Tap" : i === 1 ? "Borewell Water" : "Filtered Water"}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Aug {20 - i}, 2026 • Intended: Drinking</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className={`font-bold ${i === 0 ? "text-emerald-600" : i === 1 ? "text-amber-600" : "text-emerald-600"}`}>
                      {i === 0 ? "Safe" : i === 1 ? "Caution" : "Safe"}
                   </p>
                   <Link to="#" className="text-xs text-slate-400 hover:text-cyan-600 mt-1 inline-block">View details</Link>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
