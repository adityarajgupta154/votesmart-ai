import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import Simulator from '../Simulator';

describe('Simulator Component', () => {
  it('renders the h1 heading', () => {
    render(<Simulator />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders hero image with alt text', () => {
    render(<Simulator />);
    const img = screen.getByAltText('Polling Booth Illustration');
    expect(img).toBeInTheDocument();
  });

  it('renders scenario cards as buttons', () => {
    render(<Simulator />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('starts a scenario when card is clicked', () => {
    render(<Simulator />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/score|स्कोर/i)).toBeInTheDocument();
  });

  it('renders back button during playing phase', () => {
    render(<Simulator />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/back|वापस/i)).toBeInTheDocument();
  });

  it('renders quiz options during playing phase', () => {
    render(<Simulator />);
    const scenarioButtons = screen.getAllByRole('button');
    fireEvent.click(scenarioButtons[0]);
    const allButtons = screen.getAllByRole('button');
    expect(allButtons.length).toBeGreaterThanOrEqual(3);
  });
});
