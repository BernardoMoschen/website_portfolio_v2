import type { MetadataRoute } from 'next';
import siteConfig from '../config/site';
import { projects } from '../components/data/projectsData';

const PROJECT_DATES: Record<string, string> = {
  'portfolio':             '2026-03-17',
  'telecom-backoffice':    '2025-06-01',
  'edtech-platform':       '2025-03-01',
  'mining-data-platform':  '2024-12-01',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(PROJECT_DATES[project.slug] ?? '2025-01-01'),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date('2026-03-17'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectUrls,
  ];
}
