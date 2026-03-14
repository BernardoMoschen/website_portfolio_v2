import React from 'react';
import { useSoundContext } from './SoundContext';
import { SOUND_ENABLED_EVENT, SOUND_DISABLED_EVENT } from './AmbientAudio';

interface SoundToggleProps {
    size?: number;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ size = 20 }) => {
    const { muted, setMuted, playSound } = useSoundContext();

    const handleClick = () => {
        if (muted) {
            // Dispatch synchronously here so play() is called within the user gesture
            window.dispatchEvent(new CustomEvent(SOUND_ENABLED_EVENT));
            setMuted(false);
            // Play toggle sound after unmuting — need slight delay so state updates
            setTimeout(() => {
                // Manually trigger since muted was just changed
                try {
                    const ctx = new AudioContext();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1200, ctx.currentTime);
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.04);
                    osc.onended = () => { ctx.close(); };
                } catch {}
            }, 0);
        } else {
            window.dispatchEvent(new CustomEvent(SOUND_DISABLED_EVENT));
            playSound('toggle');
            setMuted(true);
        }
    };

    return (
        <button
            onClick={handleClick}
            aria-label={muted ? 'Enable sound effects' : 'Disable sound effects'}
            className="theme-toggle"
            title={muted ? 'Turn on sounds' : 'Turn off sounds'}
        >
            {muted ? (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            ) : (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
            )}
        </button>
    );
};

export default SoundToggle;
