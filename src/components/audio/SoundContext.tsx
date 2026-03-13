import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type SoundName = 'hover' | 'click' | 'whoosh' | 'success' | 'toggle' | 'startup';

interface SoundContextValue {
    muted: boolean;
    setMuted: (muted: boolean) => void;
    playSound: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextValue>({
    muted: true,
    setMuted: () => {},
    playSound: () => {},
});

export const useSoundContext = () => useContext(SoundContext);

const STORAGE_KEY = 'sound-muted';

function getInitialMuted(): boolean {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === null ? true : stored === 'true';
    } catch {
        return true;
    }
}

export const SoundContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [muted, setMutedState] = useState(getInitialMuted);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback((): AudioContext | null => {
        if (audioCtxRef.current) return audioCtxRef.current;
        try {
            audioCtxRef.current = new AudioContext();
            return audioCtxRef.current;
        } catch {
            return null;
        }
    }, []);

    const setMuted = useCallback((value: boolean) => {
        setMutedState(value);
        try {
            localStorage.setItem(STORAGE_KEY, String(value));
        } catch {}
    }, []);

    const playSound = useCallback((name: SoundName) => {
        if (muted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const schedule = () => {
            const now = ctx.currentTime;

            const play = (freq: number, type: OscillatorType, duration: number, volume: number, startAt = now) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, startAt);
                gain.gain.setValueAtTime(volume, startAt);
                gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startAt);
                osc.stop(startAt + duration);
            };

            switch (name) {
                case 'hover':
                    play(2000, 'sine', 0.03, 0.03);
                    break;
                case 'click':
                    play(800, 'square', 0.05, 0.05);
                    break;
                case 'whoosh': {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                }
                case 'success':
                    play(500, 'sine', 0.08, 0.05, now);
                    play(700, 'sine', 0.08, 0.05, now + 0.08);
                    break;
                case 'toggle':
                    play(1200, 'sine', 0.04, 0.04);
                    break;
                case 'startup':
                    // Ascending major triad: C4 → E4 → G4
                    play(261.6, 'sine', 0.35, 0.04, now);
                    play(329.6, 'sine', 0.3, 0.04, now + 0.06);
                    play(392.0, 'sine', 0.25, 0.04, now + 0.12);
                    break;
            }
        };

        if (ctx.state === 'suspended') {
            ctx.resume().then(schedule);
        } else {
            schedule();
        }
    }, [muted, getAudioContext]);

    return (
        <SoundContext.Provider value={{ muted, setMuted, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};
