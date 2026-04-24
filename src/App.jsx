import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { t } from './data/translations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Simulator from './components/Simulator';
import VotingGuide from './components/VotingGuide';
import MythBuster from './components/MythBuster';
import ChatAssistant from './components/ChatAssistant';
import LanguageSelector from './components/LanguageSelector';
import { initializeAI } from './utils/geminiApi';
import './App.css';

export default function App() {
  const { language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiConnected, setAiConnected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('votesmart_api_key');
    if (saved) {
      setApiKey(saved);
      const ok = initializeAI(saved);
      setAiConnected(ok);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('votesmart_api_key', apiKey.trim());
      const ok = initializeAI(apiKey.trim());
      setAiConnected(ok);
    } else {
      localStorage.removeItem('votesmart_api_key');
      setAiConnected(false);
    }
    setShowSettings(false);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  const handleChangeLanguage = () => {
    localStorage.removeItem('votesmart_language');
    setLanguage(null);
    setShowSettings(false);
  };

  // Show language selector if not yet chosen
  if (!language) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  const L = (key) => t(language, key);

  return (
    <>
      <Navbar onSettingsClick={() => setShowSettings(true)} />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/guide" element={<VotingGuide />} />
        <Route path="/myths" element={<MythBuster />} />
        <Route path="/chat" element={<ChatAssistant />} />
      </Routes>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)} id="settings-modal">
          <div className="modal-card glass-card animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h2>{L('settingsTitle')}</h2>

            <div className="settings-section">
              <h4>{L('settingsAITitle')}</h4>
              <p className="settings-desc">{L('settingsAIDesc')}</p>
              <div className="settings-status">
                {L('settingsStatus')}: {aiConnected
                  ? <span className="badge badge-success">{L('settingsConnected')}</span>
                  : <span className="badge badge-warning">{L('settingsNotConnected')}</span>
                }
              </div>
              <label className="settings-label" htmlFor="api-key-input">{L('settingsAPIKey')}</label>
              <input
                id="api-key-input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <p className="settings-hint">
                {L('settingsHint')} <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com</a>
              </p>
            </div>

            <div className="settings-section">
              <h4>{L('settingsLangTitle')}</h4>
              <p className="settings-desc">{L('settingsLangDesc')}</p>
              <button className="btn-secondary" onClick={handleChangeLanguage} id="change-lang-btn">
                {L('settingsLangBtn')}
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>{L('settingsCancel')}</button>
              <button className="btn-primary" onClick={saveApiKey} id="save-settings-btn">{L('settingsSave')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
