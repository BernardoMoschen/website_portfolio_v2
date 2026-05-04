'use client';

import React from 'react';
import type { StorylineBlock } from './types';
import Heading from './Heading';
import Paragraph from './Paragraph';
import CodeBlock from './CodeBlock';
import CountUp from './CountUp';
import Metrics from './Metrics';
import BeforeAfter from './BeforeAfter';

interface Props {
    blocks: StorylineBlock[];
}

const Storyline: React.FC<Props> = ({ blocks }) => {
    return (
        <div style={{ marginTop: '1rem', marginBottom: '3rem' }}>
            {blocks.map((block, idx) => {
                const key = `${block.kind}-${idx}`;
                switch (block.kind) {
                    case 'heading':
                        return <Heading key={key} text={block.text} level={block.level} />;
                    case 'paragraph':
                        return <Paragraph key={key} text={block.text} align={block.align} />;
                    case 'code':
                        return (
                            <CodeBlock
                                key={key}
                                code={block.code}
                                lang={block.lang}
                                caption={block.caption}
                            />
                        );
                    case 'countUp':
                        return (
                            <div key={key} className="section-inner" style={{ marginBottom: '2.5rem' }}>
                                <CountUp
                                    to={block.to}
                                    from={block.from}
                                    suffix={block.suffix}
                                    prefix={block.prefix}
                                    label={block.label}
                                />
                            </div>
                        );
                    case 'metrics':
                        return <Metrics key={key} items={block.items} />;
                    case 'beforeAfter':
                        return (
                            <BeforeAfter
                                key={key}
                                before={block.before}
                                after={block.after}
                                alt={block.alt}
                                height={block.height}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Storyline;
