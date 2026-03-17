import React from 'react';
import { motion } from 'motion/react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import type { ProjectData } from '../../data/projectsData';
import { AnimateOnScroll } from '../../utils/animations';
import { useI18n } from '../../../i18n';

interface ProjectChallengesResultsProps {
    project: ProjectData;
    shouldReduceMotion: boolean | null;
    ease: readonly [number, number, number, number];
}

const ProjectChallengesResults: React.FC<ProjectChallengesResultsProps> = ({ project, shouldReduceMotion, ease }) => {
    const { t } = useI18n();

    if (!project.challenges?.length && !project.results?.length) return null;

    return (
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
                            padding: 'clamp(1.5rem, 4vw, 2rem)', borderRadius: 16,
                            border: '1px solid var(--color-border)', height: '100%',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                background: 'linear-gradient(180deg, var(--color-secondary), rgba(var(--color-secondary-rgb, 168,85,247), 0.3))',
                                borderRadius: '3px 0 0 3px',
                            }} />
                            <h3 className="mono" style={{
                                fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem',
                                color: 'var(--color-secondary)', letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
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
                                        style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}
                                    >
                                        <span style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: 'var(--color-secondary)', flexShrink: 0,
                                            marginTop: '0.5rem', boxShadow: '0 0 6px var(--color-secondary)',
                                        }} />
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
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
                            padding: 'clamp(1.5rem, 4vw, 2rem)', borderRadius: 16,
                            border: '1px solid var(--color-border)', height: '100%',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                background: 'linear-gradient(180deg, var(--color-primary), rgba(var(--color-primary-rgb, 99,102,241), 0.3))',
                                borderRadius: '3px 0 0 3px',
                            }} />
                            <h3 className="mono" style={{
                                fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem',
                                color: 'var(--color-primary)', letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
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
                                        style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}
                                    >
                                        <FaCheckCircle size={12} style={{
                                            color: 'var(--color-primary)', flexShrink: 0,
                                            marginTop: '0.35rem', filter: 'drop-shadow(0 0 4px var(--color-primary))',
                                        }} />
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
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
    );
};

export default ProjectChallengesResults;
