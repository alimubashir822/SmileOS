"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Message {
  sender: "user" | "bot";
  text: string;
  link?: string;
  linkLabel?: string;
}

export default function LeadChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Welcome to SmileOS! I'm your virtual clinic assistant. Are you looking to brighten your smile, or would you like to check out our treatments and financing?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickReplies = [
    { label: "Teeth Whitening", text: "I want to know about teeth whitening" },
    { label: "Dental Implants", text: "Tell me about dental implants" },
    { label: "Insurance & Plans", text: "Do you accept insurance or payment plans?" },
    { label: "Book Consultation", text: "How do I book an appointment?" }
  ];

  const getBotResponse = (userInput: string): Message => {
    const text = userInput.toLowerCase();

    if (text.includes("whiten") || text.includes("bright")) {
      return {
        sender: "bot",
        text: "We offer advanced in-office Laser Teeth Whitening. It takes under 60 minutes, is fully pain-free, and makes teeth up to 6 shades brighter! You can schedule a whitening session directly.",
        link: "/book",
        linkLabel: "Book Whitening Session"
      };
    }
    
    if (text.includes("implant") || text.includes("missing")) {
      return {
        sender: "bot",
        text: "SmileOS provides high-grade Zirconium crowns and titanium implants with Dr. Ahmed. The surgery is split into structured, affordable phases. Schedule an implant consult to review your options.",
        link: "/book",
        linkLabel: "Book Implant Consult"
      };
    }

    if (text.includes("insur") || text.includes("plan") || text.includes("finance") || text.includes("cost") || text.includes("pay")) {
      return {
        sender: "bot",
        text: "We accept Delta Dental and other major carriers. We also offer 0% APR flexible co-pay financing split into 6 monthly cycles. You can view our financing page for details.",
        link: "/financing",
        linkLabel: "View Financing Plans"
      };
    }

    if (text.includes("book") || text.includes("appoint") || text.includes("schedul") || text.includes("consult")) {
      return {
        sender: "bot",
        text: "You can book an appointment in under 2 minutes! Select your service, pick a doctor (like Dr. Ahmed or Dr. Smith), and find a slot that fits your schedule.",
        link: "/book",
        linkLabel: "Go to Scheduler"
      };
    }

    return {
      sender: "bot",
      text: "I would be happy to help guide you! We offer implants, veneers, whitening, and aligners. Feel free to ask about our financing plans, clinic locations, or book a session directly.",
      link: "/services",
      linkLabel: "Explore Our Services"
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition transform cursor-pointer animate-pulse-gentle"
          id="receptionist-chat-btn"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex h-[500px] max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] sm:w-[360px] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">SmileOS Virtual Receptionist</h3>
                <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">Online & Ready</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm shadow-slate-100"
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {/* Action Link in message */}
                  {msg.link && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Link
                        href={msg.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700 hover:underline text-xs"
                      >
                        <span>{msg.linkLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-2.5 text-slate-400 text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-slate-100">
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isTyping}
                  className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 text-[10px] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Input Form */}
          <div className="p-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(input);
                }}
                disabled={isTyping}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                placeholder="Ask virtual receptionist..."
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="rounded-lg bg-blue-600 text-white p-2 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
