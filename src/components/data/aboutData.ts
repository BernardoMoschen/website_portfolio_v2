export interface Technology {
    name: string;
    iconColor: string;
    iconType: 'react' | 'typescript' | 'mui' | 'jest' | 'nextjs' | 'nodejs' | 'csharp' | 'dotnet' | 'graphql' | 'postgresql' | 'aws' | 'sonarqube' | 'server' | 'database' | 'vue' | 'php' | 'mysql' | 'mongodb' | 'zapier' | 'strapi' | 'webflow' | 'zendesk' | 'sequelize' | 'mssql' | 'typeorm' | 'adonis' | 'nestjs' | 'docker' | 'express' | 'prisma' | 'astro' | 'tailwind' | 'redux' | 'recoil' | 'webpack' | 'sass' | 'linux' | 'html' | 'css' | 'git' | 'swagger' | 'spa' | 'rest' | 'solid' | 'scrum' | 'microservices' | 'javascript';
    featured?: boolean; 
}

export interface TechnicalArea {
    category: string;
    iconType: 'devices' | 'storage' | 'cloud';
    technologies: Technology[];
    description: string;
    descriptionHighlight: string;
}

export interface Experience {
    role: string;
    company: string;
    companyUrl: string;
    period: string;
    description: string[];
    iconType: 'work';
}


export type AudienceBrief = {
    audience: string;
    brief: string;
};

export const briefList: AudienceBrief[] = [
    {
        audience: 'For anyone',
        brief:
            "I care about the details most people never see — the loading state that feels right, the API response that's 200ms faster, the code a teammate reads six months later and actually understands. I've shipped products in Brazil, Canada, and remotely for international teams. I build things that matter, not just things that work.",
    },
    {
        audience: 'Recruiters',
        brief:
            "5+ years, 3 countries, 4 industries. I led development of automation tools at a telecom that directly boosted revenue. I built a platform serving ~20 educational institutions and thousands of students. I shipped a real-time data system for ArcelorMittal's mining operations in Canada — remotely from Brazil. TypeScript full-stack, comfortable owning projects end-to-end or contributing to larger teams.",
    },
    {
        audience: 'Product Managers',
        brief:
            "I don't just build what's in the ticket — I ask why. At Paradise Mobile, I pushed for self-service onboarding flows that reduced user drop-off. At Grupo Tiradentes, I helped consolidate 20 institutional systems into one. I think in user outcomes, flag technical risks early, and ship incrementally. If something can be validated simpler and sooner, I'll push for that.",
    },
    {
        audience: 'Engineers',
        brief:
            "React + TypeScript is home base, but I've shipped production code in Node, NestJS, .NET/C#, and even PHP when needed. I've worked across PostgreSQL, SQL Server, MongoDB, and MySQL — whatever the project requires. I like clean abstractions, pragmatic testing, and code reviews that teach me something. I value teams that ship fast, refactor deliberately, and don't over-engineer.",
    },
];

