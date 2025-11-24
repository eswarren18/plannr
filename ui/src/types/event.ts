export interface EventBase {
    title: string;
    description?: string;
    hostId: number;
    startTime: string;
    endTime: string;
}

export interface EventCreate extends EventBase {}

export interface EventOut extends EventBase {
    id: number;
    hostName: string;
}

export interface ParticipantBase {
    eventId: number;
    userId: number;
    role: string;
}
