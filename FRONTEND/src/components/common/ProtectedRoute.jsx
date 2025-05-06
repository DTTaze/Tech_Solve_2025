import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleMap = {
    1: "Admin",
    2: "User",
    3: "Customer",
  };

  const userRole = roleMap[auth.user?.roles.id]?.toLowerCase() || "unknown";
  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  const hasAccess = requiredRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
