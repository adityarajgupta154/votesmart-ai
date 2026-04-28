import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { useMythChecker } from '../useMythChecker';

// Mock geminiApi
vi.mock('../../utils/geminiApi', () => ({
  checkMythWithAI: vi.fn(),
}));

import { checkMythWithAI } from '../../utils/geminiApi';

function wrapper({ children }) {
  localStorage.setItem('votesmart_language', 'en');
  return (
    <BrowserRouter>
      <LanguageProvider>{children}</LanguageProvider>
    </BrowserRouter>
  );
}

describe('useMythChecker hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('votesmart_language', 'en');
  });

  it('initializes with default category "All"', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.activeCategory).toBe('All');
  });

  it('initializes with no expanded myth', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.expandedId).toBeNull();
  });

  it('initializes with empty custom claim', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.customClaim).toBe('');
  });

  it('initializes with no AI result', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.aiResult).toBeNull();
  });

  it('initializes with checking false', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.checking).toBe(false);
  });

  it('updates active category', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    act(() => {
      result.current.setActiveCategory('EVM');
    });
    expect(result.current.activeCategory).toBe('EVM');
  });

  it('toggles myth expansion', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    act(() => {
      result.current.toggleExpand('myth-1');
    });
    expect(result.current.expandedId).toBe('myth-1');

    act(() => {
      result.current.toggleExpand('myth-1');
    });
    expect(result.current.expandedId).toBeNull();
  });

  it('does not check empty claim', async () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    await act(async () => {
      await result.current.handleCustomCheck();
    });
    expect(checkMythWithAI).not.toHaveBeenCalled();
  });

  it('checks a valid claim', async () => {
    checkMythWithAI.mockResolvedValue({ verdict: 'myth', explanation: 'False', confidenceScore: 90 });
    const { result } = renderHook(() => useMythChecker(), { wrapper });

    act(() => {
      result.current.setCustomClaim('EVMs can be hacked');
    });

    await act(async () => {
      await result.current.handleCustomCheck();
    });

    expect(checkMythWithAI).toHaveBeenCalledWith('EVMs can be hacked', expect.any(String));
    expect(result.current.aiResult).toEqual({ verdict: 'myth', explanation: 'False', confidenceScore: 90 });
    expect(result.current.checking).toBe(false);
  });

  it('provides verdict config for all verdict types', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.verdictConfig.myth).toBeDefined();
    expect(result.current.verdictConfig.fact).toBeDefined();
    expect(result.current.verdictConfig.partially_true).toBeDefined();
    expect(result.current.verdictConfig.unknown).toBeDefined();
  });

  it('provides severity labels', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.severityLabel('high')).toBe('high');
    expect(result.current.severityLabel('medium')).toBe('medium');
    expect(result.current.severityLabel('low')).toBe('low');
  });

  it('returns filtered myths list', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.filteredMyths).toBeInstanceOf(Array);
    expect(result.current.filteredMyths.length).toBeGreaterThan(0);
  });

  it('provides myth categories', () => {
    const { result } = renderHook(() => useMythChecker(), { wrapper });
    expect(result.current.mythCategories).toBeInstanceOf(Array);
    expect(result.current.mythCategories.length).toBeGreaterThan(0);
  });
});
