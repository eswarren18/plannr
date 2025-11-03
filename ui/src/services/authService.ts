import { SignUpRequest, UserRequest, UserResponse } from '../types/user';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

export async function authenticate() {
    const url = `${baseUrl}/api/users/me`;
    try {
        const res = await fetch(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            return new Error('Not logged in');
        }
        const result = await res.json();

        // Transform snake_case to camelCase
        const user: UserResponse = {
            id: result.id,
            email: result.email,
            firstName: result.first_name,
            lastName: result.last_name,
            isRegistered: result.isRegistered ?? true,
        };
        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error('Something unknown happened.');
    }
}

export async function signup(signUpRequest: SignUpRequest) {
    const url = `${baseUrl}/api/users`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(signUpRequest),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error("Couldn't sign up");
        }
        const result: UserResponse = await res.json();

        if (typeof result.id !== 'number' || typeof result.email !== 'string') {
            throw new Error('Invalid user data');
        }

        return result;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        return new Error('Something unknown happened.');
    }
}

export async function signin(userRequest: UserRequest) {
    const url = `${baseUrl}/api/auth/signin`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(userRequest),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            // Set default error message
            let errorMsg = 'Incorrect email or password';
            try {
                const errorData = await res.json();
                if (errorData.detail) errorMsg = errorData.detail;
            } catch {
                // fallback to default
            }
            return new Error(errorMsg);
        }
        const result: UserResponse = await res.json();

        if (typeof result.id !== 'number' || typeof result.email !== 'string') {
            return new Error('Invalid user data');
        }
        return result;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        return new Error('Something unknown happened.');
    }
}

export async function signout() {
    const url = `${baseUrl}/api/auth/signout`;
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) {
            throw new Error('Failed to logout');
        }
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        return new Error('Something Unknown Happened');
    }
}
