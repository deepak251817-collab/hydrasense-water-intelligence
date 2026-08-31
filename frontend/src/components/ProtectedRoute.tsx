import { Navigate } from "react-router-dom";
import { hasRole } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "PRODUCT_USER" | "AUTHORITY";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/user/login" replace />;
  }

  return <>{children}</>;
}
