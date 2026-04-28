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

  /** Safely format message text into React elements (no raw HTML injection) */
  const renderMessage = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        // Bullet: - text
        if (part.startsWith('- ')) {
          return <span key={j}>• {part.slice(2)}</span>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <span key={idx}>
          {rendered}
          {idx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="bg-[#f5efe9] min-h-[calc(100vh-80px)] p-4 flex justify-center items-start pt-8">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl border border-gray-200 shadow-md bg-white p-6 flex flex-col h-[75vh]" id="chat-container" role="log" aria-label="Chat messages">
          {/* Header */}
          <header className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🗳️</span>
              <div>
                <h1 className="text-[#8b5e34] font-semibold text-xl m-0">{L('chatTitle')}</h1>
                <span className="text-sm text-gray-500">
                  {loading ? L('chatThinking') : preparing ? (language === 'hi' ? 'AI आवाज़ तैयार कर रहा है...' : 'AI is preparing to speak...') : speaking ? (language === 'hi' ? 'AI बोल रहा है...' : 'AI is speaking...') : L('chatReady')}
                </span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-colors"
              onClick={() => setMessages([messages[0]])}
              id="clear-chat-btn"
              aria-label={language === 'hi' ? 'चैट साफ़ करें' : 'Clear chat'}
            >
              {L('chatClear')}
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2" id="chat-messages" aria-live="polite" aria-relevant="additions">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && <span className="text-2xl mr-2 mt-1 flex-shrink-0" aria-hidden="true">🗳️</span>}
                <div className={`p-3 max-w-[85%] ${msg.role === 'user'
                  ? 'bg-[#bfa085] text-white rounded-xl rounded-tr-sm shadow-md'
                  : 'bg-[#f5efe9] border border-gray-200 text-gray-800 rounded-xl rounded-tl-sm'}`}
                >
                  <div className="text-sm md:text-base leading-relaxed">{renderMessage(msg.content)}</div>
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
                    <span className="block mt-2 text-xs text-[#8b5e34] italic">{L('chatOfflineNote')}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="text-2xl mr-2 mt-1 flex-shrink-0" aria-hidden="true">🗳️</span>
                <div className="bg-[#f5efe9] border border-gray-200 text-gray-700 p-4 rounded-xl rounded-tl-sm flex items-center gap-2" role="status" aria-label="Loading">
                  <span className="text-sm text-gray-500">{L('chatThinking')}</span>
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
            <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Suggested questions">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:text-[#8b5e34] hover:border-[#bfa085]/50 hover:bg-[#f5efe9] transition-all text-left"
                  onClick={() => send(q)}
                  id={`quick-q-${i}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2" id="chat-input-area">
            <label htmlFor="chat-input" className="sr-only">{language === 'hi' ? 'संदेश टाइप करें' : 'Type your message'}</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={isListening ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : L('chatPlaceholder')}
              disabled={loading || isListening}
              className="flex-1 bg-[#f5efe9] border border-gray-300 rounded-full text-gray-800 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#bfa085]/40 focus:border-[#bfa085] placeholder:text-gray-400 transition-all"
              id="chat-input"
            />
            <button
              className={`p-3 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:bg-gray-100 hover:text-[#8b5e34]'}`}
              onClick={handleListen}
              disabled={loading}
              id="mic-btn"
              type="button"
              aria-label={isListening ? 'Listening...' : 'Start voice input'}
            >
              <IconMic />
            </button>
            <button
              className="bg-[#bfa085] p-3 rounded-full text-white hover:opacity-90 flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
