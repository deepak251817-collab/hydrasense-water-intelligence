import { Outlet, Link } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";
import Logo from "../components/shared/Logo";
import { Shield, Info } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* Citizen Public Navigation */}
      <PublicNavbar />

      {/* Top Public Advisory Ribbon */}
      <div className="bg-cyan-900 text-cyan-100 text-xs py-2 px-4 text-center font-medium border-b border-cyan-800">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2">
          <Info className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
          <span>
            Citizen Water Intelligence Portal • Real-time environmental sensor screening network
          </span>
        </div>
      </div>

      {/* Main Page Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo variant="light" to="/public" size="md" />
              <p className="mt-3 text-xs leading-relaxed text-slate-500 max-w-md">
                HydraSense continuously gathers telemetry from IoT sensor arrays deployed across municipal lakes, reservoirs, and community water bodies to provide predictive screening and early warning detection.
              </p>
              
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 max-w-md text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Sensor-based water quality screening provides indicative operational parameters and does not replace certified laboratory testing or statutory health clearances.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Citizen Tools
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link to="/public/check-water" className="hover:text-cyan-700 transition-colors">
                    Check Water for Intended Use
                  </Link>
                </li>
                <li>
                  <Link to="/public/sources" className="hover:text-cyan-700 transition-colors">
                    Monitored Water Sources
                  </Link>
                </li>
                <li>
                  <Link to="/public/warnings" className="hover:text-cyan-700 transition-colors">
                    Active Ecological Warnings
                  </Link>
                </li>
                <li>
                  <Link to="/public/my-checks" className="hover:text-cyan-700 transition-colors">
                    Past Screening History
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Operations & Authority
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link to="/authority" className="inline-flex items-center gap-1.5 text-cyan-700 font-semibold hover:underline">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Authority Command Center</span>
                  </Link>
                </li>
                <li>
                  <Link to="/authority/sources" className="hover:text-cyan-700 transition-colors">
                    Node Telemetry Directory
                  </Link>
                </li>
                <li>
                  <Link to="/authority/alerts" className="hover:text-cyan-700 transition-colors">
                    Operations Alert Desk
                  </Link>
                </li>
                <li>
                  <Link to="/authority/analytics" className="hover:text-cyan-700 transition-colors">
                    Predictive Models
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} HydraSense. AI-Powered Water Quality Intelligence.</p>
            <p className="font-medium text-slate-500">Phase 1 Frontend Foundation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
