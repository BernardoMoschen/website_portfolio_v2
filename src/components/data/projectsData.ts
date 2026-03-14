import rawData from '../../../public/data/projects.json';

export interface ProjectData {
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    image: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    status: 'planning' | 'wip' | 'completed';
    type: 'professional' | 'personal';
    challenges?: string[];
    results?: string[];
    role?: string;
    preview?: {
        type: 'live' | 'mockup';
        content?: string[];
        metrics?: { label: string; value: string }[];
    };
}

export const projects: ProjectData[] = rawData as ProjectData[];
