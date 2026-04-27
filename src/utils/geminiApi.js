/**
 * Gemini AI Integration for VoteSmart AI
 * Uses backend Cloud Functions for security (API key hidden)
 */

export function initializeAI(apiKey) {
  // We no longer need local API keys. We use the backend.
  // We return true to simulate it being connected.
  // You could optionally ping /api/health to see if backend has key configured.
  return true;
}

export async function sendMessage(userMessage, chatHistory = [], language = 'en') {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        history: chatHistory,
        language
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // { text: "...", source: "ai" }
  } catch (err) {
    // Silently fall back on error — no console leaks in production
    return getFallbackResponse(userMessage, language);
  }
}

export async function checkMythWithAI(claim, language = 'en') {
  try {
    const response = await fetch('/api/myth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ claim, language })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // Silently fall back on error — no console leaks in production
    const msg = language === 'hi' 
      ? 'इस दावे की जाँच नहीं हो सकी। कृपया eci.gov.in देखें या 1950 पर कॉल करें।' 
      : 'Could not verify this claim. Please check eci.gov.in or call 1950.';
    return { verdict: 'unknown', explanation: msg, confidenceScore: 0 };
  }
}

/** Offline fallback */
function getFallbackResponse(message, language = 'en') {
  const lower = message.toLowerCase();
  const hi = language === 'hi';

  if (lower.includes('register') || lower.includes('registration') || lower.includes('पंजीकरण') || lower.includes('रजिस्टर')) {
    return {
      text: hi
        ? `मतदाता पंजीकरण के चरण:
1. nvsp.in पर जाएं या वोटर हेल्पलाइन ऐप डाउनलोड करें
2. नए पंजीकरण के लिए फॉर्म 6 भरें
3. पासपोर्ट फोटो और पता प्रमाण अपलोड करें
4. जमा करें और संदर्भ संख्या नोट करें
5. स्थिति ऑनलाइन ट्रैक करें या 1950 पर कॉल करें
पंजीकरण के लिए 18+ आयु और भारतीय नागरिकता आवश्यक है।`
        : `Voter Registration Steps:
1. Visit nvsp.in or download the Voter Helpline App
2. Fill Form 6 for new registration
3. Upload your passport photo and address proof
4. Submit and note your reference number
5. Track status online or call 1950
You need to be 18+ and an Indian citizen to register.`,
      source: 'offline'
    };
  }

  if (lower.includes('evm') || lower.includes('machine') || lower.includes('मशीन')) {
    return {
      text: hi
        ? `EVM के बारे में:
- EVM यानी इलेक्ट्रॉनिक वोटिंग मशीन
- यह एक स्वतंत्र उपकरण है, इसमें इंटरनेट नहीं होता
- यह बैटरी पर चलती है
- VVPAT पेपर ट्रेल प्रदान करता है
- यह सरकारी कंपनियों द्वारा निर्मित है`
        : `About EVMs:
- EVM stands for Electronic Voting Machine
- It is a standalone device with no internet
- It runs on battery
- VVPAT provides a paper trail
- Manufactured by government companies`,
      source: 'offline'
    };
  }

  if (lower.includes('nota') || lower.includes('नोटा')) {
    return {
      text: hi
        ? `NOTA के बारे में:
- NOTA का मतलब है इनमें से कोई नहीं
- यह EVM पर अंतिम बटन होता है
- किसी भी उम्मीदवार को चुने बिना मतदान करने की अनुमति देता है
- आपका NOTA वोट आधिकारिक रूप से गिना जाता है`
        : `About NOTA:
- NOTA means None of the Above
- It is the last button on the EVM
- Allows voting without choosing any candidate
- Your NOTA vote is counted officially`,
      source: 'offline'
    };
  }

  if (lower.includes('id') || lower.includes('document') || lower.includes('proof') || lower.includes('पहचान') || lower.includes('दस्तावेज़')) {
    return {
      text: hi
        ? `मतदान के लिए मान्य पहचान पत्र:
1. वोटर ID कार्ड
2. आधार कार्ड
3. पासपोर्ट
4. ड्राइविंग लाइसेंस
5. PAN कार्ड`
        : `Accepted IDs for Voting:
1. Voter ID Card
2. Aadhaar Card
3. Passport
4. Driving License
5. PAN Card`,
      source: 'offline'
    };
  }

  return {
    text: hi
      ? `मैं VoteSmart AI हूँ, आपका चुनाव शिक्षा सहायक!
मैं इनमें मदद कर सकता हूँ:
- मतदाता पंजीकरण
- मतदान प्रक्रिया
- चुनाव नियम
- दावों की जाँच करें`
      : `I am VoteSmart AI, your election education assistant!
I can help with:
- Voter Registration
- Voting Process
- Election Rules
- Verify election claims`,
    source: 'offline'
  };
}

export default { initializeAI, sendMessage, checkMythWithAI };
