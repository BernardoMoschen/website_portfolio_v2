import { en } from '../../i18n/translations/en';
import type { Translations } from '../../i18n';

interface ProjectStructural {
    slug: string;
    image: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    status: 'planning' | 'wip' | 'completed';
    type: 'professional' | 'personal';
    preview?: {
        type: 'live' | 'mockup';
        content?: string[];
        metrics?: { label: string; value: string }[];
    };
}

export interface ProjectData extends ProjectStructural {
    title: string;
    description: string;
    longDescription?: string;
    challenges?: string[];
    results?: string[];
    role?: string;
}

const structuralData: ProjectStructural[] = [
    {
        slug: 'portfolio',
        image: '/project-portfolio.jpg',
        technologies: ['Next.js', 'React', 'TypeScript', 'Three.js', 'CSS Custom Properties', 'Framer Motion', 'Web Audio API', 'Resend'],
        githubUrl: 'https://github.com/BernardoMoschen/portfolio_astro',
        liveUrl: 'https://bernardomoschen.dev',
        featured: true,
        status: 'completed',
        type: 'personal',
        preview: {
            type: 'live',
            metrics: [
                { label: 'Lighthouse', value: '95+' },
                { label: '3D Bundle', value: '244KB gz' },
                { label: 'Build', value: 'Next.js (SSR + SSG)' },
            ],
        },
    },
    {
        slug: 'telecom-backoffice',
        image: '/project-telecom.jpg',
        technologies: ['React', 'Node.js', 'TypeScript', 'Material UI', 'Recoil', 'GraphQL', 'AWS', 'Zapier'],
        githubUrl: '',
        liveUrl: '',
        featured: true,
        status: 'completed',
        type: 'professional',
        preview: {
            type: 'mockup',
            content: [
                '$ zapier trigger --workflow=onboarding',
                '→ CRM sync: 10K+ customers',
                '→ Zendesk tickets: auto-routed',
                '→ Revenue: ↑ automated pipelines',
                '✓ All integrations healthy',
            ],
            metrics: [
                { label: 'Users', value: '~10K+' },
                { label: 'Integrations', value: '4+' },
                { label: 'APIs', value: 'REST + GraphQL' },
            ],
        },
    },
    {
        slug: 'edtech-platform',
        image: '/project-edtech.jpg',
        technologies: ['React', 'TypeScript', 'C#', '.NET', 'PostgreSQL', 'SCRUM'],
        githubUrl: '',
        liveUrl: '',
        featured: false,
        status: 'completed',
        type: 'professional',
        preview: {
            type: 'mockup',
            content: [
                '$ dotnet run --project=enrollment',
                '→ Institutions connected: 20',
                '→ Active students: processing...',
                '→ Contracts generated: ✓',
                '✓ All systems operational',
            ],
            metrics: [
                { label: 'Institutions', value: '~20' },
                { label: 'Stack', value: 'React + .NET' },
                { label: 'DB', value: 'PostgreSQL' },
            ],
        },
    },
    {
        slug: 'mining-data-platform',
        image: '/project-mining.jpg',
        technologies: ['React', 'TypeScript', 'Node.js', 'Sequelize.js', 'SQL Server', 'Jest'],
        githubUrl: '',
        liveUrl: '',
        featured: false,
        status: 'completed',
        type: 'professional',
        preview: {
            type: 'mockup',
            content: [
                '$ node ingest --source=sensors',
                '→ Virtual model: syncing...',
                '→ Physical sensors: 50K+/day',
                '→ Data merge: real-time ✓',
                '✓ Pipeline healthy',
            ],
            metrics: [
                { label: 'Data/Day', value: '50K+' },
                { label: 'Team', value: 'Remote Intl' },
                { label: 'DB', value: 'SQL Server' },
            ],
        },
    },
];

const mergeWithTranslations = (t: Translations): ProjectData[] =>
    structuralData.map((project) => {
        const text = t.project_items[project.slug as keyof typeof t.project_items];
        return {
            ...project,
            title: text?.title ?? project.slug,
            description: text?.description ?? '',
            longDescription: text?.longDescription,
            challenges: text?.challenges,
            results: text?.results,
            role: text?.role,
        };
    });

/** English project data — use in server components (metadata, sitemap, og) */
export const projects: ProjectData[] = mergeWithTranslations(en);

/** Localized project data — use in client components */
export const getLocalizedProjects = (t: Translations): ProjectData[] => mergeWithTranslations(t);
