import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: null,
  followingStores: [],
  myStore: null,
  loading: false,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },
    setFollowingStores: (state, action) => {
      state.followingStores = action.payload;
    },
    setMyStore: (state, action) => {
      state.myStore = action.payload;
    },
  },
});

export const { setLoading, setStore, setFollowingStores, setMyStore } =
  storeSlice.actions;

export default storeSlice.reducer;
