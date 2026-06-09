import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import privateApi from "../../api/privateApi";

// ================= FETCH =================
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await privateApi.get("cart/");
  return res.data;
});

// ================= ADD =================
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }) => {
    const res = await privateApi.post("cart/add/", {
      product_id: productId,
      quantity,
    });
    return res.data;
  }
);

// ================= REMOVE =================
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId) => {
    const res = await privateApi.delete(`cart/remove/${productId}/`);
    return res.data;
  }
);

// ================= UPDATE =================
export const updateCartQuantity = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }) => {
    const res = await privateApi.patch(`cart/update/${productId}/`, {
      quantity,
    });
    return res.data;
  }
);

// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    count: 0,
    loading: false,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.count = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
