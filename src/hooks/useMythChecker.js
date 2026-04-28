/**
 * useMythChecker — Custom hook for myth verification functionality
 *
 * Encapsulates myth checking state, AI verification calls,
 * category filtering, and verdict configuration.
 */
import { useState, useCallback, useMemo } from 'react';
import { useLanguage, lt } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { mythsDatabase, mythCategories } from '../data/myths';
import { checkMythWithAI } from '../utils/geminiApi';

export function useMythChecker() {
  const { language } = useLanguage();
  const L = useCallback((key) => t(language, key), [language]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [customClaim, setCustomClaim] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const filteredMyths = useMemo(() => {
    return activeCategory === 'All'
      ? mythsDatabase
      : mythsDatabase.filter(m => m.category === activeCategory);
  }, [activeCategory]);

  const handleCustomCheck = useCallback(async () => {
    if (!customClaim.trim()) return;
    setChecking(true);
    setAiResult(null);
    const result = await checkMythWithAI(customClaim.trim(), language);
    setAiResult(result);
    setChecking(false);
  }, [customClaim, language]);

  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const verdictConfig = useMemo(() => ({
    myth: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', label: '🚫 MYTH', labelHi: '🚫 मिथक' },
    fact: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: '✅ FACT', labelHi: '✅ सत्य' },
    partially_true: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: '⚠️ PARTIALLY TRUE', labelHi: '⚠️ आंशिक सत्य' },
    unknown: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', label: '❓ UNVERIFIED', labelHi: '❓ असत्यापित' }
  }), []);

  const severityLabel = useCallback((sev) => {
    if (language === 'hi') {
      return sev === 'high' ? 'उच्च' : sev === 'medium' ? 'मध्यम' : 'कम';
    }
    return sev;
  }, [language]);

  return {
    language,
    L,
    activeCategory,
    setActiveCategory,
    expandedId,
    toggleExpand,
    customClaim,
    setCustomClaim,
    aiResult,
    checking,
    handleCustomCheck,
    filteredMyths,
    mythCategories,
    verdictConfig,
    severityLabel,
  };
}

export default useMythChecker;
