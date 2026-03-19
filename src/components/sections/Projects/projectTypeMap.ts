import { FaLock, FaCode } from 'react-icons/fa';
import type { Translations } from '../../../i18n';

export const projectTypeConfig = {
    professional: { color: 'var(--color-secondary)', bg: 'rgba(255,138,80,0.12)', Icon: FaLock },
    personal: { color: 'var(--color-primary)', bg: 'rgba(127,176,105,0.12)', Icon: FaCode },
} as const;

export const getProjectTypeMap = (t: Translations) => ({
    professional: { ...projectTypeConfig.professional, label: t.projects.type_professional },
    personal: { ...projectTypeConfig.personal, label: t.projects.type_personal },
});
