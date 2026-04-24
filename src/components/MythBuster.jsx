import { useState } from 'react';
import { useLanguage, lt } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { mythsDatabase, mythCategories } from '../data/myths';
import { checkMythWithAI } from '../utils/geminiApi';
import { useSpeech } from '../hooks/useSpeech';
import ListenButton from './ListenButton';
import './MythBuster.css';

export default function MythBuster() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [customClaim, setCustomClaim] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const { speak, speaking, activeId } = useSpeech();
  const listenLabel = language === 'hi' ? 'सुनें' : 'Listen';

  const filtered = activeCategory === 'All'
    ? mythsDatabase
    : mythsDatabase.filter(m => m.category === activeCategory);

  const handleCustomCheck = async () => {
    if (!customClaim.trim()) return;
    setChecking(true);
    setAiResult(null);
    const result = await checkMythWithAI(customClaim.trim(), language);
    setAiResult(result);
    setChecking(false);
  };

  const verdictConfig = {
    myth: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', label: '🚫 MYTH', labelHi: '🚫 मिथक' },
    fact: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: '✅ FACT', labelHi: '✅ सत्य' },
    partially_true: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: '⚠️ PARTIALLY TRUE', labelHi: '⚠️ आंशिक सत्य' },
    unknown: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', label: '❓ UNVERIFIED', labelHi: '❓ असत्यापित' }
  };

  const severityLabel = (sev) => {
    if (language === 'hi') {
      return sev === 'high' ? 'उच्च' : sev === 'medium' ? 'मध्यम' : 'कम';
    }
    return sev;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header animate-fade-in-up">
          <h1>{L('mythPageTitle')}</h1>
          <p>{L('mythPageDesc')}</p>
        </div>

        {/* Custom Claim Checker */}
        <div className="custom-checker glass-card animate-fade-in-up" id="custom-checker">
          <h3>{L('mythCheckTitle')}</h3>
          <p>{L('mythCheckDesc')}</p>
          <div className="checker-input-row">
            <input
              type="text"
              value={customClaim}
              onChange={(e) => setCustomClaim(e.target.value)}
              placeholder={L('mythPlaceholder')}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomCheck()}
              id="claim-input"
            />
            <button className="btn-primary" onClick={handleCustomCheck} disabled={checking || !customClaim.trim()} id="check-claim-btn">
              {checking ? <span className="loading-spinner" /> : L('mythVerify')}
            </button>
          </div>

          {aiResult && (
            <div className="ai-verdict animate-fade-in-up" id="ai-verdict">
              <div className="verdict-badge" style={{ background: verdictConfig[aiResult.verdict]?.bg, color: verdictConfig[aiResult.verdict]?.color }}>
                {language === 'hi' ? verdictConfig[aiResult.verdict]?.labelHi : verdictConfig[aiResult.verdict]?.label}
              </div>
              <p className="verdict-explanation">📌 {aiResult.explanation}</p>
              {aiResult.source && <p className="verdict-source">{L('mythSources')}: {aiResult.source}</p>}
              <ListenButton
                onClick={() => speak(aiResult.explanation, language, 'ai-verdict')}
                isPlaying={speaking && activeId === 'ai-verdict'}
                label={listenLabel}
              />
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="myth-categories" id="myth-categories">
          {mythCategories.map(cat => (
            <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Myths List */}
        <div className="myths-list">
          {filtered.map((m, i) => (
            <div key={m.id} className={`myth-card glass-card ${expandedId === m.id ? 'expanded' : ''}`} style={{ animationDelay: `${i * 50}ms` }} id={`myth-${m.id}`}>
              <button className="myth-header" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                <div className="myth-header-left">
                  <span className="myth-icon">🚫</span>
                  <div>
                    <span className={`badge badge-${m.severity === 'high' ? 'danger' : m.severity === 'medium' ? 'warning' : 'info'}`}>
                      {severityLabel(m.severity)} {L('mythRisk')}
                    </span>
                    <h3>{lt(m, 'myth', language)}</h3>
                  </div>
                </div>
                <span className={`myth-chevron ${expandedId === m.id ? 'open' : ''}`}>▼</span>
              </button>

              {expandedId === m.id && (
                <div className="myth-body animate-fade-in-up">
                  <div className="fact-block">
                    <span className="fact-icon">✅</span>
                    <div>
                      <strong>{L('mythTheFact')}:</strong>
                      <p>{lt(m, 'fact', language)}</p>
                    </div>
                  </div>
                  {m.didYouKnow && (
                    <div className="did-you-know">
                      <span>{L('mythDidYouKnow')}</span>
                      <p>{lt(m, 'didYouKnow', language)}</p>
                    </div>
                  )}
                  <div className="myth-meta">
                    <span className="myth-category">{m.category}</span>
                    <span className="myth-sources">{L('mythSources')}: {m.sources.join(', ')}</span>
                  </div>
                  <ListenButton
                    onClick={() => {
                      const fullText = `${lt(m, 'myth', language)}. ${lt(m, 'fact', language)}${m.didYouKnow ? '. ' + lt(m, 'didYouKnow', language) : ''}`;
                      speak(fullText, language, `myth-${m.id}`);
                    }}
                    isPlaying={speaking && activeId === `myth-${m.id}`}
                    label={listenLabel}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
