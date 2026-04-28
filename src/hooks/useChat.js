/**
 * useChat — Custom hook for chat functionality
 *
 * Encapsulates all chat state management, message sending,
 * voice input, and message formatting logic.
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { sendMessage } from '../utils/geminiApi';

export function useChat() {
  const { language } = useLanguage();
  const L = useCallback((key) => t(language, key), [language]);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: L('chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ role: 'assistant', content: L('chatWelcome') }]);
  }, [language, L]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = useMemo(() => [
    L('chatQ1'), L('chatQ2'), L('chatQ3'),
    L('chatQ4'), L('chatQ5'), L('chatQ6')
  ], [L]);

  const send = useCallback(async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    // Simulate thinking delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    try {
      const response = await sendMessage(userMsg, newMessages.slice(1), language);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        source: response.source
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'hi'
          ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, I encountered an error. Please try again.',
        source: 'error'
      }]);
    }
    setLoading(false);
  }, [input, loading, messages, language]);

  const clearChat = useCallback(() => {
    setMessages([messages[0]]);
  }, [messages]);

  const startVoiceInput = useCallback(() => {
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
  }, [language]);

  return {
    messages,
    input,
    setInput,
    loading,
    isListening,
    endRef,
    quickQuestions,
    send,
    clearChat,
    startVoiceInput,
    language,
    L,
  };
}

export default useChat;
