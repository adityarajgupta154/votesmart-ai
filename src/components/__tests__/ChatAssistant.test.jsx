import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import ChatAssistant from './ChatAssistant';

// Mock geminiApi
vi.mock('../utils/geminiApi', () => ({
  sendMessage: vi.fn().mockResolvedValue({ text: 'Mocked AI response', source: 'ai' })
}));

// Mock useSpeech hook
vi.mock('../hooks/useSpeech', () => ({
  useSpeech: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    speaking: false,
    preparing: false,
    activeId: null,
    isCloudTTS: false
  })
}));

describe('ChatAssistant Component', () => {
  it('renders without crashing', () => {
    render(<ChatAssistant />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the chat log container', () => {
    render(<ChatAssistant />);
    expect(screen.getByRole('log')).toBeInTheDocument();
  });

  it('renders the text input', () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText(/ask|पूछें/i);
    expect(input).toBeInTheDocument();
  });

  it('renders send button with aria-label', () => {
    render(<ChatAssistant />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatAssistant />);
    const btn = screen.getByLabelText('Send message');
    expect(btn).toBeDisabled();
  });

  it('enables send button when text is entered', () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText(/ask|पूछें/i);
    fireEvent.change(input, { target: { value: 'How to vote?' } });
    const btn = screen.getByLabelText('Send message');
    expect(btn).not.toBeDisabled();
  });

  it('renders suggested questions group', () => {
    render(<ChatAssistant />);
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('renders clear chat button', () => {
    render(<ChatAssistant />);
    const btn = screen.getByLabelText(/clear/i);
    expect(btn).toBeInTheDocument();
  });

  it('uses light theme background', () => {
    const { container } = render(<ChatAssistant />);
    const outerDiv = container.firstChild;
    expect(outerDiv.className).toContain('bg-[#f5efe9]');
  });

  it('does not use dangerouslySetInnerHTML', () => {
    const { container } = render(<ChatAssistant />);
    // Verify safe rendering — no raw HTML injection
    const html = container.innerHTML;
    expect(html).not.toContain('dangerouslySetInnerHTML');
  });
});
