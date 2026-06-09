import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import privateApi from "../../api/privateApi";

/* ================= FETCH ADDRESSES ================= */
export const fetchAddresses = createAsyncThunk(
  "address/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await privateApi.get("users/addresses/");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch addresses"
      );
    }
  }
);

/* ================= ADD ADDRESS ================= */
export const addAddress = createAsyncThunk(
  "address/add",
  async (formData, thunkAPI) => {
    try {
      const { data } = await privateApi.post(
        "users/addresses/add/",
        formData
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add address"
      );
    }
  }
);

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await privateApi.patch(
        `users/addresses/${id}/`,
        formData
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update address"
      );
    }
  }
);

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      await privateApi.delete(
        `users/addresses/${id}/`
      );
      return id; // we return id manually
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete address"
      );
    }
  }
);

/* ================= SLICE ================= */

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
    defaultAddress: null,
    loading: false,
    error: null,
  },

  reducers: {
    selectAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH ADDRESSES */
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 VERY IMPORTANT FIX
        const addresses = Array.isArray(action.payload)
          ? action.payload
          : action.payload.addresses || [];

        state.list = addresses;

        const def =
          addresses.find((a) => a.is_default) ||
          addresses[0] ||
          null;

        state.defaultAddress = def;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD ADDRESS */
      .addCase(addAddress.fulfilled, (state, action) => {
        if (!action.payload?.id) return; // safety check

        state.list.unshift(action.payload);

        if (action.payload.is_default) {
          state.defaultAddress = action.payload;
        }
      })

      /* UPDATE ADDRESS */
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (a) => a.id === action.payload.id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }

        if (action.payload.is_default) {
          state.defaultAddress = action.payload;
        }
      })

      /* DELETE ADDRESS */
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (a) => a.id !== action.payload
        );

        if (state.defaultAddress?.id === action.payload) {
          state.defaultAddress = state.list[0] || null;
        }
      });
  },
});

export const { selectAddress } = addressSlice.actions;
export default addressSlice.reducer;
