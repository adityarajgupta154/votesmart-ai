import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { sendMessage } from '../utils/geminiApi';
import { useSpeech } from '../hooks/useSpeech';
import ListenButton from './ListenButton';
import { HiPaperAirplane } from 'react-icons/hi2';
import './ChatAssistant.css';

export default function ChatAssistant() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: L('chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { speak, speaking, activeId } = useSpeech();
  const listenLabel = language === 'hi' ? 'सुनें' : 'Listen';

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
    <div className="page-wrapper chat-page">
      <div className="container">
        <div className="chat-container glass-card" id="chat-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar">🗳️</span>
              <div>
                <h2>{L('chatTitle')}</h2>
                <span className="chat-status">
                  {loading ? L('chatThinking') : L('chatReady')}
                </span>
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setMessages([messages[0]])} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} id="clear-chat-btn">
              {L('chatClear')}
            </button>
          </div>

          <div className="chat-messages" id="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === 'assistant' && <span className="msg-avatar">🗳️</span>}
                <div className="msg-bubble">
                  <div className="msg-text" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  {msg.role === 'assistant' && i > 0 && (
                    <ListenButton
                      onClick={() => speak(msg.content, language, `chat-${i}`)}
                      isPlaying={speaking && activeId === `chat-${i}`}
                      label={listenLabel}
                    />
                  )}
                  {msg.source === 'offline' && (
                    <span className="msg-source">{L('chatOfflineNote')}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg assistant">
                <span className="msg-avatar">🗳️</span>
                <div className="msg-bubble">
                  <div className="thinking-indicator">
                    <span className="thinking-text">{L('chatThinking')}</span>
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="quick-questions">
              {quickQuestions.map((q, i) => (
                <button key={i} className="quick-btn" onClick={() => send(q)} id={`quick-q-${i}`}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area" id="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={L('chatPlaceholder')}
              disabled={loading}
              id="chat-input"
            />
            <button className="send-btn" onClick={() => send()} disabled={loading || !input.trim()} id="send-btn">
              <HiPaperAirplane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
