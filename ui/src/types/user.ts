export interface UserBase {
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface SignUpRequest extends UserBase {
    password: string;
}

export interface UserRequest {
    email: string;
    password: string;
}

export interface UserResponse extends UserBase {
    id: number;
    isRegistered: boolean;
}
