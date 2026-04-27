import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import QuickTips from './QuickTips';

export default function Dashboard() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const exploreCards = [
    {
      title: language === 'hi' ? 'मतदान यात्रा' : 'Voting Journey',
      desc: language === 'hi' ? 'चरण-दर-चरण मार्गदर्शिका' : 'Step-by-step guide',
      path: '/simulator',
      color: '#538038',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'मिथक बनाम वास्तविकता' : 'Myth vs Reality',
      desc: language === 'hi' ? 'सच्चाई जानें' : 'Know the truth',
      path: '/myths',
      color: '#A63C24',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v8l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'मतदाता स्थिति जाँचें' : 'Check Voter Status',
      desc: language === 'hi' ? 'अपने विवरण सत्यापित करें' : 'Verify your details',
      path: '/guide',
      color: '#538038',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'AI सहायक' : 'AI Assistant',
      desc: language === 'hi' ? 'कुछ भी पूछें' : 'Ask me anything',
      path: '/chat',
      color: '#E48A37',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h2v2H9V9zm4 0h2v2h-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9F5F0]">
      {/* BEGIN: MainHeader */}
      <header className="w-full max-w-4xl px-6 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center">
          <img
            alt="VoteSmart AI Logo"
            className="h-[60px] w-auto object-contain block"
            width="200"
            height="60"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx77ORyqY_Lmv0PYzGa5rsWx7fmieZEbrky_gGGn7yUSL4Rj92ScagslSgSK6y627FvBjjzOJJV9osJ_M9nnqLfCaeBdOM_L4KNHLvwAnS2fO59fJhv2qyTglcm0qKOyNORfaFBdZz0BmKmDf3QtPTXojIwJib-sTIh-HeQZNqYWGgi_mrazujGZ4DogekzL6kZdjdeEy5q14CnpoW_YKhFcXAHfMEIDYS9gyBqPvxF6rs2eguBIf6DsA_Fl1kYisSLM9109mfU63p"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold text-[#4A3728]">
            {language === 'hi' ? 'नमस्ते' : 'Hello'} 👋
          </span>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: MainContent */}
      <main className="w-full max-w-2xl px-6 pb-24">
        {/* Progress Section */}
        <section className="mt-4 mb-8">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">
              {language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
            </h2>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[#4A3728]">
                {language === 'hi' ? 'मतदान यात्रा' : 'Voting Journey'}
              </span>
              <span className="text-xl font-bold text-[#2D2D2D]">65%</span>
            </div>
            <div className="w-full bg-[#EFE9E1] h-2 rounded-full mb-4">
              <div className="bg-[#538038] h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-sm text-[#666666]">
              {language === 'hi' ? 'जारी रखें! आप बहुत अच्छा कर रहे हैं।' : 'Keep going! You\'re doing great.'}
            </p>
          </div>
        </section>

        {/* Explore Section */}
        <section>
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4">
            {language === 'hi' ? 'खोजें' : 'Explore'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {exploreCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-sm flex flex-col space-y-3 cursor-pointer hover:bg-gray-50 transition-colors no-underline"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-1"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#2D2D2D]">{card.title}</h3>
                  <p className="text-xs text-[#666666]">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips Section */}
        <div className="mt-8">
          <QuickTips />
        </div>
      </main>
      {/* END: MainContent */}

      {/* BEGIN: BottomNavigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#F9F5F0] px-8 pt-4 pb-6 flex justify-between items-center max-w-2xl mx-auto w-full border-t border-[#E8E2D9]">
        <Link to="/" className="flex flex-col items-center space-y-1 group no-underline">
          <svg className="w-6 h-6 text-[#7A4B2F]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
          <span className="text-xs font-bold text-[#7A4B2F]">{language === 'hi' ? 'होम' : 'Home'}</span>
        </Link>
        <Link to="/simulator" className="flex flex-col items-center space-y-1 group no-underline">
          <svg className="w-6 h-6 text-gray-500 group-hover:text-[#7A4B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span className="text-xs font-medium text-gray-500 group-hover:text-[#7A4B2F]">{language === 'hi' ? 'यात्रा' : 'Journey'}</span>
        </Link>
        <Link to="/guide" className="flex flex-col items-center space-y-1 group no-underline">
          <svg className="w-6 h-6 text-gray-500 group-hover:text-[#7A4B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span className="text-xs font-medium text-gray-500 group-hover:text-[#7A4B2F]">{language === 'hi' ? 'सत्यापन' : 'Verify'}</span>
        </Link>
        <Link to="/myths" className="flex flex-col items-center space-y-1 group no-underline">
          <svg className="w-6 h-6 text-gray-500 group-hover:text-[#7A4B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span className="text-xs font-medium text-gray-500 group-hover:text-[#7A4B2F]">{language === 'hi' ? 'सीखें' : 'Learn'}</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center space-y-1 group no-underline">
          <svg className="w-6 h-6 text-gray-500 group-hover:text-[#7A4B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span className="text-xs font-medium text-gray-500 group-hover:text-[#7A4B2F]">{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </Link>
      </nav>
      {/* END: BottomNavigation */}
    </div>
  );
}
