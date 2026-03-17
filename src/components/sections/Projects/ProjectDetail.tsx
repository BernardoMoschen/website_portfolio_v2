'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ThemeContextProvider, useThemeMode } from '../../theme/ThemeContext';
import type { ProjectData } from '../../data/projectsData';
import { AnimateOnScroll } from '../../utils/animations';
import { I18nProvider, useI18n } from '../../../i18n';
import { statusMap } from '../../../constants/projectConstants';
import styles from './ProjectDetail.module.css';
import ProjectHero from './ProjectHero';
import ProjectChallengesResults from './ProjectChallengesResults';
import ProjectNavigation from './ProjectNavigation';

interface AdjacentProject {
    slug: string;
    title: string;
}

interface ProjectDetailProps {
    project: ProjectData;
    projectIndex: number;
    totalProjects: number;
    prevProject: AdjacentProject | null;
    nextProject: AdjacentProject | null;
}

const GradientDivider: React.FC = () => (
    <div style={{
        width: '100%', height: 1,
        background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)',
        opacity: 0.3, margin: '3rem 0',
    }} />
);

const ProjectDetailContent: React.FC<ProjectDetailProps> = ({
    project, projectIndex, totalProjects, prevProject, nextProject,
}) => {
    const { darkMode } = useThemeMode();
    const shouldReduceMotion = useReducedMotion();
    const { t } = useI18n();
    const num = String(projectIndex + 1).padStart(2, '0');
    const status = statusMap[project.status] || statusMap.completed;
    const ease = [0.25, 0.1, 0.25, 1] as const;

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* ===== HERO ===== */}
            <ProjectHero
                project={project}
                projectIndex={projectIndex}
                totalProjects={totalProjects}
                darkMode={darkMode}
                shouldReduceMotion={shouldReduceMotion}
                status={status}
                ease={ease}
            />

            <div className="section-inner"><GradientDivider /></div>

            {/* ===== PROJECT IMAGE ===== */}
            <div className="section-inner">
                <AnimateOnScroll y={30} delay={0.1}>
                    <div className="glass" style={{
                        position: 'relative', borderRadius: 16, overflow: 'hidden',
                        minHeight: 'clamp(200px, 30vw, 360px)', marginBottom: '3rem',
                        border: '1px solid var(--color-border)',
                    }}>
                        {project.image && project.image !== '/project-placeholder.jpg' ? (
                            <>
                                <Image
                                    src={project.image}
                                    alt={`${project.title} — project screenshot`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 80vw"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none',
                                    background: darkMode
                                        ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(99,102,241,0.15) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(99,102,241,0.1) 100%)',
                                }} />
                            </>
                        ) : (
                            <div style={{
                                width: '100%', height: '100%', minHeight: 'clamp(200px, 30vw, 360px)',
                                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: darkMode
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 50%, rgba(236,72,153,0.03) 100%)'
                                    : 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 50%, rgba(236,72,153,0.02) 100%)',
                            }}>
                                <span style={{
                                    fontSize: 'clamp(8rem, 20vw, 16rem)', fontWeight: 900,
                                    color: 'var(--color-primary)', opacity: darkMode ? 0.06 : 0.08,
                                    letterSpacing: '-0.05em', userSelect: 'none',
                                }}>
                                    {num}
                                </span>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: `radial-gradient(circle, ${darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
                                    backgroundSize: '24px 24px', pointerEvents: 'none',
                                }} />
                            </div>
                        )}
                    </div>
                </AnimateOnScroll>
            </div>

            {/* ===== PROJECT OVERVIEW ===== */}
            {project.longDescription && (
                <div className="section-inner">
                    <AnimateOnScroll y={30} delay={0.1}>
                        <div className="glass" style={{
                            padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: 16,
                            marginBottom: '3rem', border: '1px solid var(--color-border)',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
                                borderRadius: '3px 0 0 3px',
                            }} />
                            <h2 className="mono" style={{
                                fontWeight: 600, marginBottom: '1.25rem', fontSize: '1.1rem',
                                color: 'var(--color-primary)', letterSpacing: '0.05em',
                            }}>
                                {'// '}Project Overview
                            </h2>
                            <p style={{
                                color: 'var(--color-text-secondary)', fontSize: '1.05rem',
                                lineHeight: 1.85, maxWidth: '800px', margin: 0,
                            }}>
                                {project.longDescription}
                            </p>
                        </div>
                    </AnimateOnScroll>
                </div>
            )}

            {/* ===== TECH STACK ===== */}
            <div className="section-inner">
                <AnimateOnScroll y={30} delay={0.15}>
                    <div className="glass" style={{
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: 16,
                        marginBottom: '3rem', border: '1px solid var(--color-border)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                            background: 'linear-gradient(180deg, var(--color-secondary), var(--color-primary))',
                            borderRadius: '3px 0 0 3px',
                        }} />
                        <h2 className="mono" style={{
                            fontWeight: 600, marginBottom: '1.25rem', fontSize: '1.1rem',
                            color: 'var(--color-text)', letterSpacing: '0.05em',
                        }}>
                            {'< '}{t.project_detail.tech_stack}{' />'}
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {project.technologies.map((tech, i) => (
                                <motion.span
                                    key={tech}
                                    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                                    animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                                    transition={shouldReduceMotion ? {} : { duration: 0.3, delay: 0.3 + i * 0.05, ease }}
                                    className={`tag tag-primary ${styles.techTag}`}
                                    style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>

            <div className="section-inner"><GradientDivider /></div>

            {/* ===== CHALLENGES & RESULTS ===== */}
            <ProjectChallengesResults
                project={project}
                shouldReduceMotion={shouldReduceMotion}
                ease={ease}
            />

            <div className="section-inner"><GradientDivider /></div>

            {/* ===== NAVIGATION ===== */}
            <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
        </div>
    );
};

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => (
    <ThemeContextProvider>
        <I18nProvider>
            <ProjectDetailContent {...props} />
        </I18nProvider>
    </ThemeContextProvider>
);

export default ProjectDetail;
