import React, { useEffect, useRef, useCallback } from 'react';
import { HiDownload } from 'react-icons/hi';
import { SoundToggle } from '../../audio';
import LanguageSwitcher from '../LanguageSwitcher';
import { useI18n } from '../../../i18n';

interface MenuItem {
    label: string;
    href: string;
}

interface MobileDrawerProps {
    open: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    activeSection: string;
    onMenuClick: (href: string) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
    open,
    onClose,
    menuItems,
    activeSection,
    onMenuClick,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { t } = useI18n();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            // Focus the close button when drawer opens
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Escape key closes drawer
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            // Focus trap
            if (e.key === 'Tab' && drawerRef.current) {
                const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1200,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Drawer panel */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 'min(280px, calc(100vw - 60px))',
                    backgroundColor: 'var(--color-bg)',
                    zIndex: 1300,
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderLeft: '2px solid var(--color-border)',
                    boxShadow: open ? '0 0 50px var(--color-bg-glass)' : 'none',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Dot pattern background */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.15,
                        backgroundImage:
                            'radial-gradient(circle at 2px 2px, var(--color-text-secondary) 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                        pointerEvents: 'none',
                    }}
                />

                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 24,
                        borderBottom: '2px solid var(--color-border)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Terminal icon */}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="4 17 10 11 4 5" />
                                <line x1="12" y1="19" x2="20" y2="19" />
                            </svg>
                            <span
                                className="mono"
                                style={{
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: '1rem',
                                }}
                            >
                                bernardo.moschen
                            </span>
                        </div>

                        {/* Close button */}
                        <button
                            ref={closeButtonRef}
                            onClick={onClose}
                            aria-label="Close navigation menu"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text)',
                                cursor: 'pointer',
                                padding: 10,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Status chip */}
                    <span
                        style={{
                            alignSelf: 'flex-start',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            border: '1px solid var(--color-secondary)',
                            borderRadius: 16,
                            color: 'var(--color-secondary)',
                            fontSize: '0.75rem',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        {/* Code icon */}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                        Currently coding
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav style={{ padding: 16, position: 'relative', zIndex: 1 }}>
                    {menuItems.map((item, index) => {
                        const isActive = activeSection === item.href.replace('#', '');

                        return (
                            <button
                                key={item.label}
                                onClick={() => onMenuClick(item.href)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: 16,
                                    marginBottom: 8,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
                                    background: isActive ? 'var(--color-bg-glass)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'left',
                                }}
                            >
                                <span
                                    className="mono"
                                    style={{
                                        flex: 1,
                                        color: isActive
                                            ? 'var(--color-primary)'
                                            : 'var(--color-text)',
                                        fontWeight: 600,
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {item.label}
                                </span>
                                <span
                                    style={{
                                        color: 'var(--color-secondary)',
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: '0.75rem',
                                        opacity: isActive ? 1 : 0.5,
                                    }}
                                >
                                    [{index.toString().padStart(2, '0')}]
                                </span>
                            </button>
                        );
                    })}
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            width: '100%',
                            padding: '12px 16px',
                            marginTop: 8,
                            borderRadius: 8,
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            background: 'rgba(var(--color-primary-rgb, 99,102,241), 0.07)',
                        }}
                    >
                        <HiDownload size={16} />
                        {t.nav.resume}
                    </a>

                    <div style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        paddingLeft: 16,
                    }}>
                        <SoundToggle />
                        <span style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-secondary)',
                        }}>
                            Sound FX
                        </span>
                        <div style={{ marginLeft: 'auto' }}>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default MobileDrawer;
