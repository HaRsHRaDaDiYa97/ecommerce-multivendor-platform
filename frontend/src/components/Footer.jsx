import React from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiArrowUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const mainMenuLinks = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "Contact Us", to: "/contact" },
  { name: "About Us", to: "/about" },
];

const policiesLinks = [
  { name: "Terms of Service", to: "/terms" },
  { name: "Shipping Policy", to: "/shipping" },
  { name: "Refund Policy", to: "/refund" },
  { name: "Privacy Policy", to: "/privacy" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- TOP SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="max-w-md">
            <Link to="/" className="inline-block mb-8">
              <h2 className="text-4xl font-black tracking-[ -0.05em] uppercase italic transition-opacity hover:opacity-80">
                ELITEHUB<span className="text-gray-500 text-lg">.</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-[11px] leading-loose font-bold uppercase tracking-[0.2em]">
              The standard of modern curation. We provide a bridge between timeless craftsmanship and contemporary minimalism.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-gray-600">
               Top of Page
             </p>
             <button 
               onClick={scrollToTop}
               className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-700 group shadow-2xl"
               aria-label="Scroll to top"
             >
               <FiArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* --- LINKS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16">
          
          {/* Menu */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-gray-700">Catalogue</h4>
            <ul className="space-y-5">
              {mainMenuLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.to} 
                    className="text-xs font-black uppercase tracking-widest hover:text-gray-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-gray-700">Guidelines</h4>
            <ul className="space-y-5">
              {policiesLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.to} 
                    className="text-xs font-black uppercase tracking-widest hover:text-gray-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Community */}
          <div className="col-span-2 flex flex-col items-start md:items-end">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-gray-700">The Collective</h4>
            <div className="flex gap-8 mb-8">
              <a href="#" className="text-2xl hover:scale-110 transition-transform"><FiInstagram /></a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform"><FiFacebook /></a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform"><FiTwitter /></a>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em] text-left md:text-right max-w-[200px]">
              Join our community for early access to limited edition drops.
            </p>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} ELITEHUB COLLECTIVE
            </p>
            <p className="text-[9px] font-bold text-gray-800 uppercase tracking-[0.2em]">
              Architected for Premium Experiences
            </p>
          </div>
          
          {/* Minimalist Payment Representation */}
          <div className="flex items-center gap-3 opacity-20">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-[1px] w-8 bg-white" />
             ))}
             <span className="text-[8px] font-black uppercase tracking-widest">Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;