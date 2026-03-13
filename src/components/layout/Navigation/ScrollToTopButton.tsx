import React, { useState } from 'react';

interface ScrollToTopButtonProps {
    show: boolean;
    onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ show, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            aria-label="scroll back to top"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, var(--color-primary) 30%, var(--color-secondary) 90%)',
                color: '#fff',
                border: 'none',
                outline: '2px solid var(--color-border)',
                outlineOffset: '-2px',
                overflow: 'hidden',
                cursor: 'pointer',
                appearance: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                opacity: show ? 1 : 0,
                pointerEvents: show ? 'auto' : 'none',
                transform: show
                    ? hovered
                        ? 'translateY(-4px) scale(1.1)'
                        : 'translateY(0) scale(1)'
                    : 'translateY(20px) scale(0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hovered
                    ? '0 12px 35px rgba(0,0,0,0.3)'
                    : '0 8px 25px rgba(0,0,0,0.2)',
            }}
        >
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
