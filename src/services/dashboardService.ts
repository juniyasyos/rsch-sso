import api from './api';
import type { Application } from '../types';

export const dashboardService = {
    async getApplications(): Promise<Application[]> {
        const response = await api.get('/api/applications');
        return response.data;
    },
};