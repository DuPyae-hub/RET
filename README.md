# RET Business Group Website

Professional corporate website for Royal Ever True (RET) Business Group and its subsidiaries.

## Features

### Client-Facing Pages
- **Group Landing Page**: Overview of RET Business Group with History, Legal Documents, and Organizational Structure
- **RET Advertising**: Portfolio showcase with 6 categories (Vehicle Branding, Signboards, Production, Merchandising, Events, CSR) and client logos
- **Million Zone**: Construction and infrastructure services with ongoing work gallery
- **Inner True**: Distribution and logistics services
- **Agricultural Friends**: Agricultural services overview

### Admin Dashboard
- **Project Management**: Upload and manage portfolio projects with photos and descriptions
- **Client Management**: Categorize and manage client logos (Contract, Campaign, Sector Clients)
- **Site Settings**: Update corporate information including Mission, Vision, History, and Office Address

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MySQL / MariaDB** (managed via phpMyAdmin)
- **mysql2** (direct SQL queries from the app)
- **React Hook Form** (for forms)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL database server running
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Option A (recommended): single connection string (works with MySQL/MariaDB + phpMyAdmin)
DATABASE_URL="mysql://root@127.0.0.1:3306/RET_Database"

# Option B: separate vars (used if DATABASE_URL is not set)
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="RET_Database"
```

3. Create the database tables (run in phpMyAdmin → SQL tab):

```sql
CREATE DATABASE IF NOT EXISTS `RET_Database`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `RET_Database`;

CREATE TABLE IF NOT EXISTS `Project` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(191) NOT NULL,
  `imageUrl` VARCHAR(512) NOT NULL,
  `subsidiary` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Client` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `logoUrl` VARCHAR(512) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `subsidiary` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL UNIQUE,
  `value` MEDIUMTEXT NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `LegalDocument` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `documentUrl` VARCHAR(512) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ConstructionProject` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(512) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `location` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

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
│   ├── inner-true/       # Inner True subsidiary page
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

- **Project**: Portfolio projects with categories and subsidiaries
- **Client**: Client logos with categories (Contract, Campaign, Sector)
- **site_settings**: Key-value settings for Mission, Vision, History, Address
- **LegalDocument**: Legal documents and certificates
- **ConstructionProject**: Ongoing construction projects

## Admin Access

Navigate to `/admin` to access the admin dashboard. In production, you should add authentication (e.g., NextAuth.js) to protect admin routes.

## Image Management

Currently, the system uses placeholder URLs or Cloudinary URLs. To enable image uploads:

1. Set up a Cloudinary account
2. Add Cloudinary credentials to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. Implement image upload functionality in the admin forms (can be added later)

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

## Notes

- All images use placeholder URLs initially. Replace with actual project images and client logos.
- Legal documents can be added through the admin panel (additional implementation needed).
- The office address is set by default to: "No. 5, Tha Pyay Shwe Htee Road, 10th Quarter, South Okkalapa, Yangon"
- Consider adding authentication for admin routes in production.
