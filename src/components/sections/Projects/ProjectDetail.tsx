'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaLock, FaCode } from 'react-icons/fa';
import { ThemeContextProvider, useThemeMode } from '../../theme/ThemeContext';
import type { ProjectData } from '../../data/projectsData';
import { AnimateOnScroll } from '../../utils/animations';
import { I18nProvider, useI18n } from '../../../i18n';

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

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    wip: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    planning: { label: 'Coming Soon', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

const typeMap = {
    professional: { label: 'Professional', color: 'var(--color-secondary)', bg: 'rgba(255,138,80,0.12)', Icon: FaLock },
    personal: { label: 'Open Source', color: 'var(--color-primary)', bg: 'rgba(127,176,105,0.12)', Icon: FaCode },
};

const GradientDivider: React.FC = () => (
    <div style={{
        width: '100%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)',
        opacity: 0.3,
        margin: '3rem 0',
    }} />
);

const ProjectDetailContent: React.FC<ProjectDetailProps> = ({
    project,
    projectIndex,
    totalProjects,
    prevProject,
    nextProject,
}) => {
    const { darkMode } = useThemeMode();
    const shouldReduceMotion = useReducedMotion();
    const { t } = useI18n();
    const status = statusMap[project.status] || statusMap.completed;
    const num = String(projectIndex + 1).padStart(2, '0');
    const [backHovered, setBackHovered] = useState(false);

    const ease = [0.25, 0.1, 0.25, 1] as const;

    const m = shouldReduceMotion
        ? { initial: {}, animate: {}, transition: {} }
        : null;

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Inline styles for hover effects */}
            <style>{`
                .pd-back-btn:hover { color: var(--color-primary) !important; }
                .pd-back-btn:hover .pd-back-arrow { transform: translateX(-4px); }
                .pd-back-arrow { transition: transform 0.3s ease; }
                .pd-nav-card:hover {
                    border-color: var(--color-primary) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
                }
                .pd-nav-card:hover .pd-nav-arrow { transform: translateX(4px); }
                .pd-nav-card-prev:hover .pd-nav-arrow { transform: translateX(-4px); }
                .pd-nav-arrow { transition: transform 0.3s ease; }
                .pd-tech-tag:hover {
                    border-color: var(--color-primary) !important;
                    background: rgba(var(--color-primary-rgb, 99,102,241), 0.15) !important;
                }
                .pd-action-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 20px rgba(var(--color-primary-rgb, 99,102,241), 0.3) !important;
                }
            `}</style>

            {/* ===== HERO SECTION ===== */}
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
                            className="mono pd-back-btn"
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
                            <span className="pd-back-arrow" style={{ display: 'inline-flex' }}>
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
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                            marginBottom: '1.25rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 16px',
                            borderRadius: 20,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: status.color,
                            background: status.bg,
                            border: `1px solid ${status.color}44`,
                            backdropFilter: 'blur(8px)',
                        }}>
                            <span style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: status.color,
                                boxShadow: `0 0 8px ${status.color}`,
                            }} />
                            {status.label}
                        </span>
                        {project.role && (
                            <span style={{
                                padding: '6px 16px',
                                borderRadius: 20,
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: 'var(--color-primary)',
                                background: 'rgba(var(--color-primary-rgb, 99,102,241), 0.1)',
                                border: '1px solid rgba(var(--color-primary-rgb, 99,102,241), 0.25)',
                                backdropFilter: 'blur(8px)',
                            }}>
                                {project.role}
                            </span>
                        )}
                        {(() => {
                            const tm = typeMap[project.type];
                            return (
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 16px',
                                    borderRadius: 20,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: tm.color,
                                    background: tm.bg,
                                    border: `1px solid ${tm.color}44`,
                                    backdropFilter: 'blur(8px)',
                                }}>
                                    <tm.Icon size={11} />
                                    {tm.label}
                                </span>
                            );
                        })()}
                        <span className="mono" style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-secondary)',
                            opacity: 0.6,
                        }}>
                            {num} / {String(totalProjects).padStart(2, '0')}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={m ? {} : { opacity: 0, y: 30 }}
                        animate={m ? {} : { opacity: 1, y: 0 }}
                        transition={m ? {} : { duration: 0.7, delay: 0.2, ease }}
                        className="gradient-text"
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: 800,
                            marginBottom: '1.5rem',
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {project.title}
                    </motion.h1>

                    {/* Short description */}
                    <motion.p
                        initial={m ? {} : { opacity: 0, y: 20 }}
                        animate={m ? {} : { opacity: 1, y: 0 }}
                        transition={m ? {} : { duration: 0.6, delay: 0.3, ease }}
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                            lineHeight: 1.75,
                            maxWidth: '720px',
                            marginBottom: '2rem',
                        }}
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
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '12px 28px',
                                borderRadius: 12,
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                cursor: 'default',
                            }}>
                                <FaLock size={14} /> Private Codebase
                            </span>
                        ) : project.githubUrl ? (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline pd-action-btn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                <FaGithub size={16} />
                                {t.project_detail.view_code}
                            </a>
                        ) : null}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary pd-action-btn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                <FaExternalLinkAlt size={14} />
                                {t.project_detail.live_demo}
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ===== GRADIENT DIVIDER ===== */}
            <div className="section-inner">
                <GradientDivider />
            </div>

            {/* ===== IMAGE / VISUAL HERO ===== */}
            <div className="section-inner">
                <AnimateOnScroll y={30} delay={0.1}>
                    <div className="glass" style={{
                        position: 'relative',
                        borderRadius: 16,
                        overflow: 'hidden',
                        minHeight: 'clamp(200px, 30vw, 360px)',
                        marginBottom: '3rem',
                        border: '1px solid var(--color-border)',
                    }}>
                        {project.image && project.image !== '/project-placeholder.jpg' ? (
                            <>
                                <picture>
                                    <source srcSet={project.image.replace(/\.\w+$/, '.webp')} type="image/webp" />
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        decoding="async"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            position: 'absolute',
                                            inset: 0,
                                        }}
                                    />
                                </picture>
                                {/* Gradient overlay on image */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: darkMode
                                        ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(99,102,241,0.15) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(99,102,241,0.1) 100%)',
                                    pointerEvents: 'none',
                                }} />
                            </>
                        ) : (
                            /* Abstract decorative pattern when no image */
                            <div style={{
                                width: '100%',
                                height: '100%',
                                minHeight: 'clamp(200px, 30vw, 360px)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: darkMode
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 50%, rgba(236,72,153,0.03) 100%)'
                                    : 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 50%, rgba(236,72,153,0.02) 100%)',
                            }}>
                                {/* Large faded number as decoration */}
                                <span style={{
                                    fontSize: 'clamp(8rem, 20vw, 16rem)',
                                    fontWeight: 900,
                                    color: 'var(--color-primary)',
                                    opacity: darkMode ? 0.06 : 0.08,
                                    letterSpacing: '-0.05em',
                                    userSelect: 'none',
                                }}>
                                    {num}
                                </span>
                                {/* Subtle grid pattern overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `radial-gradient(circle, ${darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
                                    backgroundSize: '24px 24px',
                                    pointerEvents: 'none',
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
                            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                            borderRadius: 16,
                            marginBottom: '3rem',
                            border: '1px solid var(--color-border)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Subtle gradient accent on the left edge */}
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 3,
                                background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
                                borderRadius: '3px 0 0 3px',
                            }} />
                            <h2 className="mono" style={{
                                fontWeight: 600,
                                marginBottom: '1.25rem',
                                fontSize: '1.1rem',
                                color: 'var(--color-primary)',
                                letterSpacing: '0.05em',
                            }}>
                                {'// '}Project Overview
                            </h2>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '1.05rem',
                                lineHeight: 1.85,
                                maxWidth: '800px',
                                margin: 0,
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
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                        borderRadius: 16,
                        marginBottom: '3rem',
                        border: '1px solid var(--color-border)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 3,
                            background: 'linear-gradient(180deg, var(--color-secondary), var(--color-primary))',
                            borderRadius: '3px 0 0 3px',
                        }} />
                        <h2 className="mono" style={{
                            fontWeight: 600,
                            marginBottom: '1.25rem',
                            fontSize: '1.1rem',
                            color: 'var(--color-text)',
                            letterSpacing: '0.05em',
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
                                    className="tag tag-primary pd-tech-tag"
                                    style={{
                                        fontSize: '0.85rem',
                                        padding: '6px 14px',
                                        transition: 'all 0.2s ease',
                                        cursor: 'default',
                                    }}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>

            {/* ===== GRADIENT DIVIDER ===== */}
            <div className="section-inner">
                <GradientDivider />
            </div>

            {/* ===== CHALLENGES & RESULTS ===== */}
            <div className="section-inner">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem',
                }}>
                    {project.challenges && project.challenges.length > 0 && (
                        <AnimateOnScroll y={30} delay={0.1}>
                            <div className="glass" style={{
                                padding: 'clamp(1.5rem, 4vw, 2rem)',
                                borderRadius: 16,
                                border: '1px solid var(--color-border)',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 3,
                                    background: 'linear-gradient(180deg, var(--color-secondary), rgba(var(--color-secondary-rgb, 168,85,247), 0.3))',
                                    borderRadius: '3px 0 0 3px',
                                }} />
                                <h3 className="mono" style={{
                                    fontWeight: 600,
                                    marginBottom: '1.25rem',
                                    fontSize: '1rem',
                                    color: 'var(--color-secondary)',
                                    letterSpacing: '0.05em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    <FaExclamationTriangle size={14} />
                                    {t.project_detail.challenges}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {project.challenges.map((challenge, i) => (
                                        <motion.li
                                            key={i}
                                            initial={shouldReduceMotion ? {} : { opacity: 0, x: -15 }}
                                            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={shouldReduceMotion ? {} : { duration: 0.4, delay: i * 0.1, ease }}
                                            style={{
                                                display: 'flex',
                                                gap: '0.75rem',
                                                marginBottom: '1rem',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: 'var(--color-secondary)',
                                                flexShrink: 0,
                                                marginTop: '0.5rem',
                                                boxShadow: '0 0 6px var(--color-secondary)',
                                            }} />
                                            <span style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: '0.92rem',
                                                lineHeight: 1.7,
                                            }}>
                                                {challenge}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </AnimateOnScroll>
                    )}

                    {project.results && project.results.length > 0 && (
                        <AnimateOnScroll y={30} delay={0.2}>
                            <div className="glass" style={{
                                padding: 'clamp(1.5rem, 4vw, 2rem)',
                                borderRadius: 16,
                                border: '1px solid var(--color-border)',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 3,
                                    background: 'linear-gradient(180deg, var(--color-primary), rgba(var(--color-primary-rgb, 99,102,241), 0.3))',
                                    borderRadius: '3px 0 0 3px',
                                }} />
                                <h3 className="mono" style={{
                                    fontWeight: 600,
                                    marginBottom: '1.25rem',
                                    fontSize: '1rem',
                                    color: 'var(--color-primary)',
                                    letterSpacing: '0.05em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    <FaCheckCircle size={14} />
                                    {t.project_detail.results}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {project.results.map((result, i) => (
                                        <motion.li
                                            key={i}
                                            initial={shouldReduceMotion ? {} : { opacity: 0, x: -15 }}
                                            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={shouldReduceMotion ? {} : { duration: 0.4, delay: i * 0.1, ease }}
                                            style={{
                                                display: 'flex',
                                                gap: '0.75rem',
                                                marginBottom: '1rem',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <FaCheckCircle
                                                size={12}
                                                style={{
                                                    color: 'var(--color-primary)',
                                                    flexShrink: 0,
                                                    marginTop: '0.35rem',
                                                    filter: 'drop-shadow(0 0 4px var(--color-primary))',
                                                }}
                                            />
                                            <span style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: '0.92rem',
                                                lineHeight: 1.7,
                                            }}>
                                                {result}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </AnimateOnScroll>
                    )}
                </div>
            </div>

            {/* ===== GRADIENT DIVIDER ===== */}
            <div className="section-inner">
                <GradientDivider />
            </div>

            {/* ===== BOTTOM CTA & NAVIGATION ===== */}
            <div className="section-inner" style={{ paddingBottom: 'clamp(3rem, 6vw, 6rem)' }}>
                {/* Project navigation */}
                <AnimateOnScroll y={30} delay={0.1}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: prevProject && nextProject ? '1fr 1fr' : '1fr',
                        gap: '1.5rem',
                        marginBottom: '3rem',
                    }}>
                        {prevProject && (
                            <a
                                href={`/projects/${prevProject.slug}`}
                                className="glass pd-nav-card pd-nav-card-prev"
                                style={{
                                    padding: 'clamp(1.25rem, 3vw, 2rem)',
                                    borderRadius: 16,
                                    border: '1px solid var(--color-border)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <span className="mono" style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}>
                                    <span className="pd-nav-arrow" style={{ display: 'inline-flex' }}>
                                        <FaArrowLeft size={10} />
                                    </span>
                                    Previous Project
                                </span>
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}>
                                    {prevProject.title}
                                </span>
                            </a>
                        )}
                        {nextProject && (
                            <a
                                href={`/projects/${nextProject.slug}`}
                                className="glass pd-nav-card"
                                style={{
                                    padding: 'clamp(1.25rem, 3vw, 2rem)',
                                    borderRadius: 16,
                                    border: '1px solid var(--color-border)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    textAlign: 'right',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    gridColumn: !prevProject ? '1 / -1' : undefined,
                                }}
                            >
                                <span className="mono" style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}>
                                    Next Project
                                    <span className="pd-nav-arrow" style={{ display: 'inline-flex' }}>
                                        <FaArrowRight size={10} />
                                    </span>
                                </span>
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}>
                                    {nextProject.title}
                                </span>
                            </a>
                        )}
                    </div>
                </AnimateOnScroll>

                {/* View all projects CTA */}
                <AnimateOnScroll y={20} delay={0.2}>
                    <div className="glass" style={{
                        padding: 'clamp(2rem, 4vw, 3rem)',
                        borderRadius: 16,
                        textAlign: 'center',
                        border: '1px solid var(--color-border)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Gradient border glow at top */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '10%',
                            right: '10%',
                            height: 1,
                            background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)',
                        }} />
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '1.05rem',
                            marginBottom: '1.5rem',
                            lineHeight: 1.6,
                        }}>
                            Interested in seeing more of my work?
                        </p>
                        <a
                            href="/#projects"
                            className="btn btn-outline pd-action-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '14px 32px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            <FaArrowLeft size={14} />
                            View All Projects
                        </a>
                    </div>
                </AnimateOnScroll>
            </div>
        </div>
    );
};

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
    return (
        <ThemeContextProvider>
            <I18nProvider>
                <ProjectDetailContent {...props} />
            </I18nProvider>
        </ThemeContextProvider>
    );
};

export default ProjectDetail;
