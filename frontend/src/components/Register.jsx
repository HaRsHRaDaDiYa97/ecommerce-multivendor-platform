// // src/components/Register.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import publicApi from '../api/publicApi';

// const Register = () => {
//   const [formData, setFormData] = useState({ email: '', full_name: '', password: '' });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await publicApi.post('users/register/', formData);
//       alert("Registration Successful! Please login.");
//       navigate('/login');
//     } catch (err) {
//       alert("Error: " + JSON.stringify(err.response.data));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <input type="text" placeholder="Full Name" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
//             onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
//           <input type="email" placeholder="Email address" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
//             onChange={(e) => setFormData({...formData, email: e.target.value})} />
//           <input type="password" placeholder="Password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
//             onChange={(e) => setFormData({...formData, password: e.target.value})} />
//           <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
//             Sign Up
//           </button>
//         </form>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;





import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import publicApi from '../api/publicApi';
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', full_name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await publicApi.post('users/register/', formData);
      // Using a more modern alert flow is recommended, but kept logic same
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 placeholder:text-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
      {/* AMBIENT BACKGROUND DECOR */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-gray-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[25%] bg-gray-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[3rem] border border-gray-50">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20">
              <UserPlus className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2 text-center">Join the Collective</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center">
              Create your profile to start your journey
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                className={inputClasses}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                className={inputClasses}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Secure Password" 
                required 
                className={inputClasses}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="group w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* REDIRECT TO LOGIN */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-bold border-b border-black/10 hover:border-black transition-all pb-0.5 ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* POLICY FOOTER */}
        <p className="mt-8 text-[9px] text-center text-gray-400 px-6 font-medium leading-relaxed uppercase tracking-widest">
          By signing up, you agree to our <span className="text-gray-600">Terms of Service</span> and <span className="text-gray-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Register;