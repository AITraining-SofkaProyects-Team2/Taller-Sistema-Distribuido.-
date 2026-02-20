export enum TicketStatus {
    RECEIVED = 'RECEIVED',
    IN_PROGRESS = 'IN_PROGRESS'
}

export enum TicketPriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
    PENDING = 'PENDING'
}

export enum IncidentType {
    NO_SERVICE = 'NO_SERVICE',
    INTERMITTENT_SERVICE = 'INTERMITTENT_SERVICE',
    SLOW_CONNECTION = 'SLOW_CONNECTION',
    ROUTER_ISSUE = 'ROUTER_ISSUE',
    BILLING_QUESTION = 'BILLING_QUESTION',
    OTHER = 'OTHER'
}

export interface Ticket {
    ticketId: string;
    lineNumber: string;
    email: string;
    type: IncidentType;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    processedAt: string | null;
}

export interface PaginationMetadata {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
}

export interface TicketFilters {
    status?: TicketStatus | TicketStatus[];
    priority?: TicketPriority;
    type?: IncidentType;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
