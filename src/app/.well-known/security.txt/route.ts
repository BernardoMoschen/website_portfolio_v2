import siteConfig from '../../../config/site';

export function GET() {
  const body = `Contact: mailto:${siteConfig.securityContact}
Expires: ${siteConfig.securityExpiry}
Preferred-Languages: en, pt
Canonical: ${siteConfig.url}/.well-known/security.txt
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
