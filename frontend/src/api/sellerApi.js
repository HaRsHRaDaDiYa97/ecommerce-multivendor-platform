import privateApi from "./privateApi";



// sellerApi.js


// ✅ NEW: Dashboard Stats API
export const getSellerDashboardStats = async () => {
  const res = await privateApi.get("orders/seller/dashboard/");
  return res.data;
};

export const getSellerOrders = async () => {
  const res = await privateApi.get("orders/seller/orders/"); // <-- add "orders/" prefix
  return res.data;
};

export const getSellerOrdersByStatus = async (status) => {
  const res = await privateApi.get(`orders/seller/orders/${status}/`);
  return res.data;
};

export const updateItemStatus = async (itemId, status) => {
  const res = await privateApi.patch(`orders/seller/item/${itemId}/status/`, { status });
  return res.data;
};

export const getSellerEarnings = async () => {
  const res = await privateApi.get("orders/seller/earnings/");
  return res.data;
};

export const getReturnRequests = async () => {
  const res = await privateApi.get("orders/seller/returns/");
  return res.data;
};

export const handleReturnRequest = async (itemId, action) => {
  const res = await privateApi.patch(`orders/seller/return/${itemId}/`, { action });
  return res.data;
};

export const createWithdrawRequest = async (amount) => {
  const res = await privateApi.post("orders/seller/withdraw/", {
    amount,
  });
  return res.data;
};





// ================= ADMIN WALLET =================

// get all withdraw requests
export const getAdminWithdrawRequests = async () => {
  const res = await privateApi.get("orders/admin/withdraws/");
  return res.data;
};

// approve withdraw with note
export const approveAdminWithdraw = async (id, admin_note = "") => {
  const res = await privateApi.patch(
    `orders/admin/withdraws/${id}/approve/`,
    { admin_note }  // <-- send note here
  );
  return res.data;
};

// reject withdraw with note
export const rejectAdminWithdraw = async (id, admin_note = "") => {
  const res = await privateApi.patch(
    `orders/admin/withdraws/${id}/reject/`,
    { admin_note }  // <-- send note here
  );
  return res.data;
};
