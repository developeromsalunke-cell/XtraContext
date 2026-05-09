/**
 * XtraContext — Typed API Error Classes
 * All errors produce structured JSON responses.
 */

import type { ApiErrorResponse } from "@/lib/types";

// =============================================================================
// Base API Error
// =============================================================================

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  toResponse(): Response {
    const body: ApiErrorResponse = {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
      },
    };
    return Response.json(body, { status: this.status });
  }
}

// =============================================================================
// Specific Error Types
// =============================================================================

export class AuthError extends ApiError {
  constructor(message = "Invalid or missing API key") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "AuthError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super("Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }

  override toResponse(): Response {
    const body: ApiErrorResponse = {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
      },
    };
    return Response.json(body, {
      status: this.status,
      headers: {
        "Retry-After": String(Math.ceil(this.retryAfterMs / 1000)),
      },
    });
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class PlanLimitError extends ApiError {
  constructor(message: string) {
    super(message, 403, "PLAN_LIMIT_EXCEEDED");
    this.name = "PlanLimitError";
  }
}

// =============================================================================
// Error Handler — Catch-all for route handlers
// =============================================================================

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  console.error("[XtraContext] Unhandled error:", error);

  const body: ApiErrorResponse = {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      status: 500,
    },
  };
  return Response.json(body, { status: 500 });
}
