interface BusEvents {
    highlightProject: { slug: string };
    scrollToSection: { id: string };
}

type EventName = keyof BusEvents;

class ConciergeBus {
    private target: EventTarget;

    constructor() {
        this.target = typeof EventTarget !== 'undefined' ? new EventTarget() : ({} as EventTarget);
    }

    emit<T extends EventName>(name: T, args: BusEvents[T]): void {
        if (typeof CustomEvent === 'undefined' || !this.target.dispatchEvent) return;
        this.target.dispatchEvent(new CustomEvent(name, { detail: args }));
    }

    on<T extends EventName>(name: T, handler: (args: BusEvents[T]) => void): () => void {
        const wrapped = (e: Event) => handler((e as CustomEvent<BusEvents[T]>).detail);
        this.target.addEventListener(name, wrapped);
        return () => this.target.removeEventListener(name, wrapped);
    }
}

export const conciergeBus = new ConciergeBus();
