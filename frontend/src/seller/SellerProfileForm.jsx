import { useState } from "react";
import privateApi from "../api/privateApi";

export default function SellerProfileForm({ seller, onUpdated }) {
  const [form, setForm] = useState({
    shop_name: seller.shop_name,
    business_address: seller.business_address,
    tax_id: seller.tax_id,
    phone_number: seller.phone_number,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await privateApi.put("users/profile/seller/", form);
      alert("Seller profile updated ✅");
      onUpdated();
    } catch (err) {
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-5 space-y-4">

      <h2 className="text-xl font-semibold">Shop Information</h2>

      <input
        name="shop_name"
        value={form.shop_name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Shop Name"
      />

      <textarea
        name="business_address"
        value={form.business_address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Business Address"
      />

      <input
        name="tax_id"
        value={form.tax_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Tax ID"
      />

      <input
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Phone Number"
      />

      <button
        disabled={saving}
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Update Shop"}
      </button>

    </div>
  );
}
