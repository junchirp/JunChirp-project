import dotenv from 'dotenv';
import type { PrismaConfig } from 'prisma';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: '.env.development.local',
    quiet: true,
  });
}

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
} satisfies PrismaConfig;
