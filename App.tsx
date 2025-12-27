
import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { generateAIResponse } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import SupportModal from './components/SupportModal';
import CollaborationModal from './components/CollaborationModal';
import { SYSTEM_PROMPT, COURSES, EDUCATION_SUBJECTS, COLLABORATION } from './constants';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCollab, setShowCollab] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'courses'>('general');
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenSupportModal');
    if (!hasSeenModal) { setShowModal(true); localStorage.setItem('hasSeenSupportModal', 'true'); }
    resetToWelcome();
    return () => stopLiveSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isLiveMode]);

  const resetToWelcome = () => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      content: 'Assalomu alaykum! Men "Mahalla Ta’lim AI" tizimiman. 1-11-sinf fanlaridan savollaringiz bo\'lsa bering, yoki istalgan mavzuni tushuntirib berishimni so\'rang. Qaysi fandan darsni boshlaymiz?',
      timestamp: Date.now()
    }]);
  };

  const stopLiveSession = () => {
    setIsLiveMode(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    for (const source of sourcesRef.current) source.stop();
    sourcesRef.current.clear();
  };

  const startLiveSession = async () => {
    try {
      setIsLiveMode(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const data = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(data.length);
              for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            const base64 = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => setIsLiveMode(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: SYSTEM_PROMPT
        }
      });
    } catch (e) { console.error(e); setIsLiveMode(false); }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() && !selectedImage) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now(), image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const base64 = selectedImage?.split(',')[1];
    setSelectedImage(null);
    setIsLoading(true);
    const response = await generateAIResponse(text, messages.slice(-30).map(m => ({ role: m.role, parts: [{ text: m.content }] })), base64);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: response || 'Xatolik yuz berdi...', timestamp: Date.now() }]);
    setIsLoading(false);
  };

  const switchTab = (tab: 'general' | 'courses') => {
    setActiveTab(tab);
    setCurrentCourse(null);
    setMessages([]);
    if (tab === 'general') resetToWelcome();
    else setMessages([{ id: 'courses-welcome', role: 'model', content: 'Professional Kurslar bo\'limiga xush kelibsiz! Har bir dars oxirida test topshirasiz va yakunda sertifikat olasiz. Qaysi kursni tanlaysiz?', timestamp: Date.now() }]);
  };

  const startCourse = (course: any) => {
    setCurrentCourse(course.title);
    setMessages([]);
    handleSendMessage(`MEN "${course.title.toUpperCase()}" KURSINI TANLADIM. ILTIMOS, USTOZ SIFATIDA SALOMLASHIB, ISIM, YOSH VA BILIM DARAJASINI SO'RANG.`);
  };

  return (
    <div className={`flex flex-col h-screen max-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans`}>
      {showModal && <SupportModal onClose={() => setShowModal(false)} isDarkMode={isDarkMode} />}
      {showCollab && <CollaborationModal onClose={() => setShowCollab(false)} isDarkMode={isDarkMode} />}
      
      {/* Dynamic Header */}
      <header className={`px-3 md:px-8 py-2 md:py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100'} backdrop-blur-md`}>
        <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer shrink-0" onClick={() => switchTab('general')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-lg md:text-xl">🏛️</span>
          </div>
          <div className="hidden xs:block">
            <h1 className={`text-[11px] md:text-sm font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>MAHALLA TA’LIM AI</h1>
            <p className="text-[7px] md:text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Doniyorbek Abdujabborov</p>
          </div>
        </div>

        <nav className={`flex items-center p-1 rounded-xl md:rounded-2xl mx-1 md:mx-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button onClick={() => switchTab('general')} className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase transition-all ${activeTab === 'general' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>Asosiy</button>
          <button onClick={() => switchTab('courses')} className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase transition-all ${activeTab === 'courses' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>Kurslar</button>
        </nav>

        <div className="flex items-center space-x-1.5 md:space-x-2 shrink-0">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-500'} active:scale-90`}>
            {isDarkMode ? <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg> : <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>}
          </button>
          <button onClick={isLiveMode ? stopLiveSession : startLiveSession} className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all border shadow-sm active:scale-90 ${isLiveMode ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-emerald-500 border-emerald-500 text-white'}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Desktop Sidebar */}
        {activeTab === 'general' && (
          <aside className={`hidden lg:flex flex-col w-72 border-r p-6 overflow-y-auto ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">TA'LIM DOIRASI</h3>
            <div className="grid grid-cols-1 gap-2">
              {EDUCATION_SUBJECTS.map((sub, i) => (
                <button key={i} onClick={() => handleSendMessage(`${sub.name} fanidan dars qilmoqchiman.`)} className={`flex items-center space-x-3 p-3.5 rounded-2xl transition-all text-left group ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-indigo-50'}`}>
                  <span className="text-xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                  <span className={`text-xs font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{sub.name}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        <main ref={scrollRef} className={`flex-1 overflow-y-auto p-3 md:p-10 custom-scrollbar relative ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto w-full">
            {activeTab === 'courses' && !currentCourse && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in slide-in-from-bottom-8">
                <div className="col-span-full mb-4 md:mb-6">
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Kurslar Markazi</h2>
                  <p className="text-slate-400 text-xs md:text-sm mt-2 font-bold uppercase tracking-tight leading-relaxed">30 darslik professional tizim, testlar va sertifikatni o'z ichiga oladi.</p>
                </div>
                {COURSES.map(course => (
                  <button key={course.id} onClick={() => startCourse(course)} className={`border p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center text-center transition-all group active:scale-95 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-600 hover:shadow-2xl'}`}>
                    <div className={`text-4xl md:text-5xl w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-6 transition-colors shadow-inner ${isDarkMode ? 'bg-slate-800 group-hover:bg-indigo-900/50' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>{course.icon}</div>
                    <h3 className={`font-black text-base md:text-lg tracking-tight mb-2 md:mb-3 uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{course.title}</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase leading-relaxed">{course.desc}</p>
                    <div className="mt-6 md:mt-8 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest transition-all">KURSNI BOSHLASH →</div>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {currentCourse && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 bg-indigo-600 rounded-[1.5rem] md:rounded-[2rem] text-white mb-6 md:mb-10 shadow-xl shadow-indigo-500/20 gap-4">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl backdrop-blur-md">🎓</div>
                    <div>
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-70">Ayni damda kursda:</p>
                      <h2 className="text-base md:text-lg font-black uppercase">{currentCourse}</h2>
                    </div>
                  </div>
                  <button onClick={() => { setCurrentCourse(null); switchTab('courses'); }} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 text-center">Kursdan chiqish</button>
                </div>
              )}
              {messages.map(m => <ChatBubble key={m.id} message={m} isDarkMode={isDarkMode} />)}
              {isLiveMode && (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 animate-in zoom-in">
                  <div className="flex items-center space-x-1 h-16 md:h-20">
                    {[...Array(20)].map((_, i) => <div key={i} className="w-1 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 30}ms` }}></div>)}
                  </div>
                  <p className="mt-8 md:mt-10 text-indigo-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.5em]">Jonli muloqot faol...</p>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start mb-10"><div className={`rounded-2xl md:rounded-3xl px-6 md:px-10 py-4 md:py-5 flex space-x-2 md:space-x-3 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}><div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-600 rounded-full animate-bounce"></div><div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div><div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div></div></div>
              )}
            </div>
          </div>
        </main>
      </div>

      {!isLiveMode && (
        <footer className={`p-3 md:p-10 pb-10 md:pb-12 shadow-2xl shrink-0 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="max-w-4xl mx-auto">
            {selectedImage && (
              <div className="relative inline-block mb-4 md:mb-6 animate-in zoom-in">
                <img src={selectedImage} alt="Mavzu" className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-indigo-600 shadow-2xl ring-4 ring-indigo-500/10" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-red-500 text-white rounded-full p-1.5 md:p-2.5 shadow-xl border-2 border-white"><svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
            )}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex-1 relative group">
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder={activeTab === 'general' ? "Savolingizni yozing..." : "Javob bering..."} className={`w-full rounded-[1.2rem] md:rounded-[2rem] py-4 md:py-7 pl-12 md:pl-16 pr-4 md:pr-8 border focus:outline-none focus:ring-4 md:ring-8 transition-all resize-none max-h-32 md:max-h-40 font-black text-xs md:text-sm leading-relaxed ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-600/5 focus:border-indigo-600'}`} rows={1} />
                <button onClick={() => fileInputRef.current?.click()} className={`absolute left-4 md:left-7 bottom-4 md:bottom-7 transition-all ${isDarkMode ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'}`}><svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
              </div>
              <button onClick={() => handleSendMessage()} disabled={isLoading || (!input.trim() && !selectedImage)} className={`p-4 md:p-7 rounded-[1.2rem] md:rounded-[2rem] shadow-xl md:shadow-2xl transition-all active:scale-90 ${isLoading || (!input.trim() && !selectedImage) ? (isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400') : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}><svg className="w-5 h-5 md:w-7 md:h-7 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>
            </div>
            <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setSelectedImage(r.result as string); r.readAsDataURL(f); } }} accept="image/*" className="hidden" />
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 mt-6 md:mt-8">
               <a href={`tel:${COLLABORATION.phone}`} className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'}`}>{COLLABORATION.phone}</a>
               <div className="hidden sm:block w-1 h-1 bg-slate-700 rounded-full"></div>
               <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Olmos • Chust • Mahalla Ta'lim AI</p>
               <div className="hidden sm:block w-1 h-1 bg-slate-700 rounded-full"></div>
               <a href={COLLABORATION.telegramUrl} target="_blank" className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-500 hover:text-sky-400' : 'text-slate-400 hover:text-sky-500'}`}>@nkmk_uz</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
