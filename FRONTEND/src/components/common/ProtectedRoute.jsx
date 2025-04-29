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

  // Handle role checking
  const userRoles = Array.isArray(auth.user?.roles)
    ? auth.user.roles.map((r) => r.name) // array of role names
    : [auth.user?.roles?.name]; // single role object fallback

  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  const hasAccess = requiredRole
    ? requiredRoles.some((role) => userRoles.includes(role))
    : true;

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
