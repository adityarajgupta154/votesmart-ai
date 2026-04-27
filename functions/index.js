/**
 * VoteSmart AI — Cloud Functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const textToSpeech = require("@google-cloud/text-to-speech");
const cors = require("cors")({ origin: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize TTS client
const ttsClient = new textToSpeech.TextToSpeechClient();
const ttsCache = new Map(); // Simple in-memory cache for TTS

// Initialize Gemini (using environment variable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const VOICE_CONFIG = {
  en: { languageCode: "en-US", name: "en-US-Neural2-F" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Neural2-A" },
};

exports.speak = onRequest(
  { cors: true, region: "asia-south1", maxInstances: 10, timeoutSeconds: 30, memory: "256MiB" },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

      const { text, language = "en", seniorMode = false } = req.body;
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Missing or empty 'text' field." });
      }
      if (text.length > 5000) {
        return res.status(400).json({ error: "Text too long. Max 5000 characters." });
      }

      const lang = language === "hi" ? "hi" : "en";
      const voiceConfig = VOICE_CONFIG[lang];

      try {
        // Step 1: Text Optimization
        let cleanText = text
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/<[^>]*>/g, "")
          .replace(/[#*_~`]/g, "")
          .replace(/\n+/g, "... ");

        if (lang === "hi") {
          cleanText = cleanText
            .replace(/ और /g, " और... ")
            .replace(/ लेकिन /g, "... लेकिन ")
            .replace(/ इसलिए /g, "... इसलिए ");
        } else {
          cleanText = cleanText
            .replace(/ and /gi, " and... ")
            .replace(/ but /gi, "... but ")
            .replace(/ because /gi, "... because ");
        }
        
        cleanText = cleanText.replace(/\.{4,}/g, '...').replace(/\s+/g, " ").trim();

        // Step 2: SSML Generation
        const sentencePause = seniorMode ? '<break time="500ms"/>' : '<break time="300ms"/>';
        const ellipsisPause = seniorMode ? '<break time="400ms"/>' : '<break time="350ms"/>';
        
        let ssmlContent = cleanText
          .replace(/\.\.\./g, ` ${ellipsisPause} `)
          .replace(/([.!?।])(\s|$)/g, `$1 ${sentencePause} `)
          .replace(/,\s/g, `, <break time="200ms"/> `);

        ssmlContent = `<speak>${ssmlContent}</speak>`;

        const speakingRate = seniorMode ? 0.85 : 0.95;
        const pitch = lang === 'hi' ? 1.0 : 1.5;

        const cacheKey = `${lang}_${seniorMode}_${cleanText}`;
        if (ttsCache.has(cacheKey)) {
          return res.status(200).json(ttsCache.get(cacheKey));
        }

        const [response] = await ttsClient.synthesizeSpeech({
          input: { ssml: ssmlContent },
          voice: voiceConfig,
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: speakingRate,
            pitch: pitch,
            volumeGainDb: 0.0,
            effectsProfileId: ["small-bluetooth-speaker-class-device"],
          },
        });

        const audioBase64 = response.audioContent.toString("base64");
        const responseData = { audio: audioBase64, format: "mp3", language: lang, characters: cleanText.length };
        
        ttsCache.set(cacheKey, responseData);
        if (ttsCache.size > 200) ttsCache.delete(ttsCache.keys().next().value); // Keep max 200 items

        res.status(200).json(responseData);
      } catch (error) {
        console.error("TTS Error:", error.message);
        res.status(500).json({ error: "Text-to-Speech failed.", details: error.message });
      }
    });
  }
);

exports.chat = onRequest(
  { cors: true, region: "asia-south1", maxInstances: 10, timeoutSeconds: 30, memory: "256MiB" },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { message, history = [], language = "en" } = req.body;
      if (!message) return res.status(400).json({ error: "Missing message field." });

      const systemPromptEn = `You are VoteSmart AI, an election education assistant for Indian citizens.
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

      const systemPromptHi = `आप VoteSmart AI हैं, भारतीय नागरिकों के लिए चुनाव शिक्षा सहायक।
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

      try {
        const chat = model.startChat({
          history: history.map(h => ({ role: h.role, parts: [{ text: h.parts[0].text }] })),
          systemInstruction: language === "hi" ? systemPromptHi : systemPromptEn
        });
        const result = await chat.sendMessage(message);
        res.status(200).json({ text: result.response.text(), source: "ai" });
      } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "AI Chat failed." });
      }
    });
  }
);

exports.myth = onRequest(
  { cors: true, region: "asia-south1", maxInstances: 10, timeoutSeconds: 30, memory: "256MiB" },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }
      const { claim, language = "en" } = req.body;
      if (!claim) return res.status(400).json({ error: "Missing claim." });

      const langInstr = language === "hi" ? "Respond in pure Hindi (Devanagari). Do not mix English." : "Respond in English.";
      const prompt = \`Analyze this claim about Indian elections:
CLAIM: "\${claim}"
\${langInstr}
Respond in this exact JSON format:
{
  "verdict": "myth" | "fact" | "partially_true" | "unverifiable",
  "explanation": "Brief factual explanation (2-3 sentences)",
  "source": "Official source",
  "confidenceScore": number (between 0 and 100)
}
Be politically neutral.\`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\\{[\\s\\S]*?\\}/);
        if (jsonMatch) {
          res.status(200).json(JSON.parse(jsonMatch[0]));
        } else {
          res.status(200).json({ verdict: "unknown", explanation: text, source: "AI Analysis" });
        }
      } catch (error) {
        console.error("Myth Error:", error);
        res.status(500).json({ error: "Failed to verify myth." });
      }
    });
  }
);

exports.health = onRequest(
  { cors: true, region: "asia-south1" },
  (req, res) => {
    cors(req, res, () => {
      res.status(200).json({
        status: "ok",
        service: "VoteSmart AI Services",
        timestamp: new Date().toISOString(),
        geminiConfigured: !!process.env.GEMINI_API_KEY
      });
    });
  }
);
