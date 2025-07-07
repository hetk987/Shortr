export interface ShortLink {
    alias: string;
    url: string;
    count: number;
    createdAt: string;
}

export interface CreateLinkRequest {
    alias: string;
    url: string;
}

export interface BulkLinkRequest {
    links: CreateLinkRequest[];
}

export interface BulkLinkResponse {
    created: ShortLink[];
    errors: Array<{ alias: string; error: string }>;
    summary: {
        total: number;
        created: number;
        failed: number;
    };
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export type SortOption =
    | 'createdAt-desc'
    | 'createdAt-asc'
    | 'count-desc'
    | 'count-asc'
    | 'alias-asc'; 