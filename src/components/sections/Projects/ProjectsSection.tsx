import React, { useRef, useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import { projectTypeMap } from './projectTypeMap';
import { projects } from '../../data/projectsData';
import siteConfig from '../../../config/site';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '../../utils/animations';
import TiltCard from '../../utils/TiltCard';
import SectionAnchor from '../../utils/SectionAnchor';
import ProjectPreview from './ProjectPreview';
import { useThemeMode } from '../../theme/ThemeContext';
import { useI18n } from '../../../i18n';

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    wip: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    planning: { label: 'Coming Soon', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

type ProjectFilter = 'all' | 'professional' | 'personal';


const ProjectsSection: React.FC = () => {
    const { darkMode } = useThemeMode();
    const { t } = useI18n();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [filter, setFilter] = useState<ProjectFilter>('all');

    const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);
    const featuredProjects = filtered.filter(p => p.featured);
    const otherProjects = filtered.filter(p => !p.featured);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollLeft = 0;
        updateScrollState();
    }, [filter]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = 440;
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const cardWidth = 400;
    const cardGap = 32;

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            padding: '80px 0',
        }}>
            {/* Ambient organic blobs */}
            <style>{`
                @keyframes projFloat1 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33%     { transform: translate(90px,-70px) scale(1.12); }
                    66%     { transform: translate(-30px,50px) scale(0.88); }
                }
                @keyframes projFloat2 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    40%     { transform: translate(-80px,60px) scale(1.08); }
                    75%     { transform: translate(50px,-40px) scale(0.92); }
                }
                @keyframes projFloat3 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    50%     { transform: translate(60px,80px) scale(1.15); }
                }
                @keyframes projMorphA {
                    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    25%     { border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; }
                    50%     { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
                    75%     { border-radius: 30% 70% 60% 40% / 60% 40% 50% 50%; }
                }
                @keyframes projMorphB {
                    0%,100% { border-radius: 50% 50% 40% 60% / 40% 60% 50% 50%; }
                    30%     { border-radius: 30% 70% 60% 40% / 60% 30% 70% 40%; }
                    65%     { border-radius: 70% 30% 40% 60% / 30% 70% 60% 40%; }
                }
                .proj-blob {
                    position: absolute;
                    pointer-events: none;
                    filter: blur(88px);
                    mix-blend-mode: screen;
                    z-index: 0;
                }
                .proj-blob-1 {
                    width: 360px; height: 300px;
                    background: radial-gradient(ellipse at 40% 40%, var(--color-primary), transparent 70%);
                    top: -40px; left: -60px;
                    opacity: 0.13;
                    animation: projFloat1 24s ease-in-out infinite, projMorphA 11s ease-in-out infinite;
                }
                .proj-blob-2 {
                    width: 440px; height: 380px;
                    background: radial-gradient(ellipse at 60% 55%, var(--color-secondary), transparent 70%);
                    top: 30%; right: -100px;
                    opacity: 0.1;
                    animation: projFloat2 30s ease-in-out infinite, projMorphB 15s ease-in-out infinite;
                }
                .proj-blob-3 {
                    width: 300px; height: 280px;
                    background: radial-gradient(ellipse at 50% 50%, var(--color-primary), transparent 70%);
                    bottom: 60px; left: 25%;
                    opacity: 0.08;
                    animation: projFloat3 19s ease-in-out infinite, projMorphA 9s ease-in-out infinite reverse;
                }
                .proj-blob-4 {
                    width: 380px; height: 320px;
                    background: radial-gradient(ellipse at 45% 60%, var(--color-secondary), transparent 70%);
                    top: 15%; left: 45%;
                    opacity: 0.07;
                    animation: projFloat2 35s ease-in-out infinite reverse, projMorphB 13s ease-in-out infinite;
                }
                @keyframes filterPillMorph {
                    0%,100% { border-radius: 20px 8px 20px 8px; }
                    25%     { border-radius: 12px 20px 8px 16px; }
                    50%     { border-radius: 8px 16px 20px 8px; }
                    75%     { border-radius: 16px 8px 12px 20px; }
                }
                .filter-pill-active {
                    animation: filterPillMorph 3.5s ease-in-out infinite;
                }
            `}</style>
            <div className="proj-blob proj-blob-1" />
            <div className="proj-blob proj-blob-2" />
            <div className="proj-blob proj-blob-3" />
            <div className="proj-blob proj-blob-4" />

            {/* Section Header */}
            <AnimateOnScroll>
                <div className="section-inner" style={{ textAlign: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                    <span className="mono" style={{
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: 16,
                    }}>
                        {t.projects.label}
                    </span>
                    <div className="section-heading-group">
                        <h2 className="gradient-text" style={{
                            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                            fontWeight: 800,
                            lineHeight: 1,
                            margin: '0 0 20px 0',
                            letterSpacing: '-0.03em',
                            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                        }}>
                            {t.projects.heading}
                        </h2>
                        <SectionAnchor sectionId="projects" />
                    </div>
                    <p className="mono" style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1rem',
                        maxWidth: 520,
                        margin: '0 auto',
                        lineHeight: 1.6,
                    }}>
                        {t.projects.subtitle}
                    </p>
                </div>
            </AnimateOnScroll>

            {/* Filter tabs */}
            <AnimateOnScroll delay={0.15}>
                <div className="section-inner" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
                    {(['all', 'professional', 'personal'] as ProjectFilter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            aria-pressed={filter === f}
                            className={filter === f ? 'tag tag-primary filter-pill-active' : 'tag'}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                fontSize: '0.8rem',
                                padding: '6px 18px',
                                transition: 'all 0.2s ease',
                                textTransform: 'capitalize',
                            }}
                        >
                            {f === 'all' ? 'All' : projectTypeMap[f].label}
                        </button>
                    ))}
                </div>
            </AnimateOnScroll>

            {/* Scroll navigation arrows */}
            <AnimateOnScroll delay={0.2}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 clamp(24px, 5vw, 80px)',
                    marginBottom: 24,
                }}>
                    <span className="mono" style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginRight: 8,
                        opacity: 0.7,
                    }}>
                        {t.projects.scroll_hint}
                    </span>
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="glass-subtle"
                        aria-label="Scroll left"
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-glass)',
                            color: canScrollLeft ? 'var(--color-text)' : 'var(--color-text-secondary)',
                            cursor: canScrollLeft ? 'pointer' : 'default',
                            opacity: canScrollLeft ? 1 : 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="glass-subtle"
                        aria-label="Scroll right"
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-glass)',
                            color: canScrollRight ? 'var(--color-text)' : 'var(--color-text-secondary)',
                            cursor: canScrollRight ? 'pointer' : 'default',
                            opacity: canScrollRight ? 1 : 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </AnimateOnScroll>

            {/* Horizontal scroll gallery */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: cardGap,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: 'clamp(24px, 5vw, 80px)',
                    paddingRight: 'clamp(24px, 5vw, 80px)',
                    paddingTop: 16,
                    paddingBottom: 24,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style>{`
                    [data-scroll-strip]::-webkit-scrollbar { display: none; }
                    .project-card-featured { position: relative; }
                    .project-card-featured::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: inherit;
                        padding: 1px;
                        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-primary), var(--color-secondary));
                        background-size: 300% 300%;
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: destination-out;
                        mask-composite: exclude;
                        opacity: 0;
                        transition: opacity 0.4s ease;
                        pointer-events: none;
                    }
                    .project-card-featured:hover::before {
                        opacity: 1;
                        animation: gradient-shift 3s ease infinite;
                    }
                    @keyframes gradient-shift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .project-card-featured:hover {
                        border-color: var(--color-primary) !important;
                        box-shadow: 0 0 40px rgba(var(--color-primary-rgb, 99,102,241), 0.2),
                                    0 20px 60px rgba(0,0,0,0.3) !important;
                    }
                    .project-card-other:hover {
                        transform: translateY(-4px) !important;
                        border-color: var(--color-primary) !important;
                        box-shadow: 0 12px 32px rgba(0,0,0,0.2) !important;
                    }
                    .action-link:hover {
                        color: var(--color-primary) !important;
                        border-color: var(--color-primary) !important;
                    }
                `}</style>

                <StaggerContainer staggerDelay={0.12} style={{
                    display: 'flex',
                    gap: cardGap,
                    flexShrink: 0,
                }}>
                    {featuredProjects.map((project, index) => {
                        const status = statusMap[project.status] || statusMap.completed;
                        const num = String(index + 1).padStart(2, '0');

                        return (
                            <StaggerItem key={project.slug} style={{ flexShrink: 0 }}>
                              <TiltCard style={{ borderRadius: 20, scrollSnapAlign: 'start' }}>
                                <div
                                    className="glass project-card-featured"
                                    data-scroll-strip=""
                                    style={{
                                        width: `min(${cardWidth}px, calc(100vw - 48px))`,
                                        height: '78vh',
                                        minHeight: 'min(560px, 70vh)',
                                        maxHeight: 780,
                                        borderRadius: 20,
                                        border: '1px solid var(--color-border)',
                                        padding: 'clamp(20px, 5vw, 36px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
                                        cursor: 'default',
                                    }}
                                >
                                    {/* Big faded number */}
                                    <span style={{
                                        position: 'absolute',
                                        top: -10,
                                        right: 16,
                                        fontSize: '10rem',
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        color: 'var(--color-text)',
                                        opacity: darkMode ? 0.04 : 0.06,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                        letterSpacing: '-0.05em',
                                    }}>
                                        {num}
                                    </span>

                                    {/* Status + type badges */}
                                    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '4px 12px',
                                            borderRadius: 20,
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: status.color,
                                            background: status.bg,
                                            border: `1px solid ${status.color}33`,
                                        }}>
                                            <span style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: status.color,
                                            }} />
                                            {status.label}
                                        </span>
                                        <span className="tag tag-primary" style={{
                                            fontSize: '0.7rem',
                                            padding: '3px 10px',
                                        }}>
                                            {t.projects.featured}
                                        </span>
                                        {(() => {
                                            const tm = projectTypeMap[project.type];
                                            return (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    padding: '4px 10px',
                                                    borderRadius: 20,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    color: tm.color,
                                                    background: tm.bg,
                                                    border: `1px solid ${tm.color}44`,
                                                }}>
                                                    <tm.Icon size={10} />
                                                    {tm.label}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Interactive Preview */}
                                    {project.preview && (
                                        <div style={{ marginBottom: 16 }}>
                                            <ProjectPreview project={project} compact />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text)',
                                        margin: '0 0 16px 0',
                                        lineHeight: 1.2,
                                    }}>
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.92rem',
                                        lineHeight: 1.65,
                                        margin: '0 0 24px 0',
                                        flex: '1 1 auto',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 5,
                                        WebkitBoxOrient: 'vertical',
                                    }}>
                                        {project.description}
                                    </p>

                                    {/* Tech tags */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 8,
                                        marginBottom: 28,
                                    }}>
                                        {project.technologies.map((tech) => (
                                            <span key={tech} className="tag tag-secondary" style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action links */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginTop: 'auto',
                                        paddingTop: 16,
                                        borderTop: '1px solid var(--color-border)',
                                    }}>
                                        {project.type === 'professional' ? (
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                fontSize: '0.82rem',
                                                padding: '8px 16px',
                                                borderRadius: 12,
                                                color: 'var(--color-text-muted)',
                                                border: '1px solid var(--color-border)',
                                                cursor: 'default',
                                            }}>
                                                <FaLock size={11} /> Private Codebase
                                            </span>
                                        ) : project.githubUrl ? (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline action-link"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    fontSize: '0.82rem',
                                                    padding: '8px 16px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <FaGithub /> {t.projects.code}
                                            </a>
                                        ) : (
                                            <span className="btn btn-ghost" style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                fontSize: '0.82rem',
                                                padding: '8px 16px',
                                                opacity: 0.4,
                                                cursor: 'default',
                                            }}>
                                                <FaGithub /> {project.status === 'wip' ? 'In Dev' : 'Soon'}
                                            </span>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn action-link"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    fontSize: '0.82rem',
                                                    padding: '8px 16px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <FaExternalLinkAlt size={12} /> {t.projects.live}
                                            </a>
                                        )}
                                        {project.slug && (
                                            <a
                                                href={`/projects/${project.slug}`}
                                                className="btn btn-ghost action-link"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    fontSize: '0.82rem',
                                                    padding: '8px 16px',
                                                    marginLeft: 'auto',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {t.projects.details} <FaArrowRight size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                              </TiltCard>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </div>

            {/* Other Projects — 2-column grid */}
            {otherProjects.length > 0 && (
                <div className="section-inner" style={{ marginTop: 80 }}>
                    <AnimateOnScroll>
                        <div style={{ marginBottom: 40 }}>
                            <h3 style={{
                                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                margin: '0 0 8px 0',
                            }}>
                                {t.projects.other_heading}
                            </h3>
                            <p className="mono" style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.9rem',
                                margin: 0,
                            }}>
                                {t.projects.other_subtitle}
                            </p>
                        </div>
                    </AnimateOnScroll>

                    <StaggerContainer staggerDelay={0.1} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
                        gap: 24,
                    }}>
                        {otherProjects.map((project) => {
                            const status = statusMap[project.status] || statusMap.completed;

                            return (
                                <StaggerItem key={project.slug}>
                                    <div
                                        className="glass-subtle project-card-other"
                                        style={{
                                            borderRadius: 16,
                                            border: '1px solid var(--color-border)',
                                            padding: 28,
                                            transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                        }}
                                    >
                                        {/* Header row */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: 14,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                                <h4 style={{
                                                    fontSize: '1.15rem',
                                                    fontWeight: 600,
                                                    color: 'var(--color-primary)',
                                                    margin: 0,
                                                }}>
                                                    {project.title}
                                                </h4>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    padding: '2px 10px',
                                                    borderRadius: 12,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    color: status.color,
                                                    background: status.bg,
                                                    border: `1px solid ${status.color}33`,
                                                }}>
                                                    <span style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: '50%',
                                                        background: status.color,
                                                    }} />
                                                    {status.label}
                                                </span>
                                                {(() => {
                                                    const tm = projectTypeMap[project.type];
                                                    return (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                            padding: '2px 8px',
                                                            borderRadius: 12,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 600,
                                                            color: tm.color,
                                                            background: tm.bg,
                                                            border: `1px solid ${tm.color}44`,
                                                        }}>
                                                            <tm.Icon size={9} />
                                                            {tm.label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                                {project.type === 'professional' ? (
                                                    <span title="Private codebase — company IP" style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        color: 'var(--color-text-muted)',
                                                        opacity: 0.5,
                                                        padding: 6,
                                                    }}>
                                                        <FaLock size={14} />
                                                    </span>
                                                ) : project.githubUrl ? (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="action-link"
                                                        style={{
                                                            color: 'var(--color-text-secondary)',
                                                            padding: 6,
                                                            transition: 'color 0.2s ease',
                                                        }}
                                                    >
                                                        <FaGithub size={16} />
                                                    </a>
                                                ) : null}
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="action-link"
                                                        style={{
                                                            color: 'var(--color-primary)',
                                                            padding: 6,
                                                            transition: 'color 0.2s ease',
                                                        }}
                                                    >
                                                        <FaExternalLinkAlt size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p style={{
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.88rem',
                                            lineHeight: 1.6,
                                            margin: '0 0 18px 0',
                                        }}>
                                            {project.description}
                                        </p>

                                        {/* Tech tags */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {project.technologies.slice(0, 4).map((tech) => (
                                                <span key={tech} className="tag tag-secondary" style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 4 && (
                                                <span className="tag" style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                    opacity: 0.6,
                                                }}>
                                                    +{project.technologies.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            )}

            {/* GitHub CTA */}
            <AnimateOnScroll>
                <div className="section-inner" style={{
                    textAlign: 'center',
                    marginTop: 72,
                }}>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.05rem',
                        marginBottom: 24,
                    }}>
                        {t.projects.github_cta}
                    </p>
                    <a
                        href={siteConfig.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '14px 32px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.25s ease',
                        }}
                    >
                        <FaGithub size={18} /> {t.projects.github_btn}
                    </a>
                </div>
            </AnimateOnScroll>
        </div>
    );
};

export default ProjectsSection;
