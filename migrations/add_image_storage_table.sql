-- Store uploaded images as binary in database (persists across deploys, no filesystem dependency)
-- Run this in phpMyAdmin or: mysql -u root -p RET_Database < migrations/add_image_storage_table.sql

CREATE TABLE IF NOT EXISTS `image_storage` (
  `id` varchar(191) NOT NULL,
  `data` mediumblob NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
