import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = (): JSX.Element => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>LOADING...</div>; //TODO: make a real component
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
