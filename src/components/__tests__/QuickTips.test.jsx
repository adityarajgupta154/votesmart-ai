import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import QuickTips from './QuickTips';

describe('QuickTips Component', () => {
  it('renders the h2 heading', () => {
    render(<QuickTips />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders exactly 3 tip cards', () => {
    render(<QuickTips />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
  });

  it('renders tip titles', () => {
    render(<QuickTips />);
    expect(screen.getByText('Be Prepared')).toBeInTheDocument();
    expect(screen.getByText('Secure Voting')).toBeInTheDocument();
    expect(screen.getByText('Stay Informed')).toBeInTheDocument();
  });

  it('renders tip descriptions', () => {
    render(<QuickTips />);
    expect(screen.getByText(/Check your voter slip/i)).toBeInTheDocument();
  });

  it('uses inline SVG icons', () => {
    const { container } = render(<QuickTips />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(3);
  });
});
