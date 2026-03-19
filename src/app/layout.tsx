import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import siteConfig from '../config/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.profileImage}`,
  email: siteConfig.email,
  address: { '@type': 'PostalAddress', addressCountry: 'BR' },
  sameAs: [siteConfig.linkedin, siteConfig.github],
  description: 'Full Stack Engineer with 5+ years of experience building scalable web applications.',
  knowsAbout: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Docker', 'C#', '.NET'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${siteConfig.name} - Portfolio`,
  url: siteConfig.url,
  description: siteConfig.description,
  author: { '@type': 'Person', name: siteConfig.name },
  inLanguage: 'en-US',
  copyrightYear: new Date().getFullYear(),
  genre: 'Portfolio',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#7fb069',
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  title: {
    default: 'Bernardo Moschen - Full Stack Engineer',
    template: '%s - Bernardo Moschen',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: siteConfig.url },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: 'Bernardo Moschen - Full Stack Engineer',
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og`,
        width: 1200,
        height: 630,
        alt: 'Bernardo Moschen - Full Stack Engineer Portfolio',
      },
    ],
    siteName: 'Bernardo Moschen - Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bernardomoschen',
    creator: '@bernardomoschen',
    title: 'Bernardo Moschen - Full Stack Engineer',
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og`,
        alt: 'Bernardo Moschen - Full Stack Engineer Portfolio',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/profile-photo.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="prefetch" href="/resume.pdf" />
        <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
        <link rel="me" href={siteConfig.github} />
        <link rel="me" href={siteConfig.linkedin} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%c\\n  ██████╗ ███╗   ███╗\\n  ██╔══██╗████╗ ████║\\n  ██████╔╝██╔████╔██║\\n  ██╔══██╗██║╚██╔╝██║\\n  ██████╔╝██║ ╚═╝ ██║\\n  ╚═════╝ ╚═╝     ╚═╝\\n', 'color: #7fb069; font-family: monospace;');
              console.log('%c  Bernardo Moschen — Full Stack Engineer\\n  %cBuilt with Next.js, React, Three.js & too much coffee.\\n\\n  %c> Curious how this was made? Let\\'s chat!\\n  > bernardo@moschen.dev\\n', 'color: #7fb069; font-weight: bold; font-size: 14px;', 'color: #999; font-size: 12px;', 'color: #e07a5f; font-family: monospace; font-size: 12px;');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
