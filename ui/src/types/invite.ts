import { EventOut } from './event';

export interface InviteBase {
    email: string;
    role: string;
}

export interface InviteCreate extends InviteBase {
    eventId: number;
}

export interface InviteOut extends InviteBase {
    event: EventOut;
    id: number;
    status: string;
    token: string;
    userName: string;
}

export interface InviteStatusUpdate {
    status: string;
}
