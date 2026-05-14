'use client';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी', promptLang: 'Hindi' },
  { code: 'en-IN', label: 'English', promptLang: 'English' },
  { code: 'mr-IN', label: 'मराठी', promptLang: 'Marathi' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', promptLang: 'Punjabi' }
];

export default function AgriChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // Default: Hindi
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'नमस्ते! मैं खेतीफाई एआई हूँ। मैं आपकी फसल या बाज़ार भाव में कैसे मदद कर सकता हूँ?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, mode]);

  // ✨ TEXT-TO-SPEECH (Reads AI reply aloud) ✨
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window) || mode === 'text') return; 
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    window.speechSynthesis.speak(utterance);
  };

  // ✨ SPEECH-TO-TEXT (Listens to Farmer) ✨
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Android.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript, true); // Auto-send when done talking
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSend = async (textOverride?: string, isVoiceData: boolean = false) => {
    const userText = typeof textOverride === 'string' ? textOverride.trim() : input.trim();
    if (!userText || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language: selectedLang.promptLang })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      if (isVoiceData || mode === 'voice') speakResponse(data.reply);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = LANGUAGES.find(l => l.code === e.target.value) || LANGUAGES[0];
    setSelectedLang(lang);
    setMessages([{ role: 'bot', text: `Language changed to ${lang.label}. How can I help you?` }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-white w-[360px] md:w-[420px] h-[600px] max-h-[85vh] rounded-[32px] border border-outline-variant shadow-2xl mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* HEADER */}
          <div className="bg-[#059669] p-4 flex flex-col gap-3 shadow-md z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[24px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">Khetify Sahayak</h3>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} type="button" className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* LANGUAGE & MODE TABS */}
            <div className="flex items-center justify-between bg-black/10 rounded-xl p-1 mt-1">
               <div className="flex flex-1">
                 <button onClick={() => setMode('text')} type="button" className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'text' ? 'bg-white text-[#059669] shadow-sm' : 'text-white/70 hover:text-white'}`}>Text</button>
                 <button onClick={() => setMode('voice')} type="button" className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${mode === 'voice' ? 'bg-white text-[#059669] shadow-sm' : 'text-white/70 hover:text-white'}`}>
                   <span className="material-symbols-outlined text-[14px]">mic</span> Voice
                 </button>
               </div>
               <div className="ml-2 border-l border-white/20 pl-2">
                 <select value={selectedLang.code} onChange={handleLanguageChange} className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer">
                   {LANGUAGES.map(l => <option key={l.code} value={l.code} className="text-black">{l.label}</option>)}
                 </select>
               </div>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-container-lowest">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#059669] text-white rounded-br-sm' 
                    : 'bg-white text-on-surface border border-outline-variant rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white text-primary p-4 rounded-2xl rounded-bl-sm border border-outline-variant shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#059669] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#059669] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#059669] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t border-outline-variant">
            {mode === 'text' ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(undefined, false); }} 
                className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-full p-1 pl-4 focus-within:border-[#059669] transition-all shadow-sm"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Type in ${selectedLang.promptLang}...`}
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-on-surface"
                />
                <button type="submit" disabled={!input.trim() || isLoading} className="w-10 h-10 bg-[#059669] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:brightness-110 shadow-md">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <button 
                  onClick={startListening} 
                  type="button"
                  disabled={isLoading || isListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse scale-110 shadow-red-500/50' : 'bg-[#059669] text-white hover:scale-105 shadow-[#059669]/30 disabled:opacity-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{isListening ? 'mic' : 'mic_none'}</span>
                </button>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${isListening ? 'text-red-500' : 'text-[#059669]'}`}>
                  {isListening ? 'Listening...' : 'Tap to Speak'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING OPEN BUTTON */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-error text-white rotate-90' : 'bg-[#059669] text-white shadow-[#059669]/40 border-[3px] border-white'
        }`}
      >
        <span className="material-symbols-outlined text-3xl transition-transform duration-300">
          {isOpen ? 'close' : 'support_agent'}
        </span>
      </button>
      
      {!isOpen && (
        <div className="absolute right-20 top-3 bg-white px-4 py-2 rounded-2xl rounded-br-sm border border-outline-variant shadow-lg animate-in fade-in slide-in-from-right-4 pointer-events-none">
          <p className="text-[11px] font-black text-[#059669] uppercase tracking-widest whitespace-nowrap">Ask Khetify AI</p>
        </div>
      )}
    </div>
  );
}