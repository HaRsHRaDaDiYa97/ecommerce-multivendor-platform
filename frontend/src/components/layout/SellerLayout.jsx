import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, 
  LogOut, Menu, X, PlusCircle, Store, Wallet, RotateCcw
} from 'lucide-react';

export default function SellerLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/seller-panel' },
    { name: 'My Products', icon: <Package size={20}/>, path: '/seller-panel/my-products' },
    { name: 'Add Product', icon: <PlusCircle size={20}/>, path: '/seller-panel/add-product' },
    { name: 'Orders', icon: <ShoppingCart size={20}/>, path: '/seller-panel/my-orders' },
    { name: 'Earnings', icon: <Wallet size={20}/>, path: '/seller-panel/earnings' },
    { name: 'Returns', icon: <RotateCcw size={20}/>, path: '/seller-panel/returns' },
    { name: 'Store Settings', icon: <Store size={20}/>, path: '/seller-panel/store' },

  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Brand Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/10">
            <Store size={18} />
          </div>
          {(isSidebarOpen || isMobileOpen) && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in duration-500">
              <span className="font-black text-[11px] tracking-tighter text-black uppercase">Elite Panel</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Partner</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-black'}`}>
                {item.icon}
              </span>
              {(isSidebarOpen || isMobileOpen) && (
                <span className="ml-3 text-[13px] font-bold uppercase tracking-tight overflow-hidden whitespace-nowrap animate-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Exit Action */}
      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={() => navigate('/')} 
          className="w-full flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform"/>
          {(isSidebarOpen || isMobileOpen) && <span className="ml-3">Exit</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-black overflow-hidden font-sans">
      
      {/* 1. Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {/* 2. Mobile Drawer (Overlay + Content) */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 md:hidden ${isMobileOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMobileOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMobileOpen(false)}
        />
        {/* Drawer Panel */}
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-white transition-transform duration-500 ease-out shadow-2xl ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-4 right-4 md:hidden">
             <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={18} />
             </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(true);
                else setSidebarOpen(!isSidebarOpen);
              }} 
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
            >
              <Menu size={20} className="text-black" />
            </button>
            <div className="h-4 w-[px] bg-gray-200 hidden sm:block"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hidden lg:block">
              Fulfillment Management System
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[11px] font-black uppercase tracking-tighter">Elite Partner</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Active Store</span>
              </div>
            </div>
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/10 cursor-pointer hover:scale-105 transition-transform">
              S
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#FAFAFA]">
          <div className="p-4 md:p-10 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}