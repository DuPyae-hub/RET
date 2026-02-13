# RET Business Group Website - Foundation

**This is the foundational codebase for Royal Ever True (RET) Business Group** - a modern, scalable corporate website platform designed as the foundation for future expansion and growth.

Professional corporate website for Royal Ever True (RET) Business Group and its subsidiaries, featuring a unified project management system, modern UI/UX design, and comprehensive admin tools.

## Features

### Client-Facing Pages
- **Group Landing Page**: Overview of RET Business Group with History, Mission, Vision, Legal Documents, and Organizational Structure
- **RET Advertising**: Portfolio showcase with category filtering (Nationwide Merchandising, Event Management, Building Paint Branding, Vehicle Branding, Signage)
- **Million Zone**: Construction and infrastructure services with project status tracking (Ongoing/Finished)
- **NL Truth**: Distribution and logistics services (Telecom, Online Money, FMCG)
- **Agricultural Friends**: Agricultural services overview

### Admin Dashboard
- **Project Management**: 
  - Upload and manage portfolio projects with photos and descriptions
  - Status tracking (Ongoing, Finished, Unknown) for all subsidiaries
  - Category management for RET Advertising projects
  - Image preservation when editing (no need to re-upload)
- **Client Management**: Categorize and manage client logos (Contract, Campaign, Sector Clients)
- **Legal Documents**: Upload and manage certificates, licenses, and legal documents
- **Site Settings**: Update corporate information including Mission, Vision, History, Core Values, Attitude, and Organization Chart

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** (Neon or any Postgres; previously MySQL)
- **pg** (Node.js PostgreSQL client; raw SQL with named-param style)
- **React Hook Form** (for forms)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- **PostgreSQL** (e.g. [Neon](https://neon.tech) – serverless Postgres) or any Postgres 14+
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Neon or any PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```
For Neon: create a project at [neon.tech](https://neon.tech), copy the connection string, and set `DATABASE_URL`.

3. Create the database tables.

**Option A – Neon / PostgreSQL:** Run the schema in Neon’s SQL Editor (or `psql $DATABASE_URL -f migrations/neon_postgres_schema.sql`):

See `migrations/neon_postgres_schema.sql`. Paste its contents into Neon SQL Editor and run it (or: `psql $DATABASE_URL -f migrations/neon_postgres_schema.sql`).
```

**Option B – Prisma only:** If you use Prisma to create tables, run `npx prisma db push`. Note: `image_storage` and full schema are in `migrations/neon_postgres_schema.sql`.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard pages
│   ├── ret-advertising/  # RET Advertising subsidiary page
│   ├── million-zone/     # Million Zone subsidiary page
│   ├── nl-truth/         # NL Truth subsidiary page
│   ├── agricultural-friends/ # Agricultural Friends subsidiary page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utility libraries
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

- **Project**: Portfolio projects with categories, subsidiaries, and status (ongoing/finished/unknown)
- **Client**: Client logos with categories (Contract, Campaign, Sector)
- **site_settings**: Key-value settings for Mission, Vision, History, Core Values, Attitude, Organization Chart
- **LegalDocument**: Legal documents and certificates
- **ConstructionProject**: Construction projects with status and location

### Migration: Adding Status Column

If you have an existing database, run this migration to add the `status` column to the Project table:

```sql
ALTER TABLE `Project` 
ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'unknown' 
AFTER `subsidiary`;

UPDATE `Project` SET `status` = 'unknown' WHERE `status` IS NULL;
```

See `migrations/add_status_to_project.sql` for the migration script.

## Admin Access

Navigate to `/admin` to access the admin dashboard. In production, you should add authentication (e.g., NextAuth.js) to protect admin routes.

## Image Management

Images are stored in the database (no filesystem or external service needed). This ensures they persist across deploys.

1. Run the image storage migration in phpMyAdmin → SQL tab:
```sql
CREATE TABLE IF NOT EXISTS `image_storage` (
  `id` varchar(191) NOT NULL,
  `data` mediumblob NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

2. New uploads are saved to `image_storage` and served from `/api/image/{id}`.
3. Existing URLs (`/uploads/...`, `/images/...`, external URLs) continue to work as before.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to platforms like Vercel, which has excellent Next.js support.

## Foundation Features

### Modern UI/UX Design
- **Minimalistic Design**: Clean, professional interface with smooth animations
- **Scroll Animations**: Content reveals on scroll for better user engagement
- **Responsive Layout**: Fully responsive design for all device sizes
- **Optimized Hover Effects**: Enhanced interactivity with smooth transitions
- **Status Badges**: Visual status indicators (Ongoing/Finished/Unknown) on project cards

### Unified Project System
- **Status Tracking**: All projects across all subsidiaries support status (ongoing, finished, unknown)
- **Category Management**: RET Advertising projects use categories; other subsidiaries use status
- **Image Management**: Smart image handling - preserves existing images when editing
- **Flexible Structure**: Easy to add new subsidiaries or modify existing ones

### Design System
- **Color Palette**: 
  - Primary (Golden Yellow): #FFD700
  - Secondary (Green): #32CD32
  - Accent (Dark Blue): #00008B
- **Typography**: Inter font family
- **Components**: Reusable card components, animations, and layouts

## Notes

- All images use placeholder URLs initially. Replace with actual project images and client logos.
- Legal documents can be added through the admin panel.
- The office address is set by default to: "No. 1168, Min Ye' Kyaw Swar Road, 6th Quarter, East Dagon Township, Yangon, Myanmar"
- Consider adding authentication for admin routes in production.
- This foundation is designed to be easily extensible for future features and subsidiaries.