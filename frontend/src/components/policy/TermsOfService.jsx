import React from "react";

export default function TermsOfService() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 md:p-20 rounded-[3rem] shadow-sm border border-gray-100">
        <header className="mb-16 border-b border-gray-100 pb-10">
          <h1 className="text-4xl font-medium tracking-tight mb-4 text-black">Terms of Service</h1>
          <p className="text-sm text-gray-400">Effective Date: January 26, 2026</p>
        </header>

        <div className="space-y-12 text-gray-600 leading-relaxed">
          {[
            { title: "Acceptance of Terms", text: "By accessing EliteHub, you agree to be bound by these Terms of Service and all applicable laws and regulations." },
            { title: "User Accounts", text: "You are responsible for maintaining the confidentiality of your account and password. EliteHub reserves the right to refuse service or terminate accounts." },
            { title: "Intellectual Property", text: "All content, including imagery, logos, and copy, is the exclusive property of EliteHub and protected by international copyright laws." },
            { title: "Limitation of Liability", text: "EliteHub shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services." }
          ].map((section, idx) => (
            <section key={idx}>
              <h2 className="text-lg font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-black"></span> {section.title}
              </h2>
              <p className="text-sm md:text-base">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}