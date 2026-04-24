/**
 * Voting Guide — State & age based personalized info
 */
export const statesList = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export const votingChecklist = [
  { id: 1, text: 'Check if your name is on the Electoral Roll', textHi: 'जाँचें कि मतदाता सूची में आपका नाम है', link: 'https://www.nvsp.in', done: false },
  { id: 2, text: 'Get your EPIC (Voter ID) or keep an approved photo ID ready', textHi: 'EPIC (वोटर ID) या कोई मान्य फोटो ID तैयार रखें', link: null, done: false },
  { id: 3, text: 'Find your polling booth via Voter Helpline App', textHi: 'वोटर हेल्पलाइन ऐप से अपना मतदान केंद्र खोजें', link: null, done: false },
  { id: 4, text: 'Research candidates in your constituency', textHi: 'अपने निर्वाचन क्षेत्र के उम्मीदवारों की जानकारी लें', link: null, done: false },
  { id: 5, text: 'Check election date for your constituency', textHi: 'अपने क्षेत्र की चुनाव तारीख जाँचें', link: null, done: false },
  { id: 6, text: 'Plan how you will reach the polling booth', textHi: 'मतदान केंद्र पहुँचने की योजना बनाएं', link: null, done: false },
  { id: 7, text: 'Carry your photo ID on election day', textHi: 'चुनाव के दिन फोटो ID लेकर जाएं', link: null, done: false },
  { id: 8, text: 'Vote and verify on VVPAT!', textHi: 'वोट करें और VVPAT पर जाँचें!', link: null, done: false }
];

export const eligibilityQuestions = [
  { id: 'age', label: 'Your Age', type: 'number', placeholder: 'e.g., 19' },
  { id: 'state', label: 'Your State / UT', type: 'select', options: statesList },
  { id: 'registered', label: 'Are you registered to vote?', type: 'select', options: ['Yes', 'No', 'Not Sure'] },
  { id: 'firstTime', label: 'Is this your first time voting?', type: 'select', options: ['Yes', 'No'] }
];

export function getPersonalizedGuide(age, state, registered, firstTime, language = 'en') {
  const tips = [];
  const hi = language === 'hi';

  if (age < 18) {
    tips.push({ type: 'warning', text: hi ? `आपकी उम्र ${age} है — वोट देने के लिए 18+ होना जरूरी है। लेकिन अभी से सीखना शुरू कर सकते हैं!` : `You are ${age} — you need to be 18+ to vote. But you can start learning now!` });
    tips.push({ type: 'info', text: hi ? '17.5 वर्ष की उम्र में NVSP पोर्टल पर पूर्व-पंजीकरण कर सकते हैं।' : 'You can pre-register on NVSP when you turn 17.5 years old.' });
  } else if (age >= 18 && age <= 21) {
    tips.push({ type: 'success', text: hi ? 'आप वोट देने के योग्य हैं! युवा मतदाता के रूप में आपकी आवाज़ बहुत महत्वपूर्ण है।' : 'You are eligible to vote! As a young voter, your voice matters — only 48% of 18-25 year olds vote.' });
    if (firstTime === 'Yes') {
      tips.push({ type: 'info', text: hi ? 'पहली बार मतदान कर रहे हैं? चुनाव सिम्युलेटर से पूरी प्रक्रिया समझें।' : 'As a first-time voter, try the Election Simulator to understand the process.' });
    }
  } else {
    tips.push({ type: 'success', text: hi ? 'आप वोट देने के योग्य हैं। सुनिश्चित करें कि आपका पंजीकरण अपडेट है!' : 'You are eligible to vote. Make sure your registration is up to date!' });
  }

  if (registered === 'No') {
    tips.push({ type: 'warning', text: hi ? 'आपको पंजीकरण करना होगा! nvsp.in पर फॉर्म 6 भरें या नजदीकी ERO कार्यालय जाएं।' : 'You need to register! Fill Form 6 on nvsp.in or visit your local ERO office.' });
    tips.push({ type: 'info', text: hi ? 'ऑनलाइन पंजीकरण में लगभग 10 मिनट लगते हैं। आधार और पासपोर्ट फोटो तैयार रखें।' : 'Registration takes about 10 minutes online. Keep your Aadhaar and photo ready.' });
  } else if (registered === 'Not Sure') {
    tips.push({ type: 'info', text: hi ? 'वोटर हेल्पलाइन ऐप या electoralsearch.eci.gov.in पर अपनी पंजीकरण स्थिति जाँचें।' : 'Check your registration status on the Voter Helpline App or electoralsearch.eci.gov.in' });
  } else {
    tips.push({ type: 'success', text: hi ? 'बहुत अच्छा, आप पंजीकृत हैं! सुनिश्चित करें कि आपके विवरण (नाम, पता) सही हैं।' : 'Great, you are registered! Make sure your details (name, address) are correct.' });
  }

  tips.push({ type: 'info', text: hi ? `${state}: अपने राज्य निर्वाचन आयोग की वेबसाइट पर स्थानीय चुनाव कार्यक्रम देखें।` : `For ${state}: Check your State Election Commission website for local election schedules.` });

  return tips;
}
