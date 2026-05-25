"use client";
import { useState, useEffect } from "react";

// تعريف بنية الملفات المرفوعة
interface StudyFile {
  id: string;
  title: string;
  url: string;
  category: "models" | "calendars" | "summaries";
}

export default function Dashboard() {
  const [role, setRole] = useState<string>("student");
  const [activeTab, setActiveTab] = useState<"models" | "calendars" | "summaries" | "ai">("models");
  
  // إدارات الأدمين
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [files, setFiles] = useState<StudyFile[]>([]);

  // إدارات الشات الـ AI
  const [messages, setMessages] = useState([
    { role: "assistant", text: "مرحباً بك يا بطل! أنا مساعدك الذكي في منصة المنهج الشامل. اسألني عن أي سؤال في المنهج وسأبسطه لك فوراً!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role") || "student";
    setRole(savedRole);

    // تحميل الملفات المخزنة سابقاً أو وضع عينة حقيقية أولية
    const savedFiles = localStorage.getItem("platform_files");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      const initialFiles: StudyFile[] = [
        { id: "1", title: "نموذج اختبار اللغة العربية الوزاري 2025", url: "#", category: "models" }
      ];
      setFiles(initialFiles);
      localStorage.setItem("platform_files", JSON.stringify(initialFiles));
    }
  }, []);

  // دالة إضافة ملف جديد بواسطة الـ Admin
  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newFile: StudyFile = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl,
      category: activeTab === "ai" ? "models" : activeTab
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem("platform_files", JSON.stringify(updatedFiles));
    
    setNewTitle("");
    setNewUrl("");
    alert("تم رفع وتثبيت الملف بنجاح في القسم الحالي!");
  };

  // دالة حذف ملف (خاصة بالإدمن فقط)
  const handleDeleteFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem("platform_files", JSON.stringify(updated));
  };

  // تشغيل الذكاء الاصطناعي المجاني عبر محرك جيت هاب / جينيريتف لـ Gemini
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loadingAi) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInputMessage("");
    setLoadingAi(true);

    try {
      // نستخدم هنا رابط API خارجي مجاني لمعالجة النصوص أو يمكنك استبداله بـ API Key الخاص بك لـ Gemini مباشرة
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD-YOUR_KEY_HERE`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت معلم ومساعد ذكي يمني لمنصة التعليم (المنهج الشامل) المخصصة للطلاب. أجب باختصار وبأسلوب مشوق ومبسط جداً باللغة العربية على هذا السؤال: ${userText}` }] }]
        })
      });
      
      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "أنا هنا معك يا بطل، يبدو أن هناك ضغطاً مؤقتاً على السيرفر، اسألني مجدداً!";
      
      setMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "أهلاً بك! أنا أعمل حالياً في البيئة المحلية. عند وضع مفتاح الـ API الخاص بك سأتمكن من قراءة كامل المنهج ومساعدتك فوراً." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    window.location.href = "./";
  };

  return (
    <div className="min-h-screen bg-[#0d0b18] text-white flex flex-col font-sans">
      
      {/* الهيدر العلوي */}
      <header className="bg-[#13112a]/90 border-b border-purple-500/20 py-4 px-6 sticky top-0 backdrop-blur-md z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            المنهج الشامل {role === "admin" && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full mr-2">لوحة الإدمن</span>}
          </h1>
        </div>
        <button onClick={handleLogout} className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 py-1.5 px-4 rounded-xl border border-red-500/20 transition-all">
          تسجيل خروج
        </button>
      </header>

      {/* أزرار التنقل الرئيسية بين الأقسام */}
      <nav className="grid grid-cols-4 bg-[#13112a] border-b border-purple-500/10 text-center text-sm">
        <button onClick={() => setActiveTab("models")} className={`py-4 font-medium transition-all ${activeTab === "models" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>النماذج</button>
        <button onClick={() => setActiveTab("calendars")} className={`py-4 font-medium transition-all ${activeTab === "calendars" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>إجابات التقاويم</button>
        <button onClick={() => setActiveTab("summaries")} className={`py-4 font-medium transition-all ${activeTab === "summaries" ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5" : "text-gray-400 hover:text-white"}`}>الملخصات</button>
        <button onClick={() => setActiveTab("ai")} className={`py-4 font-medium transition-all ${activeTab === "ai" ? "text-pink-400 border-b-2 border-pink-400 bg-pink-500/5" : "text-gray-400 hover:text-white"}`}>المساعد الذكي AI</button>
      </nav>

      {/* المحتوى الرئيسي للقسم المختار */}
      <main className="flex-1 p-6 max-w-4xl w-full mx-auto pb-24">
        
        {/* نموذج الإضافة الخاص بالـ Admin فقط (يظهر في أقسام الملفات الثلاثة) */}
        {role === "admin" && activeTab !== "ai" && (
          <form onSubmit={handleAddFile} className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 mb-8 space-y-3">
            <h3 className="text-sm font-semibold text-purple-300">➕ إضافة ملف PDF جديد لهذا القسم:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="اسم الـ PDF (مثال: ملخص أحياء الفصل الأول)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-[#1c1936] border border-gray-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="رابط أو مسار ملف الـ PDF"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-[#1c1936] border border-gray-700 rounded-xl py-2 px-3 text-sm text-left focus:outline-none focus:border-purple-500"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded-xl transition-all">
              تثبيت وحفظ الملف في المنصة
            </button>
          </form>
        )}

        {/* عرض قائمة الملفات للأقسام الثلاثة الأولى */}
        {activeTab !== "ai" && (
          <div className="space-y-3">
            {files.filter(f => f.category === activeTab).length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">لا توجد ملفات مرفوعة في هذا القسم حالياً.</div>
            ) : (
              files.filter(f => f.category === activeTab).map(file => (
                <div key={file.id} className="bg-[#13112a]/60 border border-gray-800 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm hover:border-purple-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <span className="font-medium text-sm text-gray-200">{file.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={file.url} target="_blank" rel="noreferrer" className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-xs py-1.5 px-4 rounded-lg transition-all">
                      عرض الملف الآن
                    </a>
                    {role === "admin" && (
                      <button onClick={() => handleDeleteFile(file.id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs py-1.5 px-2 rounded-lg transition-all">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* واجهة الشات والمساعد الذكي AI */}
        {activeTab === "ai" && (
          <div className="bg-[#13112a]/40 border border-purple-500/20 rounded-2xl h-[550px] flex flex-col backdrop-blur-md overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-purple-600 text-white rounded-br-none" : "bg-[#1c1936] text-gray-100 rounded-bl-none border border-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingAi && (
                <div className="flex justify-start">
                  <div className="bg-[#1c1936] text-purple-400 text-xs rounded-2xl p-3 border border-gray-800 animate-pulse">
                    جاري التفكير وصياغة الإجابة النموذجية لك... ⚡
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0d0b18] border-t border-purple-500/10 flex gap-2">
              <input
                type="text"
                placeholder="اكتب سؤالك هنا ليجيبك الذاء الاصطناعي..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#1c1936] border border-gray-700 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 text-white"
              />
              <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 rounded-xl text-white font-bold transition-all active:scale-95">
                ✈️
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
