import { InviteOut } from '../types/invite';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

async function fetchInvitesFromEndpoint(
    endpoint: string
): Promise<InviteOut[]> {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch invites');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const invites: InviteOut[] = data.map((invite: any) => ({
            email: invite.email,
            role: invite.role,
            id: invite.id,
            token: invite.token ?? '',
            event: {
                id: invite.event?.id ?? 0,
                title: invite.event?.title ?? '',
                description: invite.event?.description ?? '',
                hostName: invite.event?.host_name ?? '',
            },
        }));

        return invites;
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
): Promise<InviteOut> {
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

        // Transform Response object to JSON
        const invite = await response.json();

        // Transform snake_case to camelCase
        return {
            email: invite.email,
            role: invite.role,
            id: invite.id,
            token: invite.token ?? '',
            event: {
                id: invite.event?.id ?? 0,
                title: invite.event?.title ?? '',
                description: invite.event?.description ?? '',
                hostName: invite.event?.host_name ?? '',
            },
        };
    } catch (error) {
        console.error('Error in respondToInvite:', error);
        throw error;
    }
}
