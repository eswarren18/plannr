export interface EventBase {
    title: string;
    description?: string;
}

export interface EventCreate extends EventBase {}

export interface EventOut extends EventBase {
    id: number;
    hostId: number;
}

export interface ParticipantBase {
    eventId: number;
    userId: number;
    role: string;
}

export interface InviteBase {
    email: string;
    role: string;
}

export interface InviteCreate extends InviteBase {}

export interface InviteStatusUpdate {
    status: string;
}

export interface InviteOut extends InviteBase {
    id: number;
}
