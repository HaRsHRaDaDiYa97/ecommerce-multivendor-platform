import api from "../../api/api";
import { loginSuccess } from "./authSlice";

export const loginUser = (credentials) => async (dispatch) => {
  const res = await api.post("users/login/", credentials);

  const { access, refresh, user } = res.data;

 localStorage.setItem("access", access);
localStorage.setItem("refresh", refresh);
localStorage.setItem("user", JSON.stringify(user)); // optional (rehydrate)
dispatch(loginSuccess(user));

};
