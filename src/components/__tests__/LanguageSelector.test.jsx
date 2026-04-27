import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../LanguageSelector';

describe('LanguageSelector Component', () => {
  const mockOnSelect = vi.fn();

  it('renders without crashing', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders English button with aria-label', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    expect(screen.getByLabelText('Continue in English')).toBeInTheDocument();
  });

  it('renders Hindi button with aria-label', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    expect(screen.getByLabelText('हिंदी में जारी रखें')).toBeInTheDocument();
  });

  it('calls onSelect with en when English is clicked', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByLabelText('Continue in English'));
    expect(mockOnSelect).toHaveBeenCalledWith('en');
  });

  it('calls onSelect with hi when Hindi is clicked', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByLabelText('हिंदी में जारी रखें'));
    expect(mockOnSelect).toHaveBeenCalledWith('hi');
  });

  it('renders both language headings', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('हिंदी')).toBeInTheDocument();
  });

  it('has main landmark', () => {
    render(<LanguageSelector onSelect={mockOnSelect} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
