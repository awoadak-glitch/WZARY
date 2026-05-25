"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, FileText, CheckCircle2, Search, Brain, 
  LogOut, Sparkles, Send, Clock, Award, RotateCcw, X 
} from "lucide-react";

// بيانات المنهج والمواد البرمجية المدمجة
const CONTENT_DATA = [
  { id: 1, type: "model", title: "نموذج اختبار الفيزياء الوزاري - 2024", subject: "الفيزياء", desc: "النموذج الرسمي مع توزيع الدرجات المعتمد.", fileUrl: "#" },
  { id: 2, type: "model", title: "نموذج اختبار الكيمياء - فرع علمي", subject: "الكيمياء", desc: "شامل لأسئلة المعادلات والتحليل الكهربائي.", fileUrl: "#" },
  { id: 3, type: "solution", title: "حل تقاويم وحدة التفاضل والتكامل", subject: "الرياضيات", desc: "إجابات نموذجية تفصيلية خطوة بخطوة.", fileUrl: "#" },
  { id: 4, type: "summary", title: "ملخص الشامل في قواعد اللغة العربية", subject: "اللغة العربية", desc: "خلاصة النحو والصرف والبلاغة في 5 صفحات فقط.", fileUrl: "#" },
  { id: 5, type: "summary", title: "ملخص النواصي في الأحياء - الوراثة", subject: "الأحياء", desc: "مراجعة مركزة لجميع مسائل وقوانين الوراثة.", fileUrl: "#" },
];

