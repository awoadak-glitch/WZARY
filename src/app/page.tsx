"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, GraduationCap, ArrowLeft, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // كود الدخول الافتراضي للمنصة هو: 2026
    if (password === "2026") {
      localStorage.setItem("student_auth", "true");
      router.push("/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`glass-effect w-full max-w-md p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden ${
          error ? "animate-shake" : ""
        }`}
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#9d4edd]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#f72585]/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mx-auto w-20 h-20 bg-gradient-to-tr from-[#f72585] to-[#9d4edd] rounded-2xl flex items-center justify-center shadow-lg shadow-[#9d4edd]/30 mb-6"
        >
          <GraduationCap className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-[#4cc9f0] bg-clip-text text-transparent mb-2">
          الْمَنْهَج الشَّامِل
        </h1>
        <p className="text-sm text-slate-400 mb-8">إجابات نموذجية • نماذج وزارية • مساعد ذكي</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              placeholder="أدخل كلمة المرور (التجريبية: 2026)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pr-12 pl-4 text-white text-center tracking-widest focus:outline-none focus:border-[#9d4edd] focus:ring-1 focus:ring-[#9d4edd] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9d4edd] to-[#f72585] hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#f72585]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            تسجيل الدخول للمنصة
            <ArrowLeft className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 border-t border-slate-900 pt-4">
          <button type="button" onClick={() => alert('تواصل مع مشرف الشبكة أو الأستاذ للحصول على كود التفعيل الخاص بك.')} className="text-sm text-[#4cc9f0] hover:underline flex items-center justify-center gap-2 mx-auto">
            <HelpCircle className="w-4 h-4" />
            طلب كلمة مرور للطالب
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-8">إعداد: عمرو كريم</p>
      </motion.div>
    </div>
  );
}
