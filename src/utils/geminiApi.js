/**
 * Gemini AI Integration for VoteSmart AI
 * Uses structured prompting for election-focused, politically neutral responses.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT_EN = `You are VoteSmart AI, an election education assistant for Indian citizens.

RULES:
1. Be politically NEUTRAL — never endorse any party, candidate, or ideology.
2. Give step-by-step answers when explaining processes.
3. Always cite official sources (ECI, Constitution, Supreme Court).
4. If unsure, say "I'm not sure about this — please verify with the ECI website (eci.gov.in) or call 1950."
5. Focus ONLY on election education, voting rights, and civic processes.
6. If asked about opinions or predictions, politely decline and redirect to factual information.
7. Keep responses concise (under 200 words unless the topic requires detail).
8. Use bullet points and numbered lists for clarity.
9. Structure your response as: 1) Clear explanation 2) Structured points 3) Helpful guidance 4) Optional follow-up question.
10. Be professional, confident, and helpful. Not casual.

TOPICS YOU CAN HELP WITH:
- Voter registration, Election procedures, EVMs and VVPAT, NOTA, Election Commission, State/Central/Local elections, Election laws, Debunking myths

TOPICS YOU MUST DECLINE:
- Who to vote for, Party comparisons, Predictions, Biased content`;

const SYSTEM_PROMPT_HI = `आप VoteSmart AI हैं, भारतीय नागरिकों के लिए चुनाव शिक्षा सहायक।

नियम:
1. राजनीतिक रूप से तटस्थ रहें — किसी पार्टी या उम्मीदवार का समर्थन न करें।
2. सभी उत्तर शुद्ध हिंदी (देवनागरी लिपि) में दें। अंग्रेज़ी न मिलाएं।
3. सरल भाषा में बात करें जो बुजुर्ग भी समझ सकें।
4. चरण-दर-चरण उत्तर दें।
5. आधिकारिक स्रोत (ECI, संविधान, सुप्रीम कोर्ट) का हवाला दें।
6. अगर पक्के नहीं हैं तो कहें "कृपया eci.gov.in पर या 1950 पर कॉल करके सत्यापित करें।"
7. केवल चुनाव शिक्षा, मतदान अधिकार, नागरिक प्रक्रियाओं पर बात करें।
8. उत्तर 200 शब्दों से कम रखें।
9. बिंदुओं और क्रमांकित सूचियों का प्रयोग करें।
10. पेशेवर और आत्मविश्वासी रहें।`;

let genAI = null;
let model = null;

export function initializeAI(apiKey) {
  if (!apiKey) return false;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return true;
  } catch (err) {
    console.error('Failed to initialize Gemini:', err);
    return false;
  }
}

export async function sendMessage(userMessage, chatHistory = [], language = 'en') {
  if (!model) {
    return getFallbackResponse(userMessage, language);
  }

  try {
    const systemPrompt = language === 'hi' ? SYSTEM_PROMPT_HI : SYSTEM_PROMPT_EN;
    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    return { text: response, source: 'ai' };
  } catch (err) {
    console.error('AI Error:', err);
    return getFallbackResponse(userMessage, language);
  }
}

export async function checkMythWithAI(claim, language = 'en') {
  if (!model) {
    const msg = language === 'hi'
      ? 'AI जुड़ा नहीं है। कृपया अंतर्निहित मिथक तोड़ो डेटाबेस में सत्यापित तथ्य देखें।'
      : 'AI is not connected. Please check the built-in Myth Buster database for verified facts.';
    return { verdict: 'unknown', explanation: msg };
  }

  try {
    const langInstr = language === 'hi' ? 'Respond in pure Hindi (Devanagari). Do not mix English.' : 'Respond in English.';
    const prompt = `Analyze this claim about Indian elections:

CLAIM: "${claim}"

${langInstr}
Respond in this exact JSON format:
{
  "verdict": "myth" or "fact" or "partially_true" or "unverifiable",
  "explanation": "Brief factual explanation (2-3 sentences)",
  "source": "Official source"
}

Be politically neutral.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { verdict: 'unknown', explanation: text, source: 'AI Analysis' };
  } catch (err) {
    const msg = language === 'hi' ? 'इस दावे की जाँच नहीं हो सकी। कृपया eci.gov.in देखें या 1950 पर कॉल करें।' : 'Could not verify this claim. Please check eci.gov.in or call 1950.';
    return { verdict: 'unknown', explanation: msg };
  }
}

/** Offline fallback for when API key isn't set */
function getFallbackResponse(message, language = 'en') {
  const lower = message.toLowerCase();
  const hi = language === 'hi';

  if (lower.includes('register') || lower.includes('registration') || lower.includes('पंजीकरण') || lower.includes('रजिस्टर')) {
    return { text: hi ? '**मतदाता पंजीकरण के चरण:**\n\n1. nvsp.in पर जाएं या वोटर हेल्पलाइन ऐप डाउनलोड करें\n2. नए पंजीकरण के लिए फॉर्म 6 भरें\n3. पासपोर्ट फोटो और पता प्रमाण अपलोड करें\n4. जमा करें और संदर्भ संख्या नोट करें\n5. स्थिति ऑनलाइन ट्रैक करें या 1950 पर कॉल करें\n\nपंजीकरण के लिए 18+ आयु और भारतीय नागरिकता आवश्यक है।' : '**Voter Registration Steps:**\n\n1. Visit nvsp.in or download the Voter Helpline App\n2. Fill Form 6 for new registration\n3. Upload your passport photo and address proof\n4. Submit and note your reference number\n5. Track status online or call 1950\n\nYou need to be 18+ and an Indian citizen to register.', source: 'offline' };
  }
  if (lower.includes('evm') || lower.includes('machine') || lower.includes('मशीन')) {
    return { text: hi ? '**EVM के बारे में:**\n\n- EVM = इलेक्ट्रॉनिक वोटिंग मशीन\n- स्वतंत्र उपकरण — कोई इंटरनेट/वाईफाई/ब्लूटूथ नहीं\n- बैटरी पर चलती है\n- VVPAT पेपर ट्रेल प्रदान करता है\n- BEL और ECIL (सरकारी कंपनियों) द्वारा निर्मित\n\nEVM 1982 से उपयोग में हैं।' : '**About EVMs:**\n\n- EVM = Electronic Voting Machine\n- Standalone device — no internet/WiFi/Bluetooth\n- Runs on battery, works even without electricity\n- VVPAT provides paper trail for verification\n- Manufactured by BEL and ECIL (govt companies)\n\nEVMs have been used since 1982.', source: 'offline' };
  }
  if (lower.includes('nota') || lower.includes('नोटा')) {
    return { text: hi ? '**NOTA के बारे में:**\n\n- NOTA = इनमें से कोई नहीं\n- 2013 में सुप्रीम कोर्ट ने शुरू किया\n- EVM पर अंतिम बटन\n- किसी भी उम्मीदवार को चुने बिना मतदान करने की अनुमति\n- वर्तमान में परिणामों पर कानूनी प्रभाव नहीं\n\nआपका NOTA वोट आधिकारिक रूप से गिना जाता है।' : '**About NOTA:**\n\n- NOTA = None of the Above\n- Introduced by Supreme Court in 2013\n- Last button on the EVM\n- Allows voting without choosing any candidate\n- Currently no legal impact on results\n\nYour NOTA vote IS counted and recorded officially.', source: 'offline' };
  }
  if (lower.includes('id') || lower.includes('document') || lower.includes('proof') || lower.includes('पहचान') || lower.includes('दस्तावेज़')) {
    return { text: hi ? '**मतदान के लिए मान्य पहचान पत्र:**\n\n1. EPIC (वोटर ID कार्ड)\n2. आधार कार्ड\n3. पासपोर्ट\n4. ड्राइविंग लाइसेंस\n5. PAN कार्ड\n6. सरकारी सेवा ID\n7. बैंक/डाकघर पासबुक (फोटो सहित)\n8. छात्र ID\n9. मनरेगा जॉब कार्ड\n10. स्वास्थ्य बीमा स्मार्ट कार्ड' : '**Accepted IDs for Voting:**\n\n1. EPIC (Voter ID Card)\n2. Aadhaar Card\n3. Passport\n4. Driving License\n5. PAN Card\n6. Service ID (Govt employees)\n7. Bank/Post Office Passbook with photo\n8. Student ID\n9. MNREGA Job Card\n10. Health Insurance Smart Card', source: 'offline' };
  }

  return { text: hi ? 'मैं VoteSmart AI हूँ — आपका चुनाव शिक्षा सहायक!\n\nमैं इनमें मदद कर सकता हूँ:\n- **मतदाता पंजीकरण** — कैसे करें, स्थिति जाँचें\n- **मतदान प्रक्रिया** — EVM, VVPAT, मतदान केंद्र\n- **चुनाव नियम** — NOTA, आचार संहिता\n- **मिथक तोड़ो** — दावों की जाँच करें\n\n*बेहतर अनुभव के लिए सेटिंग्स में Gemini API key जोड़ें।*' : 'I\'m VoteSmart AI — your election education assistant!\n\nI can help with:\n- **Voter Registration** — How to register, check status\n- **Voting Process** — EVMs, VVPAT, polling booth steps\n- **Election Rules** — NOTA, Model Code of Conduct\n- **Myth Busting** — Verify election claims\n\n*For the best experience, add your Gemini API key in Settings.*', source: 'offline' };
}

export default { initializeAI, sendMessage, checkMythWithAI };
