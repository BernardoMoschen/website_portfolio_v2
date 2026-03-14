import { FaLock, FaCode } from 'react-icons/fa';

export const projectTypeMap = {
    professional: { label: 'Professional', color: 'var(--color-secondary)', bg: 'rgba(255,138,80,0.12)', Icon: FaLock },
    personal: { label: 'Open Source', color: 'var(--color-primary)', bg: 'rgba(127,176,105,0.12)', Icon: FaCode },
} as const;
