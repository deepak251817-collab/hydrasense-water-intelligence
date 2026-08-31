import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { ApiError } from "../../lib/api";
import { authApi } from "../../lib/api";
import { saveAuth } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      
      // Save auth data to sessionStorage
      saveAuth(response.access_token, response.role, {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        role: response.user.role,
      });

      // Redirect based on role
      if (response.user.role === "PRODUCT_USER") {
        navigate("/user/dashboard");
      } else if (response.user.role === "AUTHORITY") {
        navigate("/authority");
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 px-4 shadow-sm sm:rounded-3xl sm:px-10 max-w-md mx-auto w-full border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="text-sm text-slate-500 mt-2">Manage your HydraSense personal testing device.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <div className="mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm disabled:bg-slate-100"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="mt-1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm disabled:bg-slate-100"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center gap-2 items-center rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700 focus:outline-none disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/user/register" className="font-bold text-cyan-600 hover:text-cyan-500">
            Register your product
          </Link>
        </p>
      </div>
    </div>
  );
}
