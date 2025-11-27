export interface EventBase {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
}

export interface EventCreate extends EventBase {}

export interface EventOut extends EventBase {
    id: number;
    hostId: number;
    hostName: string;
}

export interface ParticipantBase {
    eventId: number;
    userId: number;
    role: string;
}
