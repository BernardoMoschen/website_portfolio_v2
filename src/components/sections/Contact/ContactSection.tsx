import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import siteConfig from '../../../config/site';
import { AnimateOnScroll, SlideIn } from '../../utils/animations';
import SectionAnchor from '../../utils/SectionAnchor';
import { useThemeMode } from '../../theme/ThemeContext';
import { useI18n } from '../../../i18n';

const ContactSection: React.FC = () => {
  const { darkMode } = useThemeMode();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getFieldError = (field: string): string | null => {
    const value = formData[field as keyof typeof formData].trim();
    switch (field) {
      case 'name':
        if (!value) return '> name is required';
        if (value.length < 2) return '> minimum 2 characters';
        return null;
      case 'email':
        if (!value) return '> email is required';
        if (!EMAIL_REGEX.test(value)) return '> invalid email format';
        return null;
      case 'subject':
        if (!value) return '> subject is required';
        return null;
      case 'message':
        if (!value) return '> message is required';
        if (value.length < 10) return '> minimum 10 characters';
        return null;
      default:
        return null;
    }
  };

  const isFormValid =
    !getFieldError('name') &&
    !getFieldError('email') &&
    !getFieldError('subject') &&
    !getFieldError('message');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocusedField(e.target.name);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocusedField(null);
  };
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isFormValid) return;
    // Honeypot — silently "succeed" if a bot filled the hidden field
    if (formData.website) {
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
      setToast({ visible: true, message: t.contact.success, type: 'success' });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setToast({
        visible: true,
        message: t.contact.success,
        type: 'success',
      });
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (error) {
      console.error('Contact form error:', error);
      setToast({
        visible: true,
        message:
          error instanceof Error
            ? error.message
            : t.contact.error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactLinks = [
    {
      icon: <HiMail size={20} />,
      label: 'Email',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: <FaGithub size={20} />,
      label: 'GitHub',
      value: 'BernardoMoschen',
      href: siteConfig.github,
      external: true,
    },
    {
      icon: <FaLinkedin size={20} />,
      label: 'LinkedIn',
      value: 'bernardomoschen',
      href: siteConfig.linkedin,
      external: true,
    },
    {
      icon: <HiLocationMarker size={20} />,
      label: 'Location',
      value: t.hero.location,
      href: '',
    },
  ];

  const focusBlob = {
    name:    { x: '20%',  y: '35%', color: 'var(--color-primary)',   morph: '50% 50% 40% 60% / 60% 40% 50% 50%' },
    email:   { x: '70%',  y: '35%', color: 'var(--color-secondary)', morph: '40% 60% 50% 50% / 50% 60% 40% 60%' },
    subject: { x: '40%',  y: '50%', color: 'var(--color-primary)',   morph: '60% 40% 60% 40% / 40% 60% 40% 60%' },
    message: { x: '35%',  y: '68%', color: 'var(--color-secondary)', morph: '30% 70% 40% 60% / 60% 30% 70% 40%' },
  } as const;
  const blob = focusedField ? focusBlob[focusedField as keyof typeof focusBlob] : null;

  return (
    <div className="section-inner" style={{ width: '100%', padding: '5rem 1.5rem 3rem', position: 'relative' }}>
      {/* Focus-reactive organic bloom */}
      <style>{`
        @keyframes contactBlobMorph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%     { border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; }
          50%     { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
          75%     { border-radius: 30% 70% 60% 40% / 60% 40% 50% 50%; }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        width: 560,
        height: 480,
        left: blob ? blob.x : '40%',
        top:  blob ? blob.y : '50%',
        transform: 'translate(-50%, -50%)',
        background: blob
          ? `radial-gradient(ellipse at 45% 45%, ${blob.color}, transparent 68%)`
          : 'radial-gradient(ellipse at 50% 50%, var(--color-primary), transparent 68%)',
        filter: 'blur(90px)',
        opacity: blob ? 0.35 : 0.06,
        borderRadius: blob ? blob.morph : '50% 50% 50% 50%',
        animation: blob ? 'contactBlobMorph 6s ease-in-out infinite' : 'none',
        transition: 'left 0.7s cubic-bezier(0.34,1.56,0.64,1), top 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease, background 0.5s ease',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
      }} />
      {/* Section Header */}
      <AnimateOnScroll>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-heading-group">
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                margin: '0 0 0.5rem',
                background: 'linear-gradient(45deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {t.contact.heading}
            </h2>
            <SectionAnchor sectionId="contact" />
          </div>
          <p
            className="mono"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            {t.contact.subtitle}
          </p>
        </div>
      </AnimateOnScroll>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Terminal Form */}
        <SlideIn direction="left">
          <div
            className="glass"
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Terminal title bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
                background: darkMode
                  ? 'rgba(0, 0, 0, 0.3)'
                  : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ff5f57',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#febc2e',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#28c840',
                  display: 'inline-block',
                }}
              />
              <span
                className="mono"
                style={{
                  marginLeft: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {t.contact.terminal_title}
              </span>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {/* Honeypot — hidden from real users, bots fill it */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="contact-website">Website</label>
                <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={formData.website ?? ''} onChange={handleInputChange} />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.25rem',
                }}
              >
                {/* Name field */}
                <div>
                  <label htmlFor="contact-name" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-success)', fontWeight: 700 }}>&gt;</span>
                    {t.contact.fields.name}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      aria-invalid={touched.name && !!getFieldError('name')}
                      placeholder={t.contact.placeholders.name}
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                        ...(touched.name && getFieldError('name') ? { borderColor: 'var(--color-error)' } : {}),
                      }}
                    />
                    {touched.name && !getFieldError('name') && formData.name && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>✓</span>
                    )}
                  </div>
                  <span className={`field-error mono${touched.name && getFieldError('name') ? ' visible' : ''}`}>
                    {getFieldError('name') || '\u00A0'}
                  </span>
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="contact-email" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-success)', fontWeight: 700 }}>&gt;</span>
                    {t.contact.fields.email}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      aria-invalid={touched.email && !!getFieldError('email')}
                      placeholder={t.contact.placeholders.email}
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                        ...(touched.email && getFieldError('email') ? { borderColor: 'var(--color-error)' } : {}),
                      }}
                    />
                    {touched.email && !getFieldError('email') && formData.email && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>✓</span>
                    )}
                  </div>
                  <span className={`field-error mono${touched.email && getFieldError('email') ? ' visible' : ''}`}>
                    {getFieldError('email') || '\u00A0'}
                  </span>
                </div>
              </div>

              {/* Subject field */}
              <div style={{ marginTop: '1.25rem' }}>
                <label htmlFor="contact-subject" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-success)', fontWeight: 700 }}>&gt;</span>
                  {t.contact.fields.subject}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    aria-invalid={touched.subject && !!getFieldError('subject')}
                    placeholder={t.contact.placeholders.subject}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                      ...(touched.subject && getFieldError('subject') ? { borderColor: 'var(--color-error)' } : {}),
                    }}
                  />
                  {touched.subject && !getFieldError('subject') && formData.subject && (
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>✓</span>
                  )}
                </div>
                <span className={`field-error mono${touched.subject && getFieldError('subject') ? ' visible' : ''}`}>
                  {getFieldError('subject') || '\u00A0'}
                </span>
              </div>

              {/* Message field */}
              <div style={{ marginTop: '1.25rem' }}>
                <label htmlFor="contact-message" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-success)', fontWeight: 700 }}>&gt;</span>
                  {t.contact.fields.message}
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="input"
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    aria-invalid={touched.message && !!getFieldError('message')}
                    placeholder={t.contact.placeholders.message}
                    rows={5}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      ...(touched.message && getFieldError('message') ? { borderColor: 'var(--color-error)' } : {}),
                    }}
                  />
                  {touched.message && !getFieldError('message') && formData.message && (
                    <span style={{ position: 'absolute', right: 12, top: 16, color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>✓</span>
                  )}
                </div>
                <span className={`field-error mono${touched.message && getFieldError('message') ? ' visible' : ''}`}>
                  {getFieldError('message') || '\u00A0'}
                </span>
              </div>

              {/* Submit button */}
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isFormValid}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    padding: '0.75rem 2rem',
                    cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
                    opacity: loading || !isFormValid ? 0.6 : 1,
                    width: '100%',
                    ...(isFormValid && !loading ? { animation: 'pulse-ready 2s ease-in-out infinite' } : {}),
                  }}
                >
                  {loading ? t.contact.sending : t.contact.submit}
                </button>
              </div>
            </form>
          </div>
        </SlideIn>

        {/* Contact Info Panel */}
        <SlideIn direction="right" delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            {/* Contact links */}
            <div
              className="glass"
              style={{
                borderRadius: '12px',
                padding: '1.75rem',
                border: '1px solid var(--color-border)',
                flex: 1,
              }}
            >
              <h3
                className="mono"
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  margin: '0 0 1.5rem',
                }}
              >
                {t.contact.info_title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {contactLinks.map((link, index) => {
                  const content = (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'var(--color-bg-glass)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary)',
                          flexShrink: 0,
                        }}
                      >
                        {link.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '2px',
                          }}
                        >
                          {link.label}
                        </div>
                        <div
                          className="mono"
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--color-text)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {link.value}
                        </div>
                      </div>
                    </div>
                  );

                  if (link.href) {
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        aria-label={`${link.label}${link.external ? ' (opens in new tab)' : ''}: ${link.value}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={e =>
                          (e.currentTarget.style.transform = 'translateX(4px)')
                        }
                        onMouseLeave={e =>
                          (e.currentTarget.style.transform = 'translateX(0)')
                        }
                      >
                        {content}
                      </a>
                    );
                  }
                  return content;
                })}
              </div>
            </div>

            {/* Availability status */}
            <div
              className="glass"
              style={{
                borderRadius: '12px',
                padding: '1.5rem 1.75rem',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  display: 'inline-block',
                  flexShrink: 0,
                  boxShadow: '0 0 8px var(--color-success)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text)',
                }}
              >
                {t.contact.available}
              </span>
              <span
                className="tag"
                style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
              >
                {t.contact.open}
              </span>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Toast notification */}
      {toast.visible && (
        <div
          role="alert"
          aria-live="assertive"
          className={`toast ${toast.type === 'success' ? 'toast-success success-msg' : 'toast-error'}`}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '90vw',
            animation: 'fadeInUp 0.3s ease',
          }}
          onClick={() => setToast(prev => ({ ...prev, visible: false }))}
        >
          <span>{toast.type === 'success' ? '$' : '!'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .field-error {
          display: block;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--color-error);
          font-size: 0.75rem;
          margin-top: 2px;
        }
        .field-error.visible {
          max-height: 30px;
          opacity: 1;
          transform: translateX(0);
        }
        @keyframes pulse-ready {
          0%, 100% { box-shadow: 0 4px 14px rgba(127, 176, 105, 0.3); }
          50% { box-shadow: 0 4px 24px rgba(127, 176, 105, 0.5); }
        }
        @keyframes pop-in {
          from { transform: translateX(-50%) scale(0.8); opacity: 0; }
          to { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        .success-msg { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
      `}</style>
    </div>
  );
};

export default ContactSection;
