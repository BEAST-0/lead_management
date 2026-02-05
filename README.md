# Lead Management API

This is a simple NestJS + TypeORM (Postgres) project for managing services, leads, users, roles, and permissions.

## Quick run

```bash
npm install
npm run seed
npm run start:dev
```

## Seeded logins

These are created by `src/database/seeds/initial-data.seed.ts`:

- Admin: `admin@test.com` / `Admin@123`
- Sales: `sales@test.com` / `Sales@123`
- Viewer: `viewer@test.com` / `Viewer@123`

## Handy scripts

- `npm run seed` — run the seed
- `npm run start:dev` — start in watch mode
- `npm run start` — normal start
