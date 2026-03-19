export interface MenuItem {
    label: string;
    href: string;
}

export const menuItems: MenuItem[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
];

export const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
        const navbarHeight = window.innerWidth < 900 ? 64 : 72; // Match Toolbar heights
        const additionalOffset = 24; // Extra breathing room
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

export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
