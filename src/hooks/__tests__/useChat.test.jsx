import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { useChat } from '../useChat';

// Mock geminiApi
vi.mock('../../utils/geminiApi', () => ({
  sendMessage: vi.fn(),
}));

import { sendMessage } from '../../utils/geminiApi';

function wrapper({ children }) {
  // Set language in localStorage before rendering
  localStorage.setItem('votesmart_language', 'en');
  return (
    <BrowserRouter>
      <LanguageProvider>{children}</LanguageProvider>
    </BrowserRouter>
  );
}

describe('useChat hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('votesmart_language', 'en');
  });

  it('initializes with a welcome message', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('initializes with empty input', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.input).toBe('');
  });

  it('initializes with loading false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.loading).toBe(false);
  });

  it('initializes with isListening false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.isListening).toBe(false);
  });

  it('updates input value', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => {
      result.current.setInput('Hello');
    });
    expect(result.current.input).toBe('Hello');
  });

  it('does not send empty messages', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    await act(async () => {
      await result.current.send('');
    });
    expect(sendMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(1);
  });

  it('does not send whitespace-only messages', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    await act(async () => {
      result.current.setInput('   ');
      await result.current.send();
    });
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('clears chat to welcome message only', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => {
      result.current.clearChat();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('provides quick questions', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.quickQuestions).toBeInstanceOf(Array);
    expect(result.current.quickQuestions.length).toBeGreaterThan(0);
  });

  it('sends message and receives response', async () => {
    sendMessage.mockResolvedValue({ text: 'AI response', source: 'ai' });
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('How to register?');
    });

    expect(result.current.messages.length).toBeGreaterThan(1);
    const userMsg = result.current.messages.find(m => m.content === 'How to register?');
    expect(userMsg).toBeTruthy();
    expect(userMsg.role).toBe('user');
  });

  it('handles API failure gracefully', async () => {
    sendMessage.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('test');
    });

    const errorMsg = result.current.messages.find(m => m.source === 'error');
    expect(errorMsg).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });
});
