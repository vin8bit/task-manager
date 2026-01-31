-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 31, 2026 at 04:05 PM
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
-- Database: `task_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in-progress','completed') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES
(3, 1, 'Complete project proposal', 'Finish writing the project proposal document', 'pending', 'high', '2026-02-02', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(4, 1, 'Prepare for client meeting', 'Gather all necessary documents and presentation materials', 'in-progress', 'high', '2026-02-01', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(5, 1, 'Update weekly report', 'Compile data and update the weekly progress report', 'pending', 'medium', '2026-02-03', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(6, 1, 'Team meeting preparation', 'Prepare agenda for the weekly team meeting', 'pending', 'medium', '2026-02-01', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(7, 1, 'Review code changes', 'Review pull requests from the development team', 'in-progress', 'medium', '2026-02-02', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(8, 1, 'Update project documentation', 'Add new features to the technical documentation', 'pending', 'medium', '2026-02-05', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(9, 1, 'Test new feature', 'Perform QA testing on the new user authentication feature', 'pending', 'medium', '2026-02-03', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(10, 1, 'Organize email inbox', 'Clean up and organize emails by category', 'pending', 'low', '2026-02-07', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(11, 1, 'Backup database', 'Create a backup of the production database', 'pending', 'low', '2026-02-10', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(12, 1, 'Update software licenses', 'Check and renew expiring software licenses', 'pending', 'low', '2026-02-14', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(13, 1, 'Setup development environment', 'Install and configure all necessary development tools', 'completed', 'medium', '2026-01-29', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(14, 1, 'Design database schema', 'Create ER diagram for the new application', 'completed', 'high', '2026-01-30', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(15, 1, 'Write API documentation', 'Document all REST API endpoints', 'completed', 'medium', '2026-01-28', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(16, 1, 'Fix login bug', 'Resolve the authentication issue reported by users', 'completed', 'high', '2026-01-30', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(17, 1, 'Setup CI/CD pipeline', 'Configure continuous integration and deployment', 'completed', 'medium', '2026-01-27', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(18, 1, 'Quarterly review meeting', 'Prepare presentation for quarterly performance review', 'pending', 'high', '2024-12-15', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(19, 1, 'Submit expense reports', 'Submit all pending travel and expense reports', 'in-progress', 'medium', '2026-02-02', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(20, 1, 'Learn new framework', 'Complete online course on React advanced features', 'pending', 'low', '2026-03-02', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(21, 1, 'Plan team building activity', 'Research and plan quarterly team building event', 'pending', 'low', '2026-02-21', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(22, 1, 'Update security policies', 'Review and update company security policies', 'in-progress', 'medium', '2026-02-07', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(23, 2, 'Write monthly newsletter', 'Create content for the monthly company newsletter', 'pending', 'medium', '2026-02-05', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(24, 2, 'Update website content', 'Refresh homepage content with latest products', 'in-progress', 'high', '2026-02-02', '2026-01-31 14:23:15', '2026-01-31 14:23:15'),
(25, 2, 'Social media planning', 'Plan next month social media posts', 'pending', 'low', '2026-02-10', '2026-01-31 14:23:15', '2026-01-31 14:23:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Vin', 'vin@gmail.com', '$2a$10$HVksbBFZcNQL0G3xTCfXF.DZ9Az1qAtUH5C8MlJSJOpJ0a4Y/rBFO', '2026-01-31 13:57:17', '2026-01-31 15:05:16'),
(2, 'Kiran', 'kiran@gmail.com', '$2a$10$YR216.jaluYBg5cA4brfuOBeSzIQfHsZzOypBGmqekhOxPNnfMUB.', '2026-01-31 14:22:51', '2026-01-31 14:22:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_status` (`user_id`,`status`),
  ADD KEY `idx_due_date` (`due_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
