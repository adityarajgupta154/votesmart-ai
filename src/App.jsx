import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { t } from './data/translations';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import PageLoader from './components/PageLoader';
import { initializeAI } from './utils/geminiApi';

const Hero = lazy(() => import('./components/Hero'));
const Simulator = lazy(() => import('./components/Simulator'));
const VotingGuide = lazy(() => import('./components/VotingGuide'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const MythBuster = lazy(() => import('./components/MythBuster'));
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));


export default function App() {
  const { language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [aiConnected, setAiConnected] = useState(true);
  const [seniorMode, setSeniorMode] = useState(false);

  useEffect(() => {
    // Ping backend health or assume true
    setAiConnected(true);
    
    // Load senior mode preference
    const isSenior = localStorage.getItem('votesmart_senior_mode') === 'true';
    setSeniorMode(isSenior);
    if (isSenior) {
      document.body.classList.add('senior-mode');
    }
  }, []);

  const toggleSeniorMode = () => {
    const newVal = !seniorMode;
    setSeniorMode(newVal);
    localStorage.setItem('votesmart_senior_mode', newVal);
    if (newVal) {
      document.body.classList.add('senior-mode');
    } else {
      document.body.classList.remove('senior-mode');
    }
  };

  const saveSettings = () => {
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
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onSettingsClick={() => setShowSettings(true)} />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/guide" element={<VotingGuide />} />
            <Route path="/myths" element={<MythBuster />} />
            <Route path="/chat" element={<ChatAssistant />} />
          </Routes>
        </Suspense>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowSettings(false)} id="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modalFadeIn 0.3s ease-out forwards' }}
          >
            <h2 id="settings-title" className="text-[#8b5e34] font-bold text-2xl mb-6">{L('settingsTitle')}</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-gray-800 font-semibold text-lg">{L('settingsAITitle')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{L('settingsAIDesc')}</p>
                <div className="text-sm font-medium mt-2 text-gray-500">
                  <span className="text-gray-600">{L('settingsStatus')}:</span>{' '}
                  {aiConnected
                    ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">{L('settingsConnected')}</span>
                    : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">{L('settingsNotConnected')}</span>
                  }
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-800 font-semibold text-lg">{L('settingsSeniorModeTitle')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{L('settingsSeniorModeDesc')}</p>
                <label className="flex items-center gap-3 cursor-pointer mt-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={seniorMode}
                    onChange={toggleSeniorMode}
                    className="w-5 h-5 rounded border-gray-300 bg-white text-[#bfa085] focus:ring-[#bfa085] focus:ring-offset-white cursor-pointer"
                  />
                  <span>{L('settingsSeniorMode')}</span>
                </label>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-800 font-semibold text-lg">{L('settingsLangTitle')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{L('settingsLangDesc')}</p>
                <button className="mt-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm hover:bg-gray-50 transition-all" onClick={handleChangeLanguage} id="change-lang-btn">
                  {L('settingsLangBtn')}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all" onClick={() => setShowSettings(false)}>{L('settingsCancel')}</button>
              <button className="px-6 py-3 bg-[#bfa085] rounded-xl text-white hover:opacity-90 font-semibold transition-opacity" onClick={saveSettings} id="save-settings-btn">{L('settingsSave')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
