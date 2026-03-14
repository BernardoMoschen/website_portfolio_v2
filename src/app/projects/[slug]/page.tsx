import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '../../../components/data/projectsData';
import ProjectDetail from '../../../components/sections/Projects/ProjectDetail';
import siteConfig from '../../../config/site';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${siteConfig.url}/projects/${project.slug}` },
  };
}

export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0
    ? { slug: projects[projectIndex - 1].slug, title: projects[projectIndex - 1].title }
    : null;
  const nextProject = projectIndex < projects.length - 1
    ? { slug: projects[projectIndex + 1].slug, title: projects[projectIndex + 1].title }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.liveUrl || `${siteConfig.url}/projects/${project.slug}`,
    author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    ...(project.technologies?.length && { keywords: project.technologies.join(', ') }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail
        project={project}
        projectIndex={projectIndex}
        totalProjects={projects.length}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
