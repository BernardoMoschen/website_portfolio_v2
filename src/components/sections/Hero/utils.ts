export const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const navbarHeight = window.innerWidth < 900 ? 64 : 72; // Match Toolbar heights
        const additionalOffset = 24;
        const totalOffset = navbarHeight + additionalOffset;

        // CinematicSection content fades in between progress 0 and 0.12.
        // Scroll past the fade-in zone so content is fully visible on arrival.
        const sectionScroll = element.scrollHeight - window.innerHeight;
        const fadeInOffset = sectionScroll > 0 ? sectionScroll * 0.15 : 0;

        const elementPosition = element.offsetTop - totalOffset + fadeInOffset;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

export const PERSONAL_INFO = {
    name: 'Bernardo Moschen',
    title: 'Full Stack Engineer',
    description: `I've shipped products across 3 countries — from Brazilian edtech serving thousands of students to Canadian mining infrastructure processing real-time sensor data. I build the systems that make businesses actually work, mostly with TypeScript, React, and Node.js.`,
    profileImage: '/profile-photo.webp',
    initials: 'BM',
    skills: [
        'React', 'Node.js', 'TypeScript', 'Material UI',
        'Astro', 'Vite', 'Tailwind CSS', 'MongoDB', 'PostgreSQL'
    ],
    social: {
        github: 'https://github.com/bernardoMoschen',
        linkedin: 'https://linkedin.com/in/bernardomoschen',
    }
} as const;
