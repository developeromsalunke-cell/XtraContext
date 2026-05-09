/**
 * XtraContext — Role-Based Access Control (RBAC)
 * Guards route handlers by checking the authenticated user's role.
 */

import type { Role, AuthContext } from "@/lib/types";
import { ForbiddenError } from "@/lib/errors";

/**
 * Role hierarchy for permission checking.
 * Higher number = more permissions.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  DEVELOPER: 2,
  ADMIN: 3,
} as const;

/**
 * Assert that the authenticated user has one of the allowed roles.
 *
 * @param context - The authenticated user's context
 * @param allowedRoles - Roles that are permitted to access the resource
 * @throws ForbiddenError if the user's role is not in the allowed list
 */
export function requireRole(
  context: AuthContext,
  ...allowedRoles: readonly Role[]
): void {
  if (!allowedRoles.includes(context.role)) {
    throw new ForbiddenError(
      `Role '${context.role}' is not authorized. Required: ${allowedRoles.join(" or ")}`
    );
  }
}

/**
 * Assert that the authenticated user has at least the specified minimum role.
 *
 * @param context - The authenticated user's context
 * @param minimumRole - The minimum role required
 * @throws ForbiddenError if the user's role is below the minimum
 */
export function requireMinimumRole(
  context: AuthContext,
  minimumRole: Role
): void {
  if (ROLE_HIERARCHY[context.role] < ROLE_HIERARCHY[minimumRole]) {
    throw new ForbiddenError(
      `Role '${context.role}' does not meet minimum requirement of '${minimumRole}'`
    );
  }
}
