/**
 * Election Simulator — Step-by-step guided experience
 * Each scenario has steps with choices, feedback, and scoring.
 */

export const simulatorScenarios = [
  {
    id: 'first-time-voter',
    title: 'First-Time Voter Journey',
    titleHi: 'पहली बार मतदान की यात्रा',
    description: 'You just turned 18! Walk through your complete voting journey from registration to casting your vote.',
    descriptionHi: 'आपकी उम्र 18 हो गई! पंजीकरण से लेकर वोट डालने तक की पूरी यात्रा सीखें।',
    icon: '🎓',
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Voter Registration',
        titleHi: 'मतदाता पंजीकरण',
        scenario: 'Congratulations! You just turned 18. Lok Sabha elections are 3 months away. What should you do first?',
        scenarioHi: 'बधाई हो! आपकी उम्र 18 हो गई। लोकसभा चुनाव 3 महीने बाद हैं। आपको सबसे पहले क्या करना चाहिए?',
        options: [
          { id: 'a', text: 'Register on the Electoral Roll (Form 6)', textHi: 'मतदाता सूची में पंजीकरण करें (फॉर्म 6)', correct: true, feedback: 'Perfect! You need to fill Form 6 online or at your local ERO office to get your name on the voter list.', feedbackHi: 'बिल्कुल सही! मतदाता सूची में नाम जोड़ने के लिए आपको ऑनलाइन या ERO कार्यालय में फॉर्म 6 भरना होगा।' },
          { id: 'b', text: 'Wait for someone to register you automatically', textHi: 'किसी के अपने आप पंजीकरण करने का इंतज़ार करें', correct: false, feedback: 'Registration is NOT automatic in India. You must apply yourself through Form 6 via NVSP portal or your local Electoral Registration Officer.', feedbackHi: 'भारत में पंजीकरण स्वचालित नहीं है। आपको NVSP पोर्टल या ERO कार्यालय में स्वयं फॉर्म 6 भरना होगा।' },
          { id: 'c', text: 'Just show up on election day with your Aadhaar card', textHi: 'चुनाव के दिन सिर्फ आधार कार्ड लेकर पहुँच जाएं', correct: false, feedback: 'You can\'t vote without being on the Electoral Roll. Aadhaar alone isn\'t a substitute for voter registration.', feedbackHi: 'मतदाता सूची में नाम हुए बिना वोट नहीं दे सकते। अकेला आधार कार्ड पंजीकरण का विकल्प नहीं है।' },
          { id: 'd', text: 'Ask your parents to add you to their voter ID', textHi: 'माता-पिता से अपने वोटर ID में जोड़ने को कहें', correct: false, feedback: 'Each voter must have their own individual registration. You cannot be added to a parent\'s voter ID.', feedbackHi: 'हर मतदाता का अपना अलग पंजीकरण होना चाहिए। आप माता-पिता के वोटर ID में नहीं जोड़े जा सकते।' }
        ],
        learnMore: 'Visit https://www.nvsp.in to register online. You can also visit your nearest Common Service Center (CSC).'
      },
      {
        id: 2,
        title: 'Know Your Constituency',
        titleHi: 'अपना निर्वाचन क्षेत्र जानें',
        scenario: 'Your registration is complete! Now you need to know where to vote. How do you find your polling booth?',
        scenarioHi: 'आपका पंजीकरण हो गया! अब जानना है कि वोट कहाँ देना है। अपना मतदान केंद्र कैसे खोजें?',
        options: [
          { id: 'a', text: 'Check the Voter Helpline App or call 1950', correct: true, feedback: 'The Voter Helpline App and toll-free number 1950 can help you find your exact polling booth location.' },
          { id: 'b', text: 'Go to any nearby school on election day', correct: false, feedback: 'You are assigned a specific polling booth based on your registered address. You can only vote at your designated booth.' },
          { id: 'c', text: 'Your constituency doesn\'t matter, vote anywhere', correct: false, feedback: 'You must vote in your assigned constituency at your designated polling booth. Each area has specific candidates.' },
          { id: 'd', text: 'Ask on social media', correct: false, feedback: 'While people may help, the official way is through the Voter Helpline App, website, or calling 1950.' }
        ],
        learnMore: 'Download the "Voter Helpline" app from Google Play or App Store for booth location, candidate info, and more.'
      },
      {
        id: 3,
        title: 'Election Day — Identity Check',
        titleHi: 'चुनाव का दिन — पहचान जाँच',
        scenario: 'It\'s election day! You arrive at the polling booth. What document should you carry?',
        scenarioHi: 'चुनाव का दिन आ गया! आप मतदान केंद्र पहुँचे। आपको कौन सा दस्तावेज़ लेकर जाना चाहिए?',
        options: [
          { id: 'a', text: 'EPIC (Voter ID Card) or any of the 12 approved IDs', correct: true, feedback: 'You can use your EPIC or alternatives like Aadhaar, Passport, Driving License, PAN card, etc. The ECI has approved 12 photo ID documents.' },
          { id: 'b', text: 'Only your Voter ID, nothing else works', correct: false, feedback: 'While the EPIC is the primary ID, the ECI accepts 11 other photo ID proofs including Aadhaar, Passport, etc.' },
          { id: 'c', text: 'No documents needed, just give your name', correct: false, feedback: 'Photo ID is mandatory. Without approved identification, you cannot vote.' },
          { id: 'd', text: 'A photocopy of your voter slip is enough', correct: false, feedback: 'The voter slip helps you find your booth but is NOT a valid ID for voting. You need an original photo ID.' }
        ],
        learnMore: 'The 12 approved IDs include: EPIC, Aadhaar, Passport, Driving License, PAN Card, Service ID (govt.), Student ID, Bank Passbook with photo, and more.'
      },
      {
        id: 4,
        title: 'Inside the Polling Booth',
        titleHi: 'मतदान केंद्र के अंदर',
        scenario: 'You\'ve been verified! The officer applies ink on your finger. Now you\'re in front of the EVM. What do you do?',
        scenarioHi: 'आपकी पहचान सत्यापित हो गई! अधिकारी ने उंगली पर स्याही लगाई। अब आप EVM के सामने हैं। क्या करेंगे?',
        options: [
          { id: 'a', text: 'Press the button next to your preferred candidate, then verify on VVPAT', correct: true, feedback: 'Press the blue button next to your candidate. The VVPAT slip will show your vote for 7 seconds. Verify it\'s correct!' },
          { id: 'b', text: 'Take a photo of the EVM to remember your vote', correct: false, feedback: 'Photography is STRICTLY PROHIBITED inside the polling booth. It\'s a criminal offense under election law.' },
          { id: 'c', text: 'Press multiple buttons to see what happens', correct: false, feedback: 'The EVM locks after one vote. You cannot press multiple buttons — only the first valid press counts.' },
          { id: 'd', text: 'Tell the officer which candidate to press for you', correct: false, feedback: 'Voting is SECRET. No officer can vote on your behalf. If you need assistance (e.g., disability), a companion can help under specific rules.' }
        ],
        learnMore: 'VVPAT (Voter Verifiable Paper Audit Trail) provides a printed slip so you can verify your vote was recorded correctly.'
      },
      {
        id: 5,
        title: 'NOTA & Special Options',
        titleHi: 'NOTA और विशेष विकल्प',
        scenario: 'You\'ve studied all candidates and none of them represent your views. What can you do?',
        scenarioHi: 'आपने सभी उम्मीदवारों का अध्ययन किया और कोई भी आपके विचारों का प्रतिनिधित्व नहीं करता। आप क्या कर सकते हैं?',
        options: [
          { id: 'a', text: 'Vote for NOTA (None of the Above)', correct: true, feedback: 'NOTA is the last option on the EVM. It lets you participate without endorsing any candidate. Your vote still counts and is recorded!' },
          { id: 'b', text: 'Skip voting, it doesn\'t matter', correct: false, feedback: 'Every vote matters! Using NOTA sends a signal to political parties that voters want better candidates.' },
          { id: 'c', text: 'Spoil the ballot intentionally', correct: false, feedback: 'With EVMs, you can\'t spoil a ballot. NOTA exists precisely for this situation — use it as your democratic right.' },
          { id: 'd', text: 'Vote for a random candidate', correct: false, feedback: 'Voting randomly defeats the purpose of democracy. NOTA is the legitimate option when no candidate appeals to you.' }
        ],
        learnMore: 'NOTA was introduced by the Supreme Court of India in 2013. While NOTA votes don\'t affect results yet, they are an important democratic expression.'
      }
    ]
  },
  {
    id: 'election-process',
    title: 'How Elections Work in India',
    titleHi: 'भारत में चुनाव कैसे होते हैं',
    description: 'Understand the complete election machinery — from ECI to counting day.',
    descriptionHi: 'चुनाव आयोग से मतगणना तक — पूरी चुनाव प्रक्रिया समझें।',
    icon: '🏛️',
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Election Commission of India',
        scenario: 'India is preparing for General Elections. Who is responsible for conducting free and fair elections?',
        options: [
          { id: 'a', text: 'Election Commission of India (ECI) — an independent constitutional body', correct: true, feedback: 'The ECI is established under Article 324 of the Constitution. It\'s an autonomous body that conducts elections for Lok Sabha, Rajya Sabha, State Legislatures, and offices of President and VP.' },
          { id: 'b', text: 'The Prime Minister\'s Office', correct: false, feedback: 'The PM\'s office has no role in election management. The ECI is independent to ensure fairness.' },
          { id: 'c', text: 'The Supreme Court', correct: false, feedback: 'The Supreme Court can intervene in election disputes but doesn\'t conduct elections. That\'s the ECI\'s role.' },
          { id: 'd', text: 'State Governments individually', correct: false, feedback: 'While state machinery assists, elections are conducted by the ECI — a central independent body under the Constitution.' }
        ],
        learnMore: 'The ECI was established on January 25, 1950. We celebrate this as National Voters\' Day every year.'
      },
      {
        id: 2,
        title: 'Model Code of Conduct',
        scenario: 'Elections have been announced! What rules must political parties follow?',
        options: [
          { id: 'a', text: 'Model Code of Conduct (MCC) — rules for fair campaigning', correct: true, feedback: 'The MCC kicks in from the announcement date. Parties cannot use government resources for campaigning, make communal appeals, or bribe voters.' },
          { id: 'b', text: 'No rules apply, it\'s a free campaign', correct: false, feedback: 'The MCC has strict guidelines on campaigning, rallies, social media, government schemes, and more.' },
          { id: 'c', text: 'Only the ruling party has restrictions', correct: false, feedback: 'The MCC applies to ALL political parties and candidates equally — ruling or opposition.' },
          { id: 'd', text: 'Rules only apply on election day', correct: false, feedback: 'The MCC is in effect from the date of election announcement until results are declared — the entire election period.' }
        ],
        learnMore: 'The MCC covers general conduct, meetings, processions, polling day rules, and the ruling party\'s use of official machinery.'
      },
      {
        id: 3,
        title: 'Phases of Voting',
        scenario: 'Why does India hold elections in multiple phases instead of a single day?',
        options: [
          { id: 'a', text: 'To ensure adequate security forces are available at every booth', correct: true, feedback: 'India has 10 lakh+ polling booths. Phased voting ensures Central Armed Police Forces (CAPF) can be deployed to every booth for security.' },
          { id: 'b', text: 'So people can vote multiple times', correct: false, feedback: 'Each person votes only ONCE in their constituency. Phased voting is purely for logistical and security reasons.' },
          { id: 'c', text: 'It\'s a tradition with no practical reason', correct: false, feedback: 'Multiple phases are a practical necessity. India is the world\'s largest democracy — managing 90+ crore voters requires careful planning.' },
          { id: 'd', text: 'Different parties get different voting days', correct: false, feedback: 'All candidates in a constituency are on the ballot on the same day. Phases apply to different regions, not parties.' }
        ],
        learnMore: 'The 2024 Lok Sabha Elections were held in 7 phases from April 19 to June 1, covering 543 constituencies.'
      },
      {
        id: 4,
        title: 'Counting Day',
        scenario: 'All phases are complete. How are votes counted?',
        options: [
          { id: 'a', text: 'EVMs are stored securely and counted on a designated counting day under strict observation', correct: true, feedback: 'EVMs are sealed and stored in strongrooms with 24/7 CCTV and armed security. On counting day, they\'re opened in the presence of candidates\' agents.' },
          { id: 'b', text: 'Votes are counted instantly as they\'re cast', correct: false, feedback: 'Votes are stored electronically in EVMs. Counting happens on a specific date after all phases are complete.' },
          { id: 'c', text: 'Only a random sample of EVMs is counted', correct: false, feedback: 'Every single EVM is counted. Additionally, VVPAT slips from 5 random booths per constituency are matched with EVM counts.' },
          { id: 'd', text: 'Counting is done secretly without observers', correct: false, feedback: 'Counting is transparent — representatives of all candidates, media, and ECI officials are present during the process.' }
        ],
        learnMore: 'The VVPAT verification of 5 booths per constituency was mandated by the Supreme Court in 2019 for additional transparency.'
      }
    ]
  },
  {
    id: 'state-local',
    title: 'State & Local Elections',
    titleHi: 'राज्य और स्थानीय चुनाव',
    description: 'Explore panchayat, municipal, and state assembly elections — the government closest to you.',
    descriptionHi: 'पंचायत, नगरपालिका और विधानसभा चुनाव — आपके सबसे करीबी सरकार को जानें।',
    icon: '🏘️',
    difficulty: 'Advanced',
    steps: [
      {
        id: 1,
        title: 'Levels of Government',
        scenario: 'India has a multi-tier democracy. How many levels of elected government exist?',
        options: [
          { id: 'a', text: 'Three — Central, State, and Local (Panchayat/Municipal)', correct: true, feedback: 'India has Central (Lok Sabha), State (Vidhan Sabha), and Local (Panchayat/Municipal) governments — each with elected representatives.' },
          { id: 'b', text: 'Only two — Central and State', correct: false, feedback: 'The 73rd and 74th Constitutional Amendments (1992) created the third tier — Panchayati Raj and Municipalities.' },
          { id: 'c', text: 'Only one — the Central Government', correct: false, feedback: 'India is a federal democracy with multiple levels. States have their own elected assemblies and local bodies.' },
          { id: 'd', text: 'Four — Central, State, District, Village', correct: false, feedback: 'Close! But officially it\'s three tiers. Within local government, there are sub-levels (district/block/village panchayats).' }
        ],
        learnMore: 'The Panchayati Raj system has 3 sub-tiers: Gram Panchayat (village), Panchayat Samiti (block), and Zila Parishad (district).'
      },
      {
        id: 2,
        title: 'State Assembly Elections',
        scenario: 'Your state is having Vidhan Sabha elections. How is the Chief Minister selected?',
        options: [
          { id: 'a', text: 'The party (or coalition) winning majority MLAs forms government, and their leader becomes CM', correct: true, feedback: 'You vote for an MLA in your constituency. The party winning 50%+1 seats forms government, and the Governor invites their leader to be CM.' },
          { id: 'b', text: 'People directly vote for the CM', correct: false, feedback: 'India has a parliamentary system — you vote for your local MLA. The CM is indirectly chosen based on which party wins majority seats.' },
          { id: 'c', text: 'The Governor appoints whoever they want', correct: false, feedback: 'The Governor must invite the leader of the majority party/coalition. They can\'t choose arbitrarily.' },
          { id: 'd', text: 'The Prime Minister selects the CM', correct: false, feedback: 'The PM has no role in selecting CMs. State government formation is an independent process based on state election results.' }
        ],
        learnMore: 'India has 28 states and 8 Union Territories. States with legislatures have Vidhan Sabha (and some have Vidhan Parishad too).'
      },
      {
        id: 3,
        title: 'Panchayat Elections',
        scenario: 'Your village is holding Gram Panchayat elections. What is unique about local elections?',
        options: [
          { id: 'a', text: 'Seats are reserved for SC/ST, OBC, and women (at least 33%) to ensure representation', correct: true, feedback: 'The Constitution mandates at least 1/3 seats (including Sarpanch positions) be reserved for women. Additional reservations exist for SC/ST/OBC based on population.' },
          { id: 'b', text: 'Only land-owning villagers can vote', correct: false, feedback: 'All registered voters in the panchayat area can vote regardless of property ownership. Voting rights are universal.' },
          { id: 'c', text: 'Panchayat elections follow the same rules as Lok Sabha', correct: false, feedback: 'Local elections are conducted by the State Election Commission (not ECI) and have their own rules, including reservation policies.' },
          { id: 'd', text: 'There are no formal elections, elders choose the sarpanch', correct: false, feedback: 'Panchayat elections are formal democratic exercises with secret ballot, conducted by the State Election Commission.' }
        ],
        learnMore: 'India has approximately 2.5 lakh Gram Panchayats, 6,000+ Panchayat Samitis, and 600+ Zila Parishads — making it the world\'s largest grassroots democracy.'
      }
    ]
  }
];

export default simulatorScenarios;
