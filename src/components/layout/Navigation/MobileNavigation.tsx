import React from 'react';
import MobileMenuButton from './MobileMenuButton';
import MobileDrawer from './MobileDrawer';

interface MenuItem {
    label: string;
    href: string;
}

interface MobileNavigationProps {
    open: boolean;
    onToggle: () => void;
    onMenuClick: (sectionId: string) => void;
    activeSection: string;
    menuItems: MenuItem[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
    onToggle,
}) => {
    return (
        <MobileMenuButton onClick={onToggle} />
    );
};

/** Drawer rendered separately — must live outside <header> to escape its
 *  backdrop-filter stacking context so `position: fixed` works correctly. */
export const MobileNavigationDrawer: React.FC<MobileNavigationProps> = ({
    open,
    onToggle,
    onMenuClick,
    activeSection,
    menuItems,
}) => (
    <MobileDrawer
        open={open}
        onClose={onToggle}
        menuItems={menuItems}
        activeSection={activeSection}
        onMenuClick={onMenuClick}
    />
);

export default MobileNavigation;
