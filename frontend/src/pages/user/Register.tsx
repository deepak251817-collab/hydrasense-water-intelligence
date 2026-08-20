import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/user/activate");
  };

  return (
    <div className="bg-white py-12 px-4 shadow-sm sm:rounded-3xl sm:px-10 max-w-md mx-auto w-full border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
        <p className="text-sm text-slate-500 mt-2">Get started with your HydraSense personal water tester.</p>
      </div>

      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <div className="mt-1">
            <input
              type="text"
              required
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
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
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
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
              className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center gap-2 items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none"
          >
            <span>Continue</span>
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
