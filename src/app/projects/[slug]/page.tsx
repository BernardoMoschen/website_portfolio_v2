import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '../../../components/data/projectsData';
import ProjectDetail from '../../../components/sections/Projects/ProjectDetail';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage(
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0
    ? { slug: projects[projectIndex - 1].slug, title: projects[projectIndex - 1].title }
    : null;
  const nextProject = projectIndex < projects.length - 1
    ? { slug: projects[projectIndex + 1].slug, title: projects[projectIndex + 1].title }
    : null;

  return (
    <ProjectDetail
      project={project}
      projectIndex={projectIndex}
      totalProjects={projects.length}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
