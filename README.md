### Database Setup for Development
1. Install Prisma: `npm install -D prisma`
2. Generate Prisma Client: `npx prisma generate`
3. Run Database Migration: `npx prisma migrate dev --name init`
4. Access Prisma Studio: `npx prisma studio` (for easy DB inspection)
5. Connect your SQLite DB at `prisma/dev.db`