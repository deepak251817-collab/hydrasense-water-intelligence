import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Droplet, Search, ShieldCheck } from "lucide-react";

export default function UserCheckWater() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link to="/user/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Water Check</h1>
        <p className="text-sm text-slate-500 mt-1">Screen your water using your HydraSense device.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-4">1. What type of source are you checking?</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Municipal Tap", "Borewell", "Storage Tank", "Purifier (RO/UV)", "Other"].map(source => (
                     <button 
                       key={source} 
                       onClick={() => setStep(2)}
                       className="p-4 border-2 border-slate-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 text-left font-semibold text-slate-700 transition-colors"
                     >
                       {source}
                     </button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-4">2. What is the intended use?</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Drinking", "Domestic (Bathing/Washing)", "Irrigation", "Other"].map(use => (
                     <button 
                       key={use} 
                       onClick={() => setStep(3)}
                       className="p-4 border-2 border-slate-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 text-left font-semibold text-slate-700 transition-colors"
                     >
                       {use}
                     </button>
                  ))}
               </div>
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-900 font-medium">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
            <div className="mx-auto w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center">
               <Droplet className="h-10 w-10 text-cyan-500" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-900">Dip your device into the water</h3>
               <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                 Ensure the sensor probes are fully submerged but do not exceed the max water line indicator.
               </p>
            </div>
            
            {analyzing ? (
              <div className="space-y-4">
                 <Search className="h-8 w-8 text-cyan-600 animate-pulse mx-auto" />
                 <p className="text-sm font-bold text-cyan-600 animate-pulse">Analyzing sample...</p>
                 <div className="w-full bg-slate-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                    <div className="bg-cyan-600 h-2 rounded-full animate-[progress_3s_ease-in-out_forwards]" style={{width: "0%"}}></div>
                 </div>
              </div>
            ) : (
              <button 
                onClick={startAnalysis}
                className="inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all duration-150"
              >
                <span>Start Screening</span>
              </button>
            )}
            {!analyzing && (
              <div className="block mt-4">
                <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-900 font-medium">← Back</button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                 <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Screening Complete</h2>
              <div className="inline-flex mt-4 items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold">
                 Preliminary Result: Likely Safe
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase">TDS</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">210 ppm</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase">pH</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">7.1</p>
               </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex gap-3">
               <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
               <p>
                 <strong>Disclaimer:</strong> This is a preliminary physical sensor screening. It does not detect biological pathogens, heavy metals, or specific chemical contaminants. Do not claim certified drinking safety based on this result alone.
               </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
               <Link 
                 to="/user/dashboard"
                 className="flex-1 text-center py-3 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition-colors text-sm"
               >
                 Done
               </Link>
               <button 
                 onClick={() => setStep(1)}
                 className="flex-1 py-3 px-4 bg-cyan-600 text-white hover:bg-cyan-700 font-bold rounded-xl transition-colors text-sm"
               >
                 Test Another Sample
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
