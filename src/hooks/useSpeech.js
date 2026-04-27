/**
 * useSpeech — Hybrid Text-to-Speech Hook
 * 
 * Strategy:
 *  1. Try Google Cloud TTS (Wavenet) via /api/speak endpoint
 *  2. If unavailable/fails → fall back to browser SpeechSynthesis API
 * 
 * Features:
 *  - Language-aware voice selection (en-US / hi-IN)
 *  - 0.9x rate for accessibility
 *  - Toggle play/stop on same item
 *  - Markdown/HTML stripping
 */
import { useState, useEffect, useCallback, useRef } from 'react';

// Detect if Cloud TTS is available (deployed environment)
const CLOUD_TTS_URL = '/api/speak';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [useCloudTTS, setUseCloudTTS] = useState(null); // null = untested
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  // Check Cloud TTS availability on mount
  useEffect(() => {
    const checkCloud = async () => {
      try {
        const resp = await fetch('/api/health', { method: 'GET' });
        if (resp.ok) {
          setUseCloudTTS(true);
        } else {
          setUseCloudTTS(false);
        }
      } catch {
        setUseCloudTTS(false);
      }
    };
    checkCloud();

    // Cleanup on unmount
    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Monitor browser speech end
  useEffect(() => {
    let interval;
    if (speaking && !audioRef.current) {
      interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          setActiveId(null);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [speaking]);

  // Clean text for TTS
  const cleanText = useCallback((text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/\\n/g, '. ')
      .replace(/\n/g, '. ')
      .replace(/[#*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  // ──── Cloud TTS (Google Wavenet) ────
  const speakCloud = useCallback(async (text, language, id) => {
    try {
      setPreparing(true);
      setActiveId(id);
      
      const seniorMode = document.body.classList.contains('senior-mode');
      const resp = await fetch(CLOUD_TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, seniorMode }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const audioSrc = `data:audio/mp3;base64,${data.audio}`;

      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Add 400ms human-like delay
      await new Promise(r => setTimeout(r, 400));

      const audio = new Audio(audioSrc);
      audio.volume = 0; // Start at 0 for fade-in
      audioRef.current = audio;

      audio.onplay = () => {
        setPreparing(false);
        setSpeaking(true);
        setActiveId(id);
        
        // Fade in effect
        let vol = 0;
        const fadeInt = setInterval(() => {
          if (vol < 0.9) {
            vol += 0.1;
            audio.volume = vol;
          } else {
            audio.volume = 1;
            clearInterval(fadeInt);
          }
        }, 50);
      };

      audio.onended = () => {
        setSpeaking(false);
        setActiveId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPreparing(false);
        setSpeaking(false);
        setActiveId(null);
        audioRef.current = null;
      };

      await audio.play();
      return true;
    } catch (err) {
      console.warn('Cloud TTS failed, falling back to browser:', err.message);
      setPreparing(false);
      return false;
    }
  }, []);

  // ──── Browser SpeechSynthesis (Fallback) ────
  const getVoice = useCallback((lang) => {
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === 'hi' ? 'hi-IN' : 'en-US';

    let voice = voices.find(v => v.lang === langCode && !v.localService);
    if (!voice) voice = voices.find(v => v.lang === langCode);
    if (!voice) voice = voices.find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en'));
    return voice || null;
  }, []);

  const speakBrowser = useCallback((text, language, id) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const clean = cleanText(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voice = getVoice(language);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setSpeaking(true);
      setActiveId(id);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setActiveId(null);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setActiveId(null);
    };

    utteranceRef.current = utterance;

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const v = getVoice(language);
        if (v) utterance.voice = v;
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }, [cleanText, getVoice]);

  // ──── Main speak function ────
  const speak = useCallback(async (text, language = 'en', id = null) => {
    // Toggle: stop if already speaking the same item
    if (speaking && activeId === id) {
      stop();
      return;
    }

    // Stop any ongoing speech
    stop();

    // Try Cloud TTS first if available, then fall back to browser
    if (useCloudTTS) {
      const success = await speakCloud(text, language, id);
      if (success) return;
    }

    // Fallback to browser SpeechSynthesis
    speakBrowser(text, language, id);
  }, [speaking, activeId, useCloudTTS, speakCloud, speakBrowser]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setSpeaking(false);
    setPreparing(false);
    setActiveId(null);
  }, []);

  return { speak, stop, speaking, preparing, activeId, isCloudTTS: useCloudTTS };
}

export default useSpeech;
