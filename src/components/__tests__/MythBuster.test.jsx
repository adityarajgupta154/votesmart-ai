import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import MythBuster from '../MythBuster';

// Mock the geminiApi module
vi.mock('../../utils/geminiApi', () => ({
  checkMythWithAI: vi.fn().mockResolvedValue({
    verdict: 'myth',
    explanation: 'This is false.',
    confidenceScore: 92
  })
}));

// Mock useSpeech hook
vi.mock('../../hooks/useSpeech', () => ({
  useSpeech: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    speaking: false,
    preparing: false,
    activeId: null,
    isCloudTTS: false
  })
}));

describe('MythBuster Component', () => {
  it('renders without crashing', () => {
    render(<MythBuster />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the claim input field', () => {
    const { container } = render(<MythBuster />);
    const input = container.querySelector('#claim-input');
    expect(input).toBeInTheDocument();
  });

  it('renders the verify button', () => {
    const { container } = render(<MythBuster />);
    const btn = container.querySelector('#check-claim-btn');
    expect(btn).toBeInTheDocument();
  });

  it('verify button is disabled when input is empty', () => {
    const { container } = render(<MythBuster />);
    const btn = container.querySelector('#check-claim-btn');
    expect(btn).toBeDisabled();
  });

  it('enables verify button when claim is entered', () => {
    const { container } = render(<MythBuster />);
    const input = container.querySelector('#claim-input');
    fireEvent.change(input, { target: { value: 'EVMs can be hacked' } });
    const btn = container.querySelector('#check-claim-btn');
    expect(btn).not.toBeDisabled();
  });

  it('renders myth cards from database', () => {
    render(<MythBuster />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('has hidden label for screen readers on claim input', () => {
    render(<MythBuster />);
    const label = document.querySelector('label[for="claim-input"]');
    expect(label).toBeInTheDocument();
    expect(label.className).toContain('sr-only');
  });

  it('expands myth card on button click', () => {
    render(<MythBuster />);
    const buttons = screen.getAllByRole('button');
    const expandBtn = buttons.find(b => b.querySelector('[aria-hidden="true"]'));
    if (expandBtn) {
      fireEvent.click(expandBtn);
      expect(screen.getByText(/reality|वास्तविकता/i)).toBeInTheDocument();
    }
  });
});
