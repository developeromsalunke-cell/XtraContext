/**
 * XtraContext — Prisma CLI Configuration (Prisma 7+)
 * Centralizes datasource URL and migration config.
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