// أسئلة الاختبار التفاعلي التجريبي
const QUIZ_QUESTIONS = [
  { q: "ما هي وحدة قياس القوة في النظام الدولي للوحدات؟", options: ["الجول", "النيوتن", "الوات", "الباسكال"], correct: 1 },
  { q: "أي مما يلي يُعد من الأحماض القوية؟", options: ["حمض الخليك", "حمض الهيدروكلوريك", "الماء", "الأمونيا"], correct: 1 },
  { q: "مشتقة الدالة ثابته المقدار تساوي دائماً:", options: ["واحد", "نفس الثابت", "صفر", "ما لا نهاية"], correct: 2 }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // إعدادات المساعد الذكي
  const [messages, setMessages] = useState([{ text: "مرحباً بك يا بطل! أنا مساعدك الذكي في منصة المنهج الشامل. اسألني عن أي سؤال في المنهج وسأبسطه لك فوراً!", isBot: true }]);
  const [inputMessage, setInputMessage] = useState("");

  // إعدادات نظام الاختبار الذكي
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("student_auth");
    if (!auth) router.push("/");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student_auth");
    router.push("/");
  };

  // فلترة المحتوى ذكياً بالفئة والبحث
  const filteredContent = CONTENT_DATA.filter(item => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = item.title.includes(searchQuery) || item.subject.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  // إرسال رسالة للمساعد الذكي لمحاكاة استجابة فورية فائقة
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInputMessage("");

    setTimeout(() => {
      let botReply = "هذا السؤال ممتاز! طبقاً للمنهج الوزاري، يجب عليك أولاً تفكيك المعطيات ثم التعويض في القانون الأساسي لتضمن الدرجة الكاملة.";
      if (userMsg.includes("فيزياء")) botReply = "في الفيزياء، تذكر دائماً تحويل الوحدات إلى النظام الدولي قبل البدء بالحل لتفادي الأخطاء!";
      if (userMsg.includes("رياضيات")) botReply = "قواعد التفاضل والتكامل تحتاج فقط لحفظ المشتقات الشهيرة وكثرة التدريب على نماذج السنوات السابقة.";
      
      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    }, 800);
  };

  // معالجة إجابة الكويز
  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < QUIZ_QUESTIONS.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* الهيدر العلوي الفخم */}
      <header className="glass-effect sticky top-0 z-40 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#9d4edd] to-[#f72585] rounded-xl flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">المنهج الشامل</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setQuizOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#9d4edd]/20 hover:bg-[#9d4edd]/30 text-[#4cc9f0] border border-[#9d4edd]/40 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <Brain className="w-4 h-4 animate-pulse" />
            ابدأ اختباراً سريعاً
          </button>
          <button onClick={handleLogout} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* القسم الأيمن والأوسط: المحتوى والفلترة والبحث */}
        <div className="lg:col-span-2 space-y-6">
          {/* شريط البحث الاحترافي */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث عن نموذج، ملخص، مادة (مثال: فيزياء)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-850 glass-effect rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-[#4cc9f0] transition-all"
            />
          </div>

          {/* التبويبات والأزرار الفلترة الفلورية */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "كل المحتوى", icon: BookOpen },
              { id: "model", label: "النماذج الوزارية", icon: FileText },
              { id: "solution", label: "إجابات التقاويم", icon: CheckCircle2 },
              { id: "summary", label: "ملخصات مضمونة", icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-[#9d4edd] to-[#f72585] text-white shadow-lg shadow-[#9d4edd]/20" 
                      : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* شبكة عرض الكروت الذكية ثلاثية الأبعاد */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredContent.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950 text-[#4cc9f0] border border-slate-800">
                        {item.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> تحديث جديد
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#4cc9f0] transition-colors mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400 mb-6">{item.desc}</p>
                  </div>
                  
                  <button 
                    onClick={() => alert('سيتم فتح مستعرض الـ PDF الآمن للملف وحمايته من النسخ.')}
                    className="w-full py-2.5 bg-slate-900/80 group-hover:bg-gradient-to-r group-hover:from-[#9d4edd] group-hover:to-[#f72585] text-sm font-bold rounded-xl border border-slate-800 group-hover:border-transparent transition-all text-center"
                  >
                    عرض الملف الآن
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* القسم الأيسر: المساعد الذكي AI */}
        <div className="space-y-6">
          <div className="glass-effect rounded-2xl p-6 h-[500px] flex flex-col justify-between border border-slate-850 relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4cc9f0] via-[#9d4edd] to-[#f72585] rounded-t-2xl" />
            
            <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
              <Brain className="w-5 h-5 text-[#4cc9f0]" />
              <h2 className="font-black text-white text-md">مساعد المنهج الذكي AI</h2>
            </div>

            {/* شاشة الرسائل التفاعلية */}
            <div className="flex-1 overflow-y-auto space-y-3 pl-2 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.isBot 
                      ? "bg-slate-900 text-slate-200 rounded-tr-none border border-slate-800" 
                      : "bg-[#9d4edd] text-white rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* صندوق الإدخال */}
            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="اكتب سؤالك هنا ليجيبك الذكاء الاصطناعي..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#9d4edd]"
              />
              <button type="submit" className="bg-[#4cc9f0] hover:bg-[#4cc9f0]/90 text-slate-950 p-2.5 rounded-xl transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* نافذة الاختبار المنبثقة الفخمة (Modal Quiz System) */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="glass-effect w-full max-w-lg p-6 rounded-3xl border border-slate-800 relative"
            >
              <button onClick={() => { setQuizOpen(false); restartQuiz(); }} className="absolute left-4 top-4 text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>

              {!quizFinished ? (
                <div>
                  <div className="flex items-center gap-2 text-[#4cc9f0] text-xs font-bold mb-4">
                    <Award className="w-4 h-4 animate-spin" />
                    <span>السؤال {currentQuestion + 1} من {QUIZ_QUESTIONS.length}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">{QUIZ_QUESTIONS[currentQuestion].q}</h3>
                  <div className="space-y-2">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full text-right p-4 rounded-xl border text-sm font-medium transition-all ${
                          selectedAnswer === idx 
                            ? idx === QUIZ_QUESTIONS[currentQuestion].correct 
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                              : "bg-rose-500/20 border-rose-500 text-rose-300"
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                    <Award className="w-10 h-10 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">أحسنت! أكملت الاختبار</h3>
                  <p className="text-slate-400 text-sm mb-6">نتيجة أدائك هي: <span className="text-[#4cc9f0] font-bold">{score}</span> من أصل {QUIZ_QUESTIONS.length}</p>
                  <button onClick={restartQuiz} className="mx-auto flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-850 transition-all">
                    <RotateCcw className="w-4 h-4" /> إعادة المحاولة
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
