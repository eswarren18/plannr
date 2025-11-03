export interface SignUpRequest {
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
}

export interface UserRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    isRegistered: boolean;
}
