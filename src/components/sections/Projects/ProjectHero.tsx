import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaLock } from 'react-icons/fa';
import { projectTypeMap } from './projectTypeMap';
import type { ProjectData } from '../../data/projectsData';
import { useI18n } from '../../../i18n';
import styles from './ProjectDetail.module.css';

interface ProjectHeroProps {
    project: ProjectData;
    projectIndex: number;
    totalProjects: number;
    darkMode: boolean;
    shouldReduceMotion: boolean | null;
    status: { label: string; color: string; bg: string };
    ease: readonly [number, number, number, number];
}

const ProjectHero: React.FC<ProjectHeroProps> = ({
    project,
    projectIndex,
    totalProjects,
    darkMode,
    shouldReduceMotion,
    status,
    ease,
}) => {
    const { t } = useI18n();
    const num = String(projectIndex + 1).padStart(2, '0');
    const [backHovered, setBackHovered] = useState(false);
    void backHovered; // used only for re-render trigger

    const m = shouldReduceMotion ? { initial: {}, animate: {}, transition: {} } : null;

    return (
        <div style={{
            position: 'relative',
            paddingTop: 'clamp(6rem, 12vw, 10rem)',
            paddingBottom: 'clamp(3rem, 6vw, 5rem)',
            overflow: 'hidden',
        }}>
            {/* Large faded project number */}
            <div style={{
                position: 'absolute',
                top: 'clamp(1rem, 4vw, 3rem)',
                right: 'clamp(-2rem, 2vw, 4rem)',
                fontSize: 'clamp(12rem, 30vw, 24rem)',
                fontWeight: 900,
                lineHeight: 1,
                color: 'var(--color-text)',
                opacity: darkMode ? 0.03 : 0.05,
                pointerEvents: 'none',
                userSelect: 'none',
                letterSpacing: '-0.05em',
                zIndex: 0,
            }}>
                {num}
            </div>

            <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
                {/* Back button */}
                <motion.div
                    initial={m ? {} : { opacity: 0, x: -20 }}
                    animate={m ? {} : { opacity: 1, x: 0 }}
                    transition={m ? {} : { duration: 0.5, ease }}
                >
                    <a
                        href="/#projects"
                        className={`mono ${styles.backBtn}`}
                        onMouseEnter={() => setBackHovered(true)}
                        onMouseLeave={() => setBackHovered(false)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.85rem',
                            marginBottom: '2.5rem',
                            transition: 'color 0.3s ease',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: 8,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-glass, transparent)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                    >
                        <span className={styles.backArrow} style={{ display: 'inline-flex' }}>
                            <FaArrowLeft size={12} />
                        </span>
                        {t.project_detail.back}
                    </a>
                </motion.div>

                {/* Status + Role tags */}
                <motion.div
                    initial={m ? {} : { opacity: 0, y: 20 }}
                    animate={m ? {} : { opacity: 1, y: 0 }}
                    transition={m ? {} : { duration: 0.5, delay: 0.1, ease }}
                    style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                        color: status.color, background: status.bg,
                        border: `1px solid ${status.color}44`, backdropFilter: 'blur(8px)',
                    }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color, boxShadow: `0 0 8px ${status.color}` }} />
                        {status.label}
                    </span>
                    {project.role && (
                        <span style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500,
                            color: 'var(--color-primary)',
                            background: 'rgba(var(--color-primary-rgb, 99,102,241), 0.1)',
                            border: '1px solid rgba(var(--color-primary-rgb, 99,102,241), 0.25)',
                            backdropFilter: 'blur(8px)',
                        }}>
                            {project.role}
                        </span>
                    )}
                    {(() => {
                        const tm = projectTypeMap[project.type];
                        return (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                                color: tm.color, background: tm.bg,
                                border: `1px solid ${tm.color}44`, backdropFilter: 'blur(8px)',
                            }}>
                                <tm.Icon size={11} />{tm.label}
                            </span>
                        );
                    })()}
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', opacity: 0.6 }}>
                        {num} / {String(totalProjects).padStart(2, '0')}
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={m ? {} : { opacity: 0, y: 30 }}
                    animate={m ? {} : { opacity: 1, y: 0 }}
                    transition={m ? {} : { duration: 0.7, delay: 0.2, ease }}
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-0.03em' }}
                >
                    {project.title}
                </motion.h1>

                {/* Short description */}
                <motion.p
                    initial={m ? {} : { opacity: 0, y: 20 }}
                    animate={m ? {} : { opacity: 1, y: 0 }}
                    transition={m ? {} : { duration: 0.6, delay: 0.3, ease }}
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.75, maxWidth: '720px', marginBottom: '2rem' }}
                >
                    {project.description}
                </motion.p>

                {/* Action buttons */}
                <motion.div
                    initial={m ? {} : { opacity: 0, y: 20 }}
                    animate={m ? {} : { opacity: 1, y: 0 }}
                    transition={m ? {} : { duration: 0.5, delay: 0.4, ease }}
                    style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                >
                    {project.type === 'professional' ? (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '12px 28px', borderRadius: 12, fontSize: '0.95rem', fontWeight: 500,
                            color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', cursor: 'default',
                        }}>
                            <FaLock size={14} /> Private Codebase
                        </span>
                    ) : project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-outline ${styles.actionBtn}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                        >
                            <FaGithub size={16} />{t.project_detail.view_code}
                        </a>
                    ) : null}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-primary ${styles.actionBtn}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                        >
                            <FaExternalLinkAlt size={14} />{t.project_detail.live_demo}
                        </a>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectHero;
