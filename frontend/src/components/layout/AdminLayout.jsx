import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Users, ShoppingBag, LogOut, Menu, 
  BarChart3, Tags, Handshake, X, Bell, Mail, 
  Wallet
} from 'lucide-react';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

 const navItems = [
    { name: 'Global Stats', icon: <BarChart3 size={20}/>, path: '/admin' },
    { name: 'User Management', icon: <Users size={20}/>, path: '/admin/user' },
    { name: 'All Products', icon: <ShoppingBag size={20}/>, path: '/admin/products' },
    { name: 'Categories', icon: <Tags size={20}/>, path: '/admin/categories' },
    
    { name: 'Tags', icon: <Tags size={20}/>, path: '/admin/tags' },
    { name: 'Seller Management', icon: <Handshake size={20}/>, path: '/admin/sellers' },
    { name: 'Seller Request', icon: <Bell size={20}/>, path: '/admin/seller-request' },
    { name: 'Contact Messages', icon: <Mail size={20}/>, path: '/admin/contact' }, // Added Contact
    { name: 'Withdraw Requests', icon: <Wallet size={20}/>, path: '/admin/withdraws' },

  ];


  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-50 bg-white">
        <div className="bg-black p-1.5 rounded-lg">
          <ShieldCheck className="text-white" size={24} />
        </div>
        {isOpen && <span className="font-bold text-lg tracking-tighter text-black uppercase">Admin Panel</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}>
                {item.icon}
              </span>
              {isOpen && <span className="ml-3 font-semibold text-sm">{item.name}</span>}
              {isActive && isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout / Bottom Action */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => navigate('/')} 
          className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={20}/>
          {isOpen && <span className="ml-3">Exit to Site</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col transition-all duration-300 ${isOpen ? 'w-72' : 'w-24'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="w-72 h-full bg-white animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <Menu size={22} />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 hidden sm:block">
              Master Control System
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[11px] font-bold text-gray-600 uppercase">Live Server</span>
             </div>
             {/* User Avatar Placeholder */}
             <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
               AD
             </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}