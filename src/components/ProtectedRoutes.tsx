import { getCookie } from "@/utils/authUtils";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const ProtectedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!getCookie("expenses_token")
  );

  useEffect(() => {
    setIsAuthenticated(!!getCookie("expenses_token"));
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
