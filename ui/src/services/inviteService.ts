import { InviteOut } from '../types/invite';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

function transformInvite(invite: any): InviteOut {
    return {
        email: invite.email,
        role: invite.role,
        id: invite.id,
        token: invite.token,
        event: {
            id: invite.event?.id ?? 0,
            title: invite.event?.title ?? '',
            description: invite.event?.description ?? '',
            hostName: invite.event?.host_name ?? '',
        },
    };
}

async function fetchInvitesFromEndpoint(
    endpoint: string
): Promise<InviteOut[]> {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch invites');
        const data = await response.json();
        return data.map(transformInvite);
    } catch (error) {
        console.error(
            `Error in fetchInvitesFromEndpoint (${endpoint}):`,
            error
        );
        throw error;
    }
}

export async function fetchAllInvites(): Promise<InviteOut[]> {
    return fetchInvitesFromEndpoint('/api/invites');
}

export async function fetchPendingInvites(): Promise<InviteOut[]> {
    return fetchInvitesFromEndpoint('/api/invites/pending');
}

export async function respondToInvite(
    token: string,
    status: 'accepted' | 'declined'
): Promise<void> {
    try {
        const response = await fetch(`${baseUrl}/api/invites/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to respond to invite: ${errorText}`);
        }
    } catch (error) {
        console.error('Error in respondToInvite:', error);
        throw error;
    }
}
