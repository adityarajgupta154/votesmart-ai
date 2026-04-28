import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeech } from '../useSpeech';

// Mock fetch for health check
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useSpeech hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockRejectedValue(new Error('No backend')); // Default: no cloud TTS
  });

  it('initializes with speaking false', () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.speaking).toBe(false);
  });

  it('initializes with preparing false', () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.preparing).toBe(false);
  });

  it('initializes with no active ID', () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.activeId).toBeNull();
  });

  it('provides speak function', () => {
    const { result } = renderHook(() => useSpeech());
    expect(typeof result.current.speak).toBe('function');
  });

  it('provides stop function', () => {
    const { result } = renderHook(() => useSpeech());
    expect(typeof result.current.stop).toBe('function');
  });

  it('stop function resets state', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => {
      result.current.stop();
    });
    expect(result.current.speaking).toBe(false);
    expect(result.current.preparing).toBe(false);
    expect(result.current.activeId).toBeNull();
  });

  it('detects cloud TTS unavailable when health check fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network'));
    const { result } = renderHook(() => useSpeech());

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    expect(result.current.isCloudTTS).toBe(false);
  });

  it('detects cloud TTS available when health check passes', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: 'ok' }) });
    const { result } = renderHook(() => useSpeech());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    expect(result.current.isCloudTTS).toBe(true);
  });

  it('uses browser speech synthesis as fallback', async () => {
    mockFetch.mockRejectedValue(new Error('No backend'));
    const { result } = renderHook(() => useSpeech());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    // Attempt to speak — should use browser fallback
    await act(async () => {
      await result.current.speak('Hello world', 'en', 'test-1');
    });

    // speechSynthesis.speak should have been called
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });
});
