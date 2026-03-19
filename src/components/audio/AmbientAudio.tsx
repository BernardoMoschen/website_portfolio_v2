'use client';
import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useSoundContext } from './SoundContext';

const TARGET_VOLUME = 0.1;
const FADE_STEPS = 50;
const FADE_MS = 2500;

// Dispatched synchronously from SoundToggle so play() stays within the user gesture
export const SOUND_ENABLED_EVENT = 'ambient:enabled';
export const SOUND_DISABLED_EVENT = 'ambient:disabled';

export const AmbientAudio: FC = () => {
    const { muted } = useSoundContext();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mutedRef = useRef(muted);
    const retryHandlerRef = useRef<(() => void) | null>(null);
    mutedRef.current = muted;

    const clearFade = () => {
        if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; }
    };

    const getAudio = (): HTMLAudioElement => {
        if (!audioRef.current) {
            const audio = new Audio('/ambience.mp3');
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0;
            audioRef.current = audio;
        }
        return audioRef.current;
    };

    const fadeIn = () => {
        clearFade();
        const audio = getAudio();
        const step = (TARGET_VOLUME - audio.volume) / FADE_STEPS;
        fadeRef.current = setInterval(() => {
            if (!audioRef.current) return clearFade();
            const next = audioRef.current.volume + step;
            if (next >= TARGET_VOLUME) { audioRef.current.volume = TARGET_VOLUME; clearFade(); }
            else { audioRef.current.volume = next; }
        }, FADE_MS / FADE_STEPS);
    };

    const fadeOut = () => {
        if (!audioRef.current) return;
        clearFade();
        const audio = audioRef.current;
        const start = audio.volume;
        const step = start / FADE_STEPS;
        fadeRef.current = setInterval(() => {
            if (!audioRef.current) return clearFade();
            const next = audioRef.current.volume - step;
            if (next <= 0) { audioRef.current.volume = 0; audioRef.current.pause(); clearFade(); }
            else { audioRef.current.volume = next; }
        }, FADE_MS / FADE_STEPS);
    };

    const tryPlay = () => {
        const audio = getAudio();
        audio.play()
            .then(() => fadeIn())
            .catch(() => {
                // Autoplay blocked — retry on first interaction
                if (retryHandlerRef.current) {
                    document.removeEventListener('click', retryHandlerRef.current);
                    document.removeEventListener('keydown', retryHandlerRef.current);
                }
                const retry = () => {
                    if (!mutedRef.current) {
                        audio.play().then(() => fadeIn()).catch(() => {});
                    }
                    document.removeEventListener('click', retry);
                    document.removeEventListener('keydown', retry);
                    retryHandlerRef.current = null;
                };
                retryHandlerRef.current = retry;
                document.addEventListener('click', retry);
                document.addEventListener('keydown', retry);
            });
    };

    // On mount: if already unmuted from a previous session, attempt to play
    useEffect(() => {
        if (!mutedRef.current) tryPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle toggle events dispatched synchronously from SoundToggle
    useEffect(() => {
        const onEnabled = () => tryPlay();
        const onDisabled = () => {
            // Clear any pending retry handler so a queued retry doesn't race with fade-out
            if (retryHandlerRef.current) {
                document.removeEventListener('click', retryHandlerRef.current);
                document.removeEventListener('keydown', retryHandlerRef.current);
                retryHandlerRef.current = null;
            }
            fadeOut();
        };
        window.addEventListener(SOUND_ENABLED_EVENT, onEnabled);
        window.addEventListener(SOUND_DISABLED_EVENT, onDisabled);
        return () => {
            window.removeEventListener(SOUND_ENABLED_EVENT, onEnabled);
            window.removeEventListener(SOUND_DISABLED_EVENT, onDisabled);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pause when tab is hidden, resume when visible
    useEffect(() => {
        const onVisibility = () => {
            const audio = audioRef.current;
            if (!audio) return;
            if (document.hidden) { audio.pause(); }
            else if (!mutedRef.current) { audio.play().catch(() => {}); }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    // Cleanup
    useEffect(() => () => {
        if (retryHandlerRef.current) {
            document.removeEventListener('click', retryHandlerRef.current);
            document.removeEventListener('keydown', retryHandlerRef.current);
            retryHandlerRef.current = null;
        }
        clearFade();
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
