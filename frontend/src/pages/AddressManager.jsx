import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
} from "../store/addressSlice";

export default function AddressManager() {
  const dispatch = useDispatch();
  const { list, defaultAddress } = useSelector((s) => s.address);

  const [form, setForm] = useState({
    label: "",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (editingId) {
      dispatch(updateAddress({ id: editingId, formData: form }));
    } else {
      dispatch(addAddress(form));
    }

    setForm({
      label: "",
      full_name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    });

    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Addresses</h2>

      {/* FORM */}
      <form onSubmit={submitHandler} className="grid grid-cols-2 gap-3 mb-8">
        <input placeholder="Label (Home/Office)" required
          value={form.label}
          onChange={(e)=>setForm({...form,label:e.target.value})}
          className="border p-2 rounded"/>

        <input placeholder="Full Name" required
          value={form.full_name}
          onChange={(e)=>setForm({...form,full_name:e.target.value})}
          className="border p-2 rounded"/>

        <input placeholder="Phone"
          value={form.phone}
          onChange={(e)=>setForm({...form,phone:e.target.value})}
          className="border p-2 rounded"/>

        <input placeholder="City"
          value={form.city}
          onChange={(e)=>setForm({...form,city:e.target.value})}
          className="border p-2 rounded"/>

        <input placeholder="State"
          value={form.state}
          onChange={(e)=>setForm({...form,state:e.target.value})}
          className="border p-2 rounded"/>

        <input placeholder="Pincode"
          value={form.pincode}
          onChange={(e)=>setForm({...form,pincode:e.target.value})}
          className="border p-2 rounded"/>

        <textarea placeholder="Full Address"
          value={form.address}
          onChange={(e)=>setForm({...form,address:e.target.value})}
          className="border p-2 rounded col-span-2"/>

        <label className="col-span-2 flex gap-2 items-center">
          <input type="checkbox"
            checked={form.is_default}
            onChange={(e)=>setForm({...form,is_default:e.target.checked})}/>
          Set as default
        </label>

        <button className="bg-black text-white py-2 rounded col-span-2">
          {editingId ? "Update Address" : "Add Address"}
        </button>
      </form>

      {/* ADDRESS LIST */}
      <div className="space-y-4">
        {list.map(addr => (
          <div key={addr.id} className={`border p-4 rounded-lg ${defaultAddress?.id===addr.id?"border-black":""}`}>
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">{addr.label}</h4>
                <p>{addr.full_name}</p>
                <p>{addr.address}</p>
                <p>{addr.city} {addr.state} - {addr.pincode}</p>
                <p>{addr.phone}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={()=>dispatch(selectAddress(addr))}>Use</button>

                <button onClick={()=>{
                  setForm(addr);
                  setEditingId(addr.id);
                }}>
                  Edit
                </button>

                <button onClick={()=>dispatch(deleteAddress(addr.id))}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
