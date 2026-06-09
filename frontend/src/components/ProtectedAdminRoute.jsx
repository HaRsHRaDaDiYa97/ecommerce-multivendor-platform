import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return user?.role === "ADMIN"
    ? <Outlet />
    : <Navigate to="/" />;
};

export default ProtectedAdminRoute;
