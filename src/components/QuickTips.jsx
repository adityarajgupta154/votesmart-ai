import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';

export default function QuickTips() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const tips = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8 text-[#8b5e34]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: language === 'hi' ? 'तैयार रहें' : 'Be Prepared',
      desc: language === 'hi' ? 'मतदान केंद्र पर जाने से पहले अपने मतदाता पर्ची और आईडी कार्ड की जांच कर लें।' : 'Check your voter slip and ID card before heading to the polling booth.'
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8 text-[#8b5e34]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: language === 'hi' ? 'सुरक्षित मतदान' : 'Secure Voting',
      desc: language === 'hi' ? 'आपका वोट गुप्त है। किसी के भी दबाव में आकर वोट न करें।' : 'Your vote is secret. Do not vote under pressure from anyone.'
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8 text-[#8b5e34]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: language === 'hi' ? 'जानकारी रखें' : 'Stay Informed',
      desc: language === 'hi' ? 'उम्मीदवारों के बारे में जानकारी प्राप्त करें और सोच-समझकर निर्णय लें।' : 'Get information about candidates and make an informed decision.'
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-[#8b5e34] mb-8 text-center">
        {language === 'hi' ? 'त्वरित मतदान सुझाव' : 'Quick Voting Tips'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${tip.id * 150}ms` }}
          >
            <div className="w-16 h-16 bg-[#f5efe9] rounded-full flex items-center justify-center mb-4">
              {tip.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{tip.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
