import React, { useState } from "react";
import { toast } from "react-toastify";
import publicApi from "../api/publicApi";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await publicApi.post("contact/send/", {
        name,
        email,
        subject,
        message,
      });

      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">Get in touch</span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-black">
            How can we <span className="font-serif italic text-gray-700 text-3xl md:text-5xl">help you?</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Whether you have a question about our curated collection or need assistance with an order, our concierge team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* CONTACT INFO (Concierge Sidebar) */}
          <div className="lg:col-span-4 space-y-12 order-2 lg:order-1">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email Us</h4>
                  <p className="text-black font-medium">concierge@elitehub.com</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Call Us</h4>
                  <p className="text-black font-medium">+1 (234) 567-890</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Concierge Hours</h4>
                  <p className="text-black font-medium text-sm">Mon - Fri: 9am - 6pm EST</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-[2rem] space-y-4">
              <h4 className="text-sm font-semibold text-black">Wholesale Inquiries</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Interested in partnering with EliteHub? Please reach out to our partnerships team directly.
              </p>
              <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 transition-colors">
                Partnership Details
              </button>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] md:p-4">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Alexander Pierce"
                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we assist you?"
                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Your Message</label>
                  <textarea
                    placeholder="Type your message here..."
                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm h-40 focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-80 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:bg-gray-400"
                  >
                    {loading ? "Transmitting..." : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}