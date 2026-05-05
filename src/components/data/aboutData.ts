export interface Technology {
    name: string;
    iconColor: string;
    iconType: 'react' | 'typescript' | 'mui' | 'jest' | 'nextjs' | 'nodejs' | 'csharp' | 'dotnet' | 'graphql' | 'postgresql' | 'aws' | 'sonarqube' | 'server' | 'database' | 'vue' | 'php' | 'mysql' | 'mongodb' | 'zapier' | 'strapi' | 'webflow' | 'zendesk' | 'sequelize' | 'mssql' | 'typeorm' | 'adonis' | 'nestjs' | 'docker' | 'express' | 'prisma' | 'astro' | 'tailwind' | 'redux' | 'recoil' | 'webpack' | 'sass' | 'linux' | 'html' | 'css' | 'git' | 'swagger' | 'spa' | 'rest' | 'solid' | 'scrum' | 'microservices' | 'javascript' | 'ethereum' | 'web3' | 'ipfs' | 'thegraph' | 'thirdweb' | 'alchemy' | 'berachain' | 'erc20' | 'smartcontract' | 'stripe' | 'shopify' | 'auth0' | 'anthropic';
    featured?: boolean;
}

export interface TechnicalArea {
    category: string;
    iconType: 'devices' | 'storage' | 'cloud' | 'blockchain';
    technologies: Technology[];
    description?: string;
    descriptionHighlight?: string;
}

export interface Experience {
    role: string;
    company: string;
    companyUrl: string;
    period: string;
    description?: string[];
    projectSlugs?: string[];
    iconType: 'work';
    allocatedVia?: {
        company: string;
        companyUrl: string;
    };
}

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
            { name: 'Anthropic API', iconColor: '#D97757', iconType: 'anthropic' },
            { name: 'PHP', iconColor: '#777BB4', iconType: 'php' },
            { name: '.NET', iconColor: '#512BD4', iconType: 'dotnet' },
            { name: 'C#', iconColor: '#239120', iconType: 'csharp', },

        ],
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
            { name: 'Stripe', iconColor: '#635BFF', iconType: 'stripe', featured: true },
            { name: 'Shopify', iconColor: '#7AB55C', iconType: 'shopify', featured: true },
            { name: 'Auth0', iconColor: '#EB5424', iconType: 'auth0' },
            { name: 'SOLID', iconColor: '#4285F4', iconType: 'solid' },
        ],
    },
    {
        category: 'Web3 & Blockchain',
        iconType: 'blockchain',
        technologies: [
            { name: 'Smart Contract Integration', iconColor: '#627EEA', iconType: 'smartcontract', featured: true },
            { name: 'EVM', iconColor: '#627EEA', iconType: 'ethereum', featured: true },
            { name: 'Berachain', iconColor: '#814625', iconType: 'berachain', featured: true },
            { name: 'ThirdWeb', iconColor: '#F213A4', iconType: 'thirdweb', featured: true },
            { name: 'Alchemy', iconColor: '#0C0C0E', iconType: 'alchemy', featured: true },
            { name: 'Subgraphs (Goldsky)', iconColor: '#6747ED', iconType: 'thegraph' },
            { name: 'IPFS', iconColor: '#65C2CB', iconType: 'ipfs' },
            { name: 'ERC20', iconColor: '#627EEA', iconType: 'erc20' },
            { name: 'Web3.js', iconColor: '#F16822', iconType: 'web3' },
        ],
    },
];

const metaItConsultant = {
    company: 'Meta IT',
    companyUrl: 'https://www.linkedin.com/company/metaoficial/about/',
};

export const experiences: Experience[] = [
    {
        role: 'Senior Full Stack Engineer',
        company: 'Frequency Advisors',
        companyUrl: 'https://www.linkedin.com/company/frequency-advisors',
        period: '2025 - Present',
        iconType: 'work',
        allocatedVia: metaItConsultant,
    },
    {
        role: 'Senior Full Stack Engineer',
        company: 'Paradise Mobile',
        companyUrl: 'https://www.linkedin.com/company/paradise-mobile/about',
        period: '2023 - 2025',
        projectSlugs: ['telecom-backoffice'],
        iconType: 'work',
        allocatedVia: metaItConsultant,
    },
    {
        role: 'Mid-level Full Stack Engineer',
        company: 'Grupo Tiradentes',
        companyUrl: 'https://www.linkedin.com/company/grupo-tiradentes/about',
        period: '2022 - 2023',
        projectSlugs: ['edtech-platform'],
        iconType: 'work',
        allocatedVia: metaItConsultant,
    },
    {
        role: 'Mid-level Full Stack Engineer',
        company: 'ArcelorMittal Mines Canada',
        companyUrl: 'https://www.linkedin.com/company/arcelormittal/about',
        period: '2021 - 2022',
        projectSlugs: ['mining-data-platform'],
        iconType: 'work',
        allocatedVia: metaItConsultant,
    },
    {
        role: 'Full Stack Engineer',
        company: 'Meta IT',
        companyUrl: 'https://www.linkedin.com/company/metaoficial/about/',
        period: '2021 - Present',
        iconType: 'work',
    },
];
