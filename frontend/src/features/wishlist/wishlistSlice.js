// src/features/wishlist/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import privateApi from "../../api/privateApi";

// ==============================
// FETCH WISHLIST
// ==============================
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    const token = localStorage.getItem("access");

    if (!token) return [];   // ⛔ nothing sent

    const res = await privateApi.get("wishlist/");
    return res.data;
  }
);


// ==============================
// ADD TO WISHLIST
// ==============================
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem("access");
    if (!token) return rejectWithValue("Not authenticated");

    try {
      const res = await privateApi.post("wishlist/add/", { product_id: productId });
      return res.data; // should return full wishlist object {id, product}
    } catch (error) {
      return rejectWithValue("Failed to add to wishlist");
    }
  }
);

// ==============================
// REMOVE FROM WISHLIST
// ==============================
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem("access");
    if (!token) return rejectWithValue("Not authenticated");

    try {
      await privateApi.delete(`wishlist/remove/${productId}/`);
      return productId; // return id for removal in state
    } catch (error) {
      return rejectWithValue("Failed to remove from wishlist");
    }
  }
);

// ==============================
// SLICE
// ==============================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // array of product IDs
    count: 0,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        // Filter out any wishlist items where product is undefined (deleted)
        const validItems = action.payload.filter(item => item.product);
        state.items = validItems.map(item => item.product.id);
        state.count = state.items.length;
        state.error = null;
      })
      // ADD
      .addCase(addToWishlist.fulfilled, (state, action) => {
  if (action.payload.product && !state.items.includes(action.payload.product.id)) {
    state.items.push(action.payload.product.id);
    state.count += 1;
  }
})

      // REMOVE
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
        state.count = state.items.length;
        state.error = null;
      })
      // ERROR HANDLING
      .addMatcher(
        (action) => action.type.startsWith("wishlist") && action.type.endsWith("rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
