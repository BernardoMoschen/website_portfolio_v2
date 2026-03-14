import React, { useEffect, useRef } from 'react';
import type { Experience } from '../../data/aboutData';
import { getCategoryIcon } from '../../utils/iconMap';

interface ExperienceTimelineProps {
    experiences: Experience[];
    descriptions: string[][];
    heading: string;
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences, descriptions, heading }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        // Observer for the timeline container (line animation)
        const timelineObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timeline.classList.add('timeline--visible');
                }
            },
            { threshold: 0.1 }
        );
        timelineObserver.observe(timeline);

        // Observer for individual entries
        const entries = timeline.querySelectorAll('.timeline-entry');
        const timers: number[] = [];
        const entryObserver = new IntersectionObserver(
            (observedEntries) => {
                observedEntries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = el.dataset.index
                            ? parseInt(el.dataset.index, 10) * 100
                            : 0;
                        timers.push(window.setTimeout(() => {
                            el.classList.add('timeline-entry--visible');
                        }, delay));
                        entryObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.2 }
        );

        entries.forEach((entry) => entryObserver.observe(entry));

        return () => {
            timers.forEach(t => clearTimeout(t));
            timelineObserver.disconnect();
            entryObserver.disconnect();
        };
    }, [experiences]);

    return (
        <div style={{ marginTop: '4rem' }}>
            <h3
                style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                }}
            >
                {heading}
            </h3>

            <div className="timeline" ref={timelineRef}>
                <style>{`
                    .timeline {
                        position: relative;
                        padding-left: 3rem;
                    }
                    .timeline::before {
                        content: '';
                        position: absolute;
                        left: 1rem;
                        top: 0;
                        bottom: 0;
                        width: 3px;
                        background: var(--color-border);
                        border-radius: 2px;
                        transform: scaleY(0);
                        transform-origin: top;
                        transition: transform 1.5s ease;
                    }
                    .timeline--visible::before {
                        transform: scaleY(1);
                    }
                    @media (min-width: 768px) {
                        .timeline {
                            padding-left: 0;
                            max-width: 900px;
                            margin: 0 auto;
                        }
                        .timeline::before {
                            left: 50%;
                            transform: scaleY(0) translateX(-50%);
                        }
                        .timeline--visible::before {
                            transform: scaleY(1) translateX(-50%);
                        }
                    }
                    .timeline-entry {
                        position: relative;
                        margin-bottom: 2.5rem;
                        opacity: 0;
                        transform: translateX(-30px);
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }
                    .timeline-entry--visible {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    @media (min-width: 768px) {
                        .timeline-entry:nth-child(even) {
                            transform: translateX(30px);
                        }
                        .timeline-entry:nth-child(even).timeline-entry--visible {
                            transform: translateX(0);
                        }
                    }
                    .timeline-dot {
                        position: absolute;
                        left: -3rem;
                        top: 0;
                        width: 2rem;
                        height: 2rem;
                        border-radius: 50%;
                        background: var(--color-primary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #fff;
                        font-size: 0.85rem;
                        box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 40%, transparent);
                        z-index: 2;
                        transform: scale(0);
                        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    .timeline-entry--visible .timeline-dot {
                        transform: scale(1);
                    }
                    @media (min-width: 768px) {
                        .timeline-entry {
                            width: 45%;
                        }
                        .timeline-entry:nth-child(odd) {
                            margin-left: auto;
                            padding-left: 2rem;
                        }
                        .timeline-entry:nth-child(even) {
                            margin-right: auto;
                            padding-right: 2rem;
                            text-align: right;
                        }
                        .timeline-entry:nth-child(even) .timeline-desc-list {
                            direction: rtl;
                        }
                        .timeline-entry:nth-child(even) .timeline-desc-list li {
                            direction: ltr;
                            text-align: left;
                        }
                        .timeline-dot {
                            left: auto;
                        }
                        .timeline-entry:nth-child(odd) .timeline-dot {
                            left: -3.5rem;
                        }
                        .timeline-entry:nth-child(even) .timeline-dot {
                            right: -3.5rem;
                            left: auto;
                        }
                    }
                    .timeline-card {
                        background: var(--color-bg-glass);
                        backdrop-filter: blur(10px);
                        border: 1px solid var(--color-border);
                        border-radius: 10px;
                        padding: 1.25rem 1.5rem;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .timeline-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 30px color-mix(in srgb, var(--color-primary) 20%, transparent);
                        border-color: var(--color-border-hover);
                    }
                    .timeline-role {
                        font-size: 1.05rem;
                        font-weight: 600;
                        color: var(--color-primary);
                        margin: 0 0 0.25rem;
                    }
                    .timeline-company {
                        font-size: 0.95rem;
                        font-weight: 500;
                        margin: 0 0 0.5rem;
                    }
                    .timeline-company a {
                        color: var(--color-secondary);
                        text-decoration: none;
                        transition: opacity 0.2s;
                    }
                    .timeline-company a:hover {
                        opacity: 0.8;
                    }
                    .timeline-period {
                        display: inline-block;
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: var(--color-text-secondary);
                        background: var(--color-bg-glass);
                        border: 1px solid var(--color-border);
                        border-radius: 999px;
                        padding: 0.15rem 0.7rem;
                        margin-bottom: 0.75rem;
                    }
                    .timeline-desc-list {
                        list-style: disc;
                        padding-left: 1.25rem;
                        margin: 0;
                    }
                    .timeline-desc-list li {
                        padding: 0.2rem 0;
                        line-height: 1.6;
                        color: var(--color-text-secondary);
                        font-size: 0.88rem;
                    }
                `}</style>

                {experiences.map((exp, index) => (
                    <div className="timeline-entry" key={index} data-index={index}>
                        <div className="timeline-dot">
                            {getCategoryIcon(exp.iconType)}
                        </div>
                        <div className="timeline-card">
                            <p className="timeline-role">{exp.role}</p>
                            <p className="timeline-company">
                                <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer">
                                    {exp.company}
                                </a>
                            </p>
                            <span className="timeline-period">{exp.period}</span>
                            <ul className="timeline-desc-list">
                                {(descriptions[index] ?? exp.description).map((desc, descIndex) => (
                                    <li key={descIndex}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceTimeline;
