// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   FiSearch,
//   FiUser,
//   FiShoppingBag,
//   FiMenu,
//   FiX,
//   FiLogOut,
//   FiArrowRight,
// } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice";
// import { fetchCart, clearCart } from "../features/cart/cartSlice";
// import { fetchWishlist, clearWishlist } from "../features/wishlist/wishlistSlice";
// import { FiHeart } from "react-icons/fi";



// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate();

//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);


//   const cartCount = useSelector((state) => state.cart.count);
//   const wishlistCount = useSelector((state) => state.wishlist.count);


//   useEffect(() => {
//   const token = localStorage.getItem("access");

//   if (isAuthenticated && token) {
//     dispatch(fetchCart());
//     dispatch(fetchWishlist());
//   } else {
//     dispatch(clearCart());
//     dispatch(clearWishlist());
//   }
// }, [isAuthenticated, dispatch]);



//   const navLinks = [
//     { name: "Home", href: "/" },
//     { name: "Products", href: "/products" },
//     { name: "Contact Us", href: "/contact" },
//     { name: "About Us", href: "/about" },
//   ];

//   const handleLogout = () => {
//     dispatch(logout());
//     setIsProfileMenuOpen(false);
//     setIsMenuOpen(false);
//     navigate("/login");
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
//         setIsProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
//         <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">

//           {/* LEFT: Mobile Menu Toggle & Logo */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsMenuOpen(true)}
//               className="md:hidden p-2 -ml-2 text-gray-700 active:bg-gray-100 rounded-full transition-colors"
//             >
//               <FiMenu size={24} />
//             </button>
//             <Link to="/" className="flex items-center">
//               <span className="text-xl md:text-2xl font-semibold tracking-tight text-black">
//                 <h1 className="text-2xl font-black tracking-tighter uppercase italic group-hover:opacity-70 transition-opacity">
//                   ELITEHUB<span className="text-gray-400">.</span>
//                 </h1>
//               </span>
//             </Link>
//           </div>

//           {/* CENTER: Navigation (Desktop Only) */}
//           <nav className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.name}
//                 to={link.href}
//                 className={({ isActive }) => `
//                   text-[13px] font-medium uppercase tracking-wider transition-all duration-200
//                   ${isActive ? "text-black" : "text-gray-500 hover:text-black"}
//                 `}
//               >
//                 {link.name}
//               </NavLink>
//             ))}
//           </nav>

//           {/* RIGHT: User Actions */}
//           <div className="flex items-center gap-2 md:gap-5 text-gray-700">
//             <Link to="/products" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:flex">
//               <FiSearch size={20} />
//             </Link>

//             <div className="relative hidden md:block" ref={profileMenuRef}>
//               <button
//                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                 className="p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center"
//               >
//                 <FiUser size={20} />
//               </button>

//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-3 w-56 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl ring-1 ring-black ring-opacity-5">
//                   <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
//                     <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Member Account</p>
//                     <p className="text-sm font-medium text-black truncate">{user?.full_name || "Guest"}</p>
//                   </div>
//                   <div className="py-1">
//                     {!isAuthenticated ? (
//                       <>
//                         <Link to="/login" className="menu-item-clean">Sign In</Link>
//                         <Link to="/register" className="menu-item-clean">Join EliteHub</Link>
//                       </>
//                     ) : (
//                       <>
//                         {user?.role === "ADMIN" && <Link to="/admin" className="menu-item-clean">Admin Workspace</Link>}
//                         {user?.role === "SELLER" && <Link to="/seller-panel" className="menu-item-clean">Seller Dashboard</Link>}
//                         <Link to="/profile" className="menu-item-clean">My Profile</Link>
//                         <hr className="my-1 border-gray-100" />
//                         <button onClick={handleLogout} className="w-full text-left menu-item-clean text-red-600">
//                           Sign Out
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

// <Link to="/wishlist" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
//   <FiHeart size={20} />
//   {wishlistCount > 0 && (
//     <span className="absolute top-1 right-1 bg-black text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-medium">
//       {wishlistCount}
//     </span>
//   )}
// </Link>

//             <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
//               <FiShoppingBag size={20} />
//               {cartCount > 0 && (
//                 <span className="absolute top-1 right-1 bg-black text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-medium">
//                   {cartCount}
//                 </span>
//               )}

//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ================= MOBILE MENU DRAWER ================= */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
//         {/* Overlay */}
//         <div
//           onClick={() => setIsMenuOpen(false)}
//           className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
//         />

//         {/* Side Panel */}
//         <div className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
//           <div className="flex flex-col h-full">
//             <div className="flex items-center justify-between p-6 border-b border-gray-50">
//               <span className="text-lg font-semibold tracking-tight">ELITEHUB</span>
//               <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full"><FiX /></button>
//             </div>

//             <nav className="p-6 space-y-4">
//               {navLinks.map((link) => (
//                 <NavLink
//                   key={link.name}
//                   to={link.href}
//                   onClick={() => setIsMenuOpen(false)}
//                   className="block text-lg font-medium text-gray-600 hover:text-black transition-colors"
//                 >
//                   {link.name}
//                 </NavLink>
//               ))}
//             </nav>

