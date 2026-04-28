

export default function LanguageSelector({ onSelect }) {
  return (
    <div className="bg-[#f4efe6] min-h-screen flex flex-col" id="language-selector">
      {/* BEGIN: Navigation */}
      <nav className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="object-contain" fill="none" height="48" viewBox="0 0 40 40" width="48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" fill="url(#logo_gradient)" r="20"></circle>
            <path d="M10 30V20H15V30H10Z" fill="white"></path>
            <path d="M17 30V14H22V30H17Z" fill="white"></path>
            <path d="M24 30V18H29V30H24Z" fill="white"></path>
            <path d="M20 18L26 12L32 18" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="logo_gradient" x1="0" x2="40" y1="0" y2="40">
                <stop stopColor="#ED8B38"></stop>
                <stop offset="1" stopColor="#824C28"></stop>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[#824c28] text-[26px] font-extrabold tracking-tight ml-1">VoteSmart AI</span>
        </div>
        <div className="flex items-center gap-8">
          <a className="text-[#824c28] font-semibold hover:opacity-70" href="#">Home</a>
          <a className="text-[#824c28] font-semibold hover:opacity-70" href="#">Profile</a>
        </div>
      </nav>
      {/* END: Navigation */}

      {/* BEGIN: Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="bg-white w-full max-w-5xl rounded-[3rem] py-16 px-10 md:py-24 md:px-16 flex flex-col items-center shadow-sm">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-[#824c28] text-3xl md:text-4xl font-extrabold mb-3">Welcome to VoteSmart AI</h1>
            <p className="text-[#824c28] text-lg md:text-xl font-medium">Choose your language / अपनी भाषा चुनें</p>
          </div>

          {/* Language Cards */}
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch">
            {/* English Card */}
            <button
              className="flex-1 max-w-sm border border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-between gap-6 cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => onSelect('en')}
              id="lang-en"
              aria-label="Continue in English"
            >
              <div className="bg-[#824c28] w-32 h-32 rounded-[1.5rem] flex items-center justify-center shadow-md">
                <span className="text-white text-7xl font-bold">A</span>
              </div>
              <h2 className="text-[#824c28] text-3xl font-bold">English</h2>
              <span className="bg-[#824c28] text-white text-[15px] font-semibold py-3 px-8 w-full rounded-lg text-center hover:opacity-90 transition-all">
                Continue in English
              </span>
            </button>

            {/* Hindi Card */}
            <button
              className="flex-1 max-w-sm border border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-between gap-6 cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => onSelect('hi')}
              id="lang-hi"
              aria-label="हिंदी में जारी रखें"
            >
              <div className="bg-[#824c28] w-32 h-32 rounded-[1.5rem] flex items-center justify-center shadow-md">
                <span className="text-white text-7xl font-bold">अ</span>
              </div>
              <h2 className="text-[#824c28] text-3xl font-bold">हिंदी</h2>
              <span className="bg-[#824c28] text-white text-[15px] font-semibold py-3 px-8 w-full rounded-lg text-center hover:opacity-90 transition-all">
                हिंदी में जारी रखें
              </span>
            </button>
          </div>

          {/* Footer Help Text */}
          <div className="mt-12 text-center">
            <p className="text-[#824c28] text-[15px] font-medium">
              You can change this later in Settings / सेटिंग्स में बाद में बदल सकते हैं
            </p>
          </div>
        </div>
      </main>
      {/* END: Main Content */}
    </div>
  );
}
