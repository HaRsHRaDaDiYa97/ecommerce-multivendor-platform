import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedSellerRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return user?.role === "SELLER"
    ? <Outlet />
    : <Navigate to="/" />;
};

export default ProtectedSellerRoute;
