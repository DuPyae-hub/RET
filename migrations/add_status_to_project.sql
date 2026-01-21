-- Migration: Add status column to Project table
-- Run this SQL script to add the status column to your existing Project table

ALTER TABLE `Project` 
ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'unknown' 
AFTER `subsidiary`;

-- Update existing records to have 'unknown' status if they are NULL
UPDATE `Project` SET `status` = 'unknown' WHERE `status` IS NULL;
