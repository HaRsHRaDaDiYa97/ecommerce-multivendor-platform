// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../features/auth/authSlice";
// import { fetchWishlist } from "../features/wishlist/wishlistSlice";
// import publicApi from "../api/publicApi";

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await publicApi.post("users/login/", credentials);

//       // ✅ Construct payload correctly
//       const payload = {
//         user: res.data.user,
//         access: res.data.access,
//         refresh: res.data.refresh,
//       };

//       // ✅ Dispatch loginSuccess with full payload
//       dispatch(loginSuccess(payload));

//       // ✅ Fetch wishlist after token is saved
//       dispatch(fetchWishlist());

//       // ✅ Navigate
//       if (payload.user.role === "ADMIN") navigate("/admin");
//       else if (payload.user.role === "SELLER") navigate("/seller-panel");
//       else navigate("/");

//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Invalid credentials or login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl">
//         <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={credentials.email}
//             onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//           <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-bold">
//             Sign In
//           </button>
//         </form>
//         <p className="mt-6 text-center">
//           New? <Link to="/register" className="text-blue-600 underline">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { fetchWishlist } from "../features/wishlist/wishlistSlice";
import publicApi from "../api/publicApi";
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await publicApi.post("users/login/", credentials);

      const payload = {
        user: res.data.user,
        access: res.data.access,
        refresh: res.data.refresh,
      };

      dispatch(loginSuccess(payload));
      dispatch(fetchWishlist());

      if (payload.user.role === "ADMIN") navigate("/admin");
      else if (payload.user.role === "SELLER") navigate("/seller-panel");
      else navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials or login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 placeholder:text-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gray-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gray-100 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] border border-gray-50">
          
          {/* LOGO/ICON */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
               <Sparkles className="text-white" size={28} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Enter your details to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                className={inputClasses}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                className={inputClasses}
              />
            </div>

            <div className="flex justify-end pt-1">
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              disabled={isLoading}
              className="group w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 disabled:bg-gray-400"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-black font-bold border-b border-black/10 hover:border-black transition-all pb-0.5">
                Join the Elite
              </Link>
            </p>
          </div>
        </div>

        {/* SECURE BADGE */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
           <div className="w-1 h-1 rounded-full bg-emerald-500" />
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};

export default Login;