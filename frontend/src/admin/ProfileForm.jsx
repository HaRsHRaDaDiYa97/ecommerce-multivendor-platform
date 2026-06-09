import { useState } from "react";
import privateApi from "../api/privateApi";

export default function ProfileForm({ user, onUpdated }) {
  const [form, setForm] = useState({
    full_name: user.full_name,
    email: user.email,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await privateApi.put("users/profile/", form);
      alert("Profile updated successfully ✅");
      onUpdated();
    } catch (err) {
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-5 space-y-4">

      <h2 className="text-xl font-semibold">Basic Information</h2>

      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Full Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Email"
      />

      <button
        disabled={saving}
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}
