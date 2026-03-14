import type { MetadataRoute } from 'next';
import siteConfig from '../config/site';
import { projects } from '../components/data/projectsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectUrls,
  ];
}
