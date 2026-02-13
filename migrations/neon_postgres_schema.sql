-- Neon (PostgreSQL) schema for RET Business Group
-- Run this in Neon SQL Editor or: psql $DATABASE_URL -f migrations/neon_postgres_schema.sql
-- Tables use quoted identifiers to match Prisma/application (Client, Project, etc.)

-- site_settings (used by settings + organization chart)
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(191) PRIMARY KEY,
  "key" VARCHAR(191) NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- image_storage (file uploads; not in Prisma)
CREATE TABLE IF NOT EXISTS image_storage (
  id VARCHAR(191) PRIMARY KEY,
  data BYTEA NOT NULL,
  mime_type VARCHAR(255) NOT NULL
);

-- "Client"
CREATE TABLE IF NOT EXISTS "Client" (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "logoUrl" VARCHAR(512) NOT NULL,
  category VARCHAR(191) NOT NULL,
  subsidiary VARCHAR(191),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "Project"
CREATE TABLE IF NOT EXISTS "Project" (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(191) NOT NULL,
  "imageUrl" VARCHAR(512) NOT NULL,
  subsidiary VARCHAR(191),
  status VARCHAR(191) DEFAULT 'unknown',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "Subsidiary"
CREATE TABLE IF NOT EXISTS "Subsidiary" (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  path VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  "imageUrl" VARCHAR(512),
  "displayOrder" INT DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "LegalDocument"
CREATE TABLE IF NOT EXISTS "LegalDocument" (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "documentUrl" VARCHAR(512) NOT NULL,
  type VARCHAR(191) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "ConstructionProject"
CREATE TABLE IF NOT EXISTS "ConstructionProject" (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "imageUrl" VARCHAR(512) NOT NULL,
  status VARCHAR(191) NOT NULL,
  location VARCHAR(255),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "PageBanner"
CREATE TABLE IF NOT EXISTS "PageBanner" (
  id VARCHAR(191) PRIMARY KEY,
  "pageKey" VARCHAR(191) NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  "imageUrl" VARCHAR(512) NOT NULL,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "isActive" SMALLINT NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pagebanner_pagekey ON "PageBanner" ("pageKey");

-- Application sets "updatedAt" = NOW() in UPDATE statements
