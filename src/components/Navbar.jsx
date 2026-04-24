import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { HiOutlineAcademicCap, HiOutlineChatBubbleLeftRight, HiOutlineShieldCheck, HiOutlineClipboardDocumentList, HiOutlineCog6Tooth, HiBars3, HiXMark } from 'react-icons/hi2';
import './Navbar.css';

export default function Navbar({ onSettingsClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const navItems = [
    { path: '/', label: L('navHome'), icon: <HiOutlineAcademicCap /> },
    { path: '/simulator', label: L('navSimulator'), icon: <HiOutlineClipboardDocumentList /> },
    { path: '/guide', label: L('navGuide'), icon: <HiOutlineAcademicCap /> },
    { path: '/myths', label: L('navMyths'), icon: <HiOutlineShieldCheck /> },
    { path: '/chat', label: L('navChat'), icon: <HiOutlineChatBubbleLeftRight /> },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-icon">🗳️</span>
          <span className="brand-text">
            <strong>VoteSmart</strong> <span className="brand-ai">AI</span>
          </span>
        </NavLink>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="settings-btn" onClick={onSettingsClick} title="Settings" id="settings-btn">
            <HiOutlineCog6Tooth />
          </button>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-btn">
            {mobileOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
      </div>

      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
}
