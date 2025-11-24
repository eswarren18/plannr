import { InviteCreate, InviteOut } from '../types/invite';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

export async function createInvite(
    eventId: number,
    inviteData: InviteCreate
): Promise<InviteOut | Error> {
    try {
        const response = await fetch(
            `${baseUrl}/api/events/${eventId}/invites`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inviteData),
                credentials: 'include',
            }
        );
        if (!response.ok) throw new Error('Failed to create invite');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const invite: InviteOut = {
            id: data.id,
            token: data.token,
            email: data.email,
            role: data.role,
            status: data.status,
            event: {
                id: data.event.id,
                title: data.event.title,
                description: data.event.description,
                hostName: data.event.host_name,
            },
        };
        return invite;
    } catch (error) {
        console.error('Error in createInvite:', error);
        return new Error('Could not create invite');
    }
}

export async function fetchInvites(
    status: 'pending' | 'accepted' | 'declined' | 'all',
    eventId?: number,
    userId?: number
): Promise<InviteOut[]> {
    try {
        // Build query string
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (eventId !== undefined) params.append('event_id', String(eventId));
        if (userId !== undefined) params.append('user_id', String(userId));
        const response = await fetch(
            `${baseUrl}/api/invites?${params.toString()}`,
            {
                credentials: 'include',
            }
        );
        if (!response.ok) throw new Error('Failed to fetch invites');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const invites: InviteOut[] = data.map((invite: any) => ({
            id: invite.id,
            token: invite.token ?? '',
            email: invite.email,
            role: invite.role,
            status: invite.status,
            event: {
                id: invite.event?.id ?? 0,
                title: invite.event?.title ?? '',
                description: invite.event?.description ?? '',
                hostName: invite.event?.host_name ?? '',
            },
        }));

        return invites;
    } catch (error) {
        console.error(`Error in fetchInvites (${status}):`, error);
        throw error;
    }
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
        const data = await response.json();

        // Transform snake_case to camelCase
        const invite: InviteOut = {
            id: data.id,
            token: data.token ?? '',
            email: data.email,
            role: data.role,
            status: data.status,
            event: {
                id: data.event?.id ?? 0,
                title: data.event?.title ?? '',
                description: data.event?.description ?? '',
                hostName: data.event?.host_name ?? '',
            },
        };

        return invite;
    } catch (error) {
        console.error('Error in respondToInvite:', error);
        throw error;
    }
}
