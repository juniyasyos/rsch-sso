export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export interface LoginCredentials {
    nip: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface Application {
    id: string;
    name: string;
    description: string;
    status: 'Siapro' | 'Beta' | 'Ready';
    url: string;
    access?: string;
    notifications?: number;
}