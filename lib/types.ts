/**
 * XtraContext — Shared TypeScript Types
 * Zero `any` types. All shapes are strictly defined.
 */

import type { Plan, Role } from "@/generated/prisma/client";

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

// =============================================================================
// Sync API — Request / Response shapes
// =============================================================================

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
} as const satisfies Record<Plan, { maxProjects: number; maxTeamMembers: number; maxConversations: number }>;

