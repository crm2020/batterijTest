/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: BatterijTest
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `device_id` int NOT NULL AUTO_INCREMENT,
  `display_name` varchar(50) DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `motor1` int DEFAULT NULL,
  `motor2` int DEFAULT NULL,
  `online` tinyint(1) DEFAULT NULL,
  `image` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES
(1,'Battery Sensor 1','9167ec599e9463385d654f774cdb4ce45f7a2c0aead4c17770a20a3082fe6f04','Primary battery sensor',46,38,1,'device1.png'),
(2,'Battery Sensor 2','f4e1191b5974f997e4d0ff4334a1792a80af7d230598513b7abf3ed2fd52e792','Secondary battery sensor',15,25,0,'device2.png'),
(3,'Temp Monitor','7836bd71b286c0471b71864a547d7f900808f18b34a9201852baa40d56f02129','Temperature monitoring device',0,0,1,'device3.png'),
(4,'Power Meter','a1636035d90fd60f49bab3795ad891be90c81ecf7842b50a4d79aef053afafc1','Measures power consumption',5,5,1,'device4.png'),
(5,'Backup Sensor','ec56239660f000104f691a1a5756973e6337c19386d83b201a5b966d8a5d1002','Backup battery sensor',8,16,0,'device1.png');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `time` datetime DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES
('2024-11-10 14:32:00',1,'Logged in','192.168.1.1'),
('2024-11-10 14:35:00',2,'Attempted login','192.168.1.2'),
('2024-11-10 15:10:00',3,'Changed password','192.168.1.3'),
('2024-11-10 16:45:00',1,'Logged out','192.168.1.1'),
('2024-11-10 18:00:00',4,'Viewed device logs','192.168.1.4');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measurements`
--

DROP TABLE IF EXISTS `measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measurements` (
  `time` datetime DEFAULT NULL,
  `measurement_id` int NOT NULL AUTO_INCREMENT,
  `device_id` int DEFAULT NULL,
  `voltage` float DEFAULT NULL,
  `Btemperature` float DEFAULT NULL,
  `amperage` float DEFAULT NULL,
  `motor1` int DEFAULT NULL,
  `motor2` int DEFAULT NULL,
  `currentpannel` float DEFAULT NULL,
  `voltpannel` float DEFAULT NULL,
  `powerpannel` float DEFAULT NULL,
  `Vbat` float DEFAULT NULL,
  `Tbat` float DEFAULT NULL,
  `LDR` int DEFAULT NULL,
  `humidity` float DEFAULT NULL,
  `rain` float DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `sensor` varchar(100) DEFAULT NULL,
  `Wtemperature` float DEFAULT NULL,
  PRIMARY KEY (`measurement_id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measurements`
--

LOCK TABLES `measurements` WRITE;
/*!40000 ALTER TABLE `measurements` DISABLE KEYS */;
INSERT INTO `measurements` VALUES
('2024-11-10 14:40:00',1,1,12.5,25,1.2,10,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('2024-11-10 15:00:00',2,2,11.7,24.8,1.5,15,25,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('2024-11-10 15:20:00',3,3,13.2,23.4,1.1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('2024-11-10 15:40:00',4,4,10.9,26.1,1.3,5,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('2024-11-10 16:00:00',5,5,12,25.5,1,8,16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('2008-11-11 12:12:49',6,1,12.4,19.4,2.1,16,19,12.3,19.2,102.2,15.6,14.7,17,102.1,12.1,'KAAS','eeen',12.2),
('2025-01-25 15:04:53',7,1,NULL,NULL,NULL,NULL,NULL,1.4,12.9,102.6,12.8,51.3,13,79.6,2.3,NULL,NULL,12.48);
/*!40000 ALTER TABLE `measurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_password`
--

DROP TABLE IF EXISTS `reset_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reset_password` (
  `reset_id` varchar(11) NOT NULL,
  `expire` date DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`reset_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reset_password_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_password`
--

LOCK TABLES `reset_password` WRITE;
/*!40000 ALTER TABLE `reset_password` DISABLE KEYS */;
INSERT INTO `reset_password` VALUES
('rst1','2024-12-01',1),
('rst2','2024-12-02',2),
('rst3','2024-12-03',3),
('rst4','2024-12-04',4),
('rst5','2024-12-05',5);
/*!40000 ALTER TABLE `reset_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permissions` (
  `device_id` int NOT NULL,
  `user_id` int NOT NULL,
  `permissions` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`device_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`),
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES
(1,1,'read'),
(2,1,'write'),
(3,2,'read'),
(4,3,'read'),
(5,4,'write');
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `admin` int DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'john_doe',1,'password123','John Doe','john.doe@example.com'),
(2,'jane_smith',0,'securepass456','Jane Smith','jane.smith@example.com'),
(3,'admin_user',1,'adminpass789','Admin User','admin@example.com'),
(4,'bob_brown',0,'bobpass101','Bob Brown','bob.brown@example.com'),
(5,'alex_jones',0,'alexpass202','Alex Jones','alice.jones@example.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-29 15:14:23
