import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";
// import { Spin } from "antd";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth, appLoading } = useContext(AuthContext);
  const location = useLocation();

  if (appLoading) return <Spin />;
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && auth.user?.roles?.name !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
