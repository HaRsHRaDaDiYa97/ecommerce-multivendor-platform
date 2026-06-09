import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (storedUser && storedUser !== "undefined" && access && refresh) {
        const user = JSON.parse(storedUser);
        // dispatch with the shape your authSlice expects
        dispatch(loginSuccess({ user, access, refresh }));
      }
    } catch (error) {
      console.error("Failed to initialize auth from localStorage", error);
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
