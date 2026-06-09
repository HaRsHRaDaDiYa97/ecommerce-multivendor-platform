import React, { useEffect, useState } from "react";
import privateApi from "../api/privateApi";
import { toast } from "react-toastify";
import {
  ChevronDown, Trash2, Reply, Clock,
  CheckCircle2, Mail, User, MessageSquare,
  Inbox, Loader2
} from "lucide-react";

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  const [replyLoading, setReplyLoading] = useState({});


  const fetchMessages = async () => {
    try {
      const { data } = await privateApi.get("contact/");
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    if (!replyText[id]) return toast.error("Please write a reply first");

    setReplyLoading(prev => ({ ...prev, [id]: true }));

    try {
      await privateApi.patch(`contact/reply/${id}/`, { reply: replyText[id] });

      toast.success("Reply dispatched successfully");

      setReplyText(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      fetchMessages();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(prev => ({ ...prev, [id]: false }));
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await privateApi.delete(`contact/delete/${id}/`);
      toast.success("Message archived");
      fetchMessages();
    } catch {
      toast.error("Deletion failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-300 mb-4" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Opening Inbox...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-black">Support Inbox</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mt-1">
            <Inbox size={12} /> {messages.length} Incoming Inquiries
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Your inbox is clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOpen = openId === msg.id;

            return (
              <div
                key={msg.id}
                className={`transition-all duration-500 bg-white border rounded-[1.5rem] overflow-hidden ${isOpen ? "ring-2 ring-black/5 border-black/10 shadow-xl" : "border-gray-100 hover:border-gray-200"
                  }`}
              >
                {/* ACCORDION HEADER */}
                <div
                  onClick={() => setOpenId(isOpen ? null : msg.id)}
                  className={`flex flex-wrap md:flex-nowrap justify-between items-center p-5 cursor-pointer transition-colors ${isOpen ? "bg-gray-50/50" : "hover:bg-gray-50/30"
                    }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                      {msg.status === "pending" ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div className="truncate">
                      <h3 className="font-semibold text-sm text-black truncate flex items-center gap-2">
                        {msg.subject}
                        {msg.status === "pending" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{msg.name} · {msg.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${msg.status === "pending" ? "bg-amber-100/50 text-amber-700" : "bg-emerald-100/50 text-emerald-700"
                      }`}>
                      {msg.status}
                    </span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-500 ${isOpen && "rotate-180"}`} />
                  </div>
                </div>

                {/* SMOOTH TRANSITION BODY */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden border-t border-gray-50`}
                  style={{
                    maxHeight: isOpen ? "1000px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? "visible" : "hidden"
                  }}
                >
                  <div className="p-6 md:p-8 space-y-8 bg-white">
                    {/* MESSAGE CONTENT */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <User size={12} /> Inquiry Message
                      </label>
                      <div className="bg-gray-50 p-6 rounded-2xl">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* PREVIOUS REPLIES */}
                    {msg.reply && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                          <Reply size={12} /> Previous Response
                        </label>
                        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                          <p className="text-sm text-emerald-900 leading-relaxed">{msg.reply}</p>
                        </div>
                      </div>
                    )}

                    {/* ACTION AREA */}
                    <div className="pt-4 space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        Compose Reply
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all shadow-sm"
                          placeholder="Type your response here..."
                          value={replyText[msg.id] || ""}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(msg.id)}
                            disabled={replyLoading[msg.id]}
                            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10
                              ${replyLoading[msg.id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:opacity-85 active:scale-95 text-white"
                              }`}
                          >
                            {replyLoading[msg.id] ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Reply size={16} />
                                Send Reply
                              </>
                            )}
                          </button>


                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="bg-white border border-red-100 text-red-500 px-4 py-3 rounded-xl hover:bg-red-50 transition-all active:scale-95"
                            title="Delete Message"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}