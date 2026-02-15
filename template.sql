-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2026 at 09:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `template`
--

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `name`, `link`) VALUES
(1, 'Cleaning Service', 'https://demosites.royal-elementor-addons.com/cleaning-v1/?ref=rea-plugin-backend-templates'),
(2, 'Dev Portfolio', 'https://demosites.royal-elementor-addons.com/developer-portfolio-v1/?ref=rea-plugin-backend-template'),
(3, 'Shop Wooshop', 'https://demosites.royal-elementor-addons.com/shop-wooshop-v2/?ref=rea-plugin-backend-templates'),
(4, 'LP Digital Product', 'https://demosites.royal-elementor-addons.com/landing-page-digital-product-v1/?ref=rea-plugin-backend-templates'),
(5, 'Financial Services', 'https://demosites.royal-elementor-addons.com/financial-services-v1/?ref=rea-plugin-backend-templates'),
(6, 'One Page', 'https://demosites.royal-elementor-addons.com/one-page-v2/?ref=rea-plugin-backend-templates'),
(7, 'Car Repair', 'https://demosites.royal-elementor-addons.com/car-repair-v1/?ref=rea-plugin-backend-templates'),
(8, 'Fitness Gym', 'https://demosites.royal-elementor-addons.com/fitness-gym-v1/?ref=rea-plugin-backend-templates'),
(9, 'LP Investment Platform', 'https://demosites.royal-elementor-addons.com/landing-page-investment-platform-v1/?ref=rea-plugin-backend-templates'),
(10, 'Online Course', 'https://demosites.royal-elementor-addons.com/online-course-v1/?ref=rea-plugin-backend-templates'),
(11, 'Dental', 'https://demosites.royal-elementor-addons.com/dental-v1/?ref=rea-plugin-backend-templates'),
(12, 'Lawyer', 'https://demosites.royal-elementor-addons.com/lawyer-v1/?ref=rea-plugin-backend-templates'),
(13, 'Restaurant', 'https://demosites.royal-elementor-addons.com/restaurant-v1/?ref=rea-plugin-backend-templates'),
(14, 'Construction Company', 'https://demosites.royal-elementor-addons.com/construction-v1/?ref=rea-plugin-backend-templates'),
(15, 'Hotel Booking', 'https://demosites.royal-elementor-addons.com/hotel-v1/?ref=rea-plugin-backend-templates'),
(16, 'Travel Agency', 'https://demosites.royal-elementor-addons.com/travel-v1/?ref=rea-plugin-backend-templates');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
