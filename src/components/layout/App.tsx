'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import { ThemeContextProvider } from '../theme';
import { SoundContextProvider, useSoundContext } from '../audio';
import { AmbientAudio } from '../audio/AmbientAudio';
import { I18nProvider } from '../../i18n';
import Navigation from './Navigation';
import CinematicSection from './CinematicSection';
import SectionDivider from './SectionDivider';
import CustomCursor from './CustomCursor';
import LoadingScreen from './LoadingScreen';
import ScrollProgress from './ScrollProgress';
import { HeroSection } from '../sections/Hero';
import { AboutSection } from '../sections/About';
import { ProjectsSection } from '../sections/Projects';
import { ContactSection } from '../sections/Contact';
import { FooterSection } from '../sections/Footer';
import CertificationsSection from '../sections/Certifications/CertificationsSection';
import { LikesProvider } from '../../context/LikesContext';
import BottomRightHUD from '../ui/BottomRightHUD';
import KonamiOverlay from '../ui/KonamiOverlay';
import { useKonamiCode } from '../../hooks/useKonamiCode';
import { conciergeBus } from '../../lib/conciergeBus';

const Scene3D = dynamic(() => import('../3d/Scene3D'), { ssr: false });
const Concierge = dynamic(() => import('../ai/Concierge'), { ssr: false });

const conciergeEnabled = process.env.NEXT_PUBLIC_CONCIERGE_ENABLED === '1';

const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const lenis = new Lenis({
            lerp: 0.12,
            smoothWheel: true,
            wheelMultiplier: 1.2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return <>{children}</>;
};

const AppInner: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [showBoot, setShowBoot] = useState(true);
    const [konamiActive, setKonamiActive] = useState(false);
    const { playSound } = useSoundContext();
    const startupPlayed = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('boot-seen')) {
            setLoading(false);
            setShowBoot(false);
            return;
        }
        const timer = setTimeout(() => {
            setLoading(false);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('boot-seen', '1');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading && !startupPlayed.current) {
            startupPlayed.current = true;
            const t = setTimeout(() => playSound('startup'), 300);
            return () => clearTimeout(t);
        }
    }, [loading, playSound]);

    // Console greeting for DevTools explorers
    useEffect(() => {
        console.log(
            '%c👋 Hey, curious one!',
            'color: #7fb069; font-size: 18px; font-weight: bold; font-family: monospace;'
        );
        console.log(
            '%c  Built with Next.js, Three.js & too much coffee.\n  Stack: React · TypeScript · Node.js · Python · AWS\n\n  If you\'re reading this, you might be exactly who I want to work with.\n  → https://bernardomoschen.dev',
            'color: #ff8a50; font-size: 12px; font-family: monospace; line-height: 2;'
        );
    }, []);

    const activateKonami = useCallback(() => setKonamiActive(true), []);
    useKonamiCode(activateKonami);

    useEffect(() => {
        if (!conciergeEnabled) return;
        const off = conciergeBus.on('scrollToSection', ({ id }) => {
            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return off;
    }, []);

    return (
        <LenisProvider>
            <AmbientAudio />
            {showBoot && <LoadingScreen loading={loading} />}
            <CustomCursor />
            {konamiActive && <KonamiOverlay onClose={() => setKonamiActive(false)} />}
            <Suspense fallback={null}>
                <Scene3D />
            </Suspense>
            <Navigation />
            <ScrollProgress />
            <main id="main-content">
                <CinematicSection id="hero" scrollHeight="300vh" startVisible>
                    <HeroSection />
                </CinematicSection>
                <SectionDivider idBase="hero-about-divider" />
                <CinematicSection id="about" scrollHeight="400vh">
                    <AboutSection />
                </CinematicSection>
                <SectionDivider flip idBase="about-projects-divider" />
                <CinematicSection id="projects" scrollHeight="500vh">
                    <ProjectsSection />
                </CinematicSection>
                <SectionDivider flip idBase="projects-certifications-divider" />
                <CinematicSection id="certifications" scrollHeight="300vh">
                    <CertificationsSection />
                </CinematicSection>
                <SectionDivider idBase="certifications-contact-divider" />
                <CinematicSection id="contact" scrollHeight="400vh">
                    <ContactSection />
                </CinematicSection>
            </main>
            <FooterSection />
            {conciergeEnabled && <Concierge />}
        </LenisProvider>
    );
};

const App: React.FC = () => {
    return (
        <ThemeContextProvider>
            <I18nProvider>
                <SoundContextProvider>
                    <LikesProvider>
                        <AppInner />
                        <BottomRightHUD />
                    </LikesProvider>
                </SoundContextProvider>
            </I18nProvider>
        </ThemeContextProvider>
    );
};

export default App;
