import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import siteConfig from '../../../config/site';
import { AnimateOnScroll, SlideIn } from '../../utils/animations';
import SectionAnchor from '../../utils/SectionAnchor';
import { useThemeMode } from '../../theme/ThemeContext';
import { useI18n } from '../../../i18n';
import { EMAIL_REGEX } from '../../../utils/validation';
import styles from './ContactSection.module.css';

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

      setToast({ visible: true, message: t.contact.success, type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (error) {
      console.error('Contact form error:', error);
      setToast({
        visible: true,
        message: error instanceof Error ? error.message : t.contact.error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactLinks = [
    { icon: <HiMail size={20} />, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: <FaGithub size={20} />, label: 'GitHub', value: 'BernardoMoschen', href: siteConfig.github, external: true },
    { icon: <FaLinkedin size={20} />, label: 'LinkedIn', value: 'bernardomoschen', href: siteConfig.linkedin, external: true },
    { icon: <HiLocationMarker size={20} />, label: 'Location', value: t.hero.location, href: '' },
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
      <div
        className={`${styles.blob}${blob ? ` ${styles.blobActive}` : ''}`}
        style={{
          left: blob ? blob.x : '40%',
          top: blob ? blob.y : '50%',
          background: blob
            ? `radial-gradient(ellipse at 45% 45%, ${blob.color}, transparent 68%)`
            : 'radial-gradient(ellipse at 50% 50%, var(--color-primary), transparent 68%)',
          opacity: blob ? 0.35 : 0.06,
          borderRadius: blob ? blob.morph : '50% 50% 50% 50%',
        }}
      />

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
          <p className="mono" style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', margin: 0 }}>
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
          <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {/* Terminal title bar */}
            <div
              className={styles.terminalBar}
              style={{ background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}
            >
              <span className={styles.terminalDot} style={{ background: '#ff5f57' }} />
              <span className={styles.terminalDot} style={{ background: '#febc2e' }} />
              <span className={styles.terminalDot} style={{ background: '#28c840' }} />
              <span className={`mono ${styles.terminalTitle}`}>{t.contact.terminal_title}</span>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {/* Honeypot — hidden from real users, bots fill it */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="contact-website">Website</label>
                <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={formData.website ?? ''} onChange={handleInputChange} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                      aria-describedby="field-name-error"
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
                  <span id="field-name-error" role="alert" aria-live="assertive" className={`mono ${styles.fieldError}${touched.name && getFieldError('name') ? ` ${styles.fieldErrorVisible}` : ''}`}>
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
                      aria-describedby="field-email-error"
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
                  <span id="field-email-error" role="alert" aria-live="assertive" className={`mono ${styles.fieldError}${touched.email && getFieldError('email') ? ` ${styles.fieldErrorVisible}` : ''}`}>
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
                    aria-describedby="field-subject-error"
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
                <span id="field-subject-error" role="alert" aria-live="assertive" className={`mono ${styles.fieldError}${touched.subject && getFieldError('subject') ? ` ${styles.fieldErrorVisible}` : ''}`}>
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
                    aria-describedby="field-message-error"
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
                <span id="field-message-error" role="alert" aria-live="assertive" className={`mono ${styles.fieldError}${touched.message && getFieldError('message') ? ` ${styles.fieldErrorVisible}` : ''}`}>
                  {getFieldError('message') || '\u00A0'}
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className={[
                  'btn btn-primary',
                  styles.submitBtn,
                  isFormValid && !loading ? styles.submitBtnReady : styles.submitBtnDisabled,
                ].join(' ')}
                disabled={loading || !isFormValid}
              >
                {loading ? t.contact.sending : t.contact.submit}
              </button>
            </form>
          </div>
        </SlideIn>

        {/* Contact Info Panel */}
        <SlideIn direction="right" delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            {/* Contact links */}
            <div className="glass" style={{ borderRadius: '12px', padding: '1.75rem', border: '1px solid var(--color-border)', flex: 1 }}>
              <h3 className="mono" style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.5rem' }}>
                {t.contact.info_title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {contactLinks.map((link, index) => {
                  const content = (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: 40, height: 40, borderRadius: '10px',
                          background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-primary)', flexShrink: 0,
                        }}
                      >
                        {link.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          {link.label}
                        </div>
                        <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--color-text)', wordBreak: 'break-word' }}>
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
                        style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
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
              style={{ borderRadius: '12px', padding: '1.5rem 1.75rem', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <span className={styles.availabilityDot} />
              <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                {t.contact.available}
              </span>
              <span className="tag" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
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
          className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'} ${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : ''}`}
          onClick={() => setToast(prev => ({ ...prev, visible: false }))}
        >
          <span>{toast.type === 'success' ? '$' : '!'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ContactSection;
