import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { votingChecklist, getPersonalizedGuide, statesList } from '../data/votingInfo';
import VoterStatus from './VoterStatus';

export default function VotingGuide() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [formData, setFormData] = useState({ age: '', state: '', registered: '', firstTime: '' });
  const [tips, setTips] = useState(null);
  const [checklist, setChecklist] = useState(votingChecklist.map(c => ({ ...c })));
  const [showChecklist, setShowChecklist] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = getPersonalizedGuide(
      parseInt(formData.age) || 0,
      formData.state,
      formData.registered,
      formData.firstTime,
      language
    );
    setTips(result);
    setShowChecklist(true);
  };

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const completedCount = checklist.filter(c => c.done).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="bg-[#f5efe9] min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-[#8b5e34] font-bold text-3xl md:text-4xl mb-4">{L('guidePageTitle')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{L('guidePageDesc')}</p>
        </div>

        <VoterStatus />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 animate-fade-in-up" id="guide-form">
            <h2 className="text-gray-800 font-bold text-xl mb-6">{L('guideTellUs')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="age" className="text-gray-700 font-medium mb-2">{L('guideAge')}</label>
                <input id="age" type="number" min="1" max="120" value={formData.age} onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))} placeholder="e.g., 19" required className="bg-white border border-gray-300 rounded-xl text-gray-800 p-3 focus:outline-none focus:border-[#bfa085] focus:ring-1 focus:ring-[#bfa085] transition-colors" />
              </div>

              <div className="flex flex-col">
                <label htmlFor="state" className="text-gray-700 font-medium mb-2">{L('guideState')}</label>
                <select id="state" value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} required className="bg-white border border-gray-300 rounded-xl text-gray-800 p-3 focus:outline-none focus:border-[#bfa085] focus:ring-1 focus:ring-[#bfa085] transition-colors">
                  <option value="">{L('guideSelectState')}</option>
                  {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="registered" className="text-gray-700 font-medium mb-2">{L('guideRegistered')}</label>
                <select id="registered" value={formData.registered} onChange={(e) => setFormData(prev => ({ ...prev, registered: e.target.value }))} required className="bg-white border border-gray-300 rounded-xl text-gray-800 p-3 focus:outline-none focus:border-[#bfa085] focus:ring-1 focus:ring-[#bfa085] transition-colors">
                  <option value="">{L('guideSelect')}</option>
                  <option value="Yes">{L('guideYes')}</option>
                  <option value="No">{L('guideNo')}</option>
                  <option value="Not Sure">{L('guideNotSure')}</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="firstTime" className="text-gray-700 font-medium mb-2">{L('guideFirstTime')}</label>
                <select id="firstTime" value={formData.firstTime} onChange={(e) => setFormData(prev => ({ ...prev, firstTime: e.target.value }))} required className="bg-white border border-gray-300 rounded-xl text-gray-800 p-3 focus:outline-none focus:border-[#bfa085] focus:ring-1 focus:ring-[#bfa085] transition-colors">
                  <option value="">{L('guideSelect')}</option>
                  <option value="Yes">{L('guideYes')}</option>
                  <option value="No">{L('guideNo')}</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#bfa085] text-white rounded-full py-3 mt-4 hover:opacity-90 transition-opacity font-medium shadow-md" id="get-guide-btn">
                {L('guideGetGuide')}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            {tips && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 animate-fade-in-up" id="tips-card">
                <h2 className="text-gray-800 font-bold text-xl mb-4">{L('guideTipsTitle')}</h2>
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${tip.type === 'success' ? 'bg-green-50 border-green-200' : tip.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                      <span className="text-lg mt-0.5">
                        {tip.type === 'success' ? '✅' : tip.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showChecklist && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 animate-fade-in-up" id="checklist-card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-800 font-bold text-xl">{L('guideChecklistTitle')}</h2>
                  <span className="text-[#8b5e34] font-medium">{completedCount}/{checklist.length}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
                  <div className="bg-[#bfa085] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-3">
                  {checklist.map(item => (
                    <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${item.done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-[#bfa085]'}`} id={`check-${item.id}`}>
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 bg-white text-[#bfa085] focus:ring-[#bfa085]" checked={item.done} onChange={() => toggleCheck(item.id)} />
                      <span className={`flex-1 text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{language === 'hi' && item.textHi ? item.textHi : item.text}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#8b5e34] hover:text-[#7a4e24] font-medium text-sm whitespace-nowrap" onClick={(e) => e.stopPropagation()}>Link →</a>
                      )}
                    </label>
                  ))}
                </div>

                {completedCount === checklist.length && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-medium animate-fade-in-up">
                    {L('guideAllSet')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
