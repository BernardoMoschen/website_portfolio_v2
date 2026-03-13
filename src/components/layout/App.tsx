'use client';

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { ThemeContextProvider } from '../theme';
import { SoundContextProvider, useSoundContext } from '../audio';
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

const Scene3D = lazy(() => import('../3d/Scene3D'));

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
    const { playSound } = useSoundContext();
    const startupPlayed = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading && !startupPlayed.current) {
            startupPlayed.current = true;
            // Small delay so sound plays as curtain lifts
            const t = setTimeout(() => playSound('startup'), 300);
            return () => clearTimeout(t);
        }
    }, [loading, playSound]);

    return (
        <LenisProvider>
            <LoadingScreen loading={loading} />
            <CustomCursor />
            <Suspense fallback={null}>
                <Scene3D />
            </Suspense>
            <Navigation />
            <ScrollProgress />
            <main id="main-content">
                <CinematicSection id="hero" scrollHeight="300vh" startVisible>
                    <HeroSection />
                </CinematicSection>
                <SectionDivider />
                <CinematicSection id="about" scrollHeight="400vh">
                    <AboutSection />
                </CinematicSection>
                <SectionDivider flip />
                <CinematicSection id="projects" scrollHeight="500vh">
                    <ProjectsSection />
                </CinematicSection>
                <SectionDivider flip />
                <CinematicSection id="certifications" scrollHeight="300vh">
                    <CertificationsSection />
                </CinematicSection>
                <SectionDivider />
                <CinematicSection id="contact" scrollHeight="400vh">
                    <ContactSection />
                </CinematicSection>
            </main>
            <FooterSection />
        </LenisProvider>
    );
};

const App: React.FC = () => {
    return (
        <ThemeContextProvider>
            <I18nProvider>
            <SoundContextProvider>
                <AppInner />
            </SoundContextProvider>
            </I18nProvider>
        </ThemeContextProvider>
    );
};

export default App;
