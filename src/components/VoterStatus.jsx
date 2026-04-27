import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';

export default function VoterStatus() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const [formData, setFormData] = useState({ name: '', state: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.state) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call for checking voter status
    setTimeout(() => {
      // Mock logic: If name length is even -> Found, else -> Not Found
      const isFound = formData.name.trim().length % 2 === 0;
      setResult({
        status: isFound ? 'found' : 'not_found',
        message: isFound 
          ? (language === 'hi' ? '✅ आपका नाम मतदाता सूची में मिल गया है।' : '✅ Your name was found in the voter list.')
          : (language === 'hi' ? '❌ आपका नाम मतदाता सूची में नहीं मिला।' : '❌ Your name was not found in the voter list.'),
        suggestion: !isFound 
          ? (language === 'hi' ? 'आपको रजिस्टर करने की आवश्यकता है। कृपया फॉर्म 6 भरें या National Voters Service Portal (nvsp.in) पर जाएँ।' : 'You need to register. Please fill Form 6 or visit the National Voters Service Portal (nvsp.in).')
          : null
      });
      setLoading(false);
    }, 1500);
  };

  const statesList = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
  ];

  return (
    <div className="rounded-2xl border border-white/10 shadow-lg bg-[#102a43] p-6" id="voter-status-section">
      <h3 className="text-white font-semibold text-xl mb-2">{language === 'hi' ? '🗳️ मतदाता स्थिति जांचें (सिम्युलेटेड)' : '🗳️ Check Voter Status (Simulated)'}</h3>
      <p className="text-gray-400 mb-6">{language === 'hi' ? 'जानें कि आपका नाम मतदाता सूची में है या नहीं।' : 'Find out if your name is on the voter list.'}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="voterName" className="text-white font-semibold text-sm">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
          <input
            id="voterName"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
            required
            className="bg-[#0f2a44] border border-gray-600 rounded-xl text-white placeholder:text-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="voterState" className="text-white font-semibold text-sm">{language === 'hi' ? 'राज्य' : 'State'}</label>
          <select
            id="voterState"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
            className="bg-[#0f2a44] border border-gray-600 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-all appearance-none"
          >
            <option value="">{language === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
            {statesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] rounded-full text-white py-3 px-6 hover:opacity-90 font-semibold transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !formData.name.trim() || !formData.state}
        >
          {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (language === 'hi' ? 'स्थिति जांचें' : 'Check Status')}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-xl border ${result.status === 'found' ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} animate-fade-in-up`}>
          <div className="text-white font-semibold">{result.message}</div>
          {result.suggestion && (
            <div className="text-gray-400 mt-2 text-sm">
              <strong className="text-white">{language === 'hi' ? 'सुझाव: ' : 'Suggestion: '}</strong>
              {result.suggestion}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
