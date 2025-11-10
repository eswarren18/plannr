export interface InviteBase {
    email: string;
    role: string;
}

export interface InviteCreate extends InviteBase {}

export interface EventSummary {
    id: number;
    title: string;
    description?: string | null;
    hostName?: string | null;
}

export interface InviteOut extends InviteBase {
    id: number;
    event: EventSummary;
    token: string;
}

export interface InviteStatusUpdate {
    status: string;
}
