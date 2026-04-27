import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ListenButton from '../ListenButton';

describe('ListenButton Component', () => {
  it('renders with default label', () => {
    render(<ListenButton onClick={() => {}} />);
    expect(screen.getByText('Listen')).toBeInTheDocument();
  });

  it('renders with Hindi label', () => {
    render(<ListenButton onClick={() => {}} label="सुनें" />);
    expect(screen.getByText('सुनें')).toBeInTheDocument();
  });

  it('shows Stop when playing', () => {
    render(<ListenButton onClick={() => {}} isPlaying={true} />);
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('shows Replay after playback', () => {
    render(<ListenButton onClick={() => {}} hasPlayed={true} />);
    expect(screen.getByText('Replay')).toBeInTheDocument();
  });

  it('is disabled when preparing', () => {
    render(<ListenButton onClick={() => {}} isPreparing={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', () => {
    const handler = vi.fn();
    render(<ListenButton onClick={handler} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label when not playing', () => {
    render(<ListenButton onClick={() => {}} />);
    expect(screen.getByLabelText('Listen to this')).toBeInTheDocument();
  });

  it('has correct aria-label when playing', () => {
    render(<ListenButton onClick={() => {}} isPlaying={true} />);
    expect(screen.getByLabelText('Stop listening')).toBeInTheDocument();
  });
});
