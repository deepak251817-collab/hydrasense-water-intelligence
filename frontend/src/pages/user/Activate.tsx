import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";

export default function Activate() {
  const navigate = useNavigate();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/user/dashboard");
  };

  return (
    <div className="bg-white py-12 px-4 shadow-sm sm:rounded-3xl sm:px-10 max-w-md mx-auto w-full border border-slate-200">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Activate your Device</h2>
        <p className="text-sm text-slate-500 mt-2">Enter the product code found on your HydraSense device packaging or manual.</p>
      </div>

      <form className="space-y-6" onSubmit={handleActivate}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Product Code</label>
          <div className="mt-1">
            <input
              type="text"
              required
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 text-center font-mono tracking-widest uppercase sm:text-lg"
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm flex gap-3 text-blue-800">
           <Info className="h-5 w-5 shrink-0" />
           <p>For this prototype phase, any product code will be accepted as valid.</p>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center gap-2 items-center rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700 focus:outline-none"
          >
            <span>Activate & Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