//             <div className="mt-auto p-6 border-t border-gray-50">
//               {!isAuthenticated ? (
//                 <div className="flex flex-col gap-3">
//                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-black text-white rounded-lg text-sm font-medium">Login</Link>
//                   <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">Create Account</Link>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
//                     <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold">{user?.full_name?.charAt(0)}</div>
//                     <div className="overflow-hidden">
//                       <p className="text-sm font-semibold truncate">{user?.full_name}</p>
//                       <p className="text-[11px] text-gray-500 uppercase tracking-tighter">Gold Member</p>
//                     </div>
//                   </div>

//                   {user?.role === "ADMIN" && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center justify-between text-sm text-gray-600">Admin Panel <FiArrowRight /></Link>}
//                   {user?.role === "SELLER" && <Link to="/seller-panel" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center justify-between text-sm text-gray-600">Seller Panel <FiArrowRight /></Link>}
//                   {user?.role === "USER" && <Link to="/become-seller" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center justify-between text-sm text-gray-600">Become Seller <FiArrowRight /></Link>}


//                   <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-sm text-gray-600">Account Settings <FiArrowRight /></Link>
//                   <button onClick={handleLogout} className="flex items-center justify-between w-full text-sm text-red-600 font-medium pt-2">Logout <FiLogOut /></button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .menu-item-clean {
//           display: block;
//           padding: 10px 16px;
//           font-size: 13px;
//           color: #374151;
//           transition: background 0.2s ease;
//         }
//         .menu-item-clean:hover {
//           background: #f9fafb;
//           color: #000;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;







import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiLogOut,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { fetchCart, clearCart } from "../features/cart/cartSlice";
import { fetchWishlist, clearWishlist } from "../features/wishlist/wishlistSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const cartCount = useSelector((state) => state.cart.count);
  const wishlistCount = useSelector((state) => state.wishlist.count);

 // Determine profile link based on role
  const profileLink = (() => {
    if (!isAuthenticated) return "/login";
    if (user.role === "ADMIN") return "/admin/profile";
    if (user.role === "SELLER") return "/seller-panel/profile";
    return "/profile"; // normal user
  })();



  // Fetch cart & wishlist only if logged in
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (isAuthenticated && token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    } else {
      dispatch(clearCart());
      dispatch(clearWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
          {/* LEFT: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-700 active:bg-gray-100 rounded-full transition-colors"
            >
              <FiMenu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                ELITEHUB<span className="text-gray-400">.</span>
              </h1>
            </Link>
          </div>

          {/* CENTER: Navigation (Desktop Only) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-[13px] font-medium uppercase tracking-wider transition-all duration-200
                  ${isActive ? "text-black" : "text-gray-500 hover:text-black"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: User Actions */}
          <div className="flex items-center gap-2 md:gap-5 text-gray-700">
            <Link
              to="/products"
              className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:flex"
            >
              <FiSearch size={20} />
            </Link>

            <div className="relative hidden md:block" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center"
              >
                <FiUser size={20} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                      Member Account
                    </p>
                    <p className="text-sm font-medium text-black truncate">
                      {user?.full_name || "Guest"}
                    </p>
                  </div>
                  <div className="py-1">
                    {!isAuthenticated ? (
                      <>
                        <Link to="/login" className="menu-item-clean">
                          Sign In
                        </Link>
                        <Link to="/register" className="menu-item-clean">
                          Join EliteHub
                        </Link>
                      </>
                    ) : (
                      <>
                        {user?.role === "ADMIN" && (
                          <Link to="/admin" className="menu-item-clean">
                            Admin Workspace
                          </Link>
                        )}
                        {user?.role === "SELLER" && user?.is_seller && (
                          <Link to="/seller-panel" className="menu-item-clean">
                            Seller Dashboard
                          </Link>
                        )}
                        <Link to={profileLink} className="menu-item-clean">
                          My Profile
                        </Link>
                        {user?.role === "USER" && (
                          <Link to="/become-seller" className="menu-item-clean">
                            Become Seller
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left menu-item-clean text-red-600"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"
          }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Side Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <span className="text-lg font-semibold tracking-tight">ELITEHUB</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-gray-50 rounded-full"
              >
                <FiX />
              </button>
            </div>

            <nav className="p-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto p-6 border-t border-gray-50">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-3 bg-black text-white rounded-lg text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-3 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold">
                      {user?.full_name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate">{user?.full_name}</p>
                      <p className="text-[11px] text-gray-500 uppercase tracking-tighter">
                        {user?.role === "SELLER" && user?.is_seller
                          ? "Seller"
                          : "Gold Member"}
                      </p>
                    </div>
                  </div>

                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-nav-link flex items-center justify-between text-sm text-gray-600"
                    >
                      Admin Panel <FiArrowRight />
                    </Link>
                  )}
                  {user?.role === "SELLER" && user?.is_seller && (
                    <Link
                      to="/seller-panel"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-nav-link flex items-center justify-between text-sm text-gray-600"
                    >
                      Seller Panel <FiArrowRight />
                    </Link>
                  )}
                  {user?.role === "USER" && (
                    <Link
                      to="/become-seller"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-nav-link flex items-center justify-between text-sm text-gray-600"
                    >
                      Become Seller <FiArrowRight />
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between text-sm text-gray-600"
                  >
                    Account Settings <FiArrowRight />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full text-sm text-red-600 font-medium pt-2"
                  >
                    Logout <FiLogOut />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .menu-item-clean {
          display: block;
          padding: 10px 16px;
          font-size: 13px;
          color: #374151;
          transition: background 0.2s ease;
        }
        .menu-item-clean:hover {
          background: #f9fafb;
          color: #000;
        }
      `}</style>
    </>
  );
};

export default Header;
