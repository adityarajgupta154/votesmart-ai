import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageLoader from '../PageLoader';

describe('PageLoader Component', () => {
  it('renders with status role', () => {
    render(<PageLoader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live polite for screen readers', () => {
    render(<PageLoader />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('has screen-reader text', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  it('spinner is hidden from screen readers', () => {
    const { container } = render(<PageLoader />);
    const spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
  });
});
