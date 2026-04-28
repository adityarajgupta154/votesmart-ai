import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

export default function Hero() {
  const { language } = useLanguage();
  const L = (key) => t(language, key);

  const features = [
    { icon: <IconPlay />, title: L('feat1Title'), desc: L('feat1Desc'), path: '/simulator', color: '#FF9933' },
    { icon: <IconClipboard />, title: L('feat2Title'), desc: L('feat2Desc'), path: '/guide', color: '#138808' },
    { icon: <IconShield />, title: L('feat3Title'), desc: L('feat3Desc'), path: '/myths', color: '#FF9933' },
    { icon: <IconChat />, title: L('feat4Title'), desc: L('feat4Desc'), path: '/chat', color: '#138808' },
  ];

  const stats = [
    { value: '96.8 Cr', label: L('stat1') },
    { value: '10.5 L+', label: L('stat2') },
    { value: '543', label: L('stat3') },
    { value: '4000+', label: L('stat4') },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f7f3ee]">
      {/* BEGIN: MainContainer */}
      <main className="max-w-4xl w-full bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden p-8 md:p-12 mb-8">
        {/* BEGIN: HeaderSection */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="mb-2">
            <img
              alt="VoteSmart AI Logo"
              className="h-16 w-auto object-contain block"
              width="180"
              height="64"
              fetchpriority="high"
              loading="eager"
              decoding="async"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGTPE9Ox51YDsplCtKiTmJr_3tiu9V2st_Zl6p5Mxp-GVea7r5PJyn3LjYoQ3Z7gkiJ1ZHMDeDytc9wGUk4ynJlExaMyhDaRwMZFqXEPCBwzePwyAs8CDgzImxO48GX--Hoz9BW3ZOW36wECEglFYprxIKfa0ushd8ro4FSlqC6nlk1D3mCUbKfUSExGEdou6HWlYFMoXmpo1KdNbjL-OKrQl2-W07F2e3B0H3sClnRipK53nH5ikU9FgWn8zORmytFlc89Jv1NHDM"
            />
          </div>
          <p className="uppercase tracking-widest text-xs font-bold text-gray-600">{L('heroBadge') || 'Learn • Play • Verify'}</p>
          <h1 className="mt-8 text-3xl md:text-4xl font-bold text-[#333333]">
            {L('heroTitle1')} <span className="text-[#8c5d38]">{L('heroTitle2')}</span>
          </h1>
          <p className="mt-2 text-gray-600 text-lg">{L('heroSubtitle')}</p>
        </header>
        {/* END: HeaderSection */}

        {/* BEGIN: HeroSection */}
        <section className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <img
              alt="Electoral Process Illustration"
              className="w-full h-auto rounded-xl block"
              width="672"
              height="400"
              loading="lazy"
              decoding="async"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOPm2bEGM-AxvbdDHEi7PEcaGVKDpSn0RICm1vD1_ghqCTCtptREiEQNKEofpdxoqWj-l9OjOCCZYqsByoqIZatHr6L1Cm4wnaOXR1JprEQtWvhXAAafjsfWDdWdAy_wXBQpHb8d_mhmOE6t_6DuzUgsfqZXktihlXlNbpfIkOa-QAQoaz10WCZZd17H_fMmcf1QQ9TcmDOgToxL4cCwT9BVBmWWEeOZ7szqWgZ0SGxJfL3hK1TIlWVGMfbDbypDDki5Ou2--RIsL3"
            />
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: FeaturesSection */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" id="features-section">
          {features.slice(0, 3).map((f, i) => (
            <Link key={f.path} to={f.path} className="flex flex-col items-center text-center no-underline group">
              <div className="w-16 h-16 rounded-full bg-[#f0e4d7] flex items-center justify-center mb-4 border border-[#d4a373]/20">
                <span className="text-2xl text-[#8c5d38]">{f.icon}</span>
              </div>
              <h3 className="font-bold text-lg text-[#333333]">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </Link>
          ))}
        </section>
        {/* END: FeaturesSection */}

        {/* BEGIN: CTASection */}
        <section className="flex justify-center">
          <Link
            to="/simulator"
            className="bg-[#8c5d38] hover:bg-[#7a4f2f] text-white font-semibold py-4 px-12 rounded-xl transition duration-300 flex items-center gap-2 text-lg shadow-md no-underline"
            id="start-simulator-btn"
          >
            {L('heroStartSim')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </Link>
        </section>
        {/* END: CTASection */}
      </main>
      {/* END: MainContainer */}

      {/* BEGIN: Footer */}
      <footer className="w-full flex flex-col items-center space-y-6 pb-8">
        <nav className="flex space-x-6 text-sm text-gray-600 font-medium">
          <a href="https://www.eci.gov.in/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-[#8c5d38] transition-colors">Contact Us</a>
        </nav>
        <div className="w-full max-w-2xl text-center px-4 text-xs text-gray-500 space-y-3">
          <p>Our AI assistant is designed to provide information strictly based on official Indian election guidelines and principles derived from the Constitution of India.</p>
          <p>We do not generate misleading or fabricated information. All responses are aligned with publicly available government sources, election rules, and verified civic knowledge.</p>
          <p>However, this platform is an educational tool and should not be considered a substitute for official government communication. For final verification, users are encouraged to refer to the Election Commission of India website.</p>
          <p>Our goal is to promote awareness, transparency, and informed voting among citizens.</p>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}
