import api from './api';
import type { Application } from '../types';

export interface ApplicationRoleResponse {
    id: number;
    slug: string;
    name: string;
    description?: string;
}

export interface ApplicationInProfile {
    id: number;
    app_key: string;
    name: string;
    description?: string;
    enabled: boolean;
    logo_url?: string;
    app_url?: string;
    redirect_uris?: string[];
    role: ApplicationRoleResponse;
}

export interface AccessProfileResponse {
    id: number;
    slug: string;
    name: string;
    description?: string;
    is_system: boolean;
    is_active: boolean;
    applications_count: number;
    applications: ApplicationInProfile[];
}

export interface AccessProfilesApiResponse {
    access_profiles: AccessProfileResponse[];
    total_profiles: number;
    total_accessible_apps: number;
    timestamp: string;
}

export const dashboardService = {
    async getApplicationsByProfile(): Promise<AccessProfileResponse[]> {
        const response = await api.get<AccessProfilesApiResponse>('/api/users/applications');
        return response.data.access_profiles;
    },
};