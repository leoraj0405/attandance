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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `otp` varchar(255) DEFAULT NULL,
  `unBlockTime` varchar(255) DEFAULT NULL,
  `otpAttempt` int DEFAULT NULL,
  `profileImage` varchar(356) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `loginId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'felix','kumar','657564674','leoraj04065@gmail.com','shad01','12313','2024-07-27 18:33:01','2024-12-06 04:40:59',NULL,1,'AWVYSJ',NULL,0,'profile-1732342448211-493972052.jpg'),(2,'rex','r','434245522','sample@gmail.com','shad02','123','2024-07-27 18:34:01',NULL,NULL,0,NULL,'2024-10-25 15:52:27',1,''),(3,'leo','m','2329743873','leo@gmail.com','shad03','12313','2024-08-01 04:36:27',NULL,NULL,0,'KPD14O','2024-10-25 17:50:26',1,''),(4,'francis','m','2i323487','francis@gmail.com','shad04','fa123','2024-08-01 04:38:46',NULL,NULL,0,'W1ALPA','2024-10-25 19:15:37',1,''),(5,'bright','m','3453545632','bright@gmail.com','shad05','b123','2024-08-01 04:41:26',NULL,'2024-11-06 17:18:07',0,'MQ9VQH','2024-10-25 19:11:19',1,''),(6,'sada','asdadsa','2143411','assad@gmail.com','shad06','12','2024-08-01 04:50:27',NULL,'2024-11-06 17:18:20',0,'1QGITC','2024-10-28 04:54:32',1,''),(7,'cameo','dass','12334567891','democameo@gmail.com','shad07','1234','2024-08-21 16:55:15',NULL,NULL,0,NULL,NULL,1,''),(8,'pojan','y','8220664282','demoPojan@gmail.com','shad08','123421','2024-08-22 11:12:54',NULL,'2024-11-14 11:35:42',0,NULL,NULL,1,''),(10,'kavi','h','217829727','kavi@gmail.com','shad10','9999','2024-09-08 16:04:08','2024-09-22 16:14:51',NULL,0,NULL,NULL,1,''),(11,'pojan','nikson','87188483','pojan44@gmail.com','shad20','5667','2024-09-08 16:24:09',NULL,NULL,0,NULL,NULL,1,''),(13,'john','snow','234567890','jon@gmail.com','shad11','asd','2024-09-10 16:49:28',NULL,NULL,0,NULL,NULL,1,''),(14,'geo','j','1278638263','geo@gmail.com','shad12','81736','2024-09-21 06:37:43',NULL,NULL,0,NULL,NULL,1,''),(16,'rahul','j','23486548','rahul@gmail.com','shad13','81736','2024-09-21 15:42:03',NULL,NULL,0,NULL,NULL,1,''),(17,'leo','Guru','1232321','dummy@gmail.com','shad14','123','2024-09-21 15:50:59',NULL,NULL,0,NULL,NULL,1,''),(22,'leo','dass','12456','demo2@gmail.com','shad16','123','2024-09-21 15:57:48',NULL,'2024-11-14 10:27:26',0,NULL,NULL,1,''),(23,'shvh','j','273283','asddas@gmail.com','shad17','132','2024-09-21 16:20:57',NULL,'2024-11-14 04:38:51',0,NULL,NULL,1,''),(24,'hjg','j','273283','hjg@gmail.com','shad18','132','2024-09-21 16:30:36',NULL,'2024-11-06 17:18:32',0,'EWL1F2','2024-10-28 05:05:02',3,''),(25,'drop table user; -->','j','273283','tyr@gmail.com','shad19','132','2024-10-06 16:59:50',NULL,'2024-10-26 08:24:51',0,NULL,NULL,1,''),(26,'jones','muthu','13232827','muthu@gmail.com','shad21','12313','2024-10-06 17:37:49',NULL,NULL,0,'6168HQ','2024-10-28 05:03:53',3,''),(29,'rex','preveen','13278232','demorex@gmail.com','shad25','12313','2024-10-15 15:47:38',NULL,NULL,1,'COGL2B','2024-10-28 04:55:24',1,''),(36,'jeeva','d','3772298329','jeevaa@gmail.com','shad26','123','2024-10-26 08:20:47',NULL,NULL,1,'ZP38N4','2024-10-28 05:02:21',4,''),(37,'roshan','kumar','13423423','roshan@gmail.com','shad27','12313','2024-10-27 20:28:27',NULL,NULL,1,'','',1,''),(38,'james','asutin','2374728827','austin@gmail.com','shad30','1234','2024-11-06 15:59:49',NULL,NULL,1,NULL,NULL,1,''),(39,'mani','kandan','12673812','maniman@gmail.com','shad31','123','2024-11-14 11:31:54',NULL,'2024-11-16 09:43:29',0,NULL,NULL,1,''),(42,'kiran','kesavan','7678656765','keka@gmail.com','shad15','fgh','2024-11-16 10:01:02',NULL,'2024-11-16 10:01:38',1,NULL,NULL,1,''),(44,'abi','neyan','6283648732','abineyan@gmail.com','shad32','123','2024-11-20 16:19:55',NULL,NULL,0,NULL,NULL,1,''),(48,'ravi','kumar','1234142132','ravikumar@gmail.com','shad33','123','2024-11-21 05:28:21',NULL,NULL,0,NULL,NULL,1,'profile-1732167664650-535185615.jpg'),(53,'guna','raja','3456789765','guna@gmail.com','shad35','1234','2024-11-25 16:21:29',NULL,NULL,1,NULL,NULL,1,'profile-1732551689390-752459427.jpg');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-24 16:54:51
