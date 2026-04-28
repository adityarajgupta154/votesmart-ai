import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkHealth, sendChatMessage, checkMythClaim, requestTTS } from '../apiService';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('apiService', () => {
  describe('checkHealth', () => {
    it('returns true when backend is healthy', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'ok' }),
      });
      const result = await checkHealth();
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('/api/health', { method: 'GET' });
    });

    it('returns false on network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network'));
      const result = await checkHealth();
      expect(result).toBe(false);
    });

    it('returns false on non-ok response', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const result = await checkHealth();
      expect(result).toBe(false);
    });
  });

  describe('sendChatMessage', () => {
    it('sends a chat message and returns response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: 'Hello!', source: 'ai' }),
      });
      const result = await sendChatMessage('Hi', [], 'en');
      expect(result).toEqual({ text: 'Hello!', source: 'ai' });
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'Hi', history: [], language: 'en' }),
      }));
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(sendChatMessage('test', [], 'en')).rejects.toThrow('HTTP error');
    });
  });

  describe('checkMythClaim', () => {
    it('sends a claim and returns verdict', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ verdict: 'myth', explanation: 'False', confidenceScore: 90 }),
      });
      const result = await checkMythClaim('EVMs are hackable', 'en');
      expect(result.verdict).toBe('myth');
      expect(mockFetch).toHaveBeenCalledWith('/api/myth', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('throws on network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network'));
      await expect(checkMythClaim('test', 'en')).rejects.toThrow();
    });
  });

  describe('requestTTS', () => {
    it('sends TTS request with correct parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ audio: 'base64data', format: 'mp3', language: 'en' }),
      });
      const result = await requestTTS('Hello', 'en', false);
      expect(result.audio).toBe('base64data');
      expect(mockFetch).toHaveBeenCalledWith('/api/speak', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'Hello', language: 'en', seniorMode: false }),
      }));
    });

    it('includes senior mode parameter', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ audio: 'base64data', format: 'mp3', language: 'en' }),
      });
      await requestTTS('Hello', 'en', true);
      expect(mockFetch).toHaveBeenCalledWith('/api/speak', expect.objectContaining({
        body: JSON.stringify({ text: 'Hello', language: 'en', seniorMode: true }),
      }));
    });
  });
});
