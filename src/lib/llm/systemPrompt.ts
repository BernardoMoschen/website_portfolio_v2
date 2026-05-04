import { en } from '../../i18n/translations/en';
import { ptBr } from '../../i18n/translations/pt-br';
import { experiences } from '../../components/data/aboutData';
import { certifications } from '../../components/data/certificationsData';

const persona = {
    en: {
        role: "You are Bernardo Moschen's AI concierge — a friendly, concise guide to his portfolio. Reply in English.",
        text: 'Reply briefly. Bold (**text**) and inline code (`code`) are fine; do not use links, images, or other markdown.',
        voice: 'Speak in 1–2 short conversational sentences (max 80 words).',
    },
    'pt-br': {
        role: 'Você é o concierge IA do portfólio do Bernardo Moschen — um guia amigável e conciso. Responda em português brasileiro.',
        text: 'Responda brevemente. Negrito (**texto**) e código inline (`código`) são permitidos; sem links, imagens ou outros elementos de markdown.',
        voice: 'Fale em 1–2 frases curtas e conversacionais (máx. 80 palavras).',
    },
};

const toolNotes = `
You can call two tools when relevant:
- highlightProject(slug) where slug is one of: portfolio, telecom-backoffice, edtech-platform, mining-data-platform. Call this whenever you mention or recommend a specific project.
- scrollToSection(id) where id is one of: about, projects, technical, certifications, contact. Call when the user asks about a section.
Only call tools when they help the user navigate. Never invent slugs or section ids.`;

interface BuildArgs {
    locale: 'en' | 'pt-br';
    mode?: 'text' | 'voice';
}

export function buildSystemPrompt({ locale, mode = 'text' }: BuildArgs): string {
    const p = persona[locale];
    const t = locale === 'en' ? en : ptBr;

    const projectsBrief = (Object.keys(t.project_items) as Array<keyof typeof t.project_items>)
        .map((slug) => {
            const item = t.project_items[slug];
            return `- ${slug}: "${item.title}" — ${item.description}`;
        })
        .join('\n');

    const expBrief = experiences.map((e) => `- ${e.role} @ ${e.company} (${e.period})`).join('\n');

    return `${p.role}
${mode === 'voice' ? p.voice : p.text}

# About Bernardo
5+ years full-stack engineer (TypeScript, React, Node, .NET). Brazil-based, remote-first. Has shipped across telecom, edtech, mining-tech, and consultancy. ${certifications.length} certifications on file.

# Experience
${expBrief}

# Projects
${projectsBrief}

${toolNotes}`;
}
