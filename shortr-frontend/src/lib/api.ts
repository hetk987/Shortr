import axios from 'axios';
import { ShortLink, CreateLinkRequest, BulkLinkRequest, BulkLinkResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API functions
export const linksApi = {
    // Get all links
    getAll: () => api.get<ShortLink[]>('/api/links').then(res => res.data),

    // Create a new link
    create: (data: CreateLinkRequest) => api.post<ShortLink>('/api/links', data).then(res => res.data),

    // Bulk create links
    bulkCreate: (data: BulkLinkRequest) => api.post<BulkLinkResponse>('/api/links/bulk', data).then(res => res.data),

    // Update a link
    update: (alias: string, url: string) => api.put<ShortLink>(`/api/links/${alias}`, { url }).then(res => res.data),

    // Delete a link
    delete: (alias: string) => api.delete<{ message: string }>(`/api/links/${alias}`).then(res => res.data),
}; 