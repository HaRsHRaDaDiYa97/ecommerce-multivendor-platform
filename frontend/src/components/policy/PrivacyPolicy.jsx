import React from "react";
import { ShieldCheck, EyeOff, Lock, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Encryption Standard</span>
            <h1 className="text-5xl font-medium tracking-tight text-black mb-6">Your privacy is <br/>our priority.</h1>
            <p className="text-gray-500 leading-relaxed">We use industry-leading encryption and security protocols to ensure your personal data remains yours alone.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center text-center">
              <Lock size={24} className="mb-3 text-black"/>
              <span className="text-[10px] font-bold uppercase tracking-tighter">AES-256 Bit</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center text-center mt-8">
              <EyeOff size={24} className="mb-3 text-black"/>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Zero Tracking</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-medium mb-10 text-black">Data Collection Transparency</h2>
            <div className="space-y-10">
              <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-widest text-black">Information We Collect</h4>
                <p className="text-sm text-gray-500 leading-relaxed">We collect your name, shipping address, and email solely to fulfill your orders and provide a personalized experience.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-widest text-black">Third Party Disclosure</h4>
                <p className="text-sm text-gray-400 leading-relaxed">EliteHub never sells, trades, or rents your personal information to outside parties. We only share data with trusted logistics partners.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}