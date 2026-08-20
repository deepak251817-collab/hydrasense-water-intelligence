import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "../components/shared/Logo";
import { User, Activity, Clock, Settings, LogOut } from "lucide-react";

export default function UserLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes("/login") || location.pathname.includes("/register") || location.pathname.includes("/activate");

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-800">
        <header className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Logo variant="light" to="/public" size="md" />
            <Link to="/public" className="text-sm text-slate-500 hover:text-slate-900">Back to Public Portal</Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/user/dashboard", icon: Activity },
    { name: "Check Water", href: "/user/check-water", icon: Activity },
    { name: "History", href: "/user/history", icon: Clock },
    { name: "Devices", href: "/user/devices", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo variant="light" to="/user/dashboard" size="md" />
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-cyan-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <User className="h-4 w-4" />
                <span>Product User</span>
             </div>
             <Link to="/public" className="text-slate-400 hover:text-slate-600 p-2">
                <LogOut className="h-4 w-4" />
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-200 bg-white py-6 text-slate-500 text-center text-xs">
        <p>© {new Date().getFullYear()} HydraSense Personal Product User Portal.</p>
      </footer>
    </div>
  );
}
