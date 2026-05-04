import type { ChatMessage, Chunk } from './types';

const fixtures = {
    en: {
        portfolio:
            "This site! Built with Next.js, Three.js, and a custom design system — no UI library. Bernardo aimed for product-feel, not CV-feel. Check the storyline for the build details.",
        telecom:
            "Paradise Mobile — Bermuda's first cloud-native 5G operator. Bernardo built the digital platform: onboarding flows, CRM, back-office automation. ~10K customers served.",
        edtech:
            "Grupo Tiradentes — northeastern Brazil's largest higher-ed group. 50K+ students across 5 states. Bernardo built the unified enrollment platform on React + .NET.",
        mining:
            "ArcelorMittal Mines Canada — Bernardo led the operations platform for the world's largest open-pit iron ore mine. Real-time sensor merge, equipment tracking.",
        about:
            "Bernardo's a full-stack engineer with 5+ years across telecom, edtech, mining-tech, and consultancy. TypeScript, React, Node, .NET — he likes owning projects end-to-end.",
        skills:
            "React, TypeScript, Node, .NET, GraphQL, AWS, plus PostgreSQL, SQL Server, MongoDB. He cares about clean abstractions, pragmatic testing, and pixel-precise UI.",
        contact:
            "Easiest way: scroll to the contact section and drop a line. He replies within 24 hours.",
        fallback:
            "Hi! I'm Bernardo's concierge demo. I can show you projects (portfolio, telecom, edtech, mining), summarize his experience, or help you reach him. What sounds interesting?",
    },
    'pt-br': {
        portfolio:
            'Este site! Feito com Next.js, Three.js e design system próprio — sem biblioteca de UI. O Bernardo buscou cara de produto, não de currículo. Veja a storyline pra detalhes.',
        telecom:
            'Paradise Mobile — primeira operadora 5G cloud-native de Bermuda. O Bernardo construiu a plataforma digital: onboarding, CRM, automação de back-office. ~10K clientes.',
        edtech:
            'Grupo Tiradentes — maior grupo de ensino superior do Nordeste. 50K+ alunos em 5 estados. O Bernardo construiu a plataforma unificada de matrícula em React + .NET.',
        mining:
            'ArcelorMittal Mines Canada — o Bernardo liderou a plataforma de operações da maior mina de ferro a céu aberto do mundo. Fusão de sensores em tempo real.',
        about:
            'O Bernardo é full-stack engineer com 5+ anos em telecom, edtech, mineração e consultoria. TypeScript, React, Node, .NET — gosta de tocar projeto do início ao fim.',
        skills:
            'React, TypeScript, Node, .NET, GraphQL, AWS, mais PostgreSQL, SQL Server, MongoDB. Liga pra abstrações limpas, testes pragmáticos e UI no pixel.',
        contact:
            'Mais fácil: rola até a seção de contato e manda uma mensagem. Resposta em até 24 horas.',
        fallback:
            'Oi! Sou o concierge IA de demo do Bernardo. Posso te mostrar projetos (portfólio, telecom, edtech, mineração), resumir a experiência ou te ajudar a entrar em contato. O que te interessa?',
    },
};

const slugMap: Record<string, string> = {
    portfolio: 'portfolio',
    telecom: 'telecom-backoffice',
    edtech: 'edtech-platform',
    mining: 'mining-data-platform',
};

type Detection =
    | { kind: 'project'; key: keyof typeof slugMap }
    | { kind: 'about' | 'skills' | 'contact' | 'fallback' };

const detect = (input: string): Detection => {
    const lower = input.toLowerCase();
    for (const k of Object.keys(slugMap) as Array<keyof typeof slugMap>) {
        if (lower.includes(k)) return { kind: 'project', key: k };
    }
    if (
        lower.includes('about') ||
        lower.includes('sobre') ||
        lower.includes('experien') ||
        lower.includes('quem') ||
        lower.includes('career') ||
        lower.includes('carreira')
    ) {
        return { kind: 'about' };
    }
    if (
        lower.includes('skill') ||
        lower.includes('stack') ||
        lower.includes(' tech') ||
        lower.includes('habilidade') ||
        lower.includes('tecnologia')
    ) {
        return { kind: 'skills' };
    }
    if (
        lower.includes('contact') ||
        lower.includes('contato') ||
        lower.includes('reach') ||
        lower.includes('email') ||
        lower.includes('hire') ||
        lower.includes('contratar')
    ) {
        return { kind: 'contact' };
    }
    return { kind: 'fallback' };
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function* streamMock({
    messages,
    locale,
}: {
    messages: ChatMessage[];
    locale: 'en' | 'pt-br';
}): AsyncGenerator<Chunk> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const detection = detect(lastUser);
    const fxt = fixtures[locale];

    const reply: string =
        detection.kind === 'project'
            ? fxt[detection.key as keyof typeof fxt]
            : detection.kind === 'about'
              ? fxt.about
              : detection.kind === 'skills'
                ? fxt.skills
                : detection.kind === 'contact'
                  ? fxt.contact
                  : fxt.fallback;

    let toolEmitted = false;
    const total = reply.length;
    const step = 2;

    for (let i = 0; i < total; i += step) {
        yield { type: 'delta', text: reply.slice(i, i + step) };
        await sleep(28);

        if (!toolEmitted && i > total * 0.3) {
            toolEmitted = true;
            if (detection.kind === 'project') {
                yield {
                    type: 'tool',
                    name: 'highlightProject',
                    args: { slug: slugMap[detection.key] },
                };
            } else if (detection.kind === 'contact') {
                yield { type: 'tool', name: 'scrollToSection', args: { id: 'contact' } };
            } else if (detection.kind === 'about') {
                yield { type: 'tool', name: 'scrollToSection', args: { id: 'about' } };
            } else if (detection.kind === 'skills') {
                yield { type: 'tool', name: 'scrollToSection', args: { id: 'technical' } };
            }
        }
    }
}
