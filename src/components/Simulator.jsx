import { useState } from 'react';
import { useLanguage, lt } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { simulatorScenarios } from '../data/simulatorSteps';

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

  // ==================== PHASE: SELECT (screen4.html) ====================
  if (phase === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5efe6]">
        <main className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl overflow-hidden p-8 md:p-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b572a] tracking-tight">
              {L('simPageTitle')}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8b572a]">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <div>
                <div className="font-bold text-xl leading-none flex items-center">
                  VoteSmart <span className="text-[#8b572a] ml-1">AI</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500 mt-1">LEARN • PLAY • VERIFY</p>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <section className="mb-10">
            <div className="w-full h-auto bg-[#fdf8f3] rounded-2xl border border-gray-100 overflow-hidden flex justify-center items-center">
              <img
                alt="Polling Booth Illustration"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBcv9tqbGpTwqgQh0Y2vaCQ1g16s6TmgM-j0Tfkxt6kpqn37mCpERiyFA8dDJOXrnbY2rj033ySMpLLyLl6yrzo3yz2ETZY5nnOOWG7Wd57K74B-fI4L5yvlbARoLyB_YojcAF8hCQbKhs2asEK7HRqf2Blm8eBjw5OZ2Owdo_tcfa_3zPgOEXuo3KOl0qFei4KlYNm7tW2jDUa5-SiuJaADPKv4Iz8IAkHobeQizbII_3ai-1AvhZa_Gghoy6o9DPhLPnYaBxQ-Yb"
              />
            </div>
          </section>

          {/* Description */}
          <article className="space-y-6 mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">{L('simPageDesc')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              {language === 'hi'
                ? 'एक परिदृश्य चुनें और अपनी मतदान यात्रा शुरू करें।'
                : 'Choose a scenario below and begin your voting journey simulation.'}
            </p>
          </article>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {simulatorScenarios.map((s, i) => (
              <button
                key={s.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                onClick={() => startScenario(s)}
                id={`scenario-${s.id}`}
              >
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{lt(s, 'title', language)}</h3>
                <p className="text-sm text-gray-500 mb-3">{lt(s, 'description', language)}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    s.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    s.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {diffLabel(s.difficulty)}
                  </span>
                  <span className="text-xs text-gray-500">{s.steps.length} {L('simSteps')}</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ==================== PHASE: RESULTS ====================
  if (phase === 'results') {
    const percentage = Math.round((score / scenario.steps.length) * 100);
    const gradeKey = percentage >= 80 ? 'simExcellent' : percentage >= 60 ? 'simGood' : percentage >= 40 ? 'simKeepLearning' : 'simNeedPractice';
    const gradeEmoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪';

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5EFEB]">
        <main className="w-full max-w-md mx-auto flex flex-col items-center" id="results-card">
          <h1 className="text-xl text-gray-800 mb-6 font-bold">{L('simComplete')}</h1>
          <div className="w-full bg-[#FCFAF7] border border-[#E8E3DD] rounded-2xl p-8 shadow-sm text-center">
            <div className="text-6xl mb-4">{gradeEmoji}</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">{lt(scenario, 'title', language)}</p>
            <div className="text-5xl font-bold text-[#235D3A] mb-2">{score}/{scenario.steps.length}</div>
            <p className="text-[#235D3A] font-semibold mb-6">{L(gradeKey)}</p>

            {/* Answer Review */}
            <div className="space-y-3 text-left mb-6">
              {answers.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${a.correct ? 'bg-[#E4EFE0] border-[#93C493]' : 'bg-red-50 border-red-200'}`}>
                  <span className={`font-bold ${a.correct ? 'text-[#235D3A]' : 'text-red-600'}`}>
                    {a.correct ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-800">{a.step}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                className="w-full bg-[#956034] hover:opacity-90 transition-opacity text-white font-medium py-4 px-6 rounded-2xl text-lg"
                onClick={() => startScenario(scenario)}
                id="retry-btn"
              >
                {L('simTryAgain')}
              </button>
              <button
                className="w-full border border-[#E8E3DD] bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium py-4 px-6 rounded-2xl text-lg"
                onClick={restart}
                id="back-scenarios-btn"
              >
                {L('simAllScenarios')}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== PHASE: PLAYING (screen5.html quiz) ====================
  const step = scenario.steps[stepIndex];
  const progress = ((stepIndex + 1) / scenario.steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5EFEB]">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <button onClick={restart} className="text-[#8b572a] font-semibold hover:opacity-70 transition-opacity">
            ← {L('simBack')}
          </button>
          <h1 className="text-xl text-gray-800 font-bold">{lt(scenario, 'title', language)}</h1>
          <div className="text-[#8b572a] font-semibold">{L('simScore')}: {score}</div>
        </div>

        {/* Stepper */}
        <nav className="relative flex items-center justify-between mb-8 px-2 w-full max-w-lg">
          {scenario.steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                i < stepIndex ? 'bg-[#8b572a]' :
                i === stepIndex ? 'bg-[#8b572a]' :
                'bg-gray-300'
              }`}>
                {i < stepIndex ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < scenario.steps.length - 1 && (
                <div className={`h-[2px] flex-grow mx-2 ${i < stepIndex ? 'bg-[#8b572a]' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </nav>

        {/* Progress text */}
        <div className="text-sm text-gray-500 mb-2 self-end">
          {stepIndex + 1}/{scenario.steps.length}
        </div>

        {/* Quiz Card */}
        <div className="w-full bg-[#FCFAF7] border border-[#E8E3DD] rounded-2xl p-8 shadow-sm" id="sim-step-card">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-snug">
            {lt(step, 'title', language)}
          </h2>
          <p className="text-gray-600 text-base mb-8 leading-relaxed">{lt(step, 'scenario', language)}</p>

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((opt) => {
              let optClasses = 'border rounded-xl p-4 cursor-pointer transition-colors text-left w-full';
              if (showFeedback) {
                if (opt.correct) {
                  optClasses += ' border-[#B49372] bg-[#F1E6D4]';
                } else if (selectedOption?.id === opt.id && !opt.correct) {
                  optClasses += ' border-red-300 bg-red-50';
                } else {
                  optClasses += ' border-[#E8E3DD] bg-white opacity-50';
                }
              } else {
                optClasses += ' border-[#E8E3DD] bg-white hover:bg-gray-50';
              }

              return (
                <button
                  key={opt.id}
                  className={optClasses}
                  onClick={() => handleSelect(opt)}
                  disabled={showFeedback}
                  id={`option-${opt.id}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-gray-800 ${selectedOption?.id === opt.id ? 'font-medium' : ''}`}>
                      {lt(opt, 'text', language)}
                    </span>
                    {showFeedback && opt.correct && (
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                      </svg>
                    )}
                    {showFeedback && selectedOption?.id === opt.id && !opt.correct && (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <section className="w-full mt-2">
            <div className={`rounded-2xl p-6 border ${
              selectedOption?.correct
                ? 'bg-[#E4EFE0] border-[#93C493]'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-lg ${selectedOption?.correct ? 'text-[#235D3A]' : 'text-red-700'}`}>
                  {selectedOption?.correct ? L('simCorrect') : L('simWrong')}
                </span>
                {selectedOption?.correct && (
                  <svg className="w-5 h-5 text-[#235D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  </svg>
                )}
              </div>
              <p className={selectedOption?.correct ? 'text-[#235D3A]' : 'text-red-700'}>
                {lt(selectedOption, 'feedback', language)}
              </p>
              {!selectedOption?.correct && (
                <p className="text-red-700 mt-2">
                  {language === 'hi' ? '✅ सही उत्तर: ' : '✅ The correct answer is: '}
                  <strong>{lt(step.options.find(o => o.correct), 'text', language)}</strong>
                </p>
              )}
              {step.learnMore && (
                <p className="mt-2 text-sm text-gray-600"><strong>{L('simLearnMore')}:</strong> {step.learnMore}</p>
              )}
            </div>
          </section>
        )}

        {/* Next Button */}
        {showFeedback && (
          <footer className="w-full mt-6">
            <button
              className="w-full bg-[#956034] hover:opacity-90 transition-opacity text-white font-medium py-4 px-6 flex justify-center items-center gap-2 text-lg rounded-2xl"
              onClick={nextStep}
              id="next-step-btn"
            >
              {stepIndex < scenario.steps.length - 1 ? L('simNextStep') : L('simSeeResults')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              </svg>
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
