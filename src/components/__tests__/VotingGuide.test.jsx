import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import VotingGuide from '../VotingGuide';

// Mock useSpeech
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

describe('VotingGuide Component', () => {
  it('renders without crashing', () => {
    render(<VotingGuide />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the age input with label', () => {
    render(<VotingGuide />);
    expect(screen.getByLabelText(/age|उम्र/i)).toBeInTheDocument();
  });

  it('renders the state select', () => {
    const { container } = render(<VotingGuide />);
    const stateSelect = container.querySelector('#state');
    expect(stateSelect).toBeInTheDocument();
  });

  it('renders VoterStatus component', () => {
    render(<VotingGuide />);
    expect(screen.getByLabelText('Voter Status Checker')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    const { container } = render(<VotingGuide />);
    const btn = container.querySelector('#get-guide-btn');
    expect(btn).toBeInTheDocument();
  });

  it('uses light theme background', () => {
    const { container } = render(<VotingGuide />);
    const outerDiv = container.firstChild;
    expect(outerDiv.className).toContain('bg-[#f5efe9]');
  });
});
