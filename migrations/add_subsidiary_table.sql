-- Create Subsidiary table
CREATE TABLE IF NOT EXISTS `Subsidiary` (
  `id` varchar(191) NOT NULL,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(512) DEFAULT NULL,
  `displayOrder` int DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default subsidiaries
INSERT INTO `Subsidiary` (`id`, `name`, `path`, `description`, `imageUrl`, `displayOrder`) VALUES
('sub-001', 'RET Advertising', '/ret-advertising', 'Branding, production, and CSR services', NULL, 1),
('sub-002', 'Million Zone', '/million-zone', 'Construction, infrastructure, and rural electrification', NULL, 2),
('sub-003', 'Inner True', '/inner-true', 'Distribution and logistics (Telecom, Online Money, FMCG)', NULL, 3),
('sub-004', 'Agricultural Friends', '/agricultural-friends', 'General agricultural services', NULL, 4)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
