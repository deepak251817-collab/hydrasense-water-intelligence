import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { ApiError } from "../../lib/api";
import { authApi } from "../../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productCode, setProductCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.register({
        full_name: fullName,
        email,
        password,
        product_code: productCode || undefined,
      });

      // Registration successful - redirect to login
      navigate("/user/login", { state: { message: "Registration successful! Please sign in." } });
    } catch (err) {
      const apiError = err as ApiError;
      let errorMsg = apiError.detail || "Registration failed";
      
      // Provide user-friendly error messages
      if (errorMsg.includes("already registered")) {
        errorMsg = "This email is already registered. Please sign in instead.";
      } else if (errorMsg.includes("Invalid product code")) {
        errorMsg = "The product code is invalid. Please check and try again.";
      } else if (errorMsg.includes("already been registered")) {
        errorMsg = "This product code has already been activated by another account.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 px-4 shadow-sm sm:rounded-3xl sm:px-10 max-w-md mx-auto w-full border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
        <p className="text-sm text-slate-500 mt-2">Get started with your HydraSense personal water tester.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <div className="mt-1">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm disabled:bg-slate-100"
              placeholder="Jane Doe"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-slate-700">
            Product Code <span className="text-slate-400">(optional)</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm disabled:bg-slate-100"
              placeholder="e.g., HS-KIT-000124"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Enter your product code to automatically activate your device.</p>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center gap-2 items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Creating account..." : "Continue"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/user/login" className="font-bold text-cyan-600 hover:text-cyan-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
