"use client";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2026") {
      localStorage.setItem("user_role", "student");
      window.location.href = "./dashboard";
    } else if (password === "Admin2026") { // كلمة مرور الإدمن
      localStorage.setItem("user_role", "admin");
      window.location.href = "./dashboard";
    } else {
      setError("كلمة المرور غير صحيحة، يرجى المحاولة مجدداً");
    }
  };

  const handleWhatsAppRequest = () => {
    const phoneNumber = "967782217679"; // رقمك بصيغة دولية صحيحة
    const message = encodeURIComponent("مرحباً أستاذ، أريد الحصول على كلمة المرور الخاصة بمنصة المنهج الشامل التعليمية.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070510] text-white px-4">
      <div className="w-full max-w-md bg-[#13112a]/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center">
        
        {/* شعار المنصة الفخم */}
        <div className="text-5xl mb-4">📚</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          الْمَنْهَجُ الشَّامِل
        </h1>
        <p className="text-gray-400 text-sm mb-8">إجابات نموذجية • نماذج وزارية • مساعد ذكي</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1c1936] border border-gray-700 rounded-xl py-3 px-4 text-center focus:outline-none focus:border-purple-500 transition-all text-white placeholder-gray-500"
            />
            <span className="absolute right-3 top-3.5 text-gray-500">🔑</span>
          </div>

          {error && <p className="text-red-400 text-xs text-right px-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all transform active:scale-95"
          >
            تسجيل الدخول للمنصة
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={handleWhatsAppRequest}
            className="w-full bg-transparent border border-green-500/40 hover:bg-green-500/10 text-green-400 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            💬 طلب كلمة مرور للطالب (واتساب)
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-8">إعداد: عمرو كريم</p>
      </div>
    </div>
  );
}
