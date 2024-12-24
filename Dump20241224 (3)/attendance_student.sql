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
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accNo` int NOT NULL,
  `sfirstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `wardenId` int DEFAULT NULL,
  `blockId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `phoneNo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `native` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `roomId` int DEFAULT NULL,
  `studProfile` varchar(356) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accNo` (`accNo`),
  UNIQUE KEY `email` (`email`),
  KEY `wardenId` (`wardenId`),
  KEY `blockId` (`blockId`),
  KEY `departmentId` (`departmentId`),
  KEY `student_ibfk_5_idx` (`roomId`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`wardenId`) REFERENCES `user` (`id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`blockId`) REFERENCES `blocks` (`id`),
  CONSTRAINT `student_ibfk_4` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`),
  CONSTRAINT `student_ibfk_5` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,663,'leo','raj',1,1,2,'234346453','leoraj@gmail.com','dindigul','2024-07-27 18:35:19',NULL,NULL,1,'studProfile-1732858093760-306881081.jpg'),(2,232,'bala','Kumar',2,1,1,'235434634','balakumar@gmail.com','dindigul','2024-07-27 18:36:14',NULL,NULL,1,'studProfile-1732808230113-487809781.jpg'),(3,333,'janick','anto',1,1,2,'238783646','janick2@gmail.com','madurai','2024-08-10 16:16:15',NULL,NULL,3,NULL),(6,222,'pojan','gyin',1,1,2,'27327627','pojan44@gmail.com','dindigul','2024-09-10 16:29:03',NULL,'2024-11-26 15:40:02',2,NULL),(7,321,'kavi','muthu',1,1,2,'637282732','kavi22@gmail.com','dindigul','2024-09-10 16:46:33',NULL,NULL,1,NULL),(8,555,'pojan','nixon',1,1,2,'247279329','cameo@gmial.com','dindigul','2024-09-26 15:26:42',NULL,NULL,2,NULL),(10,777,'raja','malai',2,1,2,'234783783','malai@gmail.com','dindigul','2024-09-26 15:33:37',NULL,NULL,1,NULL),(12,322,'jeeva','muthu',2,1,2,'37287282323','jeeva@gmail.com','madurai','2024-10-26 09:53:45',NULL,NULL,2,NULL),(15,323,'gugan','raja',2,1,2,'322982983928','gugan@gmail.com','tirupur','2024-10-26 09:59:13',NULL,NULL,2,NULL),(16,324,'pavan','kumar',2,2,1,'87832782787','pavan@gmail.com','tirupur','2024-10-26 10:00:32',NULL,'2024-11-26 15:48:37',1,NULL),(18,1287,'ravi','Kumar',2,1,1,'0739879379','ravikumar@gmail.com','dindigul','2024-11-28 15:33:53',NULL,NULL,1,'studProfile-1732807791205-150325147.jpg'),(20,287,'brigth','antony',2,1,1,'7575276537','modernbrigth@gmail.com','dindigul','2024-11-28 15:38:52',NULL,NULL,1,'studProfile-1732808332729-36617533.jpg'),(21,342,'cladin','raja',2,1,1,'386782363','cladin@gmail.com','Dindigul','2024-11-28 17:24:26',NULL,NULL,1,'studProfile-1732814666621-23944253.JPG');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-24 16:54:53
