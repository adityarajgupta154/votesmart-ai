import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage, lt } from './LanguageContext';

describe('LanguageContext', () => {
  const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>;

  beforeEach(() => {
    localStorage.clear();
  });

  it('provides language state (null by default)', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBeNull();
  });

  it('setLanguage updates language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => {
      result.current.setLanguage('hi');
    });
    expect(result.current.language).toBe('hi');
  });

  it('persists language to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => {
      result.current.setLanguage('en');
    });
    expect(localStorage.getItem('votesmart_language')).toBe('en');
  });

  it('reads language from localStorage on mount', () => {
    localStorage.setItem('votesmart_language', 'hi');
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('hi');
  });

  it('throws when used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within LanguageProvider');
    spy.mockRestore();
  });
});

describe('lt helper', () => {
  it('returns Hindi field when language is hi and field exists', () => {
    expect(lt({ title: 'Hello', titleHi: 'नमस्ते' }, 'title', 'hi')).toBe('नमस्ते');
  });

  it('returns English field when language is en', () => {
    expect(lt({ title: 'Hello', titleHi: 'नमस्ते' }, 'title', 'en')).toBe('Hello');
  });

  it('falls back to English when Hindi field is missing', () => {
    expect(lt({ title: 'Hello' }, 'title', 'hi')).toBe('Hello');
  });
});
