-- Page banner table for per-page hero image carousels
-- Run this in phpMyAdmin or:
--   mysql -u root -p RET_Database < migrations/add_page_banner_table.sql

CREATE TABLE IF NOT EXISTS `PageBanner` (
  `id` varchar(191) NOT NULL,
  `pageKey` varchar(191) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `imageUrl` varchar(512) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_pageKey` (`pageKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

