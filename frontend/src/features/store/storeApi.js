import privateApi from "../../api/privateApi";
import publicApi from "../../api/publicApi";

/* =========================================================
   PUBLIC STORE (Customer Side)
========================================================= */

// Get store by slug
export const fetchStoreBySlug = async (slug) => {
  try {
    const { data } = await publicApi.get(`stores/${slug}/`);
    return data;
  } catch (error) {
    console.error("Fetch store error:", error?.response?.data || error.message);
    return null;
  }
};


/* =========================================================
   FOLLOW SYSTEM
========================================================= */

// Follow / Unfollow store
export const toggleFollowStore = async (slug) => {
  try {
    const { data } = await privateApi.post(`stores/${slug}/follow/`);
    return data;
  } catch (error) {
    console.error("Follow store error:", error?.response?.data || error.message);
    throw error;
  }
};

// Get all followed stores
export const fetchFollowingStores = async () => {
  try {
    const { data } = await privateApi.get(`stores/following/`);
    return data || [];
  } catch (error) {
    console.error("Following stores error:", error?.response?.data || error.message);
    return [];
  }
};


/* =========================================================
   SELLER STORE (Seller Panel)
========================================================= */

// Get seller own store
export const fetchMyStore = async () => {
  try {
    const { data } = await privateApi.get(`stores/me/`);
    return data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return null; // ✅ IMPORTANT FIX
    }

    console.error("My store fetch error:", error?.response?.data || error.message);
    throw error;
  }
};


// Update seller store
export const updateMyStore = async (formData) => {
  try {
    const { data } = await privateApi.patch(`stores/me/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Update store error:", error?.response?.data || error.message);
    throw error;
  }
};
