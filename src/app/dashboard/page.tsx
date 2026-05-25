"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

interface StudyFile { id: string; title: string; url: string; category: string; }
interface StudentToken { id: string; code: string; name: string; }

export default function Dashboard() {
  const [role, setRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("models");
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [tokens, setTokens] = useState<StudentToken[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTokenCode, setNewTokenCode] = useState("");
  const [newTokenName, setNewTokenName] = useState("");

  const [messages, setMessages] = useState([
    { role: "assistant", text: "مرحباً بك يا بطل! أنا مساعدك الذكي في منصة المنهج الشامل. اسألني عن أي سؤال في المنهج وسأبسطه لك فوراً!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    
    // حماية الصفحة: إذا لم يجد دور مستخدم مسجل يرجعه لصفحة الدخول فوراً
    if (!savedRole) {
      window.location.href = "./";
      return;
    }
    
    setRole(savedRole);
    setPageLoading(false);

    // ربط ملفات قاعدة البيانات السحابية
    const unsubscribeFiles = onSnapshot(collection(db, "files"), (snapshot) => {
      const fileList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyFile));
      setFiles(fileList);
    });

    // ربط أكواد الطلاب المسموحة
    const unsubscribeTokens = onSnapshot(collection(db, "tokens"), (snapshot) => {
      const tokenList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentToken));
      setTokens(tokenList);
    });

    return () => {
      unsubscribeFiles();
      unsubscribeTokens();
    };
  }, []);

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    try {
      await addDoc(collection(db, "files"), {
        title: newTitle.trim(),
        url: newUrl.trim(),
        category: activeTab
      });
      setNewTitle(""); setNewUrl("");
    } catch (err) {
      alert("حدث خطأ أثناء إضافة الملف إلى السيرفر.");
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await deleteDoc(doc(db, "files", id));
    } catch (err) {
      alert("حدث خطأ أثناء حذف الملف.");
    }
  };

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenCode.trim()) return;
    try {
      await addDoc(collection(db, "tokens"), {
        code: newTokenCode.trim(),
        name: newTokenName.trim() || "طالب غير مسمى"
      });
      setNewTokenCode(""); setNewTokenName("");
    } catch (err) {
      alert("حدث خطأ أثناء حفظ وتفعيل الكود سحابياً.");
    }
  };

  const handleDeleteToken = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tokens", id));
    } catch (err) {
      alert("حدث خطأ أثناء إلغاء تفعيل الرمز.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loadingAi) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInputMessage("");
    setLoadingAi(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDMdCszUhO2-J91FAb6Klv_1rVKEzxkMmU`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت معلم ومساعد ذكي يمني لمنصة التعليم (المنهج الشامل) المخصصة للطلاب. أجب باختصار وبأسلوب مشوق ومبسط جداً باللغة العربية على هذا السؤال التعليمي: ${userText}` }] }]
        })
      });
      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "أنا هنا معك يا بطل، اسألني مجدداً وسأجيبك فوراً!";
      setMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "أهلاً بك! السيرفر الذكي يواجه ضغطاً مؤقتاً، أعد إرسال سؤالك." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "./";
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0d0b18] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-t-purple-500 border-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-400 font-medium">جاري تأمين الحساب والتحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b18] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* هيدر المنصة الفخم */}
      <header className="bg-[#13112a]/90 border-b border-purple-500/20 py-4 px-6 sticky top-0 backdrop-blur-md z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🎓</span>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            الْمَنْهَجُ الشَّامِل {role === "admin" && <span className="text-[10px] bg-red-600 font-bold text-white px-2.5 py-0.5 rounded-full mr-2 tracking-wide">لوحة الإدمن السحابية</span>}
          </h1>
        </div>
        <button onClick={handleLogout} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-4 rounded-xl border border-red-500/20 transition-all font-semibold shadow-inner">
          تسجيل خروج
        </button>
      </header>

      {/* أزرار التنقل الزجاجية */}
      <nav className={`grid bg-[#13112a]/80 backdrop-blur-sm border-b border-purple-500/10 text-center text-xs md:text-sm sticky top-[65px] z-40 ${role === 'admin' ? 'grid-cols-5' : 'grid-cols-4'}`}>
        <button onClick={() => setActiveTab("models")} className={`py-4 font-bold transition-all ${activeTab === "models" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>النماذج</button>
        <button onClick={() => setActiveTab("calendars")} className={`py-4 font-bold transition-all ${activeTab === "calendars" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>التقاويم</button>
        <button onClick={() => setActiveTab("summaries")} className={`py-4 font-bold transition-all ${activeTab === "summaries" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>الملخصات</button>
        <button onClick={() => setActiveTab("ai")} className={`py-4 font-bold transition-all ${activeTab === "ai" ? "text-pink-400 border-b-2 border-pink-400 bg-pink-500/5" : "text-gray-400 hover:text-white"}`}>المساعد الذكي AI</button>
        {role === "admin" && (
          <button onClick={() => setActiveTab("manage_tokens")} className={`py-4 font-bold transition-all ${activeTab === "manage_tokens" ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5" : "text-gray-400 hover:text-white"}`}>🔑 إدارة الرموز</button>
        )}
      </nav>

      {/* المحتوى الرئيسي للمنصة */}
      <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto pb-24 relative z-10">
        
        {/* واجهة إضافة الملفات السحابية للإدمن فقط */}
        {role === "admin" && activeTab !== "ai" && activeTab !== "manage_tokens" && (
          <form onSubmit={handleAddFile} className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 mb-8 space-y-3 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-1">➕ رفع ملف PDF سحابي للقسم الحالي:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="اسم الـ PDF" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-[#1c1936] border border-gray-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500" />
              <input type="text" placeholder="رابط الملف" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="bg-[#1c1936] border border-gray-700 rounded-xl py-2.5 px-4 text-sm text-left text-white focus:outline-none focus:border-purple-500" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md">
              حفظ وتثبيت الملف في السيرفر السحابي ⚡
            </button>
          </form>
        )}

        {/* عرض قائمة الملفات القادمة من السيرفر السحابي حقيقياً */}
        {activeTab !== "ai" && activeTab !== "manage_tokens" && (
          <div className="space-y-3">
            {files.filter(f => f.category === activeTab).length === 0 ? (
              <div className="text-center py-16 bg-[#13112a]/30 border border-dashed border-gray-800 rounded-2xl text-gray-500 text-sm font-medium">
                📭 لا توجد ملفات مرفوعة في هذا القسم حالياً.
              </div>
            ) : (
              files.filter(f => f.category === activeTab).map(file => (
                <div key={file.id} className="bg-[#13112a]/60 border border-gray-800/80 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm hover:border-purple-500/40 transition-all shadow-sm group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
                    <span className="font-semibold text-sm text-gray-200">{file.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={file.url} target="_blank" rel="noreferrer" className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-xs font-bold py-1.5 px-4 rounded-lg transition-all">
                      عرض الملف
                    </a>
                    {role === "admin" && (
                      <button onClick={() => handleDeleteFile(file.id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs py-1.5 px-2.5 rounded-lg transition-all">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* لوحة تحكم إدارة الرموز السحابية للطلاب (للإدمن فقط) */}
        {role === "admin" && activeTab === "manage_tokens" && (
          <div className="space-y-6">
            <form onSubmit={handleAddToken} className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-xl">
              <h3 className="text-sm font-bold text-amber-300">🔑 توليد وتفعيل رمز دخول جديد لطالب:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="الرمز السري" value={newTokenCode} onChange={(e) => setNewTokenCode(e.target.value)} className="bg-[#1c1936] border border-gray-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500" />
                <input type="text" placeholder="اسم الطالب المستلم" value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} className="bg-[#1c1936] border border-gray-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md">
                تفعيل الرمز وحفظه في السيرفر فوراً
              </button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 px-1">الرموز النشطة والفعالة للطلاب حالياً:</h4>
              {tokens.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs font-medium">لا توجد رموز طلاب منشأة حالياً.</div>
              ) : (
                tokens.map(t => (
                  <div key={t.id} className="bg-[#13112a]/50 border border-gray-800/60 rounded-xl p-3.5 flex justify-between items-center shadow-inner">
                    <div>
                      <span className="text-amber-400 font-mono font-bold tracking-wider">{t.code}</span>
                      <span className="text-gray-400 text-xs mr-4 font-normal">👤 {t.name}</span>
                    </div>
                    <button onClick={() => handleDeleteToken(t.id)} className="text-red-400 hover:text-red-500 text-xs font-bold px-2 py-1 bg-red-500/5 hover:bg-red-500/10 rounded-lg border border-red-500/10 transition-all">
                      إلغاء التفعيل ❌
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* واجهة المساعد الذكي المطور AI */}
        {activeTab === "ai" && (
          <div className="bg-[#13112a]/40 border border-purple-500/20 rounded-2xl h-[530px] flex flex-col backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed font-medium shadow-sm ${msg.role === "user" ? "bg-gradient-to-l from-purple-600 to-indigo-600 text-white rounded-br-none" : "bg-[#1c1936] text-gray-100 rounded-bl-none border border-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingAi && (
                <div className="flex justify-start">
                  <div className="bg-[#1c1936] text-purple-400 text-xs font-bold rounded-2xl p-3.5 border border-gray-800 animate-pulse flex items-center gap-2">
                    جاري صياغة الإجابة النموذجية لك... ⚡
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0d0b18] border-t border-purple-500/10 flex gap-2">
              <input
                type="text"
                placeholder="اسأل المساعد الذكي عن أي سؤال في المنهج..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#1c1936] border border-gray-700/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-pink-500 text-white placeholder-gray-500 font-medium"
              />
              <button type="submit" className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-3 rounded-xl text-white font-bold transition-all active:scale-95 shadow-md">
                ✈️
              </button>
            </form>
          </div>
        )}

      </main>

      <footer className="text-center text-xs text-gray-600 mt-auto pb-6 border-t border-purple-500/10 pt-4 bg-[#0d0b18]/80 z-20 font-bold">
        جميع الحقوق محفوظة للمنصة التعليمية الذكية • إعداد وتطوير: الديفل ⚡
      </footer>
    </div>
  );
}
