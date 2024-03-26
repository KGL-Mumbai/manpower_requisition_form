
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 17, 2023 at 08:17 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30
use mrf;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `MRF`
--

-- --------------------------------------------------------

--
-- Table structure for table `CandidateDetails`
--

CREATE TABLE `CandidateDetails` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `EmailId` varchar(100) NOT NULL,
  `ContactNo` varchar(50) NOT NULL,
  `ResumePath` text NOT NULL,
  `CandidateStatusId` int(11) NOT NULL,
  `ReviewedByEmployeeIds` varchar(50) NOT NULL,
  `SourceId` int(11) DEFAULT 0,
  `Reason` varchar(255) NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `CandidateDetails`
--

INSERT INTO `CandidateDetails` (`Id`, `MrfId`, `Name`, `EmailId`, `ContactNo`, `ResumePath`, `CandidateStatusId`, `ReviewedByEmployeeIds`,`SourceId`,`Reason`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 'Amita D', 'amita.dhamapurkar@gmail.com', '2147483647', 'resume1.pdf', 3, '1',1,  'Reason test',1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(2, 1, 'ramkrishna maurya', 'ramkrishna.maurya@gmail.com', '875765467', 'ramkrishna.pdf', 3, '2',2, 'Reason testg ',1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(3, 1, 'sujata pawar', 'sujata.pawar@gmail.com', '2147483647', 'sujata.pdf', 3, '5',3,'Reason rrt', 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(4, 2, 'alpesh patil', 'alpesh.patil@gmail.com', '875765467', 'alpesh.pdf', 3, '3',4,'Reason rt', 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(5, 2, 'gauravsingh rana', 'gauravsingh.rana@gmail.com', '2147483647', 'gauravsingh.pdf', 3, '6',5, 'Reason rtrt',1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(6, 3, 'jkl', 'manny.jah@gmail.com', '875765467', 'ramkrishna.pdf', 3, '4',1,'Reason rtrt', 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(7, 5, 'mno', 'ray.sin@gmail.com', '2147483647', 'ramkrishna.pdf', 3, '1',2, 'Reason rtrt',1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(8, 2, 'chris', 'manny.jah@gmail.com', '875765467', 'ramkrishna.pdf', 3, '7',6,'Reason rtr', 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `CandidateStatusMaster`
--

CREATE TABLE `CandidateStatusMaster` (
  `Id` int(11) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `CandidateStatusMaster`
--

INSERT INTO `CandidateStatusMaster` (`Id`, `Status`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES

(1, 'New', 1, 1, '2023-08-08 20:18:22', 1, '2023-08-08 20:18:22'),
(2, 'Shortlisted', 1, 1, '2023-08-08 20:18:22', 1, '2023-08-08 20:18:22'),
(3, 'Rejected', 1, 1, '2023-08-08 20:18:22', 1, '2023-08-08 20:18:22'),
(4, 'On Hold', 1, 1, '2023-08-08 20:18:22', 1, '2023-08-08 20:18:22');
-- --------------------------------------------------------

--
-- Table structure for table `DepartmentMaster`
--

CREATE TABLE `DepartmentMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `DepartmentMaster`
--

INSERT INTO `DepartmentMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Technology', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(2, 'Support', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(3, 'IT Services', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(4, 'HR', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(5, 'Admin', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(6, 'Marketing', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(7, 'Sales', 1, 1, '2023-08-06 16:45:42', 1, '2023-08-06 16:45:42'),
(8, 'Finance', 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22');



-- --------------------------------------------------------

--
-- Table structure for table `EmployeeDetails`
--

CREATE TABLE `EmployeeDetails` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(80) NOT NULL,
  `ContactNo` varchar(15) NOT NULL,
  `IsDeleted`  boolean default FALSE,
  `EmployeeCode` int NOT NULL,
  `IsAllowed` tinyint(1) NOT NULL,
  `AllowedByEmployeeId` int(11) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EmployeeDetails`
--

INSERT INTO `EmployeeDetails` (`Id`, `Name`, `Email`, `ContactNo`,`IsDeleted`,`EmployeeCode`, `IsAllowed`, `AllowedByEmployeeId`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Amita D', 'amita.dhamapurkar@kwglobal.com', '7865567886',0,41233, 1, 1, 1, '2023-08-07 23:00:42', 1, '2023-08-07 23:00:42'),
(2,  'ramkrishna maurya', 'ramkrishna.maurya@kwglobal.com', '6756764534',0,41234, 1, 1, 1, '2023-08-07 23:00:42', 1, '2023-08-07 23:00:42'),
(3, 'sujata pawar', 'sujata.pawar@kwglobal.com', '9876756456',0,41235, 1, 1, 1, '2023-08-07 23:00:42', 1, '2023-08-07 23:00:42'),
(4, 'alpesh patil', 'alpesh.patil@kwglobal.com', '7656865467',0,41236, 1, 1, 1, '2023-08-07 23:00:42', 1, '2023-08-07 23:00:42'),
(5, 'gauravsingh rana', 'gauravsingh.rana@kwglobal.com', '8662459752',0,41237, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(6, 'kritika gupta', 'kritika.gupta@kwglobal.com', '8911848218',0,41238, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(7, 'vaibhav chaudhari', 'vaibhav.chaudhari@kwglobal.com', '8756776654',0,41239, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(8, 'manish partey', 'manish.partey@kwglobal.com', '9410625151',0,41249, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(9, 'manotosh roy', 'manish.partey@kwglobal.com', '9660013618',0,41248, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(10, 'ashutosh.tiwari', 'ashutosh.tiwari@kwglobal.com', '9660013618',0,41247, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(11, 'jack md', 'amita.dhamapurkar@kwglobal.com', '9660013618',0,41246, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(12, 'John Ms', 'ramkrishna.maurya@kwglobal.com', '9660013618',0,41245, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(13, 'cathy Za', 'ramkrishna.maurya@kwglobal.com', '9660013618',0,41244, 1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(14, 'Queen ff', 'amita.dhamapurkar@kwglobal.com', '9660013618', 0,41243,1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(15, 'president', 'manish.partey@kwglobal.com', '9660013618', 0,4111,1, 1, 1, '2023-08-09 18:48:53', 1, '2023-08-09 18:48:53'),
(16, 'Riya Singh', 'riya.singh@kwglobal.com', '7656865467',0,47082, 1, 1, 1, '2023-08-07 23:00:42', 1, '2023-08-07 23:00:42');
-- --------------------------------------------------------

--
-- Table structure for table `EmployeeLoginDetails`
--

CREATE TABLE `EmployeeLoginDetails` (
  `Id` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `LoginDateTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EmployeeLoginDetails`
--

INSERT INTO `EmployeeLoginDetails` (`Id`, `EmployeeId`, `LoginDateTime`) VALUES
(1, 1, '2023-08-06 16:41:06'),
(2, 4, '2023-08-06 16:41:06'),
(3, 5, '2023-08-06 16:41:06'),
(4, 1, '2023-08-07 14:26:03'),
(5, 2, '2023-08-07 14:26:03'),
(6, 3, '2023-08-07 14:26:03'),
(7, 4, '2023-08-07 14:27:05'),
(8, 5, '2023-08-07 14:27:05'),
(9, 6, '2023-08-07 14:27:05'),
(10, 7, '2023-08-07 14:27:05'),
(11, 3, '2023-08-07 14:27:05'),
(12, 5, '2023-08-07 14:27:05'),
(13, 2, '2023-08-07 14:27:05');

-- --------------------------------------------------------

--
-- Table structure for table `EmployeeRoleMap`
--

CREATE TABLE `EmployeeRoleMap` (
  `Id` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `multipleRoleIds` varchar(30) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EmployeeRoleMap`
--

INSERT INTO `EmployeeRoleMap` (`Id`, `EmployeeId`, `RoleId`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`,`multipleRoleIds`) VALUES
(1, 1, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(2, 2, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5,6"),
(3, 3, 5, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(4, 4, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5,6"),
(5, 5, 6, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(6, 6, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5,6"),
(7, 7, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(8, 8, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5,6"),
(9, 9, 3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(10, 10, 4, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5"),
(11, 11, 7, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"8"),
(12, 12, 8, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"10"),
(13, 13, 9, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"8"),
(14, 14, 10, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"10"),
(15, 15, 11, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"11"),
(16, 16,3, 1, 1, '2023-08-07 17:46:26', 1, '2023-08-07 17:46:26',"3,4,5");

-- --------------------------------------------------------

--
-- Table structure for table `EmploymentTypeMaster`
--

CREATE TABLE `EmploymentTypeMaster` (
  `Id` int(11) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EmploymentTypeMaster`
--

INSERT INTO `EmploymentTypeMaster` (`Id`, `Type`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Trainee', 1, 1, '2023-08-06 17:01:30', 1, '2023-08-06 17:01:30'),
(2, 'On Probation', 1, 1, '2023-08-06 17:01:30', 1, '2023-08-06 17:01:30'),
(3, 'Contract', 1, 1, '2023-08-06 17:01:30', 1, '2023-08-06 17:01:30');

-- --------------------------------------------------------

--
-- Table structure for table `EvaluationFeedbackMaster`
--

CREATE TABLE `EvaluationFeedbackMaster` (
  `Id` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EvaluationFeedbackMaster`
--

INSERT INTO `EvaluationFeedbackMaster` (`Id`, `Description`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'SoftSkills', 1, 1, '2023-08-06 18:35:46', 1, '2023-08-06 18:35:46'),
(2, 'HardSkills', 1, 1, '2023-08-06 18:35:46', 1, '2023-08-06 18:35:46'),
(3, 'Required Training', 1, 1, '2023-08-06 18:35:46', 1, '2023-08-06 18:35:46');

-- --------------------------------------------------------

--
-- Table structure for table `EvaluationMaster`
--

CREATE TABLE `EvaluationMaster` (
  `Id` int(11) NOT NULL,
  `Type` varchar(80) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EvaluationMaster`
--

INSERT INTO `EvaluationMaster` (`Id`, `Type`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Assignment', 1, 1, '2023-08-07 14:27:05', 1, '2023-08-07 14:27:05'),
(2, 'Face To Face Interview', 1, 1, '2023-08-07 14:27:05', 1, '2023-08-07 14:27:05'),
(3, 'Coding Round', 1, 1, '2023-08-07 14:27:05', 1, '2023-08-07 14:27:05'),
(4, 'Aptitude Test', 1, 1, '2023-08-07 14:27:05', 1, '2023-08-07 14:27:05'),
(5, 'Telephonic Interview', 1, 1, '2023-08-07 14:27:05', 1, '2023-08-07 14:27:05'),
(6, 'Video Interview', 1, 1, '2023-08-14 14:36:01', 1, '2023-08-14 14:36:01');

-- --------------------------------------------------------

--
-- Table structure for table `EvaluationStatusMaster`
--

CREATE TABLE `EvaluationStatusMaster` (
  `Id` int(11) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EvaluationStatusMaster`
--

INSERT INTO `EvaluationStatusMaster` (`Id`, `Status`,`RoleId`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Assignment Sent',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(2, 'Assignment Received',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(3, 'Interview Scheduled',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(4, 'Interview Rescheduled',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(5, 'Interview Cancelled',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(6, 'Interview On Hold',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(7, 'Offer Rolledout',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(8, 'Offer Accepted',4, 1, 1, '2023-08-06 17:22:47', 1, 0),
(9, 'Offer accepted & did not joiin', 4,1, 1, '2023-08-08 21:46:52', 1, 0),
(10, 'Offer Rejected',4, 1, 1, '2023-08-08 21:46:52', 1, 0),
(11, 'Onboarded',4, 1, 1, '2023-08-08 21:51:49', 1, 0),
(12, 'Assignment  Shortlisted',6, 1, 1, '2023-08-08 21:51:49', 1, 0),
(13, 'Assignment Rejected',6, 1, 1, '2023-08-08 21:55:33', 1, 0),
(14, 'Interview To Be Scheduled',6, 1, 1, '2023-08-08 21:55:33', 1, 0),
(15, 'Interview Forwarded',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(16, 'Candidate was Absent',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(17, 'Coding Round',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(18, 'Coding Round Cleared',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(19, 'Coding Round Not Cleared',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(20, 'FaceToFace Interview',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(21, 'FaceToFace Interview Cleared',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(22, 'FaceToFace Interview Not Cleared',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(23, 'Candidate Selected',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(24, 'Candidate Not Selected',6, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22'),
(25 ,'On Hold',4, 1, 1, '2023-08-06 19:01:22', 1, '2023-08-06 19:01:22');
 

-- --------------------------------------------------------

--
-- Table structure for table `FreshMrfDetails`
--

CREATE TABLE `FreshMrfDetails` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `Justification` text NOT NULL,
  `JobDescription` text NOT NULL,
  `Skills` text NOT NULL,
  `MinTargetSalary` float(11) NOT NULL,
  `MaxTargetSalary` float(11) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `FreshMrfDetails`
--

INSERT INTO `FreshMrfDetails` (`Id`, `MrfId`, `Justification`, `JobDescription`, `Skills`, `MinTargetSalary`, `MaxTargetSalary`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(2, 2, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8, 11, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(3, 3, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8, 11, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(4, 4, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8, 11, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(5, 5, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(6, 6, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(7, 7, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(8, 8, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(9, 9, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(10, 10, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(11, 11, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(12, 12, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(13, 13, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(14, 14, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(15, 15, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(16, 16, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(17, 17, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(18, 18, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(19, 19, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(20, 20, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(21, 21, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(22, 22, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(23, 23, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(24, 24, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8 , 11 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(25,25, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8 , 11 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(26, 26, 'For additional RnD work', 'Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location', 'Headset, Laptop, Keyboard, Mouse', 8 , 11 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(27,27, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(28, 28, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(29,29, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5 , 7 , 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33'),
(30, 30, 'For a new project', 'Start with a strong, attention-grabbing summary.
Your summary should provide an overview of your company and expectations for the position.
Get your reader interested by giving details about what makes your company unique.
Your job description is an introduction to your company and your employer brand. Include details about your company culture to sum up why a candidate would enjoy working for you.
Include an exact job location.
Provide an exact job location to optimize your job posting so it appears higher in job search results.', 'Visual Studio, MS Office,Laptop,Headset, Laptop, Keyboard, Mouse', 5, 7, 1, '2023-08-07 16:31:33', 1, '2023-08-07 16:31:33')

;

-- --------------------------------------------------------

--
-- Table structure for table `GenderMaster`
--

CREATE TABLE `GenderMaster` (
  `Id` int(11) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `GenderMaster`
--

INSERT INTO `GenderMaster` (`Id`, `Type`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Male', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(2, 'Female', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(3, 'Either', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06');

-- --------------------------------------------------------

--
-- Table structure for table `GradeMaster`
--

CREATE TABLE `GradeMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `GradeMaster`
--

INSERT INTO `GradeMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'C01', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(2, 'C02', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(3, 'C03', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(4, 'C04', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(5, 'C05', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(6, 'C06', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(7, 'C07', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(8, 'C08', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(9, 'C09', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53'),
(10, 'C10', 1, 1, '2023-08-06 16:52:53', 1, '2023-08-06 16:52:53');

-- --------------------------------------------------------

--
-- Table structure for table `InterviewEvaluation`
--

CREATE TABLE `InterviewEvaluation` (
  `Id` int(11) NOT NULL,
  `CandidateId` int(11) NOT NULL,
  `InterviewerId` int(11)  NULL,
  `EvaluationDateUtc` date  NULL,
  `FromTimeUtc` time DEFAULT NULL,
  `ToTimeUtc` time DEFAULT NULL,
  `EvalutionStatusId` int(11)  NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `InterviewEvaluation`
--

INSERT INTO `InterviewEvaluation` (`Id`, `CandidateId`,`InterviewerId`, `EvaluationDateUtc`, `FromTimeUtc`, `ToTimeUtc`, `EvalutionStatusId`,   `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1,5, '2023-08-08', NULL, NULL, 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(2, 2, 5, '2023-08-08', '15:00:00', '15:30:00', 23, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(3, 3,5, '2023-08-08', NULL, NULL, 2, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(4, 2,5, '2023-08-08', NULL, NULL, 4, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(5, 1,5, '2023-08-09', '11:30:00', '12:30:00', 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(6, 3,5, '2023-08-10', '15:30:00', '16:30:00', 9, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(7, 1, 5, '2023-08-08', NULL, NULL, 3,1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(8, 2, 5, '2023-08-08', NULL, NULL, 2,1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(9, 3, 5, '2023-08-08', NULL, NULL, 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(10, 2, 5, '2023-08-08', '10:00:00', '11:00:00', 4, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(11, 1, 5, '2023-08-08', '14:00:00', '15:00:00', 3, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(12, 4, 5, '2023-08-08', NULL, NULL, 5, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(13, 5, 5, '2023-08-08', '16:00:00', '16:30:00', 2, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(14, 4, 5, '2023-08-08', '12:00:00', '13:00:00', 8, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(15, 4, 5, '2023-08-08', '18:00:00', '18:30:00', 6, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00');

--
-- Table structure for table `AttachmentEvaluation`
--

CREATE TABLE `AttachmentEvaluation` (
  `Id` int(11) NOT NULL,
  `InterviewEvaluationId` int(11) NOT NULL,
  `FilePath` text NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `AttachmentEvaluation`
--

INSERT INTO `AttachmentEvaluation` (`Id`, `InterviewEvaluationId`,`FilePath`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1,'Atul-Assignment.pdf',  1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(2, 3,'kbc-Assignment.pdf',  1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00');
-- --------------------------------------------------------


--
-- Table structure for table `LocationMaster`
--

CREATE TABLE `LocationMaster` (
  `Id` int(11) NOT NULL,
  `Location` varchar(50) NOT NULL,
  `ShortCode` varchar(6) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `LocationMaster`
--

INSERT INTO `LocationMaster` (`Id`, `Location`, `ShortCode`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Mumbai', 'MUM', 1, 1, '2023-08-06 16:28:46', 1, '2023-08-06 16:28:46'),
(2, 'Delhi', 'DEL', 1, 1, '2023-08-06 16:28:46', 1, '2023-08-06 16:28:46'),
(3, 'Noida', 'NOD', 1, 1, '2023-08-06 16:28:46', 1, '2023-08-06 16:28:46'),
(4, 'Chennai', 'CHE', 1, 1, '2023-08-06 16:28:46', 1, '2023-08-06 16:28:46'),
(5, 'Bengaluru', 'BLR', 1, 1, '2023-08-09 22:52:02', 1, '2023-08-09 22:52:02');

-- --------------------------------------------------------

--
-- Table structure for table `MrfDetails`
--

CREATE TABLE `MrfDetails` (
  `Id` int(11) NOT NULL,
  `ReferenceNo` varchar(80) NOT NULL,
  `RequisitionType` varchar(80) NOT NULL,
  `PositionTitleId` int(11)  NULL,
  `DepartmentId` int(11)  NULL,
  `SubDepartmentId` int(11)  NULL,
  `ProjectId` int(11)  NULL,
  `VacancyNo` int(11) NOT NULL,
  `GenderId` int(11)  NULL,
  `RequisitionDateUtc` date  NULL,
  `ReportsToEmployeeId` int(11)  NULL,
  `MinGradeId` int(11)  NULL,
  `MaxGradeId` int(11)  NULL,
  `EmploymentTypeId` int(11)  NULL,
  `MinExperience` int(11)  NULL,
  `MaxExperience` int(11)  NULL,
  `VacancyTypeId` int(11)  NULL,
  `IsReplacement` tinyint(1) NOT NULL,
  `MrfStatusId` int(11) NOT NULL,
  `JdDocPath` text  NULL,
  `LocationId` int(11) NOT NULL,
  `QualificationId` int(11)  NULL,
  `HrId` int(11)  NULL,
   `Note` text  NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `MrfDetails`
--

INSERT INTO `MrfDetails` (`Id`, `ReferenceNo`,`RequisitionType`, `PositionTitleId`, `DepartmentId`, `SubDepartmentId`, `ProjectId`, `VacancyNo`, `GenderId`, `RequisitionDateUtc`, `ReportsToEmployeeId`, `MinGradeId`,`MaxGradeId`, `EmploymentTypeId`, `MinExperience`, `MaxExperience`, `VacancyTypeId`, `IsReplacement`, `MrfStatusId`, `JdDocPath`, `LocationId`,`QualificationId`,`Note`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, '02/MUM/FR/AUG/23/001', 'FR',1, 2, 6, 1, 2, 1, '2023-08-08', 5, 1,2, 1, 0, 4, 3, 0, 1, '', 1, 1,'note',9, '2023-08-08 23:30:42', 9, '2023-08-08 23:30:42'),
(2, '08/CHE/FR/SEP/23/002','RP',2, 1, 4, 1, 2, 1, '2023-08-08', 5, 2,3, 1, 5, 10, 3, 0, 2, '', 1, 1,'',1, '2023-08-08 23:32:01', 1, '2023-08-08 23:32:01'),
(3, '14/MUM/FR/MAR/23/003', 'FR',3, 1, 4, 3, 2, 1, '2023-08-06', 5, 1,2, 1, 0, 4, 3, 0, 3, '', 1, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(4, '05/MUM/RP/OCT/23/004', 'RP',4, 1, 4, 4, 1, 2, '2023-08-04', 4, 3,2, 3, 5, 10, 2, 1, 4, '', 3, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(5, '02/DEL/RP/AUG/23/005', 'FR',5, 2, 6, 5, 2, 1, '2023-08-01', 5, 5,6, 1, 0, 3, 3, 0, 5, '', 1, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(6, '01/NOD/RP/AUG/23/006','FR',6, 1, 4, 1, 1, 2, '2023-08-03', 4, 4,6, 3, 4, 6, 2, 1, 6, '', 3, 1,'note',6, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(7, '02/NOD/FR/APR/23/007','RP',7, 1, 4, 3, 2, 1, '2023-08-05', 5, 5,7, 1, 0, 4, 3, 0, 7, '', 1, 1,'note',6,'2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(8, '02/MUM/RP/MAY/23/008', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 8, '', 3, 6,'', 6,'2023-08-09 18:22:23', 1, '2023-08-09 18:22:23'),
(9, '02/MUM/RP/MAY/23/009', 'FR',9, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 9, '', 3, 1,'', 6,'2023-08-09 18:22:23', 1, '2023-08-09 18:22:23'),
(10, '02/MUM/RP/MAY/23/010', 'FR',10, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 10, '', 3, 1,'', 6,'2023-08-09 18:22:23', 1, '2023-08-09 18:22:23'),
(11, '02/MUM/FR/AUG/23/011', 'FR',1, 2, 6, 1, 2, 1, '2023-08-08', 5, 1,2, 1, 0, 4, 3, 0, 1, '', 1, 1,'note',1, '2023-08-08 23:30:42', 1, '2023-08-08 23:30:42'),
(12, '08/CHE/FR/SEP/23/012','RP',2, 1, 4, 1, 2, 1, '2023-08-08', 5, 2,3, 1, 5, 10, 3, 0, 2, '', 1, 1,'',1, '2023-08-08 23:32:01', 1, '2023-08-08 23:32:01'),
(13, '14/MUM/FR/MAR/23/013', 'FR',3, 1, 4, 3, 2, 1, '2023-08-06', 5, 1,2, 1, 0, 4, 3, 0, 3, '', 1, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(14, '05/MUM/RP/OCT/23/014', 'RP',4, 1, 4, 4, 1, 2, '2023-08-04', 4, 3,2, 3, 5, 10, 2, 1, 4, '', 3, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(15, '02/DEL/RP/AUG/23/015', 'FR',5, 1, 1, 5, 2, 1, '2023-08-01', 5, 5,6, 1, 0, 3, 3, 0, 5, '', 1, 1,'note',1, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(16, '01/NOD/RP/AUG/23/016','FR',6, 1, 4, 1, 1, 2, '2023-08-03', 4, 4,6, 3, 4, 6, 2, 1, 6, '', 3, 1,'note',2, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(17, '02/NOD/FR/APR/23/017','RP',7, 1, 4, 3, 2, 1, '2023-08-05', 5, 5,7, 1, 0, 4, 3, 0, 7, '', 1, 1,'note',1,'2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(18, '02/MUM/RP/MAY/23/018', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 8, '', 3, 1,'',1,'2023-08-09 18:22:23', 1, '2023-08-09 18:22:23'),
(19, '02/MUM/RP/MAY/23/019', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 9, '', 3, 1,'',1,'2023-08-09 18:22:23', 1, '2023-08-09 18:22:23'),
(20, '02/MUM/RP/MAY/23/020', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 10, '', 3, 1,'',6,'2023-08-09 18:22:23', 6, '2023-08-09 18:22:23'),
(21, '02/MUM/RP/MAY/23/021', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 11, '', 3, 1,'',6,'2023-08-09 18:22:23', 6, '2023-08-09 18:22:23'),
(22, '02/MUM/RP/MAY/23/022', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 12, '', 3, 1,'',6,'2023-08-09 18:22:23', 6, '2023-08-09 18:22:23'),
(23, '02/MUM/FR/AUG/23/023', 'FR',1, 1, 4, 1, 2, 1, '2023-08-08', 5, 1,2, 1, 0, 4, 3, 0, 1, '', 1, 1,'note',2, '2023-08-08 23:30:42', 1, '2023-08-08 23:30:42'),
(24, '08/CHE/FR/SEP/23/023','RP',2, 1, 4, 1, 2, 1, '2023-08-08', 5, 2,3, 1, 5, 10, 3, 0, 2, '', 1, 1,'',2, '2023-08-08 23:32:01', 1, '2023-08-08 23:32:01'),
(25, '14/MUM/FR/MAR/23/025', 'FR',3, 1, 4, 3, 2, 1, '2023-08-06', 5, 1,2, 1, 0, 4, 3, 0, 3, '', 1, 1,'note',2, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(26, '05/MUM/RP/OCT/23/026', 'RP',4, 1, 4, 4, 1, 2, '2023-08-04', 4, 3,2, 3, 5, 10, 2, 1, 4, '', 3, 1,'note',2, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(27, '02/DEL/RP/AUG/23/027', 'FR',5, 1, 4, 5, 2, 1, '2023-08-01', 5, 5,6, 1, 0, 3, 3, 0, 5, '', 1, 1,'note',2, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(28, '01/NOD/RP/AUG/23/028','FR',6, 1, 4, 1, 1, 2, '2023-08-03', 4, 4,6, 3, 4, 6, 2, 1, 6, '', 3, 1,'note',2, '2023-08-09 18:22:22', 1, '2023-08-09 18:22:22'),
(29, '02/NOD/FR/APR/23/029','RP',7, 1, 4, 3, 2, 1, '2023-08-05', 5, 5,7, 1, 0, 4, 3, 0, 7, '', 1, 1,'note',10,'2023-08-09 18:22:22', 10, '2023-08-09 18:22:22'),
(30, '02/MUM/CRP/MAY/23/030', 'FR',8, 1, 4, 5, 1, 2, '2023-08-07', 4, 4,7, 3, 5, 7, 2, 1, 8, '', 3, 6,'', 10,'2023-08-09 18:22:23', 10, '2023-08-09 18:22:23');




CREATE TABLE `MrfDetailsStatusHistory` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `MrfStatusId` int(11) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `MrfDetailsStatusHistory` (`Id`,`MrfId`,  `MrfStatusId`,  `CreatedByEmployeeId`, `CreatedOnUtc`) VALUES
(1, 1, 1,1, '2023-08-08 23:30:42'),
(2, 1, 2,1, '2023-08-08 23:30:42'),
(3, 1, 3,1, '2023-08-08 23:30:42'),
(4, 2, 1,1, '2023-08-08 23:30:42'),
(5, 2, 2,1, '2023-08-08 23:30:42'),
(6, 2, 3,1, '2023-08-08 23:30:42'),
(7, 2, 4,1, '2023-08-08 23:30:42');


-- --------------------------------------------------------
-- Table structure for table MrfEmailApproval
CREATE TABLE `MrfEmailApproval` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `ApprovalDate` date null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `MrfEmailApproval` (`Id`, `MrfId`, `EmployeeId`, `RoleId`, `ApprovalDate`) VALUES
(1,1,8,3,'2023-08-09'),
(2,1,13,4,'2023-08-09'),
(3,1,10,5,'2023-08-09'),
(4,1,11,6,'2023-08-09'),
(5,1,12,7,'2023-08-09'),
(6,2,8,3,'2023-08-09'),
(7,2,13,4,'2023-08-09'),
(8,2,10,5,'2023-08-09'),
(9,2,11,7,'2023-08-09'),
(10,2,12,6,'2023-08-09');

-- ---------------------------------------------------------
--
-- Table structure for table `MrfFeedback`
--

CREATE TABLE `MrfFeedback` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `Feedback` text NOT NULL,
  `FeedbackByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `MrfFeedback`
--

INSERT INTO `MrfFeedback` (`Id`, `MrfId`, `Feedback`, `FeedbackByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 'Not enough information provided', 1, '2023-08-07 18:27:46', 1, '2023-08-07 18:27:46'),
(2, 2, 'JD is not complete', 2, '2023-08-07 18:27:46', 1, '2023-08-07 18:27:46'),
(3, 3, 'Experience and skills are missing', 3, '2023-08-07 18:27:46', 1, '2023-08-07 18:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `MrfInterviewerMap`
--

CREATE TABLE `MrfInterviewerMap` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `InterviewerEmployeeId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `MrfInterviewerMap`
--

INSERT INTO `MrfInterviewerMap` (`Id`, `MrfId`, `InterviewerEmployeeId`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 3, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(2, 1, 5, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(3, 1, 6, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(4, 2, 7, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(5, 2, 8, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(6, 2, 9, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(7, 1, 4, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `MrfResumeReviewerMap`
--

CREATE TABLE `MrfResumeReviewerMap` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `ResumeReviewerEmployeeId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `MrfResumeReviewerMap`
--

INSERT INTO `MrfResumeReviewerMap` (`Id`, `MrfId`, `ResumeReviewerEmployeeId`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 3, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(2, 1, 5, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(3, 1, 6, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(4, 2, 7, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(5, 2, 8, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(6, 2, 9, 0, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05'),
(7, 1, 4, 1, 1, '2023-08-09 20:40:05', 1, '2023-08-09 20:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `MrfStatusMaster`
--

CREATE TABLE `MrfStatusMaster` (
  `Id` int(11) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `MrfStatusMaster`
--

INSERT INTO `MrfStatusMaster` (`Id`, `Status`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES

(1, 'Drafted', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(2, 'New', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(3, 'Re-submission Required', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(4, 'Received HOD Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(5, 'Received COO Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(6, 'Open', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(7, 'On hold', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(8, 'Rejected  MRF', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(9, 'Cancelled', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(10, 'Closed', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(11, 'Awaiting HOD Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(12, 'Awaiting COO Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(13, 'Awaiting Finance Head Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(14, 'Received Finance Head Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(15, 'Bypass Finance Head Approval', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04'),
(16, 'MRF transferred to new owner', 1, 1, '2023-08-06 17:19:04', 1, '2023-08-06 17:19:04');



-- --------------------------------------------------------

--
-- Table structure for table `ProjectMaster`
--

CREATE TABLE `ProjectMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ProjectMaster`
--

INSERT INTO `ProjectMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'SKY', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59'),
(2, 'SELECT', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59'),
(3, 'CONNECT', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59'),
(4, 'MRF', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59'),
(5, 'MANUSCRIPT', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59'),
(6, 'TWEDDLE', 1, 1, '2023-08-06 16:58:59', 1, '2023-08-06 16:58:59');

-- --------------------------------------------------------

--
-- Table structure for table `QualificationMaster`
--

CREATE TABLE `QualificationMaster` (
  `Id` int(11) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `QualificationMaster`
--

INSERT INTO `QualificationMaster` (`Id`, `Type`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Diploma', 1, 1, '2023-08-06 17:06:56', 1, '2023-08-06 17:06:56'),
(2, 'BE', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(3, 'BTech', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(4, 'BCA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(5, 'MCA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(6, 'B.Sc (IT)', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(7, 'M.Sc (IT)', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(8, 'MBA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(9, 'CA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(10, 'B.Com', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(11, 'M.Com', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(12, 'BA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(13, 'MA', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57'),
(14, 'PhD', 1, 1, '2023-08-06 17:06:57', 1, '2023-08-06 17:06:57');

-- --------------------------------------------------------

--
-- Table structure for table `ReplacementMrfDetails`
--

CREATE TABLE `ReplacementMrfDetails` (
  `Id` int(11) NOT NULL,
  `MrfId` int(11) NOT NULL,
  `EmployeeName` varchar(80) NOT NULL,
  `EmailId` varchar(80) NOT NULL,
  `EmployeeCode` int(11) NOT NULL,
  `LastWorkingDate` date NOT NULL,
  `Justification` text NOT NULL,
  `AnnualCTC` float(11) NOT NULL,
  `AnnualGross` float(11) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ReplacementMrfDetails`
--

INSERT INTO `ReplacementMrfDetails` (`Id`, `MrfId`, `EmployeeName`, `EmailId`, `EmployeeCode`, `LastWorkingDate`, `Justification`, `AnnualCTC`, `AnnualGross`,  `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1, 'Gaurav Mehta', 'gaurav.m@kwglobal.com', 46111, '2023-08-18', 'For career growth', 1000000, 900000, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(2, 3, 'Nitish Yadav', 'nitish.y@kwglobal.com', 46222, '2022-11-11', 'For career growth', 1000000, 900000, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(3, 5, 'Ramkumar Krishnan', 'ramkumar.k@kwglobal.com', 46333, '2022-07-15', 'For career growth', 1200000, 1000000, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(4, 7, 'Nitin Jadhav', 'nitin.j@kwglobal.com', 46444, '2023-03-15', 'financial growth', 1750000, 1500000, 1, '2023-08-08 18:06:56', 1, '2023-08-08 18:06:56');

-- --------------------------------------------------------

--
-- Table structure for table `ResumeForwardDetails`
--

CREATE TABLE `ResumeForwardDetails` (
  `Id` int(11) NOT NULL,
  `CandidateId` int(11) NOT NULL,
  `ForwardedFromEmployeeId` int(11) NOT NULL,
  `ForwardedToEmployeeId` int(11) NOT NULL,
  `ForwardedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ResumeForwardDetails`
--

INSERT INTO `ResumeForwardDetails` (`Id`, `CandidateId`, `ForwardedFromEmployeeId`, `ForwardedToEmployeeId`, `ForwardedOnUtc`) VALUES
(1, 1, 4, 6, '2023-08-08 20:44:18'),
(2, 2, 5, 7, '2023-08-08 20:44:18'),
(3, 1, 6, 8, '2023-08-08 20:44:18'),
(4, 4, 7, 6, '2023-08-08 20:44:18'),
(5, 2, 7, 5, '2023-08-08 20:44:18'),
(6, 3, 3, 8, '2023-08-08 20:44:18'),
(7, 1, 8, 5, '2023-08-08 20:44:18'),
(8, 5, 6, 7, '2023-08-08 20:44:18'),
(9, 6, 2, 8, '2023-08-08 20:44:18');

-- --------------------------------------------------------

--
-- Table structure for table `RoleMaster`
--

CREATE TABLE `RoleMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `RoleMaster`
--

INSERT INTO `RoleMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Superadmin', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(2, 'Admin', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(3, 'MRF Owner', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(4, 'HR', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(5, 'Resume Reviewer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(6, 'Interviewer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(7, 'Hiring Manager', 0, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(8, 'Function Head', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(9, 'Site HR SPOC', 0, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(10, 'Finance Head', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(11, 'President &COO', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58');

-- --------------------------------------------------------

--
-- Table structure for table `SubDepartmentMaster`
--

CREATE TABLE `SubDepartmentMaster` (
  `Id` int(11) NOT NULL,
  `DepartmentId` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `SubDepartmentMaster`
--

INSERT INTO `SubDepartmentMaster` (`Id`, `DepartmentId`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 6, 'Digital Marketing', 1, 1, '2023-08-06 22:28:26', 1, '2023-08-06 22:28:26'),
(2, 4, 'Onboarding', 1, 1, '2023-08-06 22:28:26', 1, '2023-08-06 22:28:26'),
(3, 4, 'Payroll', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(4, 1, 'Software', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(5, 1, 'Hardware', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(6, 2, 'Voice', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(7, 2, 'Chat', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(8, 8, 'Internal Employees', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(9, 8, 'Vendors', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27'),
(10, 8, 'Contractual Employees', 1, 1, '2023-08-06 22:28:27', 1, '2023-08-06 22:28:27');

-- --------------------------------------------------------

--
-- Table structure for table `VacancyTypeMaster`
--

CREATE TABLE `VacancyTypeMaster` (
  `Id` int(11) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `VacancyTypeMaster`
--

INSERT INTO `VacancyTypeMaster` (`Id`, `Type`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Fresh, Budgeted', 1, 1, '2023-08-06 16:50:38', 1, '2023-08-06 16:50:38'),
(2, 'Fresh, Non-budgeted', 1, 1, '2023-08-06 16:50:38', 1, '2023-08-06 16:50:38'),
(3, 'Replacement, Budgeted', 1, 1, '2023-08-06 16:50:38', 1, '2023-08-06 16:50:38'),
(4, 'Replacement, Non-budgeted', 1, 1, '2023-08-06 16:50:38', 1, '2023-08-06 16:50:38');

--
-- Table structure for table `EmailMaster`
--
CREATE TABLE `EmailMaster` (
   `Id` int(11) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `emailTo` varchar(100) NOT NULL,
  `EmployeeToSend` varchar(100) NOT NULL,
  `Subject` varchar(100) NOT NULL,
  `Content` varchar(500) NOT NULL,
  `StatusId` int(11) DEFAULT 0,
  `RoleId` varchar(50) NOT NULL

 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `EmailMaster`
--

INSERT INTO emailmaster
VALUES (1,"Login","ashutosh.tiwari@kwglobal.com","For all user","You have successfully logged in" ,"<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been logged in successfully.</p>
    </div>
</body>
</html>",0,"0"),
	   (2,"Create User","ashutosh.tiwari@kwglobal.com","Admin","User is created successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>(User Name) is created successfully.</p>
    </div>
</body>
</html>",0,"2"),
	   (3,"Delete User","ashutosh.tiwari@kwglobal.com","Admin","User is deleted successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>(User Name) is deleted successfully.</p>
    </div>
</body>
</html>",0,"2"),
	   (4,"Update User","ashutosh.tiwari@kwglobal.com","Admin","User is Updated successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>(User Name)'s detail is updated successfully.</p>
    </div>
</body>
</html>",0,"2"),
	   (5,"Saved as Draft","ashutosh.tiwari@kwglobal.com","MRF Owner","Draft is saved successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>MRF ## is saved successfully.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",1,"3"),
	   (6,"Submit MRF","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","MRF is submitted successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>MRF ## is submitted successfully.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",2,"3,4"),
	   (7,"Withdrawn MRF","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","MRF is withdrawn successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>MRF ## is withdrawn successfully.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",9,"3,4"),
	   (8,"Re-submission Required","ashutosh.tiwari@kwglobal.com","MRF Owner","Resubmission required for MRF ##","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>MRF ## has been sent for Resubmission.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",3,"3"),
	   (9,"Awaiting HOD Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Awaiting HOD Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Awaiting HOD approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",11,"3,4"),
	   (10,"Awaiting COO Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Awaiting COO Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Awaiting COO approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",12,"3,4"),
	   (11,"Open","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","MRF ## is open","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to open.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",6,"3,4"),
		
	   (12,"Rejected  MRF","ashutosh.tiwari@kwglobal.com","HR, HOD","MRF ## is rejected","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>MRF ## is rejected.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",8,"4,8"),
	   (13,"On Hold","HR","ashutosh.tiwari@kwglobal.com","MRF ## is on hold","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to On Hold.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>

",7,"4"),
	   (14,"Closed (Onboarded)","ashutosh.tiwari@kwglobal.com","HR, HOD","MRF ## status is now onboarded","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Onboarded.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",10,"4,8"),
	   (15,"Resume Reviewer added","ashutosh.tiwari@kwglobal.com","Resume Reviewer","Resume Reviewer added successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been added as a Resume Reviewer successfully against MRF ##.</p>
    </div>
</body>
</html>",0,"5"),
	   (16,"Interviewer added","ashutosh.tiwari@kwglobal.com","Resume Reviewer","Interviewer added successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been added as an Interviewer successfully against MRF ##.</p>
    </div>
</body>
</html>",0,"5"),
	   (17,"Resume Reviewer removed","ashutosh.tiwari@kwglobal.com","MRF Owner","Resume Reviewer removed successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been removed as a Resume Reviewer against Resume #R.</p>
    </div>
</body>
</html>",0,"3"),
	   (18,"Interviewer removed","ashutosh.tiwari@kwglobal.com","HR","Interviewer removed successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been removed as an interviewer against Resume #R.</p>
    </div>
</body>
</html>",0,"4"),
	   (19,"Forward To(Resume)","ashutosh.tiwari@kwglobal.com","Resume Reviewer(Has to forward)","Resume is forwarded successfully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Resume has been forwarded to (User).</p>
    </div>
</body>
</html> ",0,"5"),
	   (20,"Forward To(Resume)","ashutosh.tiwari@kwglobal.com","Resume Reviewer(added as reviewer)","Resume has been assigned","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>You have been assigned for review Resume.</p>
    </div>
</body>
</html>",0,"5"),
	   (21,"Interview Status","ashutosh.tiwari@kwglobal.com","MRF Owner, HR and Interview Reviewer","Interview status is changed","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Interview status of Resume #R is changed to #S.</p>
    </div>
</body>
</html>",0,"3,4,6"),
	   (22,"Resume Status","ashutosh.tiwari@kwglobal.com","MRF Owner, HR, Resume Reviewer & Interview Reviewer","Resume status is changed","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of Resume #R is changed to #S.</p>
    </div>
</body>
</html>",0,"3,4,5,6"),
	   (23,"Feedback Submission","ashutosh.tiwari@kwglobal.com","MRF Owner, HR and Interview Reviewer","Feedback submitted successully","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>feedback has been submitted against resume.pdf.</p>
    </div>
</body>
</html>",0,"3,4,5,6"),
	   (24,"Received HOD Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Received HOD Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Received HOD approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",4,"3,4"),
	   (25,"Received COO Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Received COO Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Received COO approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",5,"3,4"),
	   (26,"Received Finance Head Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Received Finance Head Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Received Finance Head Approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",14,"3,4"),
	   (27,"Awaiting Finance Head Approval","ashutosh.tiwari@kwglobal.com","MRF Owner, HR ","Awaiting Finance Head Approval","<!DOCTYPE html>
<html lang='en'>
<body>
    <div style='padding: 20px;'>
        <h4>Dear User,</h4>
        <p>Status of MRF ## is changed to Received Finance Head Approval.</p>
        <p>Please <a href='#'>click here</a>.</p>
    </div>
</body>
</html>",13,"3,4");

	   
--
--

CREATE TABLE `MrfLastNumber` (
`Id` int(11) NOT NULL,
  `LastNumber` int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
INSERT INTO `MrfLastNumber` (`Id`,`LastNumber`) VALUES
(1,21) ;

--
-- Table structure for table `PositionTitleMaster`
--

CREATE TABLE `PositionTitleMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `PositionTitleMaster`
--

INSERT INTO `PositionTitleMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Software engineer', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(2, 'UI Developer & UX Designer', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(3, 'Python Developer', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(4, 'Graphic Designer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(5, 'Senior Accountant', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(6, 'HR', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(7, '.Net Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(8, 'Automation QA Engineer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(9, 'Java Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(10, 'React Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(11, 'Content Writer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(12, 'Public Relations', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(13, 'Social Media Assistant', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(14, 'Brand Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(15, 'SEO Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(16, 'Content Marketing Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(17, 'Copywriter', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(18, 'Media Buyer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(19, 'Digital Marketing Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(20, 'ECommerce Marketing Specialist', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(21, 'Vice President of Marketing', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(22, 'Media Relations Coordinator', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(23, 'Administrative Assistant', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(24, 'Receptionist', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(25, 'Office Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(26, 'Auditing Clerk', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(27, 'Bookkeeper', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(28, 'Account Executive', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(29, 'Branch Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(30, 'Business Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(31, 'Quality Control Coordinator', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(32, 'Administrative Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(33, 'Chief Executive Officer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(34, 'Business Analyst', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(35, 'Risk Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(36, 'Human Resources', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(37, 'Office Assistant', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(38, 'Secretary', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(39, 'Office Clerk', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(40, 'File Clerk', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(41, 'Account Collector', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(42, 'Administrative Specialist', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(43, 'Executive Assistant', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(44, 'Program Administrator', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(45, 'Program Manager', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(46, 'Administrative Analyst', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(47, 'Data Entry', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(48, 'Computer Scientist', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(49, 'SQL Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(50, 'Web Designer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(51, 'Web Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(52, 'Help Desk Worker/Desktop Support', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(53, 'DevOps Engineer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(54, 'Network Administrator', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(55, 'Artificial Intelligence Engineer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(56, 'Cloud Architect', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(57, 'Technical Specialist', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(58, 'Application Developer', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(59, 'Chief Technology Officer (CTO)', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(60, 'Chief Information Officer (CIO)', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58')
;

--
-- Indexes for table `PositionTitleMaster`
--
ALTER TABLE `PositionTitleMaster`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for table `PositionTitleMaster`
--
ALTER TABLE `PositionTitleMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Table structure for table `SourceMaster`
--

CREATE TABLE `SourceMaster` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `SourceMaster`
--

INSERT INTO `SourceMaster` (`Id`, `Name`, `IsActive`, `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 'Nakuri', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(2, 'Indeed', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(3, 'Linkedin', 1, 1, '2023-08-06 16:41:06', 1, '2023-08-06 16:41:06'),
(4, 'Foundit', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(5, 'Shine', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(6, 'HerKey', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58'),
(7, 'Monster', 1, 1, '2023-08-07 16:40:58', 1, '2023-08-07 16:40:58')
;

--
-- Indexes for table `SourceMaster`
--
ALTER TABLE `SourceMaster`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for table `SourceMaster`
--
ALTER TABLE `SourceMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;



-- Indexes for dumped tables
--
--
-- Indexes for table `CandidateDetails`
--
ALTER TABLE `CandidateDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsCandidateDetails` (`MrfId`),
  ADD KEY `FK_SourceMaster` (`SourceId`),
  ADD KEY `FK_CandidateStatusMasterCandidateDetails` (`CandidateStatusId`)
;

--
-- Indexes for table `CandidateStatusMaster`
--
ALTER TABLE `CandidateStatusMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `DepartmentMaster`
--
ALTER TABLE `DepartmentMaster`
  ADD PRIMARY KEY (`Id`);
--
-- Indexes for table `EmailMaster`
--
ALTER TABLE `EmailMaster`
  ADD PRIMARY KEY (`Id`),
ADD KEY `FK_Statusmaster` (`StatusId`),
ADD KEY `FK_Rolemaster` (`RoleId`)
; 

--
-- Indexes for table `EmployeeDetails`
--
ALTER TABLE `EmployeeDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_UserDetailsUserDetails` (`AllowedByEmployeeId`);

--
-- Indexes for table `EmployeeLoginDetails`
--
ALTER TABLE `EmployeeLoginDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_UserMasterUserLoginDetails` (`EmployeeId`);

--
-- Indexes for table `EmployeeRoleMap`
--
ALTER TABLE `EmployeeRoleMap`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_UserMasterUserRoleMap` (`EmployeeId`),
  ADD KEY `FK_RoleMasterUserLoginDetails` (`RoleId`);

--
-- Indexes for table `EmploymentTypeMaster`
--
ALTER TABLE `EmploymentTypeMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `EvaluationFeedbackMaster`
--
ALTER TABLE `EvaluationFeedbackMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `EvaluationMaster`
--
ALTER TABLE `EvaluationMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `EvaluationStatusMaster`
--
ALTER TABLE `EvaluationStatusMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `FreshMrfDetails`
--
ALTER TABLE `FreshMrfDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsFreshMrfDetails` (`MrfId`);

--
-- Indexes for table `GenderMaster`
--
ALTER TABLE `GenderMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `GradeMaster`
--
ALTER TABLE `GradeMaster`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `MrfEmailApproval`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsId` (`MrfId`),
  ADD KEY `FK_EmployeeDetails` (`EmployeeId`),
  ADD KEY `RoleMasterMrfEmailApproval` (`RoleId`);

--
-- Indexes for table `InterviewEvaluation`
--
ALTER TABLE `InterviewEvaluation`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_CandidateMasterInterviewEvaluation` (`CandidateId`),
  ADD KEY `FK_EvaluationStatusMasterInterviewEvaluation` (`EvalutionStatusId`),    
  ADD KEY `FK_UserDetailsInterviewEvaluation` (`InterviewerId`);

--
-- Indexes for table `AttachmentEvaluation`
--
ALTER TABLE `AttachmentEvaluation`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_InterviewEvaluation` (`InterviewEvaluationId`);

--
-- Indexes for table `LocationMaster`
--
ALTER TABLE `LocationMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `MrfDetails`
--
ALTER TABLE `MrfDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_DepartmentMasterMrfDetails` (`DepartmentId`),
  ADD KEY `FK_PositionTitleMasterD` (`PositionTitleId`),
  ADD KEY `FK_SubDepartmentMasterMrfDetails` (`SubDepartmentId`),
  ADD KEY `FK_ProjectMasterMrfDetails` (`ProjectId`),
  ADD KEY `FK_GenderMasterMrfDetails` (`GenderId`),
  ADD KEY `FK_GradeMasterMrfDetails` (`MinGradeId`),
  ADD KEY `FK_GradeMasterMrfDetails2` (`MaxGradeId`),
  ADD KEY `FK_UserMasterMrfDetails` (`ReportsToEmployeeId`),
  ADD KEY `FK_EmploymentTypeMasterMrfDetails` (`EmploymentTypeId`),
  ADD KEY `FK_VacancyTypeMasterMrfDetails` (`VacancyTypeId`),
  ADD KEY `FK_MrfStatusMasterMrfDetails` (`MrfStatusId`),
  ADD KEY `FK_LocationMasterMrfDetails` (`LocationId`),
  ADD KEY `FK_QualificationMasterMrfDetails` (`QualificationId`),
   ADD KEY `FK_EmployeeDetailsMrfDetails` (`QualificationId`);



--
-- Indexes for table `MrfDetailsStatusHistory`
--
ALTER TABLE `MrfDetailsStatusHistory`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfStatusMrfDetails` (`MrfStatusId`);

--
-- Indexes for table `MrfFeedback`
--
ALTER TABLE `MrfFeedback`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsMrfFeedback` (`MrfId`),
  ADD KEY `FK_UserMasterMrfFeedback` (`FeedbackByEmployeeId`);

--
-- Indexes for table `MrfInterviewerMap`
--
ALTER TABLE `MrfInterviewerMap`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsMrfInterviewerMap` (`MrfId`),
  ADD KEY `FK_UserDetailsMrfInterviewerMap` (`InterviewerEmployeeId`);

--
-- Indexes for table `MrfResumeReviewerMap`
--
ALTER TABLE `MrfResumeReviewerMap`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsMrfResumeReviewerMap` (`MrfId`),
  ADD KEY `FK_UserMasterMrfResumeReviewerMap` (`ResumeReviewerEmployeeId`);

--
-- Indexes for table `MrfStatusMaster`
--
ALTER TABLE `MrfStatusMaster`
  ADD PRIMARY KEY (`Id`);
 

--
-- Indexes for table `ProjectMaster`
--
ALTER TABLE `ProjectMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `QualificationMaster`
--
ALTER TABLE `QualificationMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ReplacementMrfDetails`
--
ALTER TABLE `ReplacementMrfDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_MrfDetailsReplacementMrfDetails` (`MrfId`);


--
-- Indexes for table `ResumeForwardDetails`
--
ALTER TABLE `ResumeForwardDetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_CandidateDetailsResumeForwardDetails` (`CandidateId`),
  ADD KEY `FK_UserMasterResumeForwardDetails` (`ForwardedFromEmployeeId`),
  ADD KEY `FK_UserMasterResumeForwardDetails2` (`ForwardedToEmployeeId`);

--
-- Indexes for table `RoleMaster`
--
ALTER TABLE `RoleMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `SubDepartmentMaster`
--
ALTER TABLE `SubDepartmentMaster`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_DepartmentMasterSubDepartmentMaster` (`DepartmentId`);

--
-- Indexes for table `VacancyTypeMaster`
--
ALTER TABLE `VacancyTypeMaster`
  ADD PRIMARY KEY (`Id`);


--
-- AUTO_INCREMENT for table `CandidateDetails`
--
ALTER TABLE `CandidateDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `CandidateStatusMaster`
--
ALTER TABLE `CandidateStatusMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `DepartmentMaster`
--
ALTER TABLE `DepartmentMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;



ALTER TABLE `EmailMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24; 
--
-- AUTO_INCREMENT for table `EmployeeDetails`
--
ALTER TABLE `EmployeeDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `EmployeeLoginDetails`
--
ALTER TABLE `EmployeeLoginDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `EmployeeRoleMap`
--
ALTER TABLE `EmployeeRoleMap`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `EmploymentTypeMaster`
--
ALTER TABLE `EmploymentTypeMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `EvaluationFeedbackMaster`
--
ALTER TABLE `EvaluationFeedbackMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `EvaluationMaster`
--
ALTER TABLE `EvaluationMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `EvaluationStatusMaster`
--
ALTER TABLE `EvaluationStatusMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `FreshMrfDetails`
--
ALTER TABLE `FreshMrfDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `GenderMaster`
--
ALTER TABLE `GenderMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `GradeMaster`
--
ALTER TABLE `GradeMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `InterviewEvaluation`
--
ALTER TABLE `InterviewEvaluation`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `AttachmentEvaluation`
--
ALTER TABLE `AttachmentEvaluation`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `LocationMaster`
--
ALTER TABLE `LocationMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `MrfDetails`
--
ALTER TABLE `MrfDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;


--
-- AUTO_INCREMENT for table `MrfDetailsStatusHistory`
--
ALTER TABLE `MrfDetailsStatusHistory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `MrfFeedback`
--
ALTER TABLE `MrfFeedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `MrfInterviewerMap`
--
ALTER TABLE `MrfInterviewerMap`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `MrfResumeReviewerMap`
--
ALTER TABLE `MrfResumeReviewerMap`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `MrfStatusMaster`
--
ALTER TABLE `MrfStatusMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ProjectMaster`
--
ALTER TABLE `ProjectMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `QualificationMaster`
--
ALTER TABLE `QualificationMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `ReplacementMrfDetails`
--
ALTER TABLE `ReplacementMrfDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ResumeForwardDetails`
--
ALTER TABLE `ResumeForwardDetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `RoleMaster`
--
ALTER TABLE `RoleMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `SubDepartmentMaster`
--
ALTER TABLE `SubDepartmentMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `VacancyTypeMaster`
--
ALTER TABLE `VacancyTypeMaster`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `MrfEmailApproval`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `MrfEmailApproval`
--

ALTER TABLE `MrfEmailApproval`
  ADD CONSTRAINT `FK_MrfDetailsId` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`),
  ADD CONSTRAINT `FK_EmployeeDetails` FOREIGN KEY (`EmployeeId`) REFERENCES `EmployeeDetails` (`Id`),
  ADD CONSTRAINT `FK_RoleMasterMrfEmailApproval` FOREIGN KEY (`RoleId`) REFERENCES `RoleMaster` (`Id`);

--
-- Constraints for table `CandidateDetails`
--
ALTER TABLE `CandidateDetails`
  ADD CONSTRAINT `FK_CandidateStatusMasterCandidateDetails` FOREIGN KEY (`CandidateStatusId`) REFERENCES `CandidateStatusMaster` (`Id`),
  ADD CONSTRAINT `FK_SourceMaster` FOREIGN KEY (`SourceId`) REFERENCES `SourceMaster` (`Id`),
  ADD CONSTRAINT `FK_MrfDetailsCandidateDetails` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`);

--
-- Constraints for table `EmployeeDetails`
--
ALTER TABLE `EmployeeDetails`
  ADD CONSTRAINT `FK_UserDetailsUserDetails` FOREIGN KEY (`AllowedByEmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `EmployeeLoginDetails`
--
ALTER TABLE `EmployeeLoginDetails`
  ADD CONSTRAINT `FK_UserMasterUserLoginDetails` FOREIGN KEY (`EmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `EmployeeRoleMap`
--
ALTER TABLE `EmployeeRoleMap`
  ADD CONSTRAINT `FK_RoleMasterUserLoginDetails` FOREIGN KEY (`RoleId`) REFERENCES `RoleMaster` (`Id`),
  ADD CONSTRAINT `FK_UserMasterUserRoleMap` FOREIGN KEY (`EmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `FreshMrfDetails`
--
ALTER TABLE `FreshMrfDetails`
  ADD CONSTRAINT `FK_MrfDetailsFreshMrfDetails` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`);

--
-- Constraints for table `InterviewEvaluation`
--
ALTER TABLE `InterviewEvaluation`
  ADD CONSTRAINT `FK_CandidateMasterInterviewEvaluation` FOREIGN KEY (`CandidateId`) REFERENCES `CandidateDetails` (`Id`),
  
  ADD CONSTRAINT `FK_EvaluationStatusMasterInterviewEvaluation` FOREIGN KEY (`EvalutionStatusId`) REFERENCES `EvaluationStatusMaster` (`Id`),
  ADD CONSTRAINT `FK_UserDetailsInterviewEvaluation` FOREIGN KEY (`InterviewerId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `AttachmentEvaluation`
--
ALTER TABLE `AttachmentEvaluation`
  ADD CONSTRAINT `FK_InterviewEvaluation` FOREIGN KEY (`InterviewEvaluationId`) REFERENCES `InterviewEvaluation` (`Id`);

--
-- Constraints for table `MrfDetails`
--
ALTER TABLE `MrfDetails`
  ADD CONSTRAINT `FK_DepartmentMasterMrfDetails` FOREIGN KEY (`DepartmentId`) REFERENCES `DepartmentMaster` (`Id`),
  ADD CONSTRAINT `FK_PositionTitleMasterD` FOREIGN KEY (`PositionTitleId`) REFERENCES `PositionTitleMaster` (`Id`),
  ADD CONSTRAINT `FK_EmploymentTypeMasterMrfDetails` FOREIGN KEY (`EmploymentTypeId`) REFERENCES `EmploymentTypeMaster` (`Id`),
  ADD CONSTRAINT `FK_GenderMasterMrfDetails` FOREIGN KEY (`GenderId`) REFERENCES `GenderMaster` (`Id`),
  ADD CONSTRAINT `FK_GradeMasterMrfDetails` FOREIGN KEY (`MinGradeId`) REFERENCES `GradeMaster` (`Id`),
  ADD CONSTRAINT `FK_GradeMasterMrfDetails2` FOREIGN KEY (`MaxGradeId`) REFERENCES `GradeMaster` (`Id`),
  ADD CONSTRAINT `FK_LocationMasterMrfDetails` FOREIGN KEY (`LocationId`) REFERENCES `LocationMaster` (`Id`),
  ADD CONSTRAINT `FK_MrfStatusMasterMrfDetails` FOREIGN KEY (`MrfStatusId`) REFERENCES `MrfStatusMaster` (`Id`),
  ADD CONSTRAINT `FK_ProjectMasterMrfDetails` FOREIGN KEY (`ProjectId`) REFERENCES `ProjectMaster` (`Id`),
  ADD CONSTRAINT `FK_SubDepartmentMasterMrfDetails` FOREIGN KEY (`SubDepartmentId`) REFERENCES `SubDepartmentMaster` (`Id`),
  ADD CONSTRAINT `FK_UserMasterMrfDetails` FOREIGN KEY (`ReportsToEmployeeId`) REFERENCES `EmployeeDetails` (`Id`),
  ADD CONSTRAINT `FK_VacancyTypeMasterMrfDetails` FOREIGN KEY (`VacancyTypeId`) REFERENCES `VacancyTypeMaster` (`Id`),
  ADD CONSTRAINT `FK_QualificationMasterMrfDetails` FOREIGN KEY (`QualificationId`) REFERENCES `QualificationMaster` (`Id`);


--
-- Constraints for table `MrfDetailsStatusHistory`
--
ALTER TABLE `MrfDetailsStatusHistory`
 
  ADD CONSTRAINT `FK_MrfStatusMrfDetails` FOREIGN KEY (`MrfStatusId`) REFERENCES `MrfStatusMaster` (`Id`);




--
-- Constraints for table `MrfFeedback`
--
ALTER TABLE `MrfFeedback`
  ADD CONSTRAINT `FK_MrfDetailsMrfFeedback` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`),
  ADD CONSTRAINT `FK_UserMasterMrfFeedback` FOREIGN KEY (`FeedbackByEmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `MrfInterviewerMap`
--
ALTER TABLE `MrfInterviewerMap`
  ADD CONSTRAINT `FK_MrfDetailsMrfInterviewerMap` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`),
  ADD CONSTRAINT `FK_UserDetailsMrfInterviewerMap` FOREIGN KEY (`InterviewerEmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `MrfResumeReviewerMap`
--
ALTER TABLE `MrfResumeReviewerMap`
  ADD CONSTRAINT `FK_MrfDetailsMrfResumeReviewerMap` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`),
  ADD CONSTRAINT `FK_UserMasterMrfResumeReviewerMap` FOREIGN KEY (`ResumeReviewerEmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `ReplacementMrfDetails`
--
ALTER TABLE `ReplacementMrfDetails`

  ADD CONSTRAINT `FK_MrfDetailsReplacementMrfDetails` FOREIGN KEY (`MrfId`) REFERENCES `MrfDetails` (`Id`);

--
-- Constraints for table `ResumeForwardDetails`
--
ALTER TABLE `ResumeForwardDetails`
  ADD CONSTRAINT `FK_CandidateDetailsResumeForwardDetails` FOREIGN KEY (`CandidateId`) REFERENCES `CandidateDetails` (`Id`),
  ADD CONSTRAINT `FK_UserMasterResumeForwardDetails` FOREIGN KEY (`ForwardedFromEmployeeId`) REFERENCES `EmployeeDetails` (`Id`),
  ADD CONSTRAINT `FK_UserMasterResumeForwardDetails2` FOREIGN KEY (`ForwardedToEmployeeId`) REFERENCES `EmployeeDetails` (`Id`);

--
-- Constraints for table `SubDepartmentMaster`
--
ALTER TABLE `SubDepartmentMaster`
  ADD CONSTRAINT `FK_DepartmentMasterSubDepartmentMaster` FOREIGN KEY (`DepartmentId`) REFERENCES `DepartmentMaster` (`Id`);


CREATE TABLE `MrfStatusRoleMap` (
  `Id` int(11) NOT NULL,
  `StatusId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into mrfstatusrolemap(Id,StatusId,RoleId,IsActive,CreatedByEmployeeId,CreatedOnUtc,UpdatedByEmployeeId,UpdatedOnUtc)
Values(1,1,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(2,2,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(3,3,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(4,6,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(5,8,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(6,9,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(7,10,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(8,7,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(9,2,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),	
(10,3,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(11,4,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(12,5,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(13,6,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(14,7,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(15,8,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(16,9,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(17,10,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(18,11,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(19,12,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(20,2,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),	
(21,3,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(22,4,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(23,5,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(24,6,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(25,7,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(26,8,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(27,9,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(28,10,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(29,11,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(30,12,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(31,1,1,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(32,13,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(33,14,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(34,15,4,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (35,4,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (36,5,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (37,11,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (38,12,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (39,13,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (40,14,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
 (41,15,3,1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19');

ALTER TABLE `MrfStatusRoleMap`
  ADD PRIMARY KEY (`Id`);
ALTER TABLE `MrfStatusRoleMap`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
  
ALTER TABLE `MrfStatusRoleMap`
  ADD CONSTRAINT `FK_mrfstatusmasterStatusId` FOREIGN KEY (`StatusId`) REFERENCES `mrfstatusmaster` (`Id`),
  ADD CONSTRAINT `FK_rolemasterRoleId` FOREIGN KEY (`RoleId`) REFERENCES `rolemaster` (`Id`);


 CREATE TABLE `candidateinterviewfeedback` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CandidateId` int(11) NOT NULL,
  `EvaluationFeedBackId` int(11) NOT NULL,
  `InterviewRound` int(11) NOT NULL,
  `Comments` varchar(1000) NOT NULL,
  `FeedbackAsDraft` int(11) NOT NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `CandidateId_idx` (`CandidateId`),
  KEY `EvaluationFeedBackId_idx` (`EvaluationFeedBackId`),
  CONSTRAINT `CandidateId` FOREIGN KEY (`CandidateId`) REFERENCES `candidatedetails` (`Id`),
  CONSTRAINT `EvaluationFeedBackId` FOREIGN KEY (`EvaluationFeedBackId`) REFERENCES `evaluationfeedbackmaster` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

Insert into `candidateinterviewfeedback` values (1,1,1,1,"his positive attitude and friendliness made interviewing  a pleasure",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(2,1,2,1,"he spoke knowledgeably about the topics we covered in the interview and demonstrated expertise in the field",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(3,1,3,1,"his positive attitude and friendliness made interviewing  a pleasure",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(4,3,1,1,"he were confident and comfortable during the interview",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(5,1,1,2,"comment",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(6,1,2,2,"he spoke knowledgeably about the topics we covered in the interview and demonstrated expertise in the field",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(7,1,3,2,"he were confident and comfortable during the interview",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(8,1,1,3,"his positive attitude and friendliness made interviewing  a pleasure",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(9,2,2,3,"comment",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(10,2,3,1,"his positive attitude and friendliness made interviewing  a pleasure",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19'),
(11,2,2,1,"he were confident and comfortable during the interview",1,1,'2023-08-06 17:38:19',1,'2023-08-06 17:38:19');



--
-- AUTO_INCREMENT for table `candidateinterviewfeedback`
--
ALTER TABLE `candidateinterviewfeedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Table structure for table `InterviewevaluationHistory`
--

CREATE TABLE `InterviewevaluationHistory` (
  `Id` int(11) NOT NULL,
  `CandidateId` int(11) NOT NULL,
  `InterviewerId` int(11)  NULL,
  `EvaluationDateUtc` date  NULL,
  `FromTimeUtc` time DEFAULT NULL,
  `ToTimeUtc` time DEFAULT NULL,
  `EvalutionStatusId` int(11)  NULL,
  `CreatedByEmployeeId` int(11) NOT NULL,
  `CreatedOnUtc` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedByEmployeeId` int(11) NOT NULL,
  `UpdatedOnUtc` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `InterviewevaluationHistory`
--

INSERT INTO `InterviewevaluationHistory` (`Id`, `CandidateId`,`InterviewerId`, `EvaluationDateUtc`, `FromTimeUtc`, `ToTimeUtc`, `EvalutionStatusId`,   `CreatedByEmployeeId`, `CreatedOnUtc`, `UpdatedByEmployeeId`, `UpdatedOnUtc`) VALUES
(1, 1,5, '2023-08-08', NULL, NULL, 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(2, 2, 5, '2023-08-08', '15:00:00', '15:30:00', 29, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(3, 3,5, '2023-08-08', NULL, NULL, 2, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(4, 2,5, '2023-08-08', NULL, NULL, 4, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(5, 1,5, '2023-08-09', '11:30:00', '12:30:00', 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(6, 3,5, '2023-08-10', '15:30:00', '16:30:00', 9, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(7, 1, 5, '2023-08-08', NULL, NULL, 3,1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(8, 2, 5, '2023-08-08', NULL, NULL, 2,1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(9, 3, 5, '2023-08-08', NULL, NULL, 1, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(10, 2, 5, '2023-08-08', '10:00:00', '11:00:00', 4, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(11, 1, 5, '2023-08-08', '14:00:00', '15:00:00', 3, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(12, 4, 5, '2023-08-08', NULL, NULL, 5, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(13, 5, 5, '2023-08-08', '16:00:00', '16:30:00', 2, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(14, 4, 5, '2023-08-08', '12:00:00', '13:00:00', 8, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00'),
(15, 4, 5, '2023-08-08', '18:00:00', '18:30:00', 6, 1, '2023-08-08 00:00:00', 1, '2023-08-08 00:00:00');

--
-- Indexes for table `InterviewevaluationHistory`
--
ALTER TABLE `InterviewevaluationHistory`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_CandidateMasterInterviewEvaluation` (`CandidateId`),
  ADD KEY `FK_EvaluationStatusMasterInterviewEvaluation` (`EvalutionStatusId`),    
  ADD KEY `FK_UserDetailsInterviewEvaluation` (`InterviewerId`);
--
-- AUTO_INCREMENT for table `InterviewevaluationHistory`
--
ALTER TABLE `InterviewevaluationHistory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

 


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

