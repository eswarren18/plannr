export interface EventBase {
    title: string;
    description?: string;
}

export interface EventCreate extends EventBase {}

export interface EventSummaryOut extends EventBase {
    id: number;
    hostName: string;
}

export interface EventFullOut extends EventSummaryOut {
    participants: string[];
}

export interface ParticipantBase {
    eventId: number;
    userId: number;
    role: string;
}
