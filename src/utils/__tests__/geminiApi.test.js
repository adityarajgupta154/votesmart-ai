import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeAI, sendMessage, checkMythWithAI } from './geminiApi';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('geminiApi', () => {
  describe('initializeAI', () => {
    it('returns true (backend-only mode)', () => {
      expect(initializeAI()).toBe(true);
    });
  });

  describe('sendMessage', () => {
    it('sends message and returns AI response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ text: 'Hello!', source: 'ai' })
      });

      const result = await sendMessage('Hi', [], 'en');
      expect(result).toEqual({ text: 'Hello!', source: 'ai' });
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST'
      }));
    });

    it('returns offline fallback on fetch failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await sendMessage('How to register?', [], 'en');
      expect(result.source).toBe('offline');
      expect(result.text).toContain('Voter Registration');
    });

    it('returns Hindi fallback when language is hi', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await sendMessage('पंजीकरण कैसे करें?', [], 'hi');
      expect(result.source).toBe('offline');
      expect(result.text).toContain('मतदाता पंजीकरण');
    });

    it('returns EVM info for EVM queries', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await sendMessage('Tell me about EVM', [], 'en');
      expect(result.source).toBe('offline');
      expect(result.text).toContain('Electronic Voting Machine');
    });

    it('returns NOTA info for NOTA queries', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await sendMessage('What is NOTA?', [], 'en');
      expect(result.source).toBe('offline');
      expect(result.text).toContain('None of the Above');
    });

    it('returns generic fallback for unknown queries', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await sendMessage('random question', [], 'en');
      expect(result.source).toBe('offline');
      expect(result.text).toContain('VoteSmart AI');
    });

    it('falls back on HTTP error status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });
      const result = await sendMessage('test', [], 'en');
      expect(result.source).toBe('offline');
    });
  });

  describe('checkMythWithAI', () => {
    it('sends claim and returns verdict', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ verdict: 'myth', explanation: 'False', confidenceScore: 95 })
      });

      const result = await checkMythWithAI('EVMs are hackable', 'en');
      expect(result.verdict).toBe('myth');
      expect(result.confidenceScore).toBe(95);
    });

    it('returns unknown verdict on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await checkMythWithAI('test', 'en');
      expect(result.verdict).toBe('unknown');
      expect(result.confidenceScore).toBe(0);
    });

    it('returns Hindi fallback message on error when hi', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network'));
      const result = await checkMythWithAI('test', 'hi');
      expect(result.explanation).toContain('eci.gov.in');
    });
  });
});
