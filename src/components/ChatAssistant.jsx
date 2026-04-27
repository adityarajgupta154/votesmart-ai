import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { sendMessage } from '../utils/geminiApi';
import { useSpeech } from '../hooks/useSpeech';
import ListenButton from './ListenButton';

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export default function ChatAssistant() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: L('chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playedIds, setPlayedIds] = useState(new Set());
  const endRef = useRef(null);
  const { speak, speaking, preparing, activeId } = useSpeech();
  const listenLabel = language === 'hi' ? 'सुनें' : 'Listen';

  const handleListenClick = (msgId, content) => {
    setPlayedIds(prev => new Set(prev).add(msgId));
    speak(content, language, msgId);
  };

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉयस इनपुट सपोर्ट नहीं करता है।' : 'Your browser does not support voice input.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ role: 'assistant', content: L('chatWelcome') }]);
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    L('chatQ1'), L('chatQ2'), L('chatQ3'),
    L('chatQ4'), L('chatQ5'), L('chatQ6')
  ];

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    // Simulate thinking delay (800-1500ms) for more natural feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    try {
      const response = await sendMessage(userMsg, newMessages.slice(1), language);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        source: response.source
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'hi'
          ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें या सेटिंग्स में API key जाँचें।'
          : 'Sorry, I encountered an error. Please try again or check your API key in Settings.',
        source: 'error'
      }]);
    }
    setLoading(false);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '\n• ')
      .replace(/\n(\d+)\. /g, '\n$1. ')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="bg-gradient-to-br from-[#0b1f3a] to-[#0e2a47] min-h-[calc(100vh-80px)] p-4 flex justify-center items-start pt-8">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl border border-white/10 shadow-lg bg-[#102a43] p-6 flex flex-col h-[75vh]" id="chat-container">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗳️</span>
              <div>
                <h2 className="text-white font-semibold text-xl m-0">{L('chatTitle')}</h2>
                <span className="text-sm text-gray-400">
                  {loading ? L('chatThinking') : preparing ? (language === 'hi' ? 'AI आवाज़ तैयार कर रहा है...' : 'AI is preparing to speak...') : speaking ? (language === 'hi' ? 'AI बोल रहा है...' : 'AI is speaking...') : L('chatReady')}
                </span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-sm hover:bg-white/10 transition-colors"
              onClick={() => setMessages([messages[0]])}
              id="clear-chat-btn"
            >
              {L('chatClear')}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2" id="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && <span className="text-2xl mr-2 mt-1 flex-shrink-0">🗳️</span>}
                <div className={`p-3 max-w-[85%] ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white rounded-xl rounded-tr-sm shadow-md'
                  : 'bg-[#0f2a44] border border-gray-600 text-white rounded-xl rounded-tl-sm'}`}
                >
                  <div className="text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  {msg.role === 'assistant' && i > 0 && (
                    <div className="mt-2">
                      <ListenButton
                        onClick={() => handleListenClick(`chat-${i}`, msg.content)}
                        isPlaying={speaking && activeId === `chat-${i}`}
                        isPreparing={preparing && activeId === `chat-${i}`}
                        hasPlayed={playedIds.has(`chat-${i}`)}
                        label={listenLabel}
                      />
                    </div>
                  )}
                  {msg.source === 'offline' && (
                    <span className="block mt-2 text-xs text-[#f59e0b] italic">{L('chatOfflineNote')}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="text-2xl mr-2 mt-1 flex-shrink-0">🗳️</span>
                <div className="bg-[#0f2a44] border border-gray-600 text-white p-4 rounded-xl rounded-tl-sm flex items-center gap-2">
                  <span className="text-sm text-gray-400">{L('chatThinking')}</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick suggestion chips */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="px-4 py-2 border border-gray-600 rounded-full text-sm text-gray-300 hover:text-white hover:border-[#f59e0b]/50 hover:bg-white/5 transition-all text-left"
                  onClick={() => send(q)}
                  id={`quick-q-${i}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2" id="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={isListening ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : L('chatPlaceholder')}
              disabled={loading || isListening}
              className="flex-1 bg-[#0f2a44] border border-gray-600 rounded-full text-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] placeholder:text-gray-400 transition-all"
              id="chat-input"
            />
            <button
              className={`p-3 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
              onClick={handleListen}
              disabled={loading}
              id="mic-btn"
              type="button"
              aria-label={isListening ? 'Listening...' : 'Start voice input'}
            >
              <IconMic />
            </button>
            <button
              className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] p-3 rounded-full text-white hover:opacity-90 flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              id="send-btn"
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
