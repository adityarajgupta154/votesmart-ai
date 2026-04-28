import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { useSimulator } from '../useSimulator';

function wrapper({ children }) {
  localStorage.setItem('votesmart_language', 'en');
  return (
    <BrowserRouter>
      <LanguageProvider>{children}</LanguageProvider>
    </BrowserRouter>
  );
}

describe('useSimulator hook', () => {
  beforeEach(() => {
    localStorage.setItem('votesmart_language', 'en');
  });

  it('initializes in select phase', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(result.current.phase).toBe('select');
  });

  it('initializes with no scenario', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(result.current.scenario).toBeNull();
  });

  it('initializes with score 0', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(result.current.score).toBe(0);
  });

  it('initializes with empty answers', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(result.current.answers).toEqual([]);
  });

  it('provides simulator scenarios', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(result.current.simulatorScenarios).toBeInstanceOf(Array);
    expect(result.current.simulatorScenarios.length).toBeGreaterThan(0);
  });

  it('starts a scenario', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    expect(result.current.phase).toBe('playing');
    expect(result.current.scenario).toBe(scenario);
    expect(result.current.stepIndex).toBe(0);
    expect(result.current.score).toBe(0);
  });

  it('selects an option', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    const option = scenario.steps[0].options[0];
    act(() => {
      result.current.handleSelect(option);
    });

    expect(result.current.showFeedback).toBe(true);
    expect(result.current.selectedOption).toBe(option);
    expect(result.current.answers).toHaveLength(1);
  });

  it('increments score for correct answer', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    const correctOption = scenario.steps[0].options.find(o => o.correct);
    if (correctOption) {
      act(() => {
        result.current.handleSelect(correctOption);
      });
      expect(result.current.score).toBe(1);
    }
  });

  it('does not increment score for wrong answer', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    const wrongOption = scenario.steps[0].options.find(o => !o.correct);
    if (wrongOption) {
      act(() => {
        result.current.handleSelect(wrongOption);
      });
      expect(result.current.score).toBe(0);
    }
  });

  it('restarts to select phase', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    act(() => {
      result.current.restart();
    });

    expect(result.current.phase).toBe('select');
    expect(result.current.scenario).toBeNull();
    expect(result.current.score).toBe(0);
  });

  it('provides difficulty labels', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    expect(typeof result.current.diffLabel('Beginner')).toBe('string');
    expect(typeof result.current.diffLabel('Intermediate')).toBe('string');
    expect(typeof result.current.diffLabel('Advanced')).toBe('string');
  });

  it('does not allow selecting when feedback is shown', () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const scenario = result.current.simulatorScenarios[0];

    act(() => {
      result.current.startScenario(scenario);
    });

    const option1 = scenario.steps[0].options[0];
    act(() => {
      result.current.handleSelect(option1);
    });

    // Try to select again
    const option2 = scenario.steps[0].options[1];
    act(() => {
      result.current.handleSelect(option2);
    });

    // Should still be the first option
    expect(result.current.selectedOption).toBe(option1);
  });
});
