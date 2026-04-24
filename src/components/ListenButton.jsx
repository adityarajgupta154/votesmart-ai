import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import './ListenButton.css';

/**
 * ListenButton — Accessible TTS trigger
 * Props: onClick, isPlaying, label (optional)
 */
export default function ListenButton({ onClick, isPlaying, label }) {
  return (
    <button
      className={`listen-btn ${isPlaying ? 'playing' : ''}`}
      onClick={onClick}
      aria-label={isPlaying ? 'Stop listening' : 'Listen to this'}
      title={isPlaying ? 'Stop' : (label || 'Listen')}
    >
      {isPlaying ? <HiOutlineSpeakerXMark /> : <HiOutlineSpeakerWave />}
      <span>{isPlaying ? (label === 'सुनें' ? 'रुकें' : 'Stop') : (label || 'Listen')}</span>
    </button>
  );
}
