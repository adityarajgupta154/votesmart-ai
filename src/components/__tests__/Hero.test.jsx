import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Hero from '../Hero';

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(<Hero />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the logo image with alt text', () => {
    render(<Hero />);
    const logo = screen.getByAltText('VoteSmart AI Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders hero illustration with lazy loading', () => {
    render(<Hero />);
    const illustration = screen.getByAltText('Electoral Process Illustration');
    expect(illustration).toBeInTheDocument();
    expect(illustration).toHaveAttribute('loading', 'lazy');
  });

  it('renders the h1 heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the CTA button linking to simulator', () => {
    render(<Hero />);
    const link = screen.getByRole('link', { name: /start/i });
    expect(link).toHaveAttribute('href', '/simulator');
  });

  it('renders feature cards section', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('#features-section');
    expect(section).toBeInTheDocument();
  });

  it('renders the footer with ECI link', () => {
    render(<Hero />);
    const link = screen.getByText('Contact Us');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
