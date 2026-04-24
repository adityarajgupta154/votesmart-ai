import './LanguageSelector.css';

export default function LanguageSelector({ onSelect }) {
  return (
    <div className="lang-overlay" id="language-selector">
      <div className="lang-container">
        <div className="lang-header">
          <span className="lang-flag">🇮🇳</span>
          <h1>Welcome to <span className="lang-brand">VoteSmart AI</span></h1>
          <p>Choose your language / अपनी भाषा चुनें</p>
        </div>

        <div className="lang-cards">
          <button className="lang-card" onClick={() => onSelect('en')} id="lang-en">
            <span className="lang-letter">A</span>
            <h2>English</h2>
            <p>Continue in English</p>
          </button>

          <button className="lang-card" onClick={() => onSelect('hi')} id="lang-hi">
            <span className="lang-letter" style={{ fontFamily: 'var(--font-hindi)' }}>अ</span>
            <h2 style={{ fontFamily: 'var(--font-hindi)' }}>हिन्दी</h2>
            <p style={{ fontFamily: 'var(--font-hindi)' }}>हिन्दी में जारी रखें</p>
          </button>
        </div>

        <p className="lang-note">You can change this later in Settings / सेटिंग्स में बाद में बदल सकते हैं</p>
      </div>
    </div>
  );
}
