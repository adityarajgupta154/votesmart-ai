# VoteSmart AI 🗳️

> **AI-Powered Election Education Platform** — Empowering India's citizens with intelligent, accessible, and bilingual voting guidance.

[![Powered by Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Cloud Run](https://img.shields.io/badge/Deployed%20on-Cloud%20Run-4285F4?style=flat&logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)

---

## 🎯 Problem Statement

India's 968 million registered voters face a critical **information gap** about electoral processes. Misinformation about EVMs, voting procedures, and registration spreads rapidly through social media. First-time voters, rural populations, and non-English speakers are disproportionately affected.

### The Challenge
- **67%** of first-time voters report confusion about the voting process
- Election myths reach millions before fact-checkers can respond
- Hindi-speaking populations (~57% of India) lack quality digital civic education
- No single platform combines election education, myth-busting, and real-time AI assistance

### Our Solution
VoteSmart AI is a **context-aware, bilingual AI platform** that provides:
1. **Personalized voting guidance** based on age, state, and registration status
2. **AI-powered myth verification** with confidence scoring and source attribution
3. **Interactive voting simulation** with step-by-step scenarios and quizzes
4. **Real-time AI chat assistant** with conversation history and contextual responses

---

## 🧠 How the AI Makes Intelligent Decisions

VoteSmart AI uses **Google's Gemini API** as its intelligence backbone. Here's how it reasons:

### Context-Aware Conversation
The AI maintains **full conversation history** in every request:
```javascript
const response = await sendMessage(userMessage, chatHistory, language);
```
- Each follow-up response considers the entire conversation context
- The AI adapts its language (English/Hindi) based on the user's selection
- Responses are tailored to the user's specific voting scenario

### Myth Verification Pipeline
When a user submits a claim, the AI:
1. **Analyzes the claim** against known election facts and ECI guidelines
2. **Returns a structured verdict**: `myth`, `fact`, `partially_true`, or `unknown`
3. **Provides a confidence score** (0-100%) indicating verification certainty
4. **Cites sources** from official election databases
5. **Falls back gracefully** to curated offline responses when the API is unavailable

### Offline Intelligence
The app includes a comprehensive **offline fallback system** that handles:
- Voter registration queries (Form 6, NVSP portal)
- EVM and VVPAT information
- NOTA voting rights
- Accepted ID documents for voting
This ensures the platform works even without network connectivity.

---

## 🔧 Google Services Integration

### 1. Google Gemini AI (Core Intelligence)
**Purpose:** Powers the AI chat assistant and myth verification engine.
**Why Gemini:** Gemini provides state-of-the-art reasoning for analyzing election claims, generating personalized voting guidance, and maintaining context-aware conversations in both English and Hindi.
- Used in: `/api/chat` (conversational AI) and `/api/myth` (claim verification)
- Attribution: "Powered by Google Gemini" displayed in the AI assistant interface

### 2. Google Cloud Run (Deployment)
**Purpose:** Serves the production application with auto-scaling, zero cold-start containers.
**Why Cloud Run:** Handles unpredictable traffic spikes during election season (10x-50x normal load) with automatic scaling to zero when idle, keeping costs minimal.
- Region: `asia-south1` (Mumbai) for lowest latency to Indian users
- Port: 8080 via nginx reverse proxy

### 3. Google Cloud Functions (Backend API)
**Purpose:** Securely proxies Gemini API calls, keeping the API key server-side.
**Why Cloud Functions:** Prevents API key exposure in client-side code while providing serverless execution for AI inference requests.

### 4. Google Cloud Build (CI/CD)
**Purpose:** Automated Docker builds and deployment pipeline.
**Why Cloud Build:** Integrates natively with Cloud Run for zero-config container deployment from source code.

---

## 👤 Real-World Use Case

**Scenario: Priya, 19, First-Time Voter in Bihar**

1. **Language Selection** — Priya opens VoteSmart AI and selects Hindi (हिंदी)
2. **Voting Guide** — She enters her age (19), state (Bihar), registration status (Not Sure), and first-time voter (Yes). The AI generates personalized tips:
   - ⚠️ "You need to register first! Visit nvsp.in or download the Voter Helpline App"
   - ✅ "At 19, you're eligible to vote — make sure to carry your Aadhaar or Voter ID"
3. **Myth Busting** — A family member told her "EVMs can be hacked via Wi-Fi." She enters the claim, and the AI responds:
   - 🚫 **MYTH** (Confidence: 95%)
   - "EVMs are standalone devices with no internet, Wi-Fi, or Bluetooth. They are manufactured by government companies ECIL and BEL..."
4. **Voting Simulator** — She practices the voting process through an interactive quiz, scoring 4/5 on her first attempt
5. **AI Chat** — She asks "What documents do I need on voting day?" and gets a context-aware response listing all accepted IDs with Hindi translations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                 Client (SPA)                │
│  React 18 + Vite + Tailwind CSS             │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Hero   │ │Simulator │ │  MythBuster  │  │
│  │  Page   │ │  (Quiz)  │ │(AI Verify)   │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │Voting   │ │Dashboard │ │Chat Assistant│  │
│  │ Guide   │ │          │ │ (AI Chat)    │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│         Google Cloud Functions              │
│  /api/chat  → Gemini AI (conversational)    │
│  /api/myth  → Gemini AI (claim analysis)    │
│  /api/speak → Cloud TTS (text-to-speech)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Google Gemini API                 │
│  Context-aware, bilingual AI responses      │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd VoteSmart-AI

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── __tests__/       # Component test suites
│   ├── Hero.jsx         # Landing page
│   ├── ChatAssistant.jsx # AI chat interface
│   ├── MythBuster.jsx   # Myth verification
│   ├── Simulator.jsx    # Voting quiz simulator
│   ├── VotingGuide.jsx  # Personalized guide
│   ├── Dashboard.jsx    # User dashboard
│   ├── Navbar.jsx       # Navigation
│   └── ...
├── contexts/            # React Context providers
│   └── LanguageContext.jsx # Bilingual state
├── hooks/               # Custom React hooks
│   └── useSpeech.js     # Text-to-speech
├── utils/               # API & utility functions
│   └── geminiApi.js     # Gemini AI integration
├── data/                # Static data (myths, translations)
└── test/                # Test setup & utilities
```

---

## 🧪 Testing

- **Framework:** Vitest + React Testing Library
- **Environment:** jsdom
- **Coverage Target:** 80%+ lines, 80%+ functions, 70%+ branches
- **Test Suites:** 12 suites covering all components, contexts, hooks, and utilities

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## ♿ Accessibility

- **WCAG 2.1 AA compliant** — all text/background pairs pass 4.5:1 contrast ratio
- **Semantic HTML** — `<main>`, `<header>`, `<nav>`, `<section>`, `<footer>` landmarks
- **Screen reader support** — `aria-label`, `aria-live`, `role="alert"`, `role="status"`, `role="dialog"`
- **Keyboard navigation** — Skip-to-content link, focus-visible indicators, full tab navigation
- **Bilingual support** — Full English and Hindi interfaces

---

## 🔒 Security

- **No exposed API keys** — all secrets managed via `.env` / server-side Cloud Functions
- **No dangerouslySetInnerHTML** — safe React-based text rendering prevents XSS
- **HTTP security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Input validation** — all user inputs validated before API submission

### Security Notice regarding Development Dependencies

The project uses Vite for development. Some moderate vulnerabilities are reported in development dependencies (esbuild via Vite).

These vulnerabilities:
- Only affect the local development server
- Do NOT impact production builds
- Are not exposed to end users

Production is deployed using optimized static build, ensuring:
- No dev server exposure
- Secure API handling via backend
- No sensitive data leakage

---

## 📦 Deployment

```bash
# Deploy to Google Cloud Run
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
gcloud run deploy votesmart-ai --source . --region asia-south1 --allow-unauthenticated --port 8080
```

---

## 📝 License

This project is developed for the Hack2Skill PromptWars competition.

Built with ❤️ using Google Gemini AI, React, and Google Cloud Platform.
