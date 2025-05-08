-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: attendance
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dayattendance`
--

DROP TABLE IF EXISTS `dayattendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dayattendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int DEFAULT NULL,
  `wardenId` int DEFAULT NULL,
  `appearance` enum('p','a','l') DEFAULT NULL,
  `date` date DEFAULT NULL,
  `reason` text,
  `roomId` int DEFAULT NULL,
  `blockId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`,`studentId`),
  KEY `wardenId` (`wardenId`),
  KEY `dayattendance_ibfk_2_idx` (`studentId`),
  KEY `roomId` (`roomId`),
  KEY `blockId` (`blockId`),
  CONSTRAINT `dayattendance_ibfk_1` FOREIGN KEY (`wardenId`) REFERENCES `user` (`id`),
  CONSTRAINT `dayattendance_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`),
  CONSTRAINT `dayattendance_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`),
  CONSTRAINT `dayattendance_ibfk_4` FOREIGN KEY (`blockId`) REFERENCES `blocks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dayattendance`
--

LOCK TABLES `dayattendance` WRITE;
/*!40000 ALTER TABLE `dayattendance` DISABLE KEYS */;
-- INSERT INTO `dayattendance` VALUES (1,1,1,'p','2024-10-28','',1,1),(2,7,1,'p','2024-10-28','',1,1),(3,10,1,'p','2024-10-28','',1,1),(4,16,1,'p','2024-10-28','',1,2),(5,1,1,'a','2024-11-22','',1,1),(6,10,1,'a','2024-11-22','',1,1),(7,7,1,'a','2024-11-22','',1,1),(8,16,1,'a','2024-11-22','',1,2),(9,1,1,'a','2024-11-21','',1,1),(10,7,1,'a','2024-11-21','',1,1),(11,10,1,'a','2024-11-21','',1,1),(12,16,1,'a','2024-11-21','',1,2),(29,1,1,'p','2024-11-23','',1,1),(30,7,1,'a','2024-11-23','',1,1),(31,10,1,'l','2024-11-23','',1,1),(32,2,1,'a','2024-11-23','',3,1),(33,3,1,'p','2024-11-23','',3,1),(37,2,1,'l','2024-10-26','',1,10),(41,1,1,'p','2024-11-04','',1,1),(42,7,1,'p','2024-11-04','',1,1),(43,10,1,'p','2024-11-04','',1,1),(44,1,1,'p','2024-11-15','',1,1),(45,10,1,'p','2024-11-15','',1,1),(46,7,1,'p','2024-11-15','',1,1),(56,1,1,'p','2024-11-25','',1,1),(57,10,1,'l','2024-11-25','going to home',1,1),(58,7,1,'p','2024-11-25','',1,1),(59,7,2,'p','2024-11-17','',1,1),(60,1,2,'p','2024-11-17','',1,1),(61,10,2,'p','2024-11-17','',1,1),(62,7,1,'p','2024-11-27','',1,1),(63,1,1,'p','2024-11-27','',1,1),(64,10,1,'a','2024-11-27','',1,1),(65,1,1,'p','2024-11-29','',1,1),(66,7,1,'a','2024-11-29','',1,1),(67,2,1,'p','2024-11-29','',1,1),(68,10,1,'a','2024-11-29','',1,1),(69,18,1,'a','2024-11-29','',1,1),(70,20,1,'a','2024-11-29','',1,1),(71,21,1,'l','2024-11-29','going to home',1,1),(72,1,1,'p','2024-10-30','',1,1),(73,2,1,'a','2024-10-30','',1,1),(74,10,1,'p','2024-10-30','',1,1),(75,20,1,'p','2024-10-30','',1,1),(76,18,1,'a','2024-10-30','',1,1),(77,7,1,'a','2024-10-30','',1,1),(78,21,1,'a','2024-10-30','',1,1),(79,1,1,'p','2024-12-03','',1,1),(80,2,1,'a','2024-12-03','',1,1),(81,7,1,NULL,'2024-12-03','',1,1),(82,10,1,NULL,'2024-12-03','',1,1),(83,18,1,NULL,'2024-12-03','',1,1),(84,20,1,NULL,'2024-12-03','',1,1),(85,21,1,NULL,'2024-12-03','',1,1),(86,1,1,'p','2024-12-06','',1,1),(87,2,1,'a','2024-12-06','',1,1),(88,7,1,'a','2024-12-06','',1,1),(89,20,1,'l','2024-12-06','going to home',1,1),(90,10,1,'a','2024-12-06','',1,1),(91,18,1,'a','2024-12-06','',1,1),(92,21,1,'p','2024-12-06','',1,1);
/*!40000 ALTER TABLE `dayattendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-24 16:54:50