export const technicalAreas: TechnicalArea[] = [
    {
        category: 'Frontend Development',
        iconType: 'devices',
        technologies: [
            { name: 'React', iconColor: '#61DAFB', iconType: 'react', featured: true },
            { name: 'TypeScript', iconColor: '#3178C6', iconType: 'typescript', featured: true },
            { name: 'JavaScript', iconColor: '#F7DF1E', iconType: 'javascript', featured: true },
            { name: 'Material UI', iconColor: '#007FFF', iconType: 'mui', featured: true },
            { name: 'Vue', iconColor: '#4FC08D', iconType: 'vue' },
            { name: 'Astro.js', iconColor: '#FF5D01', iconType: 'astro' },
            { name: 'Tailwind', iconColor: '#06B6D4', iconType: 'tailwind', featured: true  },
            { name: 'Redux', iconColor: '#764ABC', iconType: 'redux', featured: true  },
            { name: 'Recoil', iconColor: '#3578E5', iconType: 'recoil', featured: true  },
            { name: 'Webpack', iconColor: '#8DD6F9', iconType: 'webpack' },
            { name: 'SASS', iconColor: '#CC6699', iconType: 'sass', featured: true  },
            { name: 'HTML', iconColor: '#E34F26', iconType: 'html' },
            { name: 'CSS3', iconColor: '#1572B6', iconType: 'css' },
            { name: 'Jest', iconColor: '#C21325', iconType: 'jest', featured: true },
        ],
        description: `Modern frontend frameworks, state management, and styling solutions`,
        descriptionHighlight: 'I make pixels dance and users happy (mostly)',
    },
    {
        category: 'Backend & APIs',
        iconType: 'storage',
        technologies: [
            { name: 'Node.js', iconColor: '#339933', iconType: 'nodejs', featured: true },
            { name: 'Express', iconColor: '#000000', iconType: 'express', featured: true  },
            { name: 'REST', iconColor: '#FF6B6B', iconType: 'rest', featured: true  },
            { name: 'NestJS', iconColor: '#E0234E', iconType: 'nestjs', featured: true  },
            { name: 'TypeORM', iconColor: '#FE0803', iconType: 'typeorm', featured: true },
            { name: 'Prisma', iconColor: '#2D3748', iconType: 'prisma', featured: true },
            { name: 'GraphQL', iconColor: '#E10098', iconType: 'graphql' },
            { name: 'Adonis.js', iconColor: '#220052', iconType: 'adonis' },
            { name: 'Sequelize.js', iconColor: '#52B0E7', iconType: 'sequelize' },
            { name: 'Microservices', iconColor: '#4ECDC4', iconType: 'microservices' },
            { name: 'PHP', iconColor: '#777BB4', iconType: 'php' },
            { name: '.NET', iconColor: '#512BD4', iconType: 'dotnet' },
            { name: 'C#', iconColor: '#239120', iconType: 'csharp', },

        ],
        description: 'Server-side development, API design, and scalable architecture',
        descriptionHighlight:'I create functional endpoints and make your site fast...eventually',
    },
    {
        category: 'DevOps, Databases & Tools',
        iconType: 'cloud',
        technologies: [
            { name: 'Docker', iconColor: '#2496ED', iconType: 'docker', featured: true },
            { name: 'PostgreSQL', iconColor: '#336791', iconType: 'postgresql', featured: true },
            { name: 'MySQL', iconColor: '#4479A1', iconType: 'mysql', featured: true },
            { name: 'MongoDB', iconColor: '#47A248', iconType: 'mongodb', featured: true },
            { name: 'AWS', iconColor: '#FF9900', iconType: 'aws', featured: true },
            { name: 'SQL Server', iconColor: '#CC2927', iconType: 'mssql', featured: true  },
            { name: 'Linux', iconColor: '#FCC624', iconType: 'linux',  featured: true },
            { name: 'SPAs', iconColor: '#FF6B6B', iconType: 'spa', },
            { name: 'Swagger', iconColor: '#85EA2D', iconType: 'swagger',  },
            { name: 'GitHub/GitLab', iconColor: '#181717', iconType: 'git', },
            { name: 'SonarQube', iconColor: '#4E9BCD', iconType: 'sonarqube' },
            { name: 'Zapier', iconColor: '#FF4A00', iconType: 'zapier', },
            { name: 'SCRUM', iconColor: '#0052CC', iconType: 'scrum',  },
            { name: 'Strapi', iconColor: '#2F2E8B', iconType: 'strapi' },
            { name: 'Webflow', iconColor: '#4353FF', iconType: 'webflow' },
            { name: 'SOLID', iconColor: '#4285F4', iconType: 'solid' },
        ],
        description: 'Database design, optimization, containerization and cloud infrastructure',
        descriptionHighlight:'I speak fluent SQL and deploy with confidence (fingers crossed)' ,
    },
];

export const experiences: Experience[] = [
    {
        role: 'Senior Full Stack Engineer',
        company: 'Paradise Mobile',
        companyUrl: 'https://www.linkedin.com/company/paradise-mobile/about',
        period: '2024 - Present',
        description: [
            'Built self-service onboarding flows (React, Recoil, Jest) that measurably reduced user drop-off rates across the telecom platform',
            'Designed REST APIs and midtier services (Node.js, TypeScript, GraphQL, AWS) powering a CRM serving ~10K+ customers',
            'Led development of back-office automation tools that directly boosted support team revenue by replacing manual workflows with integrated pipelines',
            'Unified 4+ external platforms (Zapier, Webflow, Zendesk, Strapi) into a single automation layer — from ticket routing to customer onboarding',
        ],
        iconType: 'work',
    },
    {
        role: 'Mid-level Full Stack Engineer',
        company: 'Grupo Tiradentes',
        companyUrl: 'https://www.linkedin.com/company/grupo-tiradentes/about',
        period: '2022 - 2023',
        description: [
            'Consolidated ~20 educational institutions into one unified platform — enrollment, contracts, financing, and reporting in a single system used daily by thousands',
            'Built the React + TypeScript frontend serving administrative staff and students across the entire institution network',
            'Engineered C#/.NET + PostgreSQL backend handling high-volume enrollment transactions with robust data integrity',
        ],
        iconType: 'work',
    },
    {
        role: 'Mid-level Full Stack Engineer',
        company: 'ArcelorMittal Mines Canada',
        companyUrl: 'https://www.linkedin.com/company/arcelormittal/about',
        period: '2021 - 2022',
        description: [
            'Led development of a real-time data integration platform processing 50K+ sensor readings/day — replaced error-prone manual data entry entirely',
            'Architected Node.js + Sequelize.js + SQL Server backend for automated merging of virtual models with physical sensor data',
            'Shipped from Brazil as part of a fully remote international team — daily coordination across time zones with Canadian stakeholders',
        ],
        iconType: 'work',
    },
    {
        role: 'Full Stack Engineer',
        company: 'Meta IT',
        companyUrl: 'https://www.linkedin.com/company/metaoficial/about/',
        period: '2021 - 2021',
        description: [
            'Delivered features across multiple client projects simultaneously — React, Vue, PHP, NestJS, and Adonis.js depending on the engagement',
            'Worked across 5+ database systems (MySQL, PostgreSQL, MongoDB, SQL Server) adapting to each project\'s architecture',
            'Agency environment: tight deadlines, diverse codebases, rapid context-switching — built the adaptability that defined my career since',
        ],
        iconType: 'work',
    },
];
