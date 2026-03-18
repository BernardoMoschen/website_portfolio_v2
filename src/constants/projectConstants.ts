import type { Translations } from '../i18n';

export const statusConfig: Record<string, { color: string; bg: string }> = {
    completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    wip: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    planning: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

export const getStatusMap = (t: Translations): Record<string, { label: string; color: string; bg: string }> => ({
    completed: { ...statusConfig.completed, label: t.projects.status_completed },
    wip: { ...statusConfig.wip, label: t.projects.status_wip },
    planning: { ...statusConfig.planning, label: t.projects.status_planning },
});
