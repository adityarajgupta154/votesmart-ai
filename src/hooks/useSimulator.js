/**
 * useSimulator — Custom hook for voting simulator functionality
 *
 * Encapsulates all simulator phases (select, playing, results),
 * scoring, answer tracking, and step navigation.
 */
import { useState, useCallback, useMemo } from 'react';
import { useLanguage, lt } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { simulatorScenarios } from '../data/simulatorSteps';

export function useSimulator() {
  const { language } = useLanguage();
  const L = useCallback((key) => t(language, key), [language]);

  const [phase, setPhase] = useState('select');
  const [scenario, setScenario] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startScenario = useCallback((s) => {
    setScenario(s);
    setStepIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setPhase('playing');
  }, []);

  const handleSelect = useCallback((option) => {
    if (showFeedback || !scenario) return;
    setSelectedOption(option);
    setShowFeedback(true);
    if (option.correct) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, {
      step: lt(scenario.steps[stepIndex], 'title', language),
      selected: option,
      correct: option.correct
    }]);
  }, [showFeedback, scenario, stepIndex, language]);

  const nextStep = useCallback(() => {
    if (!scenario) return;
    if (stepIndex < scenario.steps.length - 1) {
      setStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setPhase('results');
    }
  }, [stepIndex, scenario]);

  const restart = useCallback(() => {
    setPhase('select');
    setScenario(null);
    setStepIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
  }, []);

  const diffLabel = useCallback((d) => {
    if (d === 'Beginner') return L('simBeginner');
    if (d === 'Intermediate') return L('simIntermediate');
    return L('simAdvanced');
  }, [L]);

  const currentStep = scenario?.steps[stepIndex] || null;
  const progress = scenario ? ((stepIndex + 1) / scenario.steps.length) * 100 : 0;
  const percentage = scenario ? Math.round((score / scenario.steps.length) * 100) : 0;

  const gradeInfo = useMemo(() => {
    if (!scenario) return { key: '', emoji: '' };
    const key = percentage >= 80 ? 'simExcellent' : percentage >= 60 ? 'simGood' : percentage >= 40 ? 'simKeepLearning' : 'simNeedPractice';
    const emoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪';
    return { key, emoji };
  }, [percentage, scenario]);

  return {
    language,
    L,
    phase,
    scenario,
    stepIndex,
    selectedOption,
    showFeedback,
    score,
    answers,
    currentStep,
    progress,
    percentage,
    gradeInfo,
    simulatorScenarios,
    startScenario,
    handleSelect,
    nextStep,
    restart,
    diffLabel,
  };
}

export default useSimulator;
