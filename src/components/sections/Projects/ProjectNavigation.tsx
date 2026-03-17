import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AnimateOnScroll } from '../../utils/animations';
import styles from './ProjectDetail.module.css';

interface AdjacentProject {
    slug: string;
    title: string;
}

interface ProjectNavigationProps {
    prevProject: AdjacentProject | null;
    nextProject: AdjacentProject | null;
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ prevProject, nextProject }) => (
    <div className="section-inner" style={{ paddingBottom: 'clamp(3rem, 6vw, 6rem)' }}>
        {/* Prev / Next cards */}
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
                        className={`glass ${styles.navCard} ${styles.navCardPrev}`}
                        style={{
                            padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 16,
                            border: '1px solid var(--color-border)', textDecoration: 'none',
                            display: 'flex', flexDirection: 'column', gap: '0.5rem',
                        }}
                    >
                        <span className="mono" style={{
                            fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}>
                            <span className={styles.navArrow} style={{ display: 'inline-flex' }}>
                                <FaArrowLeft size={10} />
                            </span>
                            Previous Project
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
                            {prevProject.title}
                        </span>
                    </a>
                )}
                {nextProject && (
                    <a
                        href={`/projects/${nextProject.slug}`}
                        className={`glass ${styles.navCard}`}
                        style={{
                            padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 16,
                            border: '1px solid var(--color-border)', textDecoration: 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                            textAlign: 'right', gap: '0.5rem',
                            gridColumn: !prevProject ? '1 / -1' : undefined,
                        }}
                    >
                        <span className="mono" style={{
                            fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}>
                            Next Project
                            <span className={styles.navArrow} style={{ display: 'inline-flex' }}>
                                <FaArrowRight size={10} />
                            </span>
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
                            {nextProject.title}
                        </span>
                    </a>
                )}
            </div>
        </AnimateOnScroll>

        {/* View all CTA */}
        <AnimateOnScroll y={20} delay={0.2}>
            <div className="glass" style={{
                padding: 'clamp(2rem, 4vw, 3rem)', borderRadius: 16,
                textAlign: 'center', border: '1px solid var(--color-border)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                    background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)',
                }} />
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    Interested in seeing more of my work?
                </p>
                <a
                    href="/#projects"
                    className={`btn btn-outline ${styles.actionBtn}`}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                        padding: '14px 32px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                    }}
                >
                    <FaArrowLeft size={14} />
                    View All Projects
                </a>
            </div>
        </AnimateOnScroll>
    </div>
);

export default ProjectNavigation;
