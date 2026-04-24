/**
 * VoteSmart AI — Cloud Function: Text-to-Speech
 * 
 * Endpoint: POST /speak
 * Body: { text: string, language: "en" | "hi" }
 * Returns: Base64-encoded MP3 audio
 * 
 * Uses Google Cloud Text-to-Speech Wavenet voices for
 * natural, human-like speech at 0.9x rate for accessibility.
 */

const { onRequest } = require("firebase-functions/v2/https");
const textToSpeech = require("@google-cloud/text-to-speech");
const cors = require("cors")({ origin: true });

// Initialize TTS client (uses default GCP credentials)
const ttsClient = new textToSpeech.TextToSpeechClient();

// Voice configuration per language
const VOICE_CONFIG = {
  en: {
    languageCode: "en-US",
    name: "en-US-Wavenet-D",
    ssmlGender: "MALE",
  },
  hi: {
    languageCode: "hi-IN",
    name: "hi-IN-Wavenet-A",
    ssmlGender: "FEMALE",
  },
};

exports.speak = onRequest(
  {
    cors: true,
    region: "asia-south1",       // Mumbai — low latency for India
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (req, res) => {
    // Handle CORS preflight
    cors(req, res, async () => {
      // Only POST allowed
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
      }

      const { text, language = "en" } = req.body;

      // Validation
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Missing or empty 'text' field." });
      }

      if (text.length > 5000) {
        return res.status(400).json({ error: "Text too long. Max 5000 characters." });
      }

      const lang = language === "hi" ? "hi" : "en";
      const voiceConfig = VOICE_CONFIG[lang];

      try {
        // Strip markdown/HTML for cleaner speech
        const cleanText = text
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/<[^>]*>/g, "")
          .replace(/\\n/g, ". ")
          .replace(/\n/g, ". ")
          .replace(/[#*_~`]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        const [response] = await ttsClient.synthesizeSpeech({
          input: { text: cleanText },
          voice: voiceConfig,
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9,       // Slightly slower for clarity
            pitch: 0.0,              // Natural pitch
            volumeGainDb: 0.0,
            effectsProfileId: ["small-bluetooth-speaker-class-device"],
          },
        });

        // Return base64-encoded audio
        const audioBase64 = response.audioContent.toString("base64");

        res.status(200).json({
          audio: audioBase64,
          format: "mp3",
          language: lang,
          characters: cleanText.length,
        });
      } catch (error) {
        console.error("TTS Error:", error.message);
        res.status(500).json({
          error: "Text-to-Speech failed.",
          details: error.message,
        });
      }
    });
  }
);

// Health check endpoint
exports.health = onRequest(
  { cors: true, region: "asia-south1" },
  (req, res) => {
    cors(req, res, () => {
      res.status(200).json({
        status: "ok",
        service: "VoteSmart AI TTS",
        timestamp: new Date().toISOString(),
      });
    });
  }
);
