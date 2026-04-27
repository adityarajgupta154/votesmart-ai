import './ListenButton.css';

const IconSpeakerOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14" /><path d="M15.54 8.46a5 5 0 010 7.07" />
  </svg>
);
const IconSpeakerOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

/**
 * ListenButton — Accessible TTS trigger
 * Props: onClick, isPlaying, isPreparing, hasPlayed, label (optional)
 */
export default function ListenButton({ onClick, isPlaying, isPreparing, hasPlayed, label }) {
  const getIcon = () => {
    if (isPreparing) return <span className="preparing-spinner">•••</span>;
    if (isPlaying) return <IconSpeakerOff />;
    if (hasPlayed) return <IconRefresh />;
    return <IconSpeakerOn />;
  };

  const getText = () => {
    const isHindi = label === 'सुनें';
    if (isPreparing) return isHindi ? 'तैयार हो रहा है...' : 'Preparing...';
    if (isPlaying) return isHindi ? 'रोकें' : 'Stop';
    if (hasPlayed) return isHindi ? 'फिर से सुनें' : 'Replay';
    return label || 'Listen';
  };

  return (
    <button
      className={`listen-btn ${isPlaying ? 'playing' : ''} ${isPreparing ? 'preparing' : ''}`}
      onClick={onClick}
      disabled={isPreparing}
      aria-label={isPlaying ? 'Stop listening' : 'Listen to this'}
      title={isPlaying ? 'Stop' : (label || 'Listen')}
    >
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
}
