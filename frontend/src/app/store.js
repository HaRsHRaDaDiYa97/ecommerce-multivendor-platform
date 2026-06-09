import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import storeReducer from "../features/store/storeSlice";
import addressReducer from "../features/auth/addressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    store: storeReducer,
  },
});

export default store;
