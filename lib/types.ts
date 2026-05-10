/**
 * XtraContext — Shared TypeScript Types
 * Zero `any` types. All shapes are strictly defined.
 */

export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type Role = "ADMIN" | "DEVELOPER" | "VIEWER";
export type AiModel = 
  | "GPT_4O" | "GPT_4_TURBO" | "GPT_4" | "GPT_3_5_TURBO" 
  | "CLAUDE_3_OPUS" | "CLAUDE_3_SONNET" | "CLAUDE_3_HAIKU" | "CLAUDE_2"
  | "GEMINI_PRO" | "GEMINI_ULTRA" | "LLAMA_3" | "MISTRAL_LARGE" | "OTHER";

// =============================================================================
// Auth Context — Returned after successful API key authentication
// =============================================================================

export interface AuthContext {
  readonly teamId: string;
  readonly teamPlan: Plan;
  readonly userId: string;
  readonly role: Role;
  readonly apiKeyId: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    status: number;
  };
}

// =============================================================================
// Sync API — Request / Response shapes
// =============================================================================

export interface RateLimitResult {
  readonly success: boolean;
  readonly remaining: number;
  readonly resetAt: number; // Timestamp in ms
}

/** POST /api/v1/sync — Request body */
export interface SyncPushPayload {
  readonly projectId: string;
  readonly content: string;
  readonly checksum: string;
}

/** POST /api/v1/sync — Success response */
export interface SyncPushResponse {
  readonly version: number;
  readonly checksum: string;
  readonly updatedAt: string; // ISO 8601
}

/** GET /api/v1/sync — Success response */
export interface SyncPullResponse {
  readonly version: number;
  readonly content: string;
  readonly checksum: string;
  readonly updatedAt: string; // ISO 8601
}

// =============================================================================
// Conversations API — Request / Response shapes
// =============================================================================

export interface MessagePayload {
  readonly role: "USER" | "ASSISTANT" | "SYSTEM" | "TOOL";
  readonly content: string;
  readonly tokens?: number;
  readonly cost?: number;
}

export interface LogConversationPayload {
  readonly projectId: string;
  readonly externalId?: string;
  readonly title: string;
  readonly platform: string;
  readonly model: string;
  readonly messages: MessagePayload[];
  readonly metadata?: {
    totalTokens?: number;
    totalCost?: number;
  };
}

export interface LogConversationResponse {
  readonly id: string;
  readonly externalId?: string;
  readonly messageCount: number;
  readonly status: "synced";
}

// =============================================================================
// Search API — Success response
// =============================================================================

export interface SearchMatch {
  readonly id: string;
  readonly role: string;
  readonly content: string;
  readonly createdAt: string;
}

export interface SearchResult {
  readonly conversation: {
    readonly id: string;
    readonly title: string;
    readonly platform: string;
    readonly model: string;
    readonly createdAt: string;
  };
  readonly matches: SearchMatch[];
}

export interface SearchResponse {
  readonly query: string;
  readonly results: SearchResult[];
  readonly count: number;
}

// =============================================================================
// Teams & Members
// =============================================================================

export interface TeamMember {
  readonly userId: string;
  readonly role: Role;
  readonly name?: string;
  readonly email?: string;
}

export interface Team {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly plan: Plan;
  readonly members: TeamMember[];
  readonly createdAt: Date;
}

// =============================================================================
// Task Management (Todos)
// =============================================================================

export interface Todo {
  readonly _id: string;
  readonly teamId: string;
  readonly projectId: string;
  readonly task: string;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Freemium Tier Limits
// =============================================================================

export const PLAN_LIMITS = {
  FREE: {
    maxProjects: 1,
    maxTeamMembers: 2,
    maxConversations: 100,
  },
  PRO: {
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxConversations: Infinity,
  },
  ENTERPRISE: {
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxConversations: Infinity,
  },
} as const satisfies Record<Plan, { maxProjects: number; maxTeamMembers: number; maxConversations: number }>;

