import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { votingChecklist, getPersonalizedGuide, statesList } from '../data/votingInfo';
import './VotingGuide.css';

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
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header animate-fade-in-up">
          <h1>{L('guidePageTitle')}</h1>
          <p>{L('guidePageDesc')}</p>
        </div>

        <div className="guide-layout">
          <div className="guide-form glass-card animate-fade-in-up" id="guide-form">
            <h3>{L('guideTellUs')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="age">{L('guideAge')}</label>
                <input id="age" type="number" min="1" max="120" value={formData.age} onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))} placeholder="e.g., 19" required />
              </div>

              <div className="form-group">
                <label htmlFor="state">{L('guideState')}</label>
                <select id="state" value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} required>
                  <option value="">{L('guideSelectState')}</option>
                  {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="registered">{L('guideRegistered')}</label>
                <select id="registered" value={formData.registered} onChange={(e) => setFormData(prev => ({ ...prev, registered: e.target.value }))} required>
                  <option value="">{L('guideSelect')}</option>
                  <option value="Yes">{L('guideYes')}</option>
                  <option value="No">{L('guideNo')}</option>
                  <option value="Not Sure">{L('guideNotSure')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="firstTime">{L('guideFirstTime')}</label>
                <select id="firstTime" value={formData.firstTime} onChange={(e) => setFormData(prev => ({ ...prev, firstTime: e.target.value }))} required>
                  <option value="">{L('guideSelect')}</option>
                  <option value="Yes">{L('guideYes')}</option>
                  <option value="No">{L('guideNo')}</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} id="get-guide-btn">
                {L('guideGetGuide')}
              </button>
            </form>
          </div>

          <div className="guide-results">
            {tips && (
              <div className="tips-card glass-card animate-fade-in-up" id="tips-card">
                <h3>{L('guideTipsTitle')}</h3>
                <div className="tips-list">
                  {tips.map((tip, i) => (
                    <div key={i} className={`tip-item tip-${tip.type}`}>
                      <span className="tip-icon">
                        {tip.type === 'success' ? '✅' : tip.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <p>{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showChecklist && (
              <div className="checklist-card glass-card animate-fade-in-up" id="checklist-card">
                <div className="checklist-header">
                  <h3>{L('guideChecklistTitle')}</h3>
                  <span className="checklist-progress-text">{completedCount}/{checklist.length}</span>
                </div>

                <div className="checklist-bar">
                  <div className="checklist-bar-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="checklist-items">
                  {checklist.map(item => (
                    <label key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`} id={`check-${item.id}`}>
                      <input type="checkbox" checked={item.done} onChange={() => toggleCheck(item.id)} />
                      <span className="checkmark" />
                      <span className="check-text">{language === 'hi' && item.textHi ? item.textHi : item.text}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener" className="check-link">Link →</a>
                      )}
                    </label>
                  ))}
                </div>

                {completedCount === checklist.length && (
                  <div className="checklist-complete animate-fade-in-up">
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
