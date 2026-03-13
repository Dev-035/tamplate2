-- Database Setup for Template Showcase
-- This file creates the database and table structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `template` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `template`;

-- Create templates table
CREATE TABLE IF NOT EXISTS `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `link` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample templates (optional - you can remove these if you want to start fresh)
INSERT INTO `templates` (`name`, `link`) VALUES
('Modern Portfolio', 'https://example.com/portfolio'),
('Business Website', 'https://example.com/business'),
('E-commerce Store', 'https://example.com/shop');

-- Note: After importing this file, you can add your own templates through the "Add Template" page
