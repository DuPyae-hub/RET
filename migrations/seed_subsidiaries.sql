-- Seed data for Subsidiary table
-- This will insert the 4 default subsidiaries or update them if they already exist

INSERT INTO `Subsidiary` (`id`, `name`, `path`, `description`, `imageUrl`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
('sub-001', 'RET Advertising', '/ret-advertising', 'Branding, production, and CSR services', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80', 1, NOW(3), NOW(3)),
('sub-002', 'Million Zone', '/million-zone', 'Construction, infrastructure, and rural electrification', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80', 2, NOW(3), NOW(3)),
('sub-003', 'Inner True', '/inner-true', 'Distribution and logistics (Telecom, Online Money, FMCG)', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80', 3, NOW(3), NOW(3)),
('sub-004', 'Agricultural Friends', '/agricultural-friends', 'General agricultural services', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop&q=80', 4, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `path` = VALUES(`path`),
  `description` = VALUES(`description`),
  `displayOrder` = VALUES(`displayOrder`),
  `updatedAt` = NOW(3);
