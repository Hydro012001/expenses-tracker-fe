import { getCookie } from "@/utils/authUtils";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const ProtectedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));

  useEffect(() => {
    setIsAuthenticated(!!getCookie("token"));
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
