import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  it('renders main landmark', () => {
    render(<Dashboard />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders logo with alt text', () => {
    render(<Dashboard />);
    const logo = screen.getByAltText('VoteSmart AI Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders explore cards as links', () => {
    render(<Dashboard />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('renders QuickTips section', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Quick Voting Tips|त्वरित मतदान/i)).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(<Dashboard />);
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });
});
