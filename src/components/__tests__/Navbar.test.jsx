import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const mockOnSettings = vi.fn();

  it('renders the nav element', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders VoteSmart brand text', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    expect(screen.getByText('VoteSmart')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it('settings button has aria-label', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    const btn = screen.getByLabelText('Open settings');
    expect(btn).toBeInTheDocument();
  });

  it('calls onSettingsClick when settings clicked', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    fireEvent.click(screen.getByLabelText('Open settings'));
    expect(mockOnSettings).toHaveBeenCalled();
  });

  it('mobile menu toggle has aria-label', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    const btn = screen.getByLabelText('Open menu');
    expect(btn).toBeInTheDocument();
  });

  it('toggles mobile menu label on click', () => {
    render(<Navbar onSettingsClick={mockOnSettings} />);
    const btn = screen.getByLabelText('Open menu');
    fireEvent.click(btn);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });
});
