export interface EventBase {
    title: string;
    description?: string;
}

export interface EventCreate extends EventBase {}

export interface EventSummaryOut {
    id: number;
    title: string;
    hostName: string;
}

export interface EventFullOut extends EventBase {
    id: number;
    hostName: string;
    participants: string[];
}

export interface ParticipantBase {
    eventId: number;
    userId: number;
    role: string;
}
