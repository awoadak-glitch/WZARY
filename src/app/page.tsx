"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // إذا كان المستخدم مسجل دخوله بالفعل، يتم توجيهه تلقائياً للوحة التحكم
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role) {
      window.location.href = "./dashboard";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    // 1. التحقق من كود الإدمن الماستر
    if (password === "Admin2026") {
      localStorage.setItem("user_role", "admin");
      localStorage.setItem("user_token", "Admin2026");
      window.location.href = "./dashboard";
      return;
    }

    try {
      // 2. التحقق من وجود الرمز داخل السيرفر للطلاب
      const q = query(collection(db, "tokens"), where("code", "==", password.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem("user_role", "student");
        localStorage.setItem("user_token", password.trim());
        window.location.href = "./dashboard";
      } else {
        setError("رمز الدخول غير صحيح أو تم إلغاء تفعيله!");
        setLoading(false);
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية.");
      setLoading(false);
    }
  };

  const handleWhatsAppRequest = () => {
    const phoneNumber = "967782217679";
    const message = encodeURIComponent("مرحباً أستاذ، أريد الحصول على كلمة المرور الخاصة بمنصة المنهج الشامل التعليمية.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070510] text-white px-4 relative overflow-hidden">
      {/* تأثير إضاءة النيون الخلفية */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-pink-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#13112a]/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/20 text-center relative z-10">
        
        {/* شعار المنصة */}
        <div className="text-5xl mb-4 animate-bounce duration-1000">📚</div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 tracking-wide">
          الْمَنْهَجُ الشَّامِل
        </h1>
        <p className="text-gray-400 text-sm mb-8 font-light">إجابات نموذجية • نماذج وزارية • مساعد ذكي</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              placeholder={loading ? "جاري التحقق من السيرفر..." : "أدخل رمز الدخول الخاص بك"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1c1936] border border-gray-700/60 rounded-xl py-3.5 px-4 text-center focus:outline-none focus:border-purple-500 transition-all text-white placeholder-gray-500 font-medium"
            />
            <span className="absolute right-4 top-4 text-gray-500">🔑</span>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 py-2 rounded-lg text-center font-medium animate-pulse">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-xl shadow-purple-600/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول للمنصة"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800/60">
          <button
            onClick={handleWhatsAppRequest}
            className="w-full bg-transparent border border-green-500/40 hover:bg-green-500/10 text-green-400 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            💬 طلب كلمة مرور للطالب (واتساب)
          </button>
        </div>

        <p className="text-purple-400/60 text-xs mt-8 font-bold tracking-widest">إعداد وتطوير: الديفل ⚡</p>
      </div>
    </div>
  );
}
