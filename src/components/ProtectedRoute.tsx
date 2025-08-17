import { useAuth } from "@context/AuthProvider";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth() || {};

  // Check if user object is empty
  const isAuthenticated = user && Object.keys(user).length > 0;
  console.log("isAuthenticated", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default ProtectedRoute;
