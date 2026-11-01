# NVDB Objektkatalog

A catalog of NVDB road object types showing which properties surveyors must register when delivering data to the county road department. Built on the NVDB Datakatalog API (v4).

Live: https://nvdb-objektkatalog.vercel.app

## Features

- Object types grouped into category 1, 2 and 3 data, with search and filters
- Properties with NVDB requirement level, the department's own delivery requirements and comments
- FKB registration flag with comment, measurement requirements, and mother/daughter relations
- Visitors see only relevant object types and properties; admins (Google login) can edit everything

## Stack

Next.js (App Router), TypeScript, TanStack Query, shadcn/ui, Tailwind CSS, Drizzle ORM, Neon Postgres, Better Auth. Hosted on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Fill in `.env.local` before migrating. See `.env.example` for the required variables.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate a migration from the schema |
| `npm run db:migrate` | Apply migrations to the database in `DATABASE_URL` |
| `npm run db:studio` | Open Drizzle Studio |
