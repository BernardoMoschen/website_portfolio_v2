import { ImageResponse } from 'next/og';
import siteConfig from '../../config/site';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0f1117',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(127,176,105,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(127,176,105,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7fb069, #e07a5f)',
          }}
        />

        {/* Terminal prompt prefix */}
        <div
          style={{
            display: 'flex',
            color: '#7fb069',
            fontSize: '22px',
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}
        >
          ~/{siteConfig.domain}
        </div>

        {/* Name */}
        <div
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 700,
            color: '#f0f4f8',
            lineHeight: 1.1,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          {siteConfig.name}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#7fb069',
            fontWeight: 500,
            marginBottom: '40px',
          }}
        >
          {siteConfig.title}
        </div>

        {/* Tech stack chips */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                background: 'rgba(127,176,105,0.12)',
                border: '1px solid rgba(127,176,105,0.3)',
                color: '#7fb069',
                borderRadius: '6px',
                padding: '6px 16px',
                fontSize: '20px',
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            color: 'rgba(240,244,248,0.25)',
            fontSize: '20px',
            letterSpacing: '0.05em',
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
