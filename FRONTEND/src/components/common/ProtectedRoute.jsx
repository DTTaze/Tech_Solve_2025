import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth, appLoading } = useContext(AuthContext);
  const location = useLocation();

  if (appLoading) return <Loader />;

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ánh xạ role_id sang tên vai trò
  const roleMap = {
    1: "Admin",
    3: "Customer",
  };
  const userRole = roleMap[auth.user?.role_id] || "Unknown";

  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasAccess = requiredRoles.some((role) => role === userRole);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
