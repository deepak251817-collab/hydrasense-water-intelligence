import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  QrCode, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-cyan-950 p-8 sm:p-12 lg:p-16 text-white shadow-xl text-center">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Water Intelligence</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Understand your water before you use it.
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed sm:text-lg max-w-2xl mx-auto">
            Welcome to the public portal. Choose an action below to view monitored water source conditions or test your personal water supply.
          </p>
        </div>
      </section>

      {/* Primary Actions */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="rounded-2xl bg-cyan-50 p-4 text-cyan-600 w-16 h-16 flex items-center justify-center mb-6">
            <QrCode className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Scan a monitored source</h2>
          <p className="mt-2 text-slate-500 flex-1">
            Scan the HydraSense QR code installed at a monitored water source.
          </p>
          <div className="mt-8">
            <Link
              to="/public/source/ARK-003"
              className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-cyan-700 transition-all duration-150"
            >
              <span>Scan QR</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="rounded-2xl bg-teal-50 p-4 text-teal-600 w-16 h-16 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Check my water</h2>
          <p className="mt-2 text-slate-500 flex-1">
            Use your registered HydraSense device to screen water from your home, borewell, well or tank.
          </p>
          <div className="mt-8">
            <Link
              to="/user/login"
              className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-all duration-150"
            >
              <span>Check My Water</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
