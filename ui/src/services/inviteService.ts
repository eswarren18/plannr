import { InviteOut } from '../types/invite';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

export async function fetchInvites(): Promise<InviteOut[]> {
    try {
        const response = await fetch(`${baseUrl}/api/invites`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch invites');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const invites: InviteOut[] = data.map((event: any) => ({
            email: event.email,
            role: event.role,
            id: event.id,
            event: {
                id: event.event.id,
                title: event.event.title,
                description: event.event.description,
                hostName: event.event.host_name,
            },
        }));
        return invites;
    } catch (error) {
        console.error('Error in fetchInvites:', error);
        throw error;
    }
}
