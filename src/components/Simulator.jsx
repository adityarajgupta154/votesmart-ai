import { useState } from 'react';
import { useLanguage, lt } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { simulatorScenarios } from '../data/simulatorSteps';
import './Simulator.css';

export default function Simulator() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [phase, setPhase] = useState('select');
  const [scenario, setScenario] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startScenario = (s) => {
    setScenario(s);
    setStepIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setPhase('playing');
  };

  const handleSelect = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    if (option.correct) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, {
      step: lt(scenario.steps[stepIndex], 'title', language),
      selected: option,
      correct: option.correct
    }]);
  };

  const nextStep = () => {
    if (stepIndex < scenario.steps.length - 1) {
      setStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setPhase('results');
    }
  };

  const restart = () => {
    setPhase('select');
    setScenario(null);
    setStepIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const diffLabel = (d) => {
    if (d === 'Beginner') return L('simBeginner');
    if (d === 'Intermediate') return L('simIntermediate');
    return L('simAdvanced');
  };

  // Scenario selection
  if (phase === 'select') {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="page-header animate-fade-in-up">
            <h1>{L('simPageTitle')}</h1>
            <p>{L('simPageDesc')}</p>
          </div>
          <div className="scenario-grid">
            {simulatorScenarios.map((s, i) => (
              <button key={s.id} className="scenario-card glass-card" onClick={() => startScenario(s)} style={{ animationDelay: `${i * 100}ms` }} id={`scenario-${s.id}`}>
                <span className="scenario-icon">{s.icon}</span>
                <h3>{lt(s, 'title', language)}</h3>
                <p>{lt(s, 'description', language)}</p>
                <div className="scenario-meta">
                  <span className={`badge badge-${s.difficulty === 'Beginner' ? 'success' : s.difficulty === 'Intermediate' ? 'warning' : 'info'}`}>
                    {diffLabel(s.difficulty)}
                  </span>
                  <span className="step-count">{s.steps.length} {L('simSteps')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (phase === 'results') {
    const percentage = Math.round((score / scenario.steps.length) * 100);
    const gradeKey = percentage >= 80 ? 'simExcellent' : percentage >= 60 ? 'simGood' : percentage >= 40 ? 'simKeepLearning' : 'simNeedPractice';
    const gradeEmoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪';

    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="results-card glass-card animate-fade-in-up" id="results-card">
            <div className="results-emoji">{gradeEmoji}</div>
            <h2>{L('simComplete')}</h2>
            <p className="results-scenario">{lt(scenario, 'title', language)}</p>

            <div className="results-score-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeDasharray={`${percentage * 3.27} 327`} strokeLinecap="round" transform="rotate(-90 60 60)" className="score-circle" />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="100%" stopColor="#138808" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-text">
                <span className="score-number">{score}/{scenario.steps.length}</span>
                <span className="score-label">{L(gradeKey)}</span>
              </div>
            </div>

            <div className="results-answers">
              {answers.map((a, i) => (
                <div key={i} className={`answer-row ${a.correct ? 'correct' : 'wrong'}`}>
                  <span className="answer-icon">{a.correct ? '✓' : '✗'}</span>
                  <span className="answer-title">{a.step}</span>
                  <span className="answer-choice">{lt(a.selected, 'text', language).substring(0, 50)}...</span>
                </div>
              ))}
            </div>

            <div className="results-actions">
              <button className="btn-primary" onClick={() => startScenario(scenario)} id="retry-btn">{L('simTryAgain')}</button>
              <button className="btn-secondary" onClick={restart} id="back-scenarios-btn">{L('simAllScenarios')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  const step = scenario.steps[stepIndex];
  const progress = ((stepIndex + 1) / scenario.steps.length) * 100;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="sim-header animate-fade-in">
          <button className="sim-back" onClick={restart}>{L('simBack')}</button>
          <div className="sim-info">
            <span className="sim-scenario-name">{lt(scenario, 'title', language)}</span>
            <span className="sim-step-count">{L('simStep')} {stepIndex + 1} {L('simOf')} {scenario.steps.length}</span>
          </div>
          <div className="sim-score">{L('simScore')}: {score}</div>
        </div>

        <div className="sim-progress-wrapper">
          <span className="sim-progress-label">{language === 'hi' ? `आपकी मतदान यात्रा: ${Math.round(progress)}% पूर्ण` : `Your Voting Journey: ${Math.round(progress)}% Complete`}</span>
          <div className="sim-progress">
            <div className="sim-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="sim-card glass-card animate-fade-in-up" id="sim-step-card">
          <div className="sim-step-header">
            <span className="sim-step-badge badge badge-info">{L('simStep')} {step.id}</span>
            <h2>{lt(step, 'title', language)}</h2>
          </div>

          <p className="sim-scenario-text">{lt(step, 'scenario', language)}</p>

          <div className="sim-options">
            {step.options.map((opt) => {
              let optClass = 'sim-option';
              if (showFeedback) {
                if (opt.correct) optClass += ' correct';
                else if (selectedOption?.id === opt.id && !opt.correct) optClass += ' wrong';
                else optClass += ' dimmed';
              }
              if (selectedOption?.id === opt.id) optClass += ' selected';

              return (
                <button key={opt.id} className={optClass} onClick={() => handleSelect(opt)} disabled={showFeedback} id={`option-${opt.id}`}>
                  <span className="opt-letter">{opt.id.toUpperCase()}</span>
                  <span className="opt-text">{lt(opt, 'text', language)}</span>
                  {showFeedback && opt.correct && <span className="opt-badge">✓</span>}
                  {showFeedback && selectedOption?.id === opt.id && !opt.correct && <span className="opt-badge wrong-badge">✗</span>}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`sim-feedback animate-fade-in-up ${selectedOption?.correct ? 'correct' : 'wrong'}`}>
              <p className="feedback-headline">
                <strong>{selectedOption?.correct ? L('simCorrect') : L('simWrong')}</strong>
              </p>
              {!selectedOption?.correct && (
                <p className="feedback-why">
                  {language === 'hi' ? '❌ आपने जो चुना वह गलत है क्योंकि:' : '❌ Why this is incorrect:'}
                </p>
              )}
              <p>{lt(selectedOption, 'feedback', language)}</p>
              {!selectedOption?.correct && (
                <p className="feedback-correct-answer">
                  {language === 'hi' ? '✅ सही उत्तर: ' : '✅ The correct answer is: '}
                  <strong>{lt(step.options.find(o => o.correct), 'text', language)}</strong>
                </p>
              )}
              {step.learnMore && (
                <p className="learn-more"><strong>{L('simLearnMore')}:</strong> {step.learnMore}</p>
              )}
              <button className="btn-primary" onClick={nextStep} id="next-step-btn">
                {stepIndex < scenario.steps.length - 1 ? L('simNextStep') : L('simSeeResults')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
