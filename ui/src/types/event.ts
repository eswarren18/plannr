export interface EventBase {
    description?: string;
    endTime: string;
    startTime: string;
    title: string;
}

export interface EventCreate extends EventBase {}

export interface EventOut extends EventBase {
    hostId: number;
    hostName: string;
    id: number;
}

export interface ParticipantOut {
    participantName: string;
    role: string;
}
