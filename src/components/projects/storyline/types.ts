export type StorylineBlock =
    | { kind: 'heading'; text: string; level?: 2 | 3 }
    | { kind: 'paragraph'; text: string; align?: 'left' | 'center' }
    | { kind: 'code'; code: string; lang?: string; caption?: string }
    | { kind: 'countUp'; to: number; from?: number; suffix?: string; prefix?: string; label: string }
    | {
          kind: 'metrics';
          items: Array<{ to: number; from?: number; suffix?: string; prefix?: string; label: string }>;
      }
    | { kind: 'beforeAfter'; before: string; after: string; alt: string; height?: number }
    | { kind: 'pin'; heading: string; body?: string; height?: '150vh' | '200vh' | '250vh' };
