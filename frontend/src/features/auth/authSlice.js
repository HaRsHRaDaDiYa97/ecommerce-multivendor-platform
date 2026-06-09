// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

let user = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch {
  localStorage.removeItem("user");
  user = null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    access: localStorage.getItem("access") || null,
    refresh: localStorage.getItem("refresh") || null,
    isAuthenticated: !!localStorage.getItem("access"),
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, access, refresh } = action.payload;

      state.user = user;
      state.access = access;
      state.refresh = refresh;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    },

    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
