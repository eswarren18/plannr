import { SignUpRequest, UserRequest, UserResponse } from '../types/user';

export const baseUrl = import.meta.env.VITE_API_URL;
if (!baseUrl) {
    throw new Error('VITE_API_URL was not defined');
}

export async function authenticate(): Promise<UserResponse | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/users/me`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return new Error('Not logged in');
        }
        // Transform Response object to JSON
        const data = await response.json();

        // Transform snake_case to camelCase
        const user: UserResponse = {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            isRegistered: data.isRegistered ?? true,
        };
        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error('Something unknown happened.');
    }
}

export async function signin(
    userRequest: UserRequest
): Promise<UserResponse | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/auth/signin`, {
            method: 'POST',
            body: JSON.stringify(userRequest),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Set default error message
            let errorMsg = 'Incorrect email or password';
            try {
                const errorData = await response.json();
                if (errorData.detail) errorMsg = errorData.detail;
            } catch {
                // fallback to default
            }
            return new Error(errorMsg);
        }

        // Transform response object to JSON
        const data = await response.json();

        // Transform snake_case to camelCase
        const user: UserResponse = {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            isRegistered: data.isRegistered ?? true,
        };
        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error('Something unknown happened.');
    }
}

export async function signout(): Promise<void | Error> {
    const url = `${baseUrl}/api/auth/signout`;
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) {
            throw new Error('Failed to logout');
        }
    } catch (error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error('Something Unknown Happened');
    }
}

export async function signup(
    signUpRequest: SignUpRequest
): Promise<UserResponse | Error> {
    try {
        // Transform camelCase to snake_case for backend
        const payload = {
            email: signUpRequest.email,
            password: signUpRequest.password,
            first_name: signUpRequest.firstName,
            last_name: signUpRequest.lastName,
        };

        // Send signup request to backend
        const response = await fetch(`${baseUrl}/api/users/`, {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error("Couldn't sign up");
        }

        // Transform response object to JSON
        const data = await response.json();

        // Transform snake_case to camelCase
        const user: UserResponse = {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            isRegistered: data.isRegistered ?? true,
        };

        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error('Something unknown happened.');
    }
}
