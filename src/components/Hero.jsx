import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { HiOutlinePlay, HiOutlineChatBubbleLeftRight, HiOutlineShieldCheck, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import './Hero.css';

export default function Hero() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const features = [
    { icon: <HiOutlinePlay />, title: L('feat1Title'), desc: L('feat1Desc'), path: '/simulator', color: '#FF9933' },
    { icon: <HiOutlineClipboardDocumentList />, title: L('feat2Title'), desc: L('feat2Desc'), path: '/guide', color: '#138808' },
    { icon: <HiOutlineShieldCheck />, title: L('feat3Title'), desc: L('feat3Desc'), path: '/myths', color: '#FF9933' },
    { icon: <HiOutlineChatBubbleLeftRight />, title: L('feat4Title'), desc: L('feat4Desc'), path: '/chat', color: '#138808' },
  ];

  const stats = [
    { value: '96.8 Cr', label: L('stat1') },
    { value: '10.5 L+', label: L('stat2') },
    { value: '543', label: L('stat3') },
    { value: '4000+', label: L('stat4') },
  ];

  return (
    <div className="hero-page page-wrapper">
      <div className="container">
        <section className="hero-section animate-fade-in-up" id="hero-section">
          <div className="hero-badge badge badge-info">{L('heroBadge')}</div>
          <h1 className="hero-title">
            {L('heroTitle1')}<br />
            <span className="hero-gradient">{L('heroTitle2')}</span>
          </h1>
          <p className="hero-subtitle">{L('heroSubtitle')}</p>
          <div className="hero-cta">
            <Link to="/simulator" className="btn-primary" id="start-simulator-btn">
              <HiOutlinePlay /> {L('heroStartSim')}
            </Link>
            <Link to="/chat" className="btn-secondary" id="ask-ai-btn">
              <HiOutlineChatBubbleLeftRight /> {L('heroAskAI')}
            </Link>
          </div>
        </section>

        <section className="stats-row" id="stats-section">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass-card" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="features-grid" id="features-section">
          {features.map((f, i) => (
            <Link key={f.path} to={f.path} className="feature-card glass-card" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="feature-icon" style={{ color: f.color, background: `${f.color}15` }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </section>

        <section className="trust-banner glass-card" id="trust-banner">
          <div className="trust-icon">🛡️</div>
          <div>
            <h3>{L('trustTitle')}</h3>
            <p>{L('trustDesc')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
