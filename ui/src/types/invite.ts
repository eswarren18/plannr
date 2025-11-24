import { EventSummaryOut } from './event';

export interface InviteBase {
    email: string;
    role: string;
}

export interface InviteCreate extends InviteBase {}

export interface InviteOut extends InviteBase {
    id: number;
    token: string;
    user_name: string;
    status: string;
    event: EventSummaryOut;
}

export interface InviteStatusUpdate {
    status: string;
}
