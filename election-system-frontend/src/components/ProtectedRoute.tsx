import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface Props {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== "ADMIN") {
    return (
      <div className="card">
        <h2>Access denied</h2>
        <p>
          Your account ({user.role}) doesn't have permission to view this page. Required:{" "}
          {allowedRoles.join(", ")}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
