CREATE DATABASE  IF NOT EXISTS `poi_chat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `poi_chat`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: poi_chat
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `amistad`
--

DROP TABLE IF EXISTS `amistad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amistad` (
  `ID_Amistad` int(11) NOT NULL AUTO_INCREMENT,
  `usuario1` int(11) DEFAULT NULL,
  `usuario2` int(11) DEFAULT NULL,
  `estado` enum('pendiente','aceptado','bloqueado','rechazado') DEFAULT NULL,
  `Sileciar` bit(1) DEFAULT NULL,
  `Favorito` bit(1) DEFAULT NULL,
  PRIMARY KEY (`ID_Amistad`),
  KEY `usuario1` (`usuario1`),
  KEY `usuario2` (`usuario2`),
  CONSTRAINT `amistad_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuario` (`ID_Us`),
  CONSTRAINT `amistad_ibfk_2` FOREIGN KEY (`usuario2`) REFERENCES `usuario` (`ID_Us`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amistad`
--

LOCK TABLES `amistad` WRITE;
/*!40000 ALTER TABLE `amistad` DISABLE KEYS */;
INSERT INTO `amistad` VALUES (2,5,3,'aceptado',NULL,NULL),(3,4,3,'aceptado',NULL,NULL),(5,7,3,'aceptado',NULL,NULL),(6,8,3,'aceptado',NULL,NULL),(7,9,3,'aceptado',NULL,NULL),(9,6,4,'aceptado',NULL,NULL),(14,2,4,'aceptado',_binary '\0',_binary '\0'),(15,4,10,'aceptado',_binary '\0',_binary ''),(18,3,6,'pendiente',NULL,NULL),(19,3,10,'aceptado',NULL,NULL),(20,2,11,'aceptado',NULL,NULL),(21,3,11,'aceptado',_binary '\0',_binary ''),(22,3,13,'pendiente',NULL,NULL),(23,11,13,'pendiente',NULL,NULL),(24,16,15,'pendiente',NULL,NULL),(25,16,13,'pendiente',NULL,NULL),(26,3,15,'pendiente',NULL,NULL),(27,16,12,'pendiente',NULL,NULL),(28,3,12,'pendiente',NULL,NULL),(29,16,7,'aceptado',NULL,NULL),(30,3,16,'bloqueado',NULL,NULL),(31,4,11,'pendiente',NULL,NULL),(32,4,17,'pendiente',NULL,NULL),(33,4,18,'aceptado',NULL,NULL),(35,18,2,'aceptado',NULL,NULL),(36,20,2,'aceptado',NULL,NULL),(37,20,4,'aceptado',NULL,_binary ''),(38,21,2,'aceptado',NULL,NULL),(39,21,4,'aceptado',NULL,NULL),(40,21,17,'pendiente',NULL,NULL),(41,21,18,'aceptado',NULL,NULL),(42,21,19,'aceptado',NULL,NULL),(43,10,2,'aceptado',NULL,NULL),(44,10,5,'pendiente',NULL,NULL),(45,10,22,'pendiente',NULL,NULL),(46,22,4,'aceptado',NULL,NULL),(47,20,21,'pendiente',NULL,NULL),(48,18,19,'aceptado',NULL,NULL),(49,19,18,'aceptado',NULL,NULL),(50,20,10,'pendiente',NULL,NULL),(51,20,22,'pendiente',NULL,NULL),(52,7,4,'aceptado',NULL,NULL),(55,3,2,'aceptado',NULL,NULL);
/*!40000 ALTER TABLE `amistad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversacion`
--

DROP TABLE IF EXISTS `conversacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversacion` (
  `ID_Conversacion` int(11) NOT NULL AUTO_INCREMENT,
  `esGrupo` tinyint(1) NOT NULL DEFAULT 0,
  `nombreGrupo` varchar(100) DEFAULT NULL,
  `fotoGrupo` varchar(255) DEFAULT NULL,
  `idCreador` int(11) DEFAULT NULL,
  `fotoBanner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Conversacion`),
  KEY `fk_conversacion_creador` (`idCreador`),
  CONSTRAINT `fk_conversacion_creador` FOREIGN KEY (`idCreador`) REFERENCES `usuario` (`ID_Us`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversacion`
--

LOCK TABLES `conversacion` WRITE;
/*!40000 ALTER TABLE `conversacion` DISABLE KEYS */;
INSERT INTO `conversacion` VALUES (1,0,NULL,NULL,NULL,NULL),(2,0,NULL,NULL,NULL,NULL),(3,0,NULL,NULL,NULL,NULL),(4,0,NULL,NULL,NULL,NULL),(5,0,NULL,NULL,NULL,NULL),(6,0,NULL,NULL,NULL,NULL),(7,0,NULL,NULL,NULL,NULL),(8,0,NULL,NULL,NULL,NULL),(9,0,NULL,NULL,NULL,NULL),(10,1,'Los Poitasticos','/uploads/1780109229446-565796515.jpg',3,'/uploads/1780109229493-30627061.jpg'),(11,1,'Prueba contundente','/uploads/1780102688359-850853738.jpg',3,NULL),(12,0,NULL,NULL,NULL,NULL),(13,0,NULL,NULL,NULL,NULL),(14,1,'asdagaSFGAF',NULL,11,NULL),(15,0,NULL,NULL,NULL,NULL),(16,0,NULL,NULL,NULL,NULL),(17,0,NULL,NULL,NULL,NULL),(18,0,NULL,NULL,NULL,NULL),(19,1,'Los papus pro','/uploads/1780122190746-441033580.jpg',4,'/uploads/1780122190772-328025300.jpg'),(20,0,NULL,NULL,NULL,NULL),(21,0,NULL,NULL,NULL,NULL),(22,0,NULL,NULL,NULL,NULL),(23,0,NULL,NULL,NULL,NULL),(24,1,'Mau gei',NULL,19,NULL),(25,0,NULL,NULL,NULL,NULL),(26,1,'Los reprobados','/uploads/1780123136950-534977179.gif',4,'/uploads/1780123137844-1067187.gif'),(27,1,'as','/uploads/1780129599762-188525115.png',3,'/uploads/1780129599923-537914716.png'),(28,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `conversacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversacion_usuario`
--

DROP TABLE IF EXISTS `conversacion_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversacion_usuario` (
  `id_conversacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `rol` enum('miembro','admin') NOT NULL DEFAULT 'miembro',
  PRIMARY KEY (`id_conversacion`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `conversacion_usuario_ibfk_1` FOREIGN KEY (`id_conversacion`) REFERENCES `conversacion` (`ID_Conversacion`),
  CONSTRAINT `conversacion_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Us`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversacion_usuario`
--

LOCK TABLES `conversacion_usuario` WRITE;
/*!40000 ALTER TABLE `conversacion_usuario` DISABLE KEYS */;
INSERT INTO `conversacion_usuario` VALUES (1,2,'miembro'),(1,3,'miembro'),(2,3,'miembro'),(2,5,'miembro'),(3,3,'miembro'),(3,4,'miembro'),(4,3,'miembro'),(4,7,'miembro'),(5,3,'miembro'),(5,9,'miembro'),(6,3,'miembro'),(6,8,'miembro'),(7,4,'miembro'),(7,6,'miembro'),(8,2,'miembro'),(8,4,'miembro'),(9,4,'miembro'),(9,10,'miembro'),(10,2,'admin'),(10,3,'admin'),(10,4,'admin'),(10,5,'miembro'),(11,2,'miembro'),(11,3,'admin'),(11,7,'miembro'),(11,9,'miembro'),(12,2,'miembro'),(12,11,'miembro'),(13,3,'miembro'),(13,11,'miembro'),(14,2,'miembro'),(14,3,'miembro'),(14,11,'admin'),(15,7,'miembro'),(15,16,'miembro'),(16,4,'miembro'),(16,18,'miembro'),(17,4,'miembro'),(17,20,'miembro'),(18,18,'miembro'),(18,21,'miembro'),(19,4,'admin'),(19,18,'miembro'),(19,20,'miembro'),(19,21,'miembro'),(19,22,'miembro'),(20,3,'miembro'),(20,10,'miembro'),(21,4,'miembro'),(21,21,'miembro'),(22,18,'miembro'),(22,19,'miembro'),(23,19,'miembro'),(23,21,'miembro'),(24,4,'miembro'),(24,18,'miembro'),(24,19,'admin'),(24,21,'miembro'),(25,4,'miembro'),(25,22,'miembro'),(26,4,'admin'),(26,20,'admin'),(26,22,'miembro'),(27,2,'miembro'),(27,3,'admin'),(27,9,'admin'),(27,16,'miembro'),(28,2,'miembro'),(28,18,'miembro');
/*!40000 ALTER TABLE `conversacion_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `ID_Item` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Tipo` enum('banner','marco','sticker','color','insignia') DEFAULT NULL,
  `Precio` int(11) DEFAULT NULL,
  `Imagen` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensaje`
--

DROP TABLE IF EXISTS `mensaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensaje` (
  `ID_Mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `id_conversacion` int(11) DEFAULT NULL,
  `id_remitente` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT current_timestamp(),
  `tipo` varchar(10) NOT NULL DEFAULT 'texto',
  `archivo` varchar(500) DEFAULT NULL,
  `leido` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID_Mensaje`),
  KEY `id_conversacion` (`id_conversacion`),
  KEY `id_remitente` (`id_remitente`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`id_conversacion`) REFERENCES `conversacion` (`ID_Conversacion`),
  CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`id_remitente`) REFERENCES `usuario` (`ID_Us`)
) ENGINE=InnoDB AUTO_INCREMENT=539 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensaje`
--

LOCK TABLES `mensaje` WRITE;
/*!40000 ALTER TABLE `mensaje` DISABLE KEYS */;
INSERT INTO `mensaje` VALUES (1,1,2,'Hola','2026-04-24 19:34:25','texto',NULL,1),(2,1,3,'Increible funciona','2026-04-24 19:37:50','texto',NULL,1),(3,1,3,'Asies','2026-04-24 19:37:57','texto',NULL,1),(4,1,3,'que rollo se invirtio o soy yo?','2026-04-24 19:42:17','texto',NULL,1),(5,1,3,'nAH ESTA BIEN','2026-04-24 19:42:26','texto',NULL,1),(6,1,3,'fUNCIONA?','2026-04-24 19:46:45','texto',NULL,1),(7,1,2,'eSPERO QUE SI','2026-04-24 19:46:58','texto',NULL,1),(8,1,3,'Haber','2026-04-24 19:49:32','texto',NULL,1),(9,1,3,'Genial ya lo logré','2026-04-24 19:49:40','texto',NULL,1),(10,1,2,'Epico','2026-04-24 19:49:44','texto',NULL,1),(11,1,3,'yA FUNCIONA MIRA','2026-04-24 19:51:07','texto',NULL,1),(12,1,2,'tREMENDO','2026-04-24 19:51:13','texto',NULL,1),(13,1,2,'cASI MAGICO','2026-04-24 19:51:17','texto',NULL,1),(14,1,3,'aSIES MI COMPADRE xd','2026-04-24 19:51:28','texto',NULL,1),(15,1,3,'hola','2026-04-25 00:09:23','texto',NULL,1),(16,1,3,'Probando','2026-04-25 00:23:21','texto',NULL,1),(17,1,2,'Vamoo','2026-04-25 00:23:30','texto',NULL,1),(18,1,2,'Prueba 3','2026-04-25 00:26:44','texto',NULL,1),(19,2,3,'hola','2026-04-25 00:33:42','texto',NULL,0),(20,2,5,'Que onda','2026-04-25 00:33:46','texto',NULL,1),(21,3,4,'hola mamasita, como estas?, estas solita?','2026-04-25 00:37:59','texto',NULL,1),(22,3,3,'Esto lo va a ver el profe sabes jajaja','2026-04-25 00:39:19','texto',NULL,1),(23,3,4,'xd','2026-04-25 00:39:24','texto',NULL,1),(24,3,4,'hola profe uwu','2026-04-25 00:39:29','texto',NULL,1),(25,3,4,'lo quiero mucho','2026-04-25 00:39:33','texto',NULL,1),(26,3,4,'KJSAHDHKASJDH','2026-04-25 00:39:36','texto',NULL,1),(27,3,3,'jajajaja','2026-04-25 00:39:45','texto',NULL,1),(28,3,3,'pos ta con madre','2026-04-25 00:39:54','texto',NULL,1),(29,3,3,'batalle un poco pero ya jala','2026-04-25 00:40:07','texto',NULL,1),(30,3,4,'EIT YO TAMBIEN HICE UNA PRUEVA CON NGROK','2026-04-25 00:40:12','texto',NULL,1),(31,3,3,'solo que pues como ves no carga los iconos mas que nada','2026-04-25 00:40:21','texto',NULL,1),(32,3,4,'PERO PUES MEJOR LA HUBIERA ECHO EN EL PROYECTO XD','2026-04-25 00:40:25','texto',NULL,1),(33,3,3,'jajajaja','2026-04-25 00:40:36','texto',NULL,1),(34,3,4,'ESO LO ARREGLAMOS DESPUES','2026-04-25 00:40:37','texto',NULL,1),(35,3,3,'yo','2026-04-25 00:40:39','texto',NULL,1),(36,3,4,'AHORITA JALA EL CHAT','2026-04-25 00:40:45','texto',NULL,1),(37,3,3,'no crees que nos diga algo o si del diseño?','2026-04-25 00:40:54','texto',NULL,1),(38,3,4,'EH ASE SCROLL CUANDO HAY MUCHOS MENSAJES?','2026-04-25 00:40:56','texto',NULL,1),(39,3,4,'AGUESO','2026-04-25 00:40:59','texto',NULL,1),(40,3,4,'QUE RICO','2026-04-25 00:41:02','texto',NULL,1),(41,3,3,'ei','2026-04-25 00:41:03','texto',NULL,1),(42,3,4,'YO DIGO QUE...','2026-04-25 00:41:19','texto',NULL,1),(43,3,4,'MMMMM','2026-04-25 00:41:21','texto',NULL,1),(44,3,4,'NAH SI','2026-04-25 00:41:30','texto',NULL,1),(45,3,3,'tambien cuando te conectas desde otro dispositivo agarra de la bd los registros de mensajes si entras con la misma cuenta pero en otro dispositivo','2026-04-25 00:41:33','texto',NULL,1),(46,3,4,'OJO','2026-04-25 00:41:45','texto',NULL,1),(47,3,4,'CONMADRE','2026-04-25 00:41:48','texto',NULL,1),(48,3,3,'y pos te trae tu chat','2026-04-25 00:41:48','texto',NULL,1),(49,3,4,'GRACIAS RAUL','2026-04-25 00:41:52','texto',NULL,1),(50,3,4,'UWU','2026-04-25 00:41:53','texto',NULL,1),(51,3,4,'<#','2026-04-25 00:41:57','texto',NULL,1),(52,3,3,'tarda menos que el messenger o whatsapp jajaja','2026-04-25 00:42:00','texto',NULL,1),(53,3,4,'IIIIH','2026-04-25 00:42:00','texto',NULL,1),(54,3,4,'3','2026-04-25 00:42:02','texto',NULL,1),(55,3,4,'A NO SI JALÑA','2026-04-25 00:42:06','texto',NULL,1),(56,3,4,'XD','2026-04-25 00:42:10','texto',NULL,1),(57,3,4,'ANDALE','2026-04-25 00:42:11','texto',NULL,1),(58,3,4,'VAMOS A REVOLUCIONAR EL CHAT','2026-04-25 00:42:19','texto',NULL,1),(59,3,4,'DDDDD','2026-04-25 00:42:21','texto',NULL,1),(60,3,3,'pero bueno ya quedo asi lo dejo?','2026-04-25 00:42:22','texto',NULL,1),(61,3,4,'MMMM','2026-04-25 00:42:32','texto',NULL,1),(62,3,3,'pa mandar un ultimo push al repositorio','2026-04-25 00:42:33','texto',NULL,1),(63,3,3,'o que onda?','2026-04-25 00:42:44','texto',NULL,1),(64,3,4,'MANDA EL PUSH, Y SI PUEDES NADA MÁS...','2026-04-25 00:42:59','texto',NULL,1),(65,3,4,'PEA','2026-04-25 00:43:00','texto',NULL,1),(66,3,4,'NADAMÁS VE COMO SE ARREGLA UNO','2026-04-25 00:43:09','texto',NULL,1),(67,3,3,'si puedo que?','2026-04-25 00:43:22','texto',NULL,1),(68,3,3,'no te entendi perdon','2026-04-25 00:43:26','texto',NULL,1),(69,3,4,'O PONLE UNA IMAGEN PREDETERMINADA A LOS USUARIOS','2026-04-25 00:43:27','texto',NULL,1),(70,3,4,'LO DE LOS ICONOS','2026-04-25 00:43:34','texto',NULL,1),(71,3,3,'ah smn voy a intentar hacer eso','2026-04-25 00:43:36','texto',NULL,1),(72,3,4,'VAVA','2026-04-25 00:43:42','texto',NULL,1),(73,3,4,'THX','2026-04-25 00:43:44','texto',NULL,1),(74,3,4,'YO VOY A SEGUIR DANDOLE A PW2','2026-04-25 00:43:53','texto',NULL,1),(75,3,3,'espero no tardarme pero voy a mandar el push asi como quiera pa por si la llego a cajetear pos tener un backup con lo que sirve','2026-04-25 00:44:08','texto',NULL,1),(76,3,3,'dale','2026-04-25 00:44:15','texto',NULL,1),(77,3,4,'YA ME VOY A SALIR DE ESTA MAUSER','2026-04-25 00:44:21','texto',NULL,1),(78,3,3,'date','2026-04-25 00:44:24','texto',NULL,1),(79,3,4,'* DESAPARECE *','2026-04-25 00:44:34','texto',NULL,1),(80,2,5,'Estás despierto?','2026-04-25 01:25:50','texto',NULL,1),(81,2,3,'sip','2026-04-25 01:25:53','texto',NULL,0),(82,4,7,'queondi','2026-04-25 01:29:13','texto',NULL,1),(83,4,3,'que rollo','2026-04-25 01:29:18','texto',NULL,1),(84,4,3,'que te parece?','2026-04-25 01:29:24','texto',NULL,1),(85,4,7,'ala','2026-04-25 01:29:25','texto',NULL,1),(86,4,7,'wriz','2026-04-25 01:29:29','texto',NULL,1),(87,4,3,'responde al moment padre','2026-04-25 01:29:32','texto',NULL,1),(88,4,7,'ei','2026-04-25 01:29:36','texto',NULL,1),(89,4,7,'wasap 2','2026-04-25 01:29:39','texto',NULL,1),(90,4,3,'magico','2026-04-25 01:29:39','texto',NULL,1),(91,4,3,'jajajajaja','2026-04-25 01:29:42','texto',NULL,1),(92,4,7,'top tier','2026-04-25 01:29:43','texto',NULL,1),(93,4,3,'pero bueno ya esta hasta aqui lo dejo ya con eso no deberia haber queja','2026-04-25 01:30:00','texto',NULL,1),(94,4,7,'goti','2026-04-25 01:30:14','texto',NULL,1),(95,4,3,'jala todotodito','2026-04-25 01:30:16','texto',NULL,1),(96,4,3,'bueno lo necesario','2026-04-25 01:30:25','texto',NULL,1),(97,4,7,'⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀ ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀ Tumutumu ⢴⣶⣶⣿⣿⣿⣆ ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟ ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀ ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀ ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢸⣿⣀⣀⣀⣼⡿⢿⣿⣿⣿⣿⣿⡿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠙⠛⠛⠛⠋⠁⠀⠙⠻⠿⠟⠋⠑⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀','2026-04-25 01:30:28','texto',NULL,1),(98,4,3,'jajajaja','2026-04-25 01:30:40','texto',NULL,1),(99,4,7,'⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠉⠉⠉⠉⠉⠉⠉⠙⠻⢶⣄⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀    ⠀⠙⣷⡀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡟⠀⣠⣶⠛⠛⠛⠛⠛⠛⠳⣦⡀⠀⠘⣿⡄⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠁⠀⢹⣿⣦⣀⣀⣀⣀⣀⣠⣼⡇⠀⠀⠸⣷⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡏⠀⠀⠀⠉⠛⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⣿ ⠀⠀           ⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀                  ⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀ ⠀⠀⠀⠀⠀⠀⠀⢸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠀ ⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⣿⠀ ⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⣿⠀ ⠀⠀⠀⠀⠀⠀⢰⣿⠀⠀⠀⠀⣠⡶⠶⠿⠿⠿⠿⢷⣦⠀⠀⠀⠀⠀    ⣿⠀ ⠀⠀⣀⣀⣀⠀⣸⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⣿⠀ ⣠⡿⠛⠛⠛⠛⠻⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀ ⠀⣿⠀ ⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡟⠀⠀⢀⣤⣤⣴⣿⠀⠀⠀⠀⠀⠀  ⠀⣿⠀ ⠈⠙⢷⣶⣦⣤⣤⣤⣴⣶⣾⠿⠛⠁⢀⣶⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀                                ⠀⠀⠀⠀⠈⣿⣆⡀⠀⠀⠀⠀⠀⠀⢀⣠⣴⡾⠃⠀ ⠀                        ⠀⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣾⣿⡿⠿⠟⠋⠁⠀⠀⠀','2026-04-25 01:30:48','texto',NULL,1),(100,4,7,'⣿⣿⠟⢹⣶⣶⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⡟⢰⡌⠿⢿⣿⡾⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⢸⣿⣤⣒⣶⣾⣳⡻⣿⣿⣿⣿⡿⢛⣯⣭⣭⣭⣽⣻⣿⣿ ⣿⣿⢸⣿⣿⣿⣿⢿⡇⣶⡽⣿⠟⣡⣶⣾⣯⣭⣽⣟⡻⣿⣷⡽ ⣿⣿⠸⣿⣿⣿⣿⢇⠃⣟⣷⠃⢸⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣇⢻⣿⣿⣯⣕⠧⢿⢿⣇⢯⣝⣒⣛⣯⣭⣛⣛⣣⣿⣿⣿ ⣿⣿⣿⣌⢿⣿⣿⣿⣿⡘⣞⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣦⠻⠿⣿⣿⣷⠈⢞⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣗⠄⢿⣿⣿⡆⡈⣽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⡿⣻⣽⣿⣆⠹⣿⡇⠁⣿⡼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟ ⠿⣛⣽⣾⣿⣿⠿⠋⠄⢻⣷⣾⣿⣧⠟⣡⣾⣿⣿⣿⣿⣿⣿⡇ ⡟⢿⣿⡿⠋⠁⣀⡀⠄⠘⠊⣨⣽⠁⠰⣿⣿⣿⣿⣿⣿⣿⡍⠗ ⣿⠄⠄⠄⠄⣼⣿⡗⢠⣶⣿⣿⡇⠄⠄⣿⣿⣿⣿⣿⣿⣿⣇⢠ ⣝⠄⠄⢀⠄⢻⡟⠄⣿⣿⣿⣿⠃⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⢹ ⣿⣿⣿⣿⣧⣄⣁⡀⠙⢿⡿⠋⠄⣸⡆⠄⠻⣿⡿⠟⢛⣩⣝⣚ ⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣾⣿⣿⣄⠄⠄⠄⣴⣿⣿⣿⣇ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠛⠿⣿⣫⣾','2026-04-25 01:32:20','texto',NULL,1),(101,5,3,'Hola','2026-04-25 07:14:21','texto',NULL,1),(102,5,9,'Hola','2026-04-25 07:14:33','texto',NULL,1),(103,6,8,'Hola','2026-04-25 07:14:47','texto',NULL,1),(104,6,3,'Jsjxjsjd','2026-04-25 07:15:26','texto',NULL,0),(105,6,8,'Funcionó','2026-04-25 07:15:54','texto',NULL,1),(106,5,9,'hola','2026-04-25 07:23:59','texto',NULL,1),(107,5,3,'awdsadw','2026-04-25 07:24:04','texto',NULL,1),(108,5,3,'fghfghfg','2026-04-25 07:24:23','texto',NULL,1),(109,7,4,'hola xd','2026-05-27 23:40:31','texto',NULL,0),(110,7,6,'nigger','2026-05-28 00:50:41','texto',NULL,1),(111,7,4,'que fue?','2026-05-28 00:50:50','texto',NULL,0),(112,7,6,'ada','2026-05-28 00:50:52','texto',NULL,1),(113,7,6,'nada*','2026-05-28 00:50:56','texto',NULL,1),(114,7,6,'xd','2026-05-28 00:50:57','texto',NULL,1),(115,7,4,'1','2026-05-28 17:38:08','texto',NULL,0),(116,7,4,'2','2026-05-28 17:38:09','texto',NULL,0),(117,7,4,'3','2026-05-28 17:38:10','texto',NULL,0),(118,7,4,'4','2026-05-28 17:38:10','texto',NULL,0),(119,7,4,'5','2026-05-28 17:38:12','texto',NULL,0),(120,7,4,'6','2026-05-28 17:38:12','texto',NULL,0),(121,7,4,'hola','2026-05-28 17:39:21','texto',NULL,0),(122,7,4,'2','2026-05-28 17:39:36','texto',NULL,0),(123,7,4,'3','2026-05-28 17:39:37','texto',NULL,0),(124,7,4,'4','2026-05-28 17:39:40','texto',NULL,0),(125,7,4,'5','2026-05-28 17:39:41','texto',NULL,0),(126,7,4,'hola','2026-05-28 17:57:33','texto',NULL,0),(127,7,4,'dame esos puntos','2026-05-28 18:07:15','texto',NULL,0),(128,7,4,'si','2026-05-28 18:07:16','texto',NULL,0),(129,7,4,'hola','2026-05-28 18:07:17','texto',NULL,0),(130,7,4,'xd','2026-05-28 18:07:22','texto',NULL,0),(131,7,4,'1','2026-05-28 18:29:13','texto',NULL,0),(132,7,4,'2','2026-05-28 18:29:14','texto',NULL,0),(133,7,4,'3','2026-05-28 18:29:14','texto',NULL,0),(134,7,4,'4','2026-05-28 18:29:15','texto',NULL,0),(135,7,4,'5','2026-05-28 18:29:15','texto',NULL,0),(136,7,4,'6','2026-05-28 18:29:37','texto',NULL,0),(137,8,4,'wasaaaaaaaa','2026-05-28 21:34:18','texto',NULL,1),(138,9,4,'wazaaaa','2026-05-28 21:44:21','texto',NULL,1),(139,9,10,'Hi','2026-05-28 21:44:22','texto',NULL,1),(140,9,4,'KLJSAKDJASJD','2026-05-28 21:44:35','texto',NULL,1),(141,9,4,'si jala kasjdkajsd','2026-05-28 21:44:38','texto',NULL,1),(142,9,10,'Ci','2026-05-28 21:44:57','texto',NULL,1),(143,9,10,'Te quedó con maye','2026-05-28 21:45:02','texto',NULL,1),(144,9,4,'devolon con 6150 puntos','2026-05-28 21:45:06','texto',NULL,1),(145,9,10,'Las llamadas jalan?','2026-05-28 21:45:22','texto',NULL,1),(146,9,4,'noppi','2026-05-28 21:45:26','texto',NULL,1),(147,9,4,'no estan implementadas','2026-05-28 21:45:30','texto',NULL,1),(148,9,10,'Waos','2026-05-28 21:45:37','texto',NULL,1),(149,9,10,'Que usaste?','2026-05-28 21:45:44','texto',NULL,1),(150,9,10,'Sockets?','2026-05-28 21:45:48','texto',NULL,1),(151,9,4,'yepi','2026-05-28 21:45:52','texto',NULL,1),(152,9,10,'Oh porque sale esa página del inicio?','2026-05-28 21:46:03','texto',NULL,1),(153,9,4,'bueno, se supone que usa socket','2026-05-28 21:46:04','texto',NULL,1),(154,9,4,'cual? cuandos e muestra los developers?','2026-05-28 21:46:22','texto',NULL,1),(155,9,4,'nopas para darle estilo','2026-05-28 21:46:29','texto',NULL,1),(156,9,4,'jsjsjsjs','2026-05-28 21:46:30','texto',NULL,1),(157,9,10,'Es que mandas como una página no?','2026-05-28 21:46:52','texto',NULL,1),(158,9,4,'yepi','2026-05-28 21:47:00','texto',NULL,1),(159,9,10,'Al inicio M','2026-05-28 21:47:00','texto',NULL,1),(160,9,10,'No me hagas mucho caso jsjs','2026-05-28 21:47:06','texto',NULL,1),(161,9,10,'Toy loquito','2026-05-28 21:47:09','texto',NULL,1),(162,9,4,'se supone que es la pagina de \"conoce la app\"','2026-05-28 21:47:12','texto',NULL,1),(163,9,10,'AAAH','2026-05-28 21:47:19','texto',NULL,1),(164,9,10,'YABYA','2026-05-28 21:47:21','texto',NULL,1),(165,9,4,'pero pues nada más le psue el nombre de la pagina y los integrantes del equipo','2026-05-28 21:47:50','texto',NULL,1),(166,9,4,'por que refrescas tanto la pagina?','2026-05-28 21:48:30','texto',NULL,1),(167,9,4,'wa happen?','2026-05-28 21:48:39','texto',NULL,1),(168,9,10,'Que fueM','2026-05-28 21:48:50','texto',NULL,1),(169,9,10,'?','2026-05-28 21:48:51','texto',NULL,1),(170,9,4,'ya vi xd','2026-05-28 21:48:51','texto',NULL,1),(171,9,10,'Cambie foto de perfil ','2026-05-28 21:48:57','texto',NULL,1),(172,9,4,'ya vi ya vi aksjdkasjd','2026-05-28 21:49:03','texto',NULL,1),(173,9,10,'Me gusta más ese','2026-05-28 21:49:11','texto',NULL,1),(174,9,10,'De mi juego','2026-05-28 21:49:14','texto',NULL,1),(175,9,4,'igual se guarda en la carpeta de uploads xd','2026-05-28 21:49:23','texto',NULL,1),(176,9,10,'Comom','2026-05-28 21:49:32','texto',NULL,1),(177,9,10,'?','2026-05-28 21:49:33','texto',NULL,1),(178,9,4,'AKJHSDKJASD','2026-05-28 21:49:43','texto',NULL,1),(179,9,4,'WASHA','2026-05-28 21:49:45','texto',NULL,1),(180,9,4,'el whats','2026-05-28 21:50:07','texto',NULL,1),(181,7,4,'https://maps.app.goo.gl/C6dewG3YayD3aXKp9','2026-05-29 01:08:51','texto',NULL,0),(182,10,3,'Hola','2026-05-29 17:27:37','texto',NULL,1),(183,10,2,'Se envio?','2026-05-29 17:40:49','texto',NULL,1),(184,10,3,'No sé envía nada','2026-05-29 17:41:05','texto',NULL,1),(185,10,3,'Hola','2026-05-29 17:46:16','texto',NULL,1),(186,10,2,'prueba','2026-05-29 17:49:37','texto',NULL,1),(187,10,3,'No funciona al parecer ','2026-05-29 17:50:07','texto',NULL,1),(188,1,2,'Probando','2026-05-29 17:59:58','texto',NULL,1),(189,10,2,'ya funciona al parecer','2026-05-29 18:00:12','texto',NULL,1),(190,10,2,'Hola','2026-05-29 18:01:04','texto',NULL,1),(191,10,2,'Vamoo','2026-05-29 18:04:13','texto',NULL,1),(192,10,2,'Probando 2','2026-05-29 18:04:18','texto',NULL,1),(193,10,2,'listo','2026-05-29 18:06:57','texto',NULL,1),(194,1,2,'hola','2026-05-29 18:54:15','texto',NULL,1),(195,1,3,'Hola','2026-05-29 18:54:25','texto',NULL,1),(196,10,2,'hola es una prueba','2026-05-29 18:54:46','texto',NULL,1),(197,10,3,'Hola también estoy probando ','2026-05-29 18:55:01','texto',NULL,1),(198,11,2,'Hola','2026-05-29 18:57:39','texto',NULL,1),(199,11,3,'Manda mensaje','2026-05-29 18:57:49','texto',NULL,1),(200,10,3,'Hola','2026-05-29 19:58:31','texto',NULL,1),(201,11,3,'Vamoo','2026-05-29 19:58:39','texto',NULL,1),(202,8,2,'Prueba','2026-05-29 20:25:39','texto',NULL,1),(203,8,2,'POI','2026-05-29 20:26:49','texto',NULL,1),(204,8,2,'POI.jpeg','2026-05-29 20:27:01','imagen','/uploads/mensajes/1780108020930-190145092.jpeg',1),(205,8,2,'PRUEBA','2026-05-29 20:27:01','texto',NULL,1),(206,1,3,'IMG-20260527-WA0006.jpg','2026-05-29 20:27:27','imagen','/uploads/mensajes/1780108047311-825660173.jpg',1),(207,10,2,'267292568_894587417910866_3578261598577914088_n.png','2026-05-29 20:28:40','imagen','/uploads/mensajes/1780108120130-324112021.png',1),(208,10,2,'Mi skin de minecraft','2026-05-29 20:28:40','texto',NULL,1),(209,10,2,'hola','2026-05-29 20:30:28','texto',NULL,1),(210,3,4,'Hola papu','2026-05-29 20:35:27','texto',NULL,1),(211,3,4,'IMG-20260520-WA0100.jpg','2026-05-29 20:36:45','imagen','/uploads/mensajes/1780108604887-154422837.jpg',1),(212,3,4,'Un gato','2026-05-29 20:36:46','texto',NULL,1),(213,3,4,'Svrr si envía videos xD','2026-05-29 20:37:00','texto',NULL,1),(214,10,4,'Eh','2026-05-29 20:39:11','texto',NULL,1),(215,10,4,'No sé ve bien quien envío el mensaje xD','2026-05-29 20:39:25','texto',NULL,1),(216,10,4,'Ponlo en negritas o ponlo en el tono del mensaje ','2026-05-29 20:39:46','texto',NULL,1),(217,10,4,':v','2026-05-29 20:39:52','texto',NULL,1),(218,8,4,'Hola','2026-05-29 20:43:17','texto',NULL,1),(219,8,4,'Papu','2026-05-29 20:43:58','texto',NULL,1),(220,10,4,'Hola papois','2026-05-29 20:47:54','texto',NULL,1),(221,3,4,'Che','2026-05-29 20:48:11','texto',NULL,1),(222,3,4,'Así dicen los argentinos','2026-05-29 20:48:21','texto',NULL,1),(223,8,2,'[CIFRADO]:U2FsdGVkX1/FPVl7M8AUS0dqhwtF6YN+bfiq06DRmy8=','2026-05-29 20:48:34','texto',NULL,1),(224,8,2,'[CIFRADO]:U2FsdGVkX1+btB0n6nxOKPJcHu0wpgNai1ehbaUa7KjINOro1WdvlflL1bOFQIu0vqWPJ1R9IzaKn4qnIVExVw==','2026-05-29 20:48:43','texto',NULL,1),(225,10,4,'FB_IMG_1775522846932.jpg','2026-05-29 20:49:48','imagen','/uploads/mensajes/1780109387276-987889221.jpg',1),(226,8,2,'probando','2026-05-29 20:49:57','texto',NULL,1),(227,8,2,'cifrado 2.png','2026-05-29 20:50:40','imagen','/uploads/mensajes/1780109440348-369892078.png',1),(228,8,2,'cifrado1.png','2026-05-29 20:50:55','imagen','/uploads/mensajes/1780109455104-522520799.png',1),(229,10,4,'FB_IMG_1778514081354.jpg','2026-05-29 20:51:10','imagen','/uploads/mensajes/1780109469345-862789634.jpg',1),(230,8,2,'cifrado 2.png','2026-05-29 20:51:37','imagen','/uploads/mensajes/1780109497413-699633946.png',1),(231,8,2,'[CIFRADO]:U2FsdGVkX19ETrv1c39EyLpWmQe9fRtGo3PpI5nGuoCbkg2l/Uxckdq77/LGiVqI','2026-05-29 20:51:46','texto',NULL,1),(232,1,2,'[CIFRADO]:U2FsdGVkX19BgSm3Eelr9TC75KGTpLvOlC5s6vCfAKUfLmGPAVyeTuDknKzvh+s7','2026-05-29 20:53:08','texto',NULL,1),(233,10,4,'[CIFRADO]:U2FsdGVkX18DU9ftYF85tzz6GNy7szgzmB/0EyOh3dMEOGcfrvy7AQm2ciQ4FL9P','2026-05-29 20:53:21','texto',NULL,1),(234,8,4,'[CIFRADO]:U2FsdGVkX18HW/fE87bRXKNdi4vqnOMZ9GsRLs/dzV0=','2026-05-29 20:53:36','texto',NULL,1),(235,8,4,'[CIFRADO]:U2FsdGVkX1+t9VjO/bt6UlLR5b4Y2V7nT1MFqggSuDCGlw6cM0+xsJVdosBbFmcLiJ9vd0ElIiFqFGn8cOq0JCKZtRCwN2DCHpvyzDfgaRY=','2026-05-29 20:54:03','texto',NULL,1),(236,8,4,'[CIFRADO]:U2FsdGVkX18sBpWzWz7UIDBrg3ZxM3xBueNy8u+JprEeGHF84p7PYgku7qaWE9dotAJ3r5KWcdLfLuZyY16kzw==','2026-05-29 20:54:11','texto',NULL,1),(237,8,4,'[CIFRADO]:U2FsdGVkX19y24Ea+5zGy+Som3T0TIFYUvVeG/Wm8OA=','2026-05-29 20:54:17','texto',NULL,1),(238,8,4,'[CIFRADO]:U2FsdGVkX18WU1ttRah26X/t2PkZZC/6sH7+91HNVl4=','2026-05-29 20:54:20','texto',NULL,1),(239,8,4,'[CIFRADO]:U2FsdGVkX1/nKAgtduMNDHKYXPWDakjV6wABa7NzQGA=','2026-05-29 20:54:27','texto',NULL,1),(240,8,4,'[CIFRADO]:U2FsdGVkX1+++iXIHcold6R6/QW0B5rOGtLa+K/u9p5Fsn8zhoQvUUNobv7pUeOu','2026-05-29 20:54:38','texto',NULL,1),(241,8,4,'[CIFRADO]:U2FsdGVkX18qN3F6O3aVV3/ctYhjAjbHb07iaA4ryuM=','2026-05-29 20:54:40','texto',NULL,1),(242,8,4,'[CIFRADO]:U2FsdGVkX18Uhz97ZN8HkSq98Cd8TKWpR9VogLOduyg=','2026-05-29 20:55:35','texto',NULL,1),(243,8,4,'[CIFRADO]:U2FsdGVkX19PuAEJT3fWlUaqmwW2bLxdz5DfJNJ+YBY=','2026-05-29 20:55:40','texto',NULL,1),(244,10,2,'[CIFRADO]:U2FsdGVkX1+JCcMDhVz5E9AuBWlx9Z5WfpH/A9q38FWus8Wo29ojsiarm3lISI06w9wkWDoKqQswVVOjuXn78QTQknlwLLw3liN0NI/fG1XXdEdjVRt9BSxfFj9x8kJH','2026-05-29 20:55:56','texto',NULL,1),(245,10,2,'[CIFRADO]:U2FsdGVkX1+ACEKoaBdNsW7AS76g8Nv1yDHJ630Y0yM3MfeJmz4GqSQBFAuMmuUDYo4qXuXVEGVSqDauSMGvQ0Md6NRKJDz1odQITpfifH8Ge1LW7c+oGPkJuRl/bkr8WfUP8h0OnIZ5rhR52xD//rXDgDweWLWSHM7JNShdAOQCVlQfjOVzac2TMkH0BW3WLRTouccPilJ4EENHwobNRdW4rCwcCkKlYrgzQuwMi5k=','2026-05-29 20:56:38','texto',NULL,1),(246,10,3,'Listo ya arregle lo de los nombres que no se ven','2026-05-29 20:59:38','texto',NULL,1),(247,3,3,'Ya arregle lo de los nombres ','2026-05-29 21:00:00','texto',NULL,1),(248,1,2,'[CIFRADO]:U2FsdGVkX1+JVCcrjoKTb4JKL1/6fZii2/tHinpq//cDO36/oeNXIVKzGTLjo9/4','2026-05-29 21:08:52','texto',NULL,1),(249,1,2,'[CIFRADO]:U2FsdGVkX1+aBID7tnqQTSm2VozDMhe+zqmaMVpLsCM=','2026-05-29 21:09:46','texto',NULL,1),(250,1,2,'PROBANDO QUE funcione el aviso','2026-05-29 21:10:18','texto',NULL,1),(251,1,3,'Prueba 2','2026-05-29 21:11:13','texto',NULL,1),(252,1,2,'preuba 2','2026-05-29 21:12:47','texto',NULL,1),(253,1,3,'Hola','2026-05-29 21:12:57','texto',NULL,1),(254,1,3,'Hola','2026-05-29 21:13:04','texto',NULL,1),(255,1,3,'Ojito funciona','2026-05-29 21:13:15','texto',NULL,1),(256,1,3,'Screenshot_20260529_211300.jpg','2026-05-29 21:14:15','imagen','/uploads/mensajes/1780110853135-350046302.jpg',1),(257,10,4,'[CIFRADO]:U2FsdGVkX1+lb7ryNCfDUQSJvzvx6+QllqF4Gh+w7vJrggr2zNijUq+zOnxI8pa5/sc12xoGwkAwPWHGAGHA1g==','2026-05-29 21:19:10','texto',NULL,1),(258,10,4,'mr-peabody-hypnotizes.gif','2026-05-29 21:19:47','imagen','/uploads/mensajes/1780111185645-710000559.gif',1),(259,10,4,'[CIFRADO]:U2FsdGVkX18+2Mh85KO8c+WZQgXbTQK3vkLa+LN2l+E=','2026-05-29 21:19:54','texto',NULL,1),(260,10,4,'[CIFRADO]:U2FsdGVkX18vj3BTcJZkKvO73bLS0KV3JvvAB5QdJmMD7tiYbhP2UbptS8U+VN7404ainvqPMoYKomEUisxHAA==','2026-05-29 21:20:02','texto',NULL,1),(261,1,2,'Captura de pantalla 2026-05-18 224541.png','2026-05-29 21:25:09','imagen','/uploads/mensajes/1780111508886-91540930.png',1),(262,3,4,'Hello','2026-05-29 21:25:10','texto',NULL,1),(263,1,2,'Captura de pantalla 2026-05-17 140419.png','2026-05-29 21:33:22','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780112010/mundichat/mensajes/whvvih9hnvhvgbbmbehs.png',1),(264,3,4,'Wasa','2026-05-29 21:37:35','texto',NULL,1),(265,1,2,'Perfil.txt','2026-05-29 21:40:29','archivo','https://res.cloudinary.com/dqaaggfn9/raw/upload/v1780112437/mundichat/mensajes/wbsvterfdcnsauldhuhw.txt',1),(266,12,11,'Memoria tecnica cambios.pdf','2026-05-29 23:01:36','archivo','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780117296/mundichat/mensajes/xrxnzbg5fapwiazmdkxd.pdf',1),(267,12,11,'Volume 23.pdf','2026-05-29 23:02:01','archivo','/uploads/mensajes/1780117316393-38591610.pdf',1),(268,13,11,'Volume 23.pdf','2026-05-29 23:02:38','archivo','/uploads/mensajes/1780117353670-223836537.pdf',1),(269,13,3,'[CIFRADO]:U2FsdGVkX1/xJaZSTbOrQCTBrWolUcA49dZUfjoxizk=','2026-05-29 23:05:06','texto',NULL,1),(270,13,3,'Oña','2026-05-29 23:06:32','texto',NULL,1),(271,13,3,'Mande mensaje de prueba','2026-05-29 23:06:54','texto',NULL,1),(272,14,11,'ASDFGFASA','2026-05-29 23:08:08','texto',NULL,1),(273,14,11,'hola gente ','2026-05-29 23:08:22','texto',NULL,1),(274,14,11,'hola pibardos como estan jeje','2026-05-29 23:08:40','texto',NULL,1),(275,14,11,'oushet oushet','2026-05-29 23:08:43','texto',NULL,1),(276,14,3,'Callese','2026-05-29 23:08:44','texto',NULL,1),(277,14,3,'Cap_1_AS.png','2026-05-29 23:09:21','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780117761/mundichat/mensajes/k1oqvq44dkc1uanqgyw4.png',1),(278,14,11,'diego rivera ?️? diega rivera ?️? diego rivera ?️?y frida khalo ?️?','2026-05-29 23:09:27','texto',NULL,1),(279,14,11,'Diagramas.jpg','2026-05-29 23:09:53','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780117793/mundichat/mensajes/vr9ekvjrpde19md9lmrw.jpg',1),(280,14,3,'Documento de DiseÃ±o de Bajo Nivel.pdf','2026-05-29 23:10:18','archivo','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780117817/mundichat/mensajes/td0vcgczmb1d5zhftynq.pdf',1),(281,14,3,'Hola','2026-05-29 23:10:18','texto',NULL,1),(282,14,11,'Volume 24.pdf','2026-05-29 23:10:35','archivo','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780117834/mundichat/mensajes/ydd2i9hywdylgdkm2nnw.pdf',1),(283,15,16,'Hola soy el fantasma wu','2026-05-29 23:31:03','texto',NULL,1),(284,15,16,'void por ti ??','2026-05-29 23:31:15','texto',NULL,1),(285,4,7,'hola','2026-05-29 23:33:42','texto',NULL,1),(286,15,7,'⣿⣿⣿⠟⢹⣶⣶⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⡟⢰⡌⠿⢿⣿⡾⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⢸⣿⣤⣒⣶⣾⣳⡻⣿⣿⣿⣿⡿⢛⣯⣭⣭⣭⣽⣻⣿⣿⣿ ⣿⣿⣿⢸⣿⣿⣿⣿⢿⡇⣶⡽⣿⠟⣡⣶⣾⣯⣭⣽⣟⡻⣿⣷⡽⣿ ⣿⣿⣿⠸⣿⣿⣿⣿⢇⠃⣟⣷⠃⢸⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽ ⣿⣿⣿⣇⢻⣿⣿⣯⣕⠧⢿⢿⣇⢯⣝⣒⣛⣯⣭⣛⣛⣣⣿⣿⣿⡇ ⣿⣿⣿⣿⣌⢿⣿⣿⣿⣿⡘⣞⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇ ⣿⣿⣿⣿⣿⣦⠻⠿⣿⣿⣷⠈⢞⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇ ⣿⣿⣿⣿⣿⣿⣗⠄⢿⣿⣿⡆⡈⣽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢻ ⣿⣿⣿⣿⡿⣻⣽⣿⣆⠹⣿⡇⠁⣿⡼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣾ ⣿⠿⣛⣽⣾⣿⣿⠿⠋⠄⢻⣷⣾⣿⣧⠟⣡⣾⣿⣿⣿⣿⣿⣿⡇⣿ ⢼⡟⢿⣿⡿⠋⠁⣀⡀⠄⠘⠊⣨⣽⠁⠰⣿⣿⣿⣿⣿⣿⣿⡍⠗⣿ ⡼⣿⠄⠄⠄⠄⣼⣿⡗⢠⣶⣿⣿⡇⠄⠄⣿⣿⣿⣿⣿⣿⣿⣇⢠⣿ ⣷⣝⠄⠄⢀⠄⢻⡟⠄⣿⣿⣿⣿⠃⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⢹⣿ ⣿⣿⣿⣿⣿⣧⣄⣁⡀⠙⢿⡿⠋⠄⣸⡆⠄⠻⣿⡿⠟⢛⣩⣝⣚⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣾⣿⣿⣄⠄⠄⠄⣴⣿⣿⣿⣇⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠛⠿⣿⣫⣾⣿','2026-05-29 23:34:45','texto',NULL,1),(287,15,16,'Volume 23.pdf','2026-05-29 23:34:46','archivo','/uploads/mensajes/1780119281932-405115592.pdf',1),(288,3,4,'Wasa','2026-05-29 23:43:46','texto',NULL,1),(289,3,3,'que onda','2026-05-29 23:46:25','texto',NULL,1),(290,3,4,'Andas probando lo de llamada?','2026-05-30 00:06:37','texto',NULL,1),(291,16,18,'Hola','2026-05-30 00:19:59','texto',NULL,1),(292,16,18,'Quiero sexo','2026-05-30 00:20:03','texto',NULL,1),(293,16,18,'*c corre*','2026-05-30 00:20:12','texto',NULL,1),(294,16,18,'Fue fascinante ','2026-05-30 00:20:19','texto',NULL,1),(295,16,4,'Que fue?','2026-05-30 00:20:24','texto',NULL,1),(296,16,18,'Eres muy buena en esto','2026-05-30 00:20:27','texto',NULL,1),(297,16,18,'Gracias','2026-05-30 00:20:37','texto',NULL,1),(298,16,18,'*se cierra el ziper*','2026-05-30 00:20:47','texto',NULL,1),(299,16,18,'*se fuma un cigarro*','2026-05-30 00:20:53','texto',NULL,1),(300,9,10,'Alamouser','2026-05-30 00:20:58','texto',NULL,1),(301,9,10,'Me salieron de que','2026-05-30 00:21:03','texto',NULL,1),(302,9,10,'Notificaciones así full','2026-05-30 00:21:10','texto',NULL,1),(303,16,4,'XD','2026-05-30 00:21:19','texto',NULL,1),(304,17,20,'Oztias','2026-05-30 00:21:55','texto',NULL,1),(305,17,20,'Oal','2026-05-30 00:21:59','texto',NULL,1),(306,18,18,'Hola','2026-05-30 00:22:00','texto',NULL,1),(307,17,20,'Xdddd','2026-05-30 00:22:05','texto',NULL,1),(308,18,18,'No puedo tengo novia','2026-05-30 00:22:06','texto',NULL,1),(309,18,18,'*se corre*','2026-05-30 00:22:11','texto',NULL,1),(310,18,18,'Eres muy mala','2026-05-30 00:22:15','texto',NULL,1),(311,18,18,'*intenta rechazarla pero se le viene encima*','2026-05-30 00:22:27','texto',NULL,1),(312,18,18,'No le digas a mi novia ','2026-05-30 00:22:34','texto',NULL,1),(313,20,10,'HolaRuly','2026-05-30 00:22:35','texto',NULL,1),(314,18,18,'*se besan*','2026-05-30 00:22:42','texto',NULL,1),(315,18,18,'Que clase de hombre soy','2026-05-30 00:22:48','texto',NULL,1),(316,20,10,'Les quedó con madre el proyecto','2026-05-30 00:22:50','texto',NULL,1),(317,19,4,'Papus','2026-05-30 00:23:15','texto',NULL,0),(318,19,4,'Hola','2026-05-30 00:23:19','texto',NULL,0),(319,17,4,'Hola xd','2026-05-30 00:23:28','texto',NULL,1),(320,17,4,'Andas?','2026-05-30 00:23:31','texto',NULL,1),(321,17,4,'Cree un grupo','2026-05-30 00:23:35','texto',NULL,1),(322,17,20,'Okok','2026-05-30 00:23:41','texto',NULL,1),(323,17,4,'No osea','2026-05-30 00:23:51','texto',NULL,1),(324,19,20,'Worales','2026-05-30 00:23:51','texto',NULL,0),(325,17,4,'Yo cree uno xd','2026-05-30 00:23:55','texto',NULL,1),(326,17,4,'Te debe aparecer en grupos','2026-05-30 00:24:04','texto',NULL,1),(327,21,4,'Xd','2026-05-30 00:24:10','texto',NULL,1),(328,19,10,'Hola','2026-05-30 00:24:11','texto',NULL,0),(329,17,20,'Por eso','2026-05-30 00:24:11','texto',NULL,1),(330,17,20,'Jajaja','2026-05-30 00:24:13','texto',NULL,1),(331,17,20,'Fui a checar eso','2026-05-30 00:24:18','texto',NULL,1),(332,17,20,'Xddd','2026-05-30 00:24:20','texto',NULL,1),(333,17,4,'Xddd','2026-05-30 00:24:23','texto',NULL,1),(334,19,4,'Que peo','2026-05-30 00:25:08','texto',NULL,0),(335,19,4,'Hablen','2026-05-30 00:25:11','texto',NULL,0),(336,19,4,'Prueben de todo','2026-05-30 00:25:15','texto',NULL,0),(337,19,20,'Pues','2026-05-30 00:25:22','texto',NULL,0),(338,19,20,'Ya no se que más puedo hacer jajaja','2026-05-30 00:25:31','texto',NULL,0),(339,19,20,'Ya cambié mi foto de perfil, el banner','2026-05-30 00:25:45','texto',NULL,0),(340,19,20,'Hablé ','2026-05-30 00:25:49','texto',NULL,0),(341,19,4,'Intenta tronarlo','2026-05-30 00:26:05','texto',NULL,0),(342,19,20,'?','2026-05-30 00:26:18','texto',NULL,0),(343,19,4,'Envía archivos','2026-05-30 00:26:29','texto',NULL,0),(344,19,4,'Fotos','2026-05-30 00:26:31','texto',NULL,0),(345,19,4,'Imagenes','2026-05-30 00:26:34','texto',NULL,0),(346,19,4,'Etc.','2026-05-30 00:26:47','texto',NULL,0),(347,22,18,'Soy una chica decente','2026-05-30 00:27:00','texto',NULL,1),(348,23,19,'El intermediario es un pendejo ','2026-05-30 00:27:02','texto',NULL,1),(349,22,18,'No','2026-05-30 00:27:03','texto',NULL,1),(350,22,18,'Ya para','2026-05-30 00:27:06','texto',NULL,1),(351,22,18,'*la tocan *','2026-05-30 00:27:11','texto',NULL,1),(352,22,18,'Detente pervertido','2026-05-30 00:27:17','texto',NULL,1),(353,23,21,'Al chile pa','2026-05-30 00:27:30','texto',NULL,1),(354,22,18,'Ya mero yo!!!!','2026-05-30 00:27:30','texto',NULL,1),(355,23,21,'No vale v administración ','2026-05-30 00:27:40','texto',NULL,1),(356,22,18,'*le quitan las bragas*','2026-05-30 00:27:43','texto',NULL,1),(357,22,18,'Eres malo','2026-05-30 00:27:47','texto',NULL,1),(358,22,18,'*se vienen*','2026-05-30 00:27:52','texto',NULL,1),(359,19,20,'IMG_20260521_085929.jpg','2026-05-30 00:28:08','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780122487/mundichat/mensajes/w1go8spuwy0ktagapbnr.jpg',0),(360,22,18,'Tu... Tu... Me usaste','2026-05-30 00:28:10','texto',NULL,1),(361,19,20,'Xd','2026-05-30 00:28:14','texto',NULL,0),(362,22,18,'*tiembla en el suelo*','2026-05-30 00:28:23','texto',NULL,1),(363,22,18,'*salen del metro*','2026-05-30 00:28:42','texto',NULL,1),(364,17,20,'Xdd','2026-05-30 00:29:47','texto',NULL,1),(365,17,20,'Tu escuchabas algo?','2026-05-30 00:29:54','texto',NULL,1),(366,17,4,'No xd','2026-05-30 00:29:59','texto',NULL,1),(367,17,20,'Pq yo no','2026-05-30 00:30:04','texto',NULL,1),(368,17,4,'Kajskahs','2026-05-30 00:30:11','texto',NULL,1),(369,24,19,'Eleuterio','2026-05-30 00:30:24','texto',NULL,0),(370,17,4,'Esto lo arregla un compa','2026-05-30 00:30:25','texto',NULL,1),(371,24,4,'Xd','2026-05-30 00:30:39','texto',NULL,0),(372,24,19,'L','2026-05-30 00:30:42','texto',NULL,0),(373,24,19,'Euterio','2026-05-30 00:30:46','texto',NULL,0),(374,24,4,'Yo soy L','2026-05-30 00:30:50','texto',NULL,0),(375,24,19,'Leo se la come ','2026-05-30 00:30:56','texto',NULL,0),(376,17,20,'Screenshot_2026-05-30-00-31-00-625_com.android.chrome.jpg','2026-05-30 00:31:57','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780122717/mundichat/mensajes/kqcwfnuy0hqnpoummrai.jpg',1),(377,17,20,'Ubicación con h','2026-05-30 00:31:58','texto',NULL,1),(378,17,20,'JAJAJA','2026-05-30 00:32:00','texto',NULL,1),(379,17,20,'Que por cierto eso no lo pude encontrar ','2026-05-30 00:32:29','texto',NULL,1),(380,17,4,'XD','2026-05-30 00:33:13','texto',NULL,1),(381,17,4,'Anotado','2026-05-30 00:34:02','texto',NULL,1),(382,17,4,'Aún no están algunos logros','2026-05-30 00:34:25','texto',NULL,1),(383,17,4,'Así que xD','2026-05-30 00:34:29','texto',NULL,1),(384,17,20,'Xd','2026-05-30 00:34:37','texto',NULL,1),(385,24,19,'A Chucho le gusta una niña de segunda a que se llama Karla yyyyy','2026-05-30 00:34:44','texto',NULL,0),(386,17,20,'Y para que se supone que sirven?','2026-05-30 00:34:47','texto',NULL,1),(387,19,18,'FB_IMG_1779304820319.jpg','2026-05-30 00:35:07','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780122907/mundichat/mensajes/h53ynocwr7p9cwaytswe.jpg',0),(388,17,4,'Los puntos que obtienes, puedes gastarlos en la tienda','2026-05-30 00:35:13','texto',NULL,1),(389,17,4,'Que ahorita no está ','2026-05-30 00:35:17','texto',NULL,1),(390,17,4,'Y puedes customizar la app/chat','2026-05-30 00:35:28','texto',NULL,1),(391,17,20,'Bueno, pero para que serviran?','2026-05-30 00:35:40','texto',NULL,1),(392,17,4,'Los puntos?','2026-05-30 00:35:52','texto',NULL,1),(393,17,20,'Si','2026-05-30 00:36:02','texto',NULL,1),(394,17,4,'Nomás para customizar tu chat','2026-05-30 00:36:02','texto',NULL,1),(395,17,4,'Y los demás lo pueden ver','2026-05-30 00:36:07','texto',NULL,1),(396,17,20,'A','2026-05-30 00:36:11','texto',NULL,1),(397,17,4,'Osea el perfil','2026-05-30 00:36:11','texto',NULL,1),(398,17,4,'Pica mi foto de perfil','2026-05-30 00:36:16','texto',NULL,1),(399,17,4,'Ahí puedes agregarme como favorito','2026-05-30 00:36:36','texto',NULL,1),(400,17,20,'Worales','2026-05-30 00:36:40','texto',NULL,1),(401,17,4,'Eliminar amistad','2026-05-30 00:36:40','texto',NULL,1),(402,17,4,'Bloquear','2026-05-30 00:36:44','texto',NULL,1),(403,17,4,'Y pues silenciar','2026-05-30 00:36:51','texto',NULL,1),(404,9,4,'Xd','2026-05-30 00:37:17','texto',NULL,0),(405,25,4,'Papu pro','2026-05-30 00:37:32','texto',NULL,1),(406,26,4,'Hola','2026-05-30 00:37:58','texto',NULL,0),(407,25,22,'Ola','2026-05-30 00:38:07','texto',NULL,1),(408,26,20,'Oal ','2026-05-30 00:38:11','texto',NULL,0),(409,25,22,'Cómo estás papu','2026-05-30 00:38:21','texto',NULL,1),(410,19,22,'Ola','2026-05-30 00:38:37','texto',NULL,0),(411,19,22,'495072293_3747635688844865_7790713103348948903_n.png','2026-05-30 00:39:07','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780123147/mundichat/mensajes/ogk0kwlu1csuje6audxw.png',0),(412,24,4,'Eeeeh','2026-05-30 00:39:20','texto',NULL,0),(413,24,4,'Ban bimbo','2026-05-30 00:39:24','texto',NULL,0),(414,26,4,'Nia','2026-05-30 00:40:14','texto',NULL,0),(415,26,4,'Me bloqueaste? Xd','2026-05-30 00:40:21','texto',NULL,0),(416,26,20,'No','2026-05-30 00:40:50','texto',NULL,0),(417,25,4,'Todo bien papu','2026-05-30 00:40:55','texto',NULL,0),(418,17,20,'Eh que onda ','2026-05-30 00:41:05','texto',NULL,1),(419,17,20,'Levantando falsos ','2026-05-30 00:41:17','texto',NULL,1),(420,17,4,'Wasaaa','2026-05-30 00:41:18','texto',NULL,1),(421,17,4,'Cómo?','2026-05-30 00:41:26','texto',NULL,1),(422,17,20,'Nomás ','2026-05-30 00:41:41','texto',NULL,1),(423,17,20,'Xddd','2026-05-30 00:41:50','texto',NULL,1),(424,17,4,'XD','2026-05-30 00:41:53','texto',NULL,1),(425,17,4,'Osea como? Que falsos?','2026-05-30 00:42:01','texto',NULL,1),(426,17,4,'No entendí la expresión ?','2026-05-30 00:42:12','texto',NULL,1),(427,17,20,'No manches jajaja','2026-05-30 00:42:33','texto',NULL,1),(428,17,20,'O sea que mentiste pues ','2026-05-30 00:42:53','texto',NULL,1),(429,17,20,'Xdd','2026-05-30 00:42:56','texto',NULL,1),(430,17,4,'A xd','2026-05-30 00:43:03','texto',NULL,1),(431,17,20,'Lo decía pq no te bloqueé ','2026-05-30 00:43:08','texto',NULL,1),(432,17,4,'Kajskahs','2026-05-30 00:43:17','texto',NULL,1),(433,13,3,'[CIFRADO]:U2FsdGVkX19mTq9ch9AO6bK49Iqr27kxKtvFXDDTtZg=','2026-05-30 00:51:13','texto',NULL,1),(434,13,3,'[CIFRADO]:U2FsdGVkX183ioD6DkM1k31NKq4zmjRL+187hDp9XS4=','2026-05-30 01:22:47','texto',NULL,1),(435,24,21,'Kike','2026-05-30 01:35:19','texto',NULL,0),(436,24,21,'Jamom serrano','2026-05-30 01:35:34','texto',NULL,0),(437,13,3,'Cap_2_AS.png','2026-05-30 02:15:05','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780128905/mundichat/mensajes/p731xesbftgayveuq7lc.png',0),(438,13,3,'Overwatch 03_01_2026 01_19_14 a. m..png','2026-05-30 02:23:51','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780129431/mundichat/mensajes/rael8w7otqszqjponl9y.png',0),(439,1,3,'vamoo','2026-05-30 02:37:11','texto',NULL,1),(440,1,3,'Cap_1_AS.png','2026-05-30 02:48:19','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780130899/mundichat/mensajes/pubi2eoskvkmmeuk7spl.png',1),(441,1,3,'Cap_2_AS.png','2026-05-30 02:48:25','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780130905/mundichat/mensajes/ml5q4qcwuaj43k9fspq6.png',1),(442,1,3,'Copa 2026.jpeg','2026-05-30 02:48:31','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780130911/mundichat/mensajes/uceynz8qlkllrbq9sior.jpg',1),(443,1,3,'Corea AR.png','2026-05-30 02:49:31','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780130971/mundichat/mensajes/t53t9dnzsv8majr29fue.png',1),(444,1,2,'25.7498365,-100.2447386','2026-05-30 03:08:52','texto',NULL,1),(445,1,2,'25.7498083,-100.2447257','2026-05-30 03:14:01','ubicacion',NULL,1),(446,3,4,'wasa','2026-05-30 03:23:16','texto',NULL,1),(447,3,4,'ira, me tienes que colgar la video llamada','2026-05-30 03:23:31','texto',NULL,1),(448,3,4,'o bueno... hazme videollamada','2026-05-30 03:23:45','texto',NULL,1),(449,3,4,'xd','2026-05-30 03:23:46','texto',NULL,1),(450,3,4,'fijate la tarea','2026-05-30 03:24:31','texto',NULL,1),(451,3,4,'aver si progreso','2026-05-30 03:24:35','texto',NULL,1),(452,3,4,'la de Snake!!','2026-05-30 03:24:46','texto',NULL,1),(453,3,3,'si me sale que ya quedó','2026-05-30 03:25:08','texto',NULL,1),(454,3,4,'Captura de pantalla 2026-05-30 032459.png','2026-05-30 03:25:16','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780133116/mundichat/mensajes/pgv80blew5iyid0974yq.png',1),(455,3,4,'ahueso','2026-05-30 03:25:19','texto',NULL,1),(456,3,4,'25.74481366523605,-100.32080800000001','2026-05-30 03:34:29','ubicacion',NULL,1),(457,3,3,'image.png','2026-05-30 03:34:54','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780133694/mundichat/mensajes/mx9ogvwmpx3qjvzbwlsc.png',1),(458,3,3,'pues sigue igual','2026-05-30 03:34:54','texto',NULL,1),(459,3,4,'por alguna razon estoy en ese lugar xd','2026-05-30 03:35:01','texto',NULL,1),(460,3,4,'mames','2026-05-30 03:35:04','texto',NULL,1),(461,3,3,'llama tu haber que onda','2026-05-30 03:35:17','texto',NULL,1),(462,3,4,'avrr rechazame la videollamada','2026-05-30 03:35:21','texto',NULL,1),(463,3,3,'voy','2026-05-30 03:35:24','texto',NULL,1),(464,3,4,'tampoco','2026-05-30 03:35:40','texto',NULL,1),(465,3,3,'._.','2026-05-30 03:35:47','texto',NULL,1),(466,3,4,'deja washo a ver que más me falta pasarte','2026-05-30 03:35:53','texto',NULL,1),(467,3,4,'por que se me ase raro ya','2026-05-30 03:35:59','texto',NULL,1),(468,3,3,'por cierto ya deja poner imagenes que tengas copiadas en el portapapeles','2026-05-30 03:36:08','texto',NULL,1),(469,3,3,'xd','2026-05-30 03:36:09','texto',NULL,1),(470,3,3,'pero solo de una en una','2026-05-30 03:36:16','texto',NULL,1),(471,3,3,'igual que lo archivos','2026-05-30 03:36:22','texto',NULL,1),(472,3,3,'tambien ya viste que cambie el diseño para mandar archivo o la ubicacion','2026-05-30 03:36:46','texto',NULL,1),(473,3,4,'yep','2026-05-30 03:38:22','texto',NULL,1),(474,3,4,'si vi','2026-05-30 03:38:24','texto',NULL,1),(475,3,4,'y si vi eso de los archivos uno por uno xd','2026-05-30 03:38:38','texto',NULL,1),(476,3,4,'oye en la consola del servidor te sale el mensaje?','2026-05-30 03:39:06','texto',NULL,1),(477,3,4,'\"Rechazo de llamada de:\"','2026-05-30 03:39:25','texto',NULL,1),(478,3,3,'deja veo','2026-05-30 03:39:46','texto',NULL,1),(479,3,3,'me sale esto:','2026-05-30 03:40:12','texto',NULL,1),(480,3,3,'Actualizando tarea: { idUsuario: 4, idTarea: 1, incremento: 1 } Resultado update: ResultSetHeader {   fieldCount: 0,   affectedRows: 0,   insertId: 0,   info: \'Rows matched: 0  Changed: 0  Warnings: 0\',   serverStatus: 2,   warningStatus: 0,   changedRows: 0 } Actualizando tarea: { idUsuario: 3, idTarea: 1, incremento: 1 } Resultado update: ResultSetHeader {   fieldCount: 0,   affectedRows: 0,   insertId: 0,   info: \'Rows matched: 0  Changed: 0  Warnings: 0\',   serverStatus: 2,   warningStatus: 0,   changedRows: 0 }','2026-05-30 03:40:13','texto',NULL,1),(481,3,3,'image.png','2026-05-30 03:40:21','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780134021/mundichat/mensajes/tecqwcmexahraexfkvcz.png',1),(482,3,4,'nada que ver, es la tarea de enviar mensaje','2026-05-30 03:40:49','texto',NULL,1),(483,3,4,'avrr deja te llamo y me cuelgas y me dices que te aparece','2026-05-30 03:41:01','texto',NULL,1),(484,3,3,'perdon no andaba viendo el caht','2026-05-30 03:42:58','texto',NULL,1),(485,3,3,'chat xd','2026-05-30 03:43:00','texto',NULL,1),(486,3,3,'image.png','2026-05-30 03:43:40','imagen','https://res.cloudinary.com/dqaaggfn9/image/upload/v1780134220/mundichat/mensajes/n5t2pptuxyoqsa3j4cyz.png',1),(487,3,3,'salio esto por lo que veo','2026-05-30 03:43:40','texto',NULL,1),(488,1,2,'Ojito probando notis','2026-05-30 04:11:36','texto',NULL,1),(489,1,2,'Al parecer funciona a medias','2026-05-30 04:12:59','texto',NULL,1),(490,28,2,'Hola','2026-05-30 04:13:08','texto',NULL,0),(491,5,3,'hola','2026-05-30 04:13:15','texto',NULL,0),(492,1,3,'aloo','2026-05-30 04:13:37','texto',NULL,1),(493,1,2,'Prueba 2','2026-05-30 04:21:35','texto',NULL,1),(494,1,2,'Ojiggy moniggy','2026-05-30 04:21:55','texto',NULL,1),(495,1,2,'De es x','2026-05-30 04:21:57','texto',NULL,1),(496,1,2,'XD exsf','2026-05-30 04:22:01','texto',NULL,1),(497,1,2,'Dxxd','2026-05-30 04:22:03','texto',NULL,1),(498,1,3,'hola','2026-05-30 04:26:34','texto',NULL,1),(499,1,3,'hola x23','2026-05-30 04:26:42','texto',NULL,1),(500,3,3,'probando','2026-05-30 04:30:35','texto',NULL,1),(501,1,3,'saldra','2026-05-30 04:31:36','texto',NULL,1),(502,6,3,'que onda','2026-05-30 04:39:51','texto',NULL,0),(503,1,3,'listo lo hace','2026-05-30 04:39:58','texto',NULL,1),(504,11,3,'porque sigue pasando esto','2026-05-30 04:40:45','texto',NULL,1),(505,14,2,'Apoco si padre ','2026-05-30 04:40:58','texto',NULL,1),(506,14,2,'Holaaaa','2026-05-30 04:41:12','texto',NULL,1),(507,1,2,'Probando ','2026-05-30 04:42:28','texto',NULL,1),(508,1,2,'Prueba 3 o 4','2026-05-30 04:51:12','texto',NULL,1),(509,1,2,'Prueba 5','2026-05-30 04:52:16','texto',NULL,1),(510,27,3,'prueba 1 en chat grupal','2026-05-30 04:52:41','texto',NULL,1),(511,27,2,'Ojo','2026-05-30 04:53:08','texto',NULL,1),(512,14,3,'oña','2026-05-30 04:53:42','texto',NULL,1),(513,1,3,'probando','2026-05-30 05:06:53','texto',NULL,1),(514,1,2,'Prueba','2026-05-30 05:07:11','texto',NULL,1),(515,11,3,'aquiestas padre','2026-05-30 05:07:43','texto',NULL,1),(516,27,2,'Hola','2026-05-30 05:08:04','texto',NULL,1),(517,1,3,'yo','2026-05-30 05:08:24','texto',NULL,1),(518,3,4,'wasa','2026-05-30 05:14:00','texto',NULL,1),(519,3,4,'lol','2026-05-30 05:14:01','texto',NULL,1),(520,3,4,'ta bien','2026-05-30 05:14:04','texto',NULL,1),(521,3,4,':D','2026-05-30 05:14:08','texto',NULL,1),(522,3,4,'Deja avanzo este peo de los items','2026-05-30 05:14:25','texto',NULL,1),(523,3,3,'smn ya ahorita que dejes el chat podras notar las notis','2026-05-30 05:15:20','texto',NULL,0),(524,3,3,'pero la campanita funciona como quiere pero al menos los chats estan bien','2026-05-30 05:15:38','texto',NULL,0),(525,20,3,'gracuas','2026-05-30 05:15:52','texto',NULL,0),(526,20,3,'no habia visto tu mensaje pq no tenia sistema de notis todavia XD','2026-05-30 05:16:05','texto',NULL,0),(527,10,3,'estoy cansado jefe','2026-05-30 05:16:35','texto',NULL,1),(528,11,3,'probando','2026-05-30 05:20:28','texto',NULL,1),(529,27,2,'Listo','2026-05-30 05:20:45','texto',NULL,1),(530,27,2,'Parece que no funciona bien','2026-05-30 05:21:03','texto',NULL,1),(531,27,2,'Otra vez probando','2026-05-30 05:21:24','texto',NULL,1),(532,27,2,'? **Tarjeta de Contacto**\n? Nombre: Chetto\n✉️ Correo: No disponible','2026-05-30 05:21:52','texto',NULL,1),(533,1,3,'? **Tarjeta de Contacto**\n? Nombre: Ruly\n✉️ Correo: No disponible','2026-05-30 05:22:05','texto',NULL,1),(534,27,2,'25.7498686,-100.2447161','2026-05-30 05:23:23','ubicacion',NULL,1),(535,1,2,'25.7497607,-100.2446823','2026-05-30 05:32:32','ubicacion',NULL,1),(536,1,2,'? **Tarjeta de Contacto**\n? Nombre: Chetto\n✉️ Correo: No disponible','2026-05-30 05:32:37','texto',NULL,1),(537,1,3,'? **Tarjeta de Contacto**\n? Nombre: Ruly\n✉️ Correo: No disponible','2026-05-30 05:32:43','texto',NULL,1),(538,1,2,'? **Tarjeta de Contacto**\n? Nombre: Chetto\n✉️ Correo: No disponible','2026-05-30 05:33:07','texto',NULL,1);
/*!40000 ALTER TABLE `mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_emisor` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `mensaje` varchar(255) DEFAULT NULL,
  `leido` tinyint(4) DEFAULT 0,
  `count_mensajes` int(11) DEFAULT 1,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_emisor` (`id_emisor`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Us`) ON DELETE CASCADE,
  CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `usuario` (`ID_Us`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,2,3,'llamada','Ha rechazado tu llamada',1,1,'2026-05-30 10:12:04'),(2,18,2,'mensaje','Tienes un nuevo mensaje',0,1,'2026-05-30 10:13:08'),(3,9,3,'mensaje','Tienes 2 mensajes nuevos',0,2,'2026-05-30 10:52:41'),(7,2,3,'llamada','Llamada perdida o finalizada',1,1,'2026-05-30 10:27:20'),(10,8,3,'mensaje','Tienes un nuevo mensaje',0,1,'2026-05-30 10:39:51'),(17,16,3,'mensaje','Nuevos mensajes en grupo',0,1,'2026-05-30 10:52:41'),(19,9,2,'mensaje','Nuevos mensajes en grupo',0,1,'2026-05-30 10:53:08'),(20,16,2,'mensaje','Nuevos mensajes en grupo',0,1,'2026-05-30 10:53:08'),(22,11,3,'mensaje','Nuevos mensajes en grupo',0,1,'2026-05-30 10:53:42'),(26,7,3,'mensaje_grupo','{\"idGrupo\":11,\"nombreGrupo\":\"Prueba contundente\"}',0,1,'2026-05-30 11:07:43'),(27,9,3,'mensaje_grupo','{\"idGrupo\":11,\"nombreGrupo\":\"Prueba contundente\"}',0,1,'2026-05-30 11:07:43'),(29,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:08:04'),(30,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:08:04'),(32,2,3,'llamada','Llamada perdida o finalizada',1,1,'2026-05-30 11:09:02'),(34,4,3,'mensaje','Tienes 2 mensajes nuevos',0,2,'2026-05-30 11:15:38'),(35,10,3,'mensaje','Tienes 2 mensajes nuevos',0,2,'2026-05-30 11:16:05'),(36,2,3,'mensaje_grupo','{\"idGrupo\":10,\"nombreGrupo\":\"Los Poitasticos\"}',1,1,'2026-05-30 11:16:35'),(37,4,3,'mensaje_grupo','{\"idGrupo\":10,\"nombreGrupo\":\"Los Poitasticos\"}',0,1,'2026-05-30 11:16:35'),(38,5,3,'mensaje_grupo','{\"idGrupo\":10,\"nombreGrupo\":\"Los Poitasticos\"}',0,1,'2026-05-30 11:16:35'),(39,2,3,'mensaje_grupo','{\"idGrupo\":11,\"nombreGrupo\":\"Prueba contundente\"}',1,1,'2026-05-30 11:20:28'),(40,7,3,'mensaje_grupo','{\"idGrupo\":11,\"nombreGrupo\":\"Prueba contundente\"}',0,1,'2026-05-30 11:20:28'),(41,9,3,'mensaje_grupo','{\"idGrupo\":11,\"nombreGrupo\":\"Prueba contundente\"}',0,1,'2026-05-30 11:20:28'),(43,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:20:45'),(44,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:20:45'),(45,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:03'),(46,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:03'),(47,3,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',1,1,'2026-05-30 11:21:24'),(48,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:24'),(49,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:24'),(50,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:52'),(51,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:21:52'),(53,3,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',1,1,'2026-05-30 11:23:23'),(54,9,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:23:23'),(55,16,2,'mensaje_grupo','{\"idGrupo\":27,\"nombreGrupo\":\"as\"}',0,1,'2026-05-30 11:23:23');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `ID_Per` int(11) NOT NULL AUTO_INCREMENT,
  `NombreCompleto` varchar(100) DEFAULT NULL,
  `FechaNac` date DEFAULT NULL,
  PRIMARY KEY (`ID_Per`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'John Doe','1990-01-01'),(2,'Mauricio Eleuterio','2004-12-06'),(3,'Raul Cortez','2004-06-05'),(4,'Maurico Eleuterio Ortiz Rodriguez','2004-12-06'),(5,'Juan Carlos Bodoque','2004-06-10'),(6,'Carlos Alejandro Hernandez','2004-12-06'),(7,'iggy pro','2005-08-04'),(8,'Ian','2005-08-10'),(9,'Alan Dario Gomez Treviño','2004-10-19'),(10,'Lizbeth Hernández Hernández ','2003-05-05'),(11,'OguriCap','2026-05-28'),(12,'iggy dps','2026-05-28'),(13,'iggy dps','2026-05-28'),(14,'subaru','2026-05-28'),(15,'tabibito','2026-05-28'),(16,' ','0001-01-01'),(17,'Mauricio','2010-05-30'),(18,'Momo','1990-05-30'),(19,'Chinpancini Bananini','2000-06-30'),(20,'Nia','2004-12-13'),(21,'Jamoncillo kashimiri gignac de leon','2000-01-01'),(22,'Susana horia','2026-05-30');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarea`
--

DROP TABLE IF EXISTS `tarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarea` (
  `ID_Tarea` int(11) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(50) NOT NULL,
  `Descripcion` varchar(150) DEFAULT NULL,
  `Tipo` enum('mensaje','archivo','stiker','favorito','foto','amistad','login') DEFAULT NULL,
  `Objetivo` int(11) DEFAULT 1,
  `Puntos` int(11) DEFAULT 0,
  `EsDiario` bit(1) DEFAULT b'0',
  PRIMARY KEY (`ID_Tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea`
--

LOCK TABLES `tarea` WRITE;
/*!40000 ALTER TABLE `tarea` DISABLE KEYS */;
INSERT INTO `tarea` VALUES (1,'Molesta a tus amigo','envia 5 mensajes (500pts c/u)','mensaje',5,500,_binary ''),(2,'The Best Frind!','Marca a alguien como Favorito','favorito',1,1000,_binary '\0'),(3,'Un Nuevo Colega','Agrega a Un Amigo','amistad',1,150,_binary '\0'),(4,'Bienvenido!!','Iniciaste Secion en MundiChat!','login',1,2500,_binary '\0'),(5,'Año Nuevo, Nuevo yo','Cambia tú foto de perfil','foto',1,1500,_binary '\0'),(6,'Sé Unico','Agrega una imagen de Banner','foto',1,1500,_binary '\0'),(7,'Yo te conozco...','Envia una solicitud de amistad','amistad',1,100,_binary '\0'),(8,'¿Tú quien eres?','Rechaza una Solicitud de amistad','amistad',1,900,_binary '\0'),(9,'Expresate!!','Envia un Stiker','stiker',1,1500,_binary ''),(10,'Mira!!','Envia una Foto o Imagen a un chat','archivo',1,1500,_binary ''),(11,'Allô? ','Haz una llamada a un amigo','amistad',1,3500,_binary '\0'),(12,'Snake! Talk to me! Snake! Snaakeee!!','Te han Rechazado una Videollamada','amistad',1,3500,_binary ''),(13,'Vamos a vernos','Haz una videollamada y que te contesten','amistad',1,3000,_binary ''),(14,'Seción de Fotos','envia más de 6 Fotos a un amigo (1000pts c/u)','foto',7,1000,_binary ''),(15,'Liz, ¿En Donde estas?','Envia la Hubicación a un amigo','amistad',1,5000,_binary '');
/*!40000 ALTER TABLE `tarea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID_Us` int(11) NOT NULL AUTO_INCREMENT,
  `NombreUsuario` varchar(100) DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Contraseña` varchar(100) DEFAULT NULL,
  `Foto` varchar(100) DEFAULT NULL,
  `Banner` varchar(100) DEFAULT NULL,
  `id_per` int(11) DEFAULT NULL,
  `Puntos` int(11) DEFAULT 0,
  `FechaRegistro` datetime DEFAULT current_timestamp(),
  `Descripcion` text DEFAULT NULL,
  PRIMARY KEY (`ID_Us`),
  KEY `id_per` (`id_per`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_per`) REFERENCES `persona` (`ID_Per`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,NULL,'johndoe@example.com','password123',NULL,NULL,1,0,'2026-05-27 00:22:18',NULL),(2,'Chetto','mau.ortiz350@gmail.com','123456578','/uploads/1780025492950-519170418.gif','/uploads/1780025493084-743478887.jpg',2,20150,'2026-05-27 00:22:18','Hola soy el de frontend y trabaje un poco el backend jejeje'),(3,'Ruly','Raul@gmail.comsddad','T6fmrtBy','/uploads/1779874687945-515134468.jpg','/uploads/1779874687950-234902647.jpg',3,23750,'2026-05-27 00:22:18','Hola soy el chico void  ?? ? (probando ajustes)'),(4,'Chetito','mau.ortiz@gmail.com','Hola_SOY_ADMIN.','/uploads/1780025700614-98978894.gif','/uploads/1780025700653-955427447.gif',4,22650,'2026-05-27 00:22:18','si vez esto significa que logre implementarlo'),(5,'Juan Bodoque','bodoque@gmail.com','T6fmrtBy',NULL,NULL,5,4650,'2026-05-27 00:22:18',NULL),(6,'SoplaPoyasXxxx','Carlos@gmail.com','Hola_SOY1.','/uploads/1779873848541-98257399.jpg','/uploads/1779950686934-585031086.jpg',6,3400,'2026-05-27 00:22:18','Skibidi Sigma Papu'),(7,'iggy','aczino02ytIGGY@outlook.com','T6fmrtByIGGY','/uploads/1780119943960-742688909.gif','/uploads/1780119944190-147366424.gif',7,13250,'2026-05-27 00:22:18','⣿⣿⣿⠟⢹⣶⣶⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⡟⢰⡌⠿⢿⣿⡾⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⢸⣿⣤⣒⣶⣾⣳⡻⣿⣿⣿⣿⡿⢛⣯⣭⣭⣭⣽⣻⣿⣿⣿\n⣿⣿⣿⢸⣿⣿⣿⣿⢿⡇⣶⡽⣿⠟⣡⣶⣾⣯⣭⣽⣟⡻⣿⣷⡽⣿\n⣿⣿⣿⠸⣿⣿⣿⣿⢇⠃⣟⣷⠃⢸⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽\n⣿⣿⣿⣇⢻⣿⣿⣯⣕⠧⢿⢿⣇⢯⣝⣒⣛⣯⣭⣛⣛⣣⣿⣿⣿⡇\n⣿⣿⣿⣿⣌⢿⣿⣿⣿⣿⡘⣞⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⣿⣿⣿⣿⣿⣦⠻⠿⣿⣿⣷⠈⢞⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⣿⣿⣿⣿⣿⣿⣗⠄⢿⣿⣿⡆⡈⣽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢻\n⣿⣿⣿⣿⡿⣻⣽⣿⣆⠹⣿⡇⠁⣿⡼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣾\n⣿⠿⣛⣽⣾⣿⣿⠿⠋⠄⢻⣷⣾⣿⣧⠟⣡⣾⣿⣿⣿⣿⣿⣿⡇⣿\n⢼⡟⢿⣿⡿⠋⠁⣀⡀⠄⠘⠊⣨⣽⠁⠰⣿⣿⣿⣿⣿⣿⣿⡍⠗⣿\n⡼⣿⠄⠄⠄⠄⣼⣿⡗⢠⣶⣿⣿⡇⠄⠄⣿⣿⣿⣿⣿⣿⣿⣇⢠⣿\n⣷⣝⠄⠄⢀⠄⢻⡟⠄⣿⣿⣿⣿⠃⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⢹⣿\n⣿⣿⣿⣿⣿⣧⣄⣁⡀⠙⢿⡿⠋⠄⣸⡆⠄⠻⣿⡿⠟⢛⣩⣝⣚⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣾⣿⣿⣄⠄⠄⠄⣴⣿⣿⣿⣇⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠛⠿⣿⣫⣾⣿'),(8,'Naitzumi','ian@gmail.com','987654321',NULL,NULL,8,0,'2026-05-27 00:22:18',NULL),(9,'Alan','alan@gmail.com','T6fmrtBy',NULL,NULL,9,0,'2026-05-27 00:22:18',NULL),(10,'zuazuito','marthahdezmartinez@gmail.com','zuazuito05','/uploads/1780026509965-993921493.jpg','/uploads/1780026190002-980353022.jpg',10,8250,'2026-05-28 21:41:17',''),(11,'Oguri','oguri@gmail.com','12345678','/uploads/1780117245011-885775117.jpg','/uploads/1780117245306-177506957.jpg',11,10250,'2026-05-29 22:57:35','Ola de mar, soy la oguri wei creeme ohayoo sekai gud morning wo'),(12,'Iggy','iggy@mail.com','iggy1234',NULL,NULL,12,0,'2026-05-29 22:58:18',NULL),(13,'Iggy2','iggy2@mail.com','iggy1234',NULL,NULL,13,0,'2026-05-29 22:59:59',NULL),(14,'Auramonster','subaru@mail.com','subaru123',NULL,NULL,14,0,'2026-05-29 23:04:23',NULL),(15,'tabibito','tabibito@mail.com','tabibito',NULL,NULL,15,0,'2026-05-29 23:06:04',NULL),(16,' ','!@adsa.com','1231312213123',NULL,'/uploads/1780118949782-364166390.png',16,11750,'2026-05-29 23:23:06',' '),(17,'El eu terio','elfollamamis@outlook.co.','quebarbarl',NULL,NULL,17,0,'2026-05-30 00:16:25',NULL),(18,'Momouterio','eleumomos@outlook.com','momazosmauricio','/uploads/1780122280339-38647684.jpg','/uploads/1780122280547-29188543.jpg',18,11750,'2026-05-30 00:18:59',''),(19,'Mau123','mau123@gmail.com','mau12345',NULL,NULL,19,3250,'2026-05-30 00:19:07',NULL),(20,'Nia','uwuwuw@gmail.com','okmañana','/uploads/1780122208027-795544971.jpg','/uploads/1780122208326-138366310.jpg',20,12750,'2026-05-30 00:19:36',''),(21,'PapuproBv','papuproBv@gmail.com','papupro123','/uploads/1780122159397-517640248.jpg',NULL,21,5250,'2026-05-30 00:20:50',''),(22,'Zuzanahoria','eldiavlo@gmail.com','guerrero1234',NULL,NULL,22,3750,'2026-05-30 00:22:57',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_item`
--

DROP TABLE IF EXISTS `usuario_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_item` (
  `id_usuario` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `Equipado` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id_usuario`,`id_item`),
  KEY `id_item` (`id_item`),
  CONSTRAINT `usuario_item_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Us`),
  CONSTRAINT `usuario_item_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `item` (`ID_Item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_item`
--

LOCK TABLES `usuario_item` WRITE;
/*!40000 ALTER TABLE `usuario_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_tarea`
--

DROP TABLE IF EXISTS `usuario_tarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_tarea` (
  `ID_UsTar` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_tarea` int(11) DEFAULT NULL,
  `Progreso` int(11) DEFAULT 0,
  `Completada` bit(1) DEFAULT b'0',
  `Fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ID_UsTar`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tarea` (`id_tarea`),
  CONSTRAINT `usuario_tarea_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Us`),
  CONSTRAINT `usuario_tarea_ibfk_2` FOREIGN KEY (`id_tarea`) REFERENCES `tarea` (`ID_Tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_tarea`
--

LOCK TABLES `usuario_tarea` WRITE;
/*!40000 ALTER TABLE `usuario_tarea` DISABLE KEYS */;
INSERT INTO `usuario_tarea` VALUES (1,9,1,0,_binary '\0','2026-05-25 23:51:48'),(2,8,1,0,_binary '\0','2026-05-25 23:51:48'),(3,7,1,2,_binary '\0','2026-05-25 23:51:48'),(4,6,1,0,_binary '\0','2026-05-25 23:51:48'),(5,5,1,0,_binary '\0','2026-05-25 23:51:48'),(6,4,1,5,_binary '','2026-05-25 23:51:48'),(7,3,1,5,_binary '','2026-05-25 23:51:48'),(8,2,1,5,_binary '','2026-05-25 23:51:48'),(9,1,1,0,_binary '\0','2026-05-25 23:51:48'),(10,9,2,0,_binary '\0','2026-05-25 23:51:48'),(11,8,2,0,_binary '\0','2026-05-25 23:51:48'),(12,7,2,0,_binary '\0','2026-05-25 23:51:48'),(13,6,2,0,_binary '\0','2026-05-25 23:51:48'),(14,5,2,1,_binary '','2026-05-25 23:51:48'),(15,4,2,1,_binary '','2026-05-25 23:51:48'),(16,3,2,0,_binary '\0','2026-05-25 23:51:48'),(17,2,2,1,_binary '','2026-05-25 23:51:48'),(18,1,2,0,_binary '\0','2026-05-25 23:51:48'),(19,9,3,0,_binary '\0','2026-05-25 23:51:48'),(20,8,3,0,_binary '\0','2026-05-25 23:51:48'),(21,7,3,1,_binary '','2026-05-25 23:51:48'),(22,6,3,0,_binary '\0','2026-05-25 23:51:48'),(23,5,3,1,_binary '','2026-05-25 23:51:48'),(24,4,3,1,_binary '','2026-05-25 23:51:48'),(25,3,3,1,_binary '','2026-05-25 23:51:48'),(26,2,3,1,_binary '','2026-05-25 23:51:48'),(27,1,3,0,_binary '\0','2026-05-25 23:51:48'),(28,9,4,0,_binary '\0','2026-05-25 23:51:48'),(29,8,4,0,_binary '\0','2026-05-25 23:51:48'),(30,7,4,1,_binary '','2026-05-25 23:51:48'),(31,6,4,2,_binary '','2026-05-25 23:51:48'),(32,5,4,1,_binary '','2026-05-25 23:51:48'),(33,4,4,1,_binary '','2026-05-25 23:51:48'),(34,3,4,1,_binary '','2026-05-25 23:51:48'),(35,2,4,1,_binary '','2026-05-25 23:51:48'),(36,1,4,0,_binary '\0','2026-05-25 23:51:48'),(37,9,5,0,_binary '\0','2026-05-25 23:51:48'),(38,8,5,0,_binary '\0','2026-05-25 23:51:48'),(39,7,5,1,_binary '','2026-05-25 23:51:48'),(40,6,5,0,_binary '\0','2026-05-25 23:51:48'),(41,5,5,0,_binary '\0','2026-05-25 23:51:48'),(42,4,5,1,_binary '','2026-05-25 23:51:48'),(43,3,5,0,_binary '\0','2026-05-25 23:51:48'),(44,2,5,1,_binary '','2026-05-25 23:51:48'),(45,1,5,0,_binary '\0','2026-05-25 23:51:48'),(46,9,6,0,_binary '\0','2026-05-25 23:51:48'),(47,8,6,0,_binary '\0','2026-05-25 23:51:48'),(48,7,6,1,_binary '','2026-05-25 23:51:48'),(49,6,6,0,_binary '\0','2026-05-25 23:51:48'),(50,5,6,0,_binary '\0','2026-05-25 23:51:48'),(51,4,6,1,_binary '','2026-05-25 23:51:48'),(52,3,6,0,_binary '\0','2026-05-25 23:51:48'),(53,2,6,1,_binary '','2026-05-25 23:51:48'),(54,1,6,0,_binary '\0','2026-05-25 23:51:48'),(55,9,7,0,_binary '\0','2026-05-25 23:51:48'),(56,8,7,0,_binary '\0','2026-05-25 23:51:48'),(57,7,7,1,_binary '','2026-05-25 23:51:48'),(58,6,7,0,_binary '\0','2026-05-25 23:51:48'),(59,5,7,1,_binary '','2026-05-25 23:51:48'),(60,4,7,1,_binary '','2026-05-25 23:51:48'),(61,3,7,1,_binary '','2026-05-25 23:51:48'),(62,2,7,1,_binary '','2026-05-25 23:51:48'),(63,1,7,0,_binary '\0','2026-05-25 23:51:48'),(64,9,8,0,_binary '\0','2026-05-25 23:51:48'),(65,8,8,0,_binary '\0','2026-05-25 23:51:48'),(66,7,8,0,_binary '\0','2026-05-25 23:51:48'),(67,6,8,1,_binary '','2026-05-25 23:51:48'),(68,5,8,1,_binary '','2026-05-25 23:51:48'),(69,4,8,1,_binary '','2026-05-25 23:51:48'),(70,3,8,0,_binary '\0','2026-05-25 23:51:48'),(71,2,8,1,_binary '','2026-05-25 23:51:48'),(72,1,8,0,_binary '\0','2026-05-25 23:51:48'),(73,9,9,0,_binary '\0','2026-05-25 23:51:48'),(74,8,9,0,_binary '\0','2026-05-25 23:51:48'),(75,7,9,0,_binary '\0','2026-05-25 23:51:48'),(76,6,9,0,_binary '\0','2026-05-25 23:51:48'),(77,5,9,0,_binary '\0','2026-05-25 23:51:48'),(78,4,9,0,_binary '\0','2026-05-25 23:51:48'),(79,3,9,0,_binary '\0','2026-05-25 23:51:48'),(80,2,9,0,_binary '\0','2026-05-25 23:51:48'),(81,1,9,0,_binary '\0','2026-05-25 23:51:48'),(82,9,10,0,_binary '\0','2026-05-25 23:51:48'),(83,8,10,0,_binary '\0','2026-05-25 23:51:48'),(84,7,10,0,_binary '\0','2026-05-25 23:51:48'),(85,6,10,0,_binary '\0','2026-05-25 23:51:48'),(86,5,10,0,_binary '\0','2026-05-25 23:51:48'),(87,4,10,1,_binary '','2026-05-25 23:51:48'),(88,3,10,1,_binary '','2026-05-25 23:51:48'),(89,2,10,0,_binary '\0','2026-05-25 23:51:48'),(90,1,10,0,_binary '\0','2026-05-25 23:51:48'),(91,9,11,0,_binary '\0','2026-05-25 23:51:48'),(92,8,11,0,_binary '\0','2026-05-25 23:51:48'),(93,7,11,1,_binary '','2026-05-25 23:51:48'),(94,6,11,0,_binary '\0','2026-05-25 23:51:48'),(95,5,11,0,_binary '\0','2026-05-25 23:51:48'),(96,4,11,1,_binary '','2026-05-25 23:51:48'),(97,3,11,1,_binary '','2026-05-25 23:51:48'),(98,2,11,1,_binary '','2026-05-25 23:51:48'),(99,1,11,0,_binary '\0','2026-05-25 23:51:48'),(100,9,12,0,_binary '\0','2026-05-25 23:51:48'),(101,8,12,0,_binary '\0','2026-05-25 23:51:48'),(102,7,12,0,_binary '\0','2026-05-25 23:51:48'),(103,6,12,0,_binary '\0','2026-05-25 23:51:48'),(104,5,12,0,_binary '\0','2026-05-25 23:51:48'),(105,4,12,1,_binary '','2026-05-25 23:51:48'),(106,3,12,1,_binary '','2026-05-25 23:51:48'),(107,2,12,1,_binary '','2026-05-25 23:51:48'),(108,1,12,0,_binary '\0','2026-05-25 23:51:48'),(109,9,13,0,_binary '\0','2026-05-25 23:51:48'),(110,8,13,0,_binary '\0','2026-05-25 23:51:48'),(111,7,13,1,_binary '','2026-05-25 23:51:48'),(112,6,13,0,_binary '\0','2026-05-25 23:51:48'),(113,5,13,0,_binary '\0','2026-05-25 23:51:48'),(114,4,13,1,_binary '','2026-05-25 23:51:48'),(115,3,13,1,_binary '','2026-05-25 23:51:48'),(116,2,13,1,_binary '','2026-05-25 23:51:48'),(117,1,13,0,_binary '\0','2026-05-25 23:51:48'),(118,9,14,0,_binary '\0','2026-05-25 23:51:48'),(119,8,14,0,_binary '\0','2026-05-25 23:51:48'),(120,7,14,0,_binary '\0','2026-05-25 23:51:48'),(121,6,14,0,_binary '\0','2026-05-25 23:51:48'),(122,5,14,0,_binary '\0','2026-05-25 23:51:48'),(123,4,14,1,_binary '\0','2026-05-25 23:51:48'),(124,3,14,7,_binary '','2026-05-25 23:51:48'),(125,2,14,0,_binary '\0','2026-05-25 23:51:48'),(126,1,14,0,_binary '\0','2026-05-25 23:51:48'),(127,9,15,0,_binary '\0','2026-05-25 23:51:48'),(128,8,15,0,_binary '\0','2026-05-25 23:51:48'),(129,7,15,0,_binary '\0','2026-05-25 23:51:48'),(130,6,15,0,_binary '\0','2026-05-25 23:51:48'),(131,5,15,0,_binary '\0','2026-05-25 23:51:48'),(132,4,15,0,_binary '\0','2026-05-25 23:51:48'),(133,3,15,0,_binary '\0','2026-05-25 23:51:48'),(134,2,15,0,_binary '\0','2026-05-25 23:51:48'),(135,1,15,0,_binary '\0','2026-05-25 23:51:48'),(136,10,1,5,_binary '','2026-05-28 21:41:17'),(137,10,2,0,_binary '\0','2026-05-28 21:41:17'),(138,10,3,1,_binary '','2026-05-28 21:41:17'),(139,10,4,1,_binary '','2026-05-28 21:41:17'),(140,10,5,1,_binary '','2026-05-28 21:41:17'),(141,10,6,1,_binary '','2026-05-28 21:41:17'),(142,10,7,1,_binary '','2026-05-28 21:41:17'),(143,10,8,0,_binary '\0','2026-05-28 21:41:17'),(144,10,9,0,_binary '\0','2026-05-28 21:41:17'),(145,10,10,0,_binary '\0','2026-05-28 21:41:17'),(146,10,11,0,_binary '\0','2026-05-28 21:41:17'),(147,10,12,0,_binary '\0','2026-05-28 21:41:17'),(148,10,13,0,_binary '\0','2026-05-28 21:41:17'),(149,10,14,0,_binary '\0','2026-05-28 21:41:17'),(150,10,15,0,_binary '\0','2026-05-28 21:41:17'),(151,11,1,0,_binary '\0','2026-05-29 22:57:35'),(152,11,2,1,_binary '','2026-05-29 22:57:35'),(153,11,3,1,_binary '','2026-05-29 22:57:35'),(154,11,4,1,_binary '','2026-05-29 22:57:35'),(155,11,5,1,_binary '','2026-05-29 22:57:35'),(156,11,6,1,_binary '','2026-05-29 22:57:35'),(157,11,7,1,_binary '','2026-05-29 22:57:35'),(158,11,8,0,_binary '\0','2026-05-29 22:57:35'),(159,11,9,0,_binary '\0','2026-05-29 22:57:35'),(160,11,10,0,_binary '\0','2026-05-29 22:57:35'),(161,11,11,1,_binary '','2026-05-29 22:57:35'),(162,11,12,0,_binary '\0','2026-05-29 22:57:35'),(163,11,13,0,_binary '\0','2026-05-29 22:57:35'),(164,11,14,0,_binary '\0','2026-05-29 22:57:35'),(165,11,15,0,_binary '\0','2026-05-29 22:57:35'),(166,12,1,0,_binary '\0','2026-05-29 22:58:18'),(167,12,2,0,_binary '\0','2026-05-29 22:58:18'),(168,12,3,0,_binary '\0','2026-05-29 22:58:18'),(169,12,4,0,_binary '\0','2026-05-29 22:58:18'),(170,12,5,0,_binary '\0','2026-05-29 22:58:18'),(171,12,6,0,_binary '\0','2026-05-29 22:58:18'),(172,12,7,0,_binary '\0','2026-05-29 22:58:18'),(173,12,8,0,_binary '\0','2026-05-29 22:58:18'),(174,12,9,0,_binary '\0','2026-05-29 22:58:18'),(175,12,10,0,_binary '\0','2026-05-29 22:58:18'),(176,12,11,0,_binary '\0','2026-05-29 22:58:18'),(177,12,12,0,_binary '\0','2026-05-29 22:58:18'),(178,12,13,0,_binary '\0','2026-05-29 22:58:18'),(179,12,14,0,_binary '\0','2026-05-29 22:58:18'),(180,12,15,0,_binary '\0','2026-05-29 22:58:18'),(181,13,1,0,_binary '\0','2026-05-29 22:59:59'),(182,13,2,0,_binary '\0','2026-05-29 22:59:59'),(183,13,3,0,_binary '\0','2026-05-29 22:59:59'),(184,13,4,0,_binary '\0','2026-05-29 22:59:59'),(185,13,5,0,_binary '\0','2026-05-29 22:59:59'),(186,13,6,0,_binary '\0','2026-05-29 22:59:59'),(187,13,7,0,_binary '\0','2026-05-29 22:59:59'),(188,13,8,0,_binary '\0','2026-05-29 22:59:59'),(189,13,9,0,_binary '\0','2026-05-29 22:59:59'),(190,13,10,0,_binary '\0','2026-05-29 22:59:59'),(191,13,11,0,_binary '\0','2026-05-29 22:59:59'),(192,13,12,0,_binary '\0','2026-05-29 22:59:59'),(193,13,13,0,_binary '\0','2026-05-29 22:59:59'),(194,13,14,0,_binary '\0','2026-05-29 22:59:59'),(195,13,15,0,_binary '\0','2026-05-29 22:59:59'),(196,14,1,0,_binary '\0','2026-05-29 23:04:23'),(197,14,2,0,_binary '\0','2026-05-29 23:04:23'),(198,14,3,0,_binary '\0','2026-05-29 23:04:23'),(199,14,4,0,_binary '\0','2026-05-29 23:04:23'),(200,14,5,0,_binary '\0','2026-05-29 23:04:23'),(201,14,6,0,_binary '\0','2026-05-29 23:04:23'),(202,14,7,0,_binary '\0','2026-05-29 23:04:23'),(203,14,8,0,_binary '\0','2026-05-29 23:04:23'),(204,14,9,0,_binary '\0','2026-05-29 23:04:23'),(205,14,10,0,_binary '\0','2026-05-29 23:04:23'),(206,14,11,0,_binary '\0','2026-05-29 23:04:23'),(207,14,12,0,_binary '\0','2026-05-29 23:04:23'),(208,14,13,0,_binary '\0','2026-05-29 23:04:23'),(209,14,14,0,_binary '\0','2026-05-29 23:04:23'),(210,14,15,0,_binary '\0','2026-05-29 23:04:23'),(211,15,1,0,_binary '\0','2026-05-29 23:06:04'),(212,15,2,0,_binary '\0','2026-05-29 23:06:04'),(213,15,3,0,_binary '\0','2026-05-29 23:06:04'),(214,15,4,0,_binary '\0','2026-05-29 23:06:04'),(215,15,5,0,_binary '\0','2026-05-29 23:06:04'),(216,15,6,0,_binary '\0','2026-05-29 23:06:04'),(217,15,7,0,_binary '\0','2026-05-29 23:06:04'),(218,15,8,0,_binary '\0','2026-05-29 23:06:04'),(219,15,9,0,_binary '\0','2026-05-29 23:06:04'),(220,15,10,0,_binary '\0','2026-05-29 23:06:04'),(221,15,11,0,_binary '\0','2026-05-29 23:06:04'),(222,15,12,0,_binary '\0','2026-05-29 23:06:04'),(223,15,13,0,_binary '\0','2026-05-29 23:06:04'),(224,15,14,0,_binary '\0','2026-05-29 23:06:04'),(225,15,15,0,_binary '\0','2026-05-29 23:06:04'),(226,16,1,2,_binary '\0','2026-05-29 23:23:06'),(227,16,2,0,_binary '\0','2026-05-29 23:23:06'),(228,16,3,1,_binary '','2026-05-29 23:23:06'),(229,16,4,1,_binary '','2026-05-29 23:23:06'),(230,16,5,0,_binary '\0','2026-05-29 23:23:06'),(231,16,6,1,_binary '','2026-05-29 23:23:06'),(232,16,7,1,_binary '','2026-05-29 23:23:06'),(233,16,8,0,_binary '\0','2026-05-29 23:23:06'),(234,16,9,0,_binary '\0','2026-05-29 23:23:06'),(235,16,10,0,_binary '\0','2026-05-29 23:23:06'),(236,16,11,1,_binary '','2026-05-29 23:23:06'),(237,16,12,0,_binary '\0','2026-05-29 23:23:06'),(238,16,13,1,_binary '','2026-05-29 23:23:06'),(239,16,14,0,_binary '\0','2026-05-29 23:23:06'),(240,16,15,0,_binary '\0','2026-05-29 23:23:06'),(241,17,1,0,_binary '\0','2026-05-30 00:16:25'),(242,17,2,0,_binary '\0','2026-05-30 00:16:25'),(243,17,3,0,_binary '\0','2026-05-30 00:16:25'),(244,17,4,0,_binary '\0','2026-05-30 00:16:25'),(245,17,5,0,_binary '\0','2026-05-30 00:16:25'),(246,17,6,0,_binary '\0','2026-05-30 00:16:25'),(247,17,7,0,_binary '\0','2026-05-30 00:16:25'),(248,17,8,0,_binary '\0','2026-05-30 00:16:25'),(249,17,9,0,_binary '\0','2026-05-30 00:16:25'),(250,17,10,0,_binary '\0','2026-05-30 00:16:25'),(251,17,11,0,_binary '\0','2026-05-30 00:16:25'),(252,17,12,0,_binary '\0','2026-05-30 00:16:25'),(253,17,13,0,_binary '\0','2026-05-30 00:16:25'),(254,17,14,0,_binary '\0','2026-05-30 00:16:25'),(255,17,15,0,_binary '\0','2026-05-30 00:16:25'),(256,18,1,5,_binary '','2026-05-30 00:18:59'),(257,18,2,0,_binary '\0','2026-05-30 00:18:59'),(258,18,3,1,_binary '','2026-05-30 00:18:59'),(259,18,4,1,_binary '','2026-05-30 00:18:59'),(260,18,5,1,_binary '','2026-05-30 00:18:59'),(261,18,6,1,_binary '','2026-05-30 00:18:59'),(262,18,7,1,_binary '','2026-05-30 00:18:59'),(263,18,8,0,_binary '\0','2026-05-30 00:18:59'),(264,18,9,0,_binary '\0','2026-05-30 00:18:59'),(265,18,10,0,_binary '\0','2026-05-30 00:18:59'),(266,18,11,1,_binary '','2026-05-30 00:18:59'),(267,18,12,0,_binary '\0','2026-05-30 00:18:59'),(268,18,13,0,_binary '\0','2026-05-30 00:18:59'),(269,18,14,0,_binary '\0','2026-05-30 00:18:59'),(270,18,15,0,_binary '\0','2026-05-30 00:18:59'),(271,19,1,1,_binary '\0','2026-05-30 00:19:07'),(272,19,2,0,_binary '\0','2026-05-30 00:19:07'),(273,19,3,1,_binary '','2026-05-30 00:19:07'),(274,19,4,1,_binary '','2026-05-30 00:19:07'),(275,19,5,0,_binary '\0','2026-05-30 00:19:07'),(276,19,6,0,_binary '\0','2026-05-30 00:19:07'),(277,19,7,1,_binary '','2026-05-30 00:19:07'),(278,19,8,0,_binary '\0','2026-05-30 00:19:07'),(279,19,9,0,_binary '\0','2026-05-30 00:19:07'),(280,19,10,0,_binary '\0','2026-05-30 00:19:07'),(281,19,11,0,_binary '\0','2026-05-30 00:19:07'),(282,19,12,0,_binary '\0','2026-05-30 00:19:07'),(283,19,13,0,_binary '\0','2026-05-30 00:19:07'),(284,19,14,0,_binary '\0','2026-05-30 00:19:07'),(285,19,15,0,_binary '\0','2026-05-30 00:19:07'),(286,20,1,5,_binary '','2026-05-30 00:19:36'),(287,20,2,1,_binary '','2026-05-30 00:19:36'),(288,20,3,1,_binary '','2026-05-30 00:19:36'),(289,20,4,1,_binary '','2026-05-30 00:19:36'),(290,20,5,1,_binary '','2026-05-30 00:19:36'),(291,20,6,1,_binary '','2026-05-30 00:19:36'),(292,20,7,1,_binary '','2026-05-30 00:19:36'),(293,20,8,0,_binary '\0','2026-05-30 00:19:36'),(294,20,9,0,_binary '\0','2026-05-30 00:19:36'),(295,20,10,0,_binary '\0','2026-05-30 00:19:36'),(296,20,11,1,_binary '','2026-05-30 00:19:36'),(297,20,12,0,_binary '\0','2026-05-30 00:19:36'),(298,20,13,0,_binary '\0','2026-05-30 00:19:36'),(299,20,14,0,_binary '\0','2026-05-30 00:19:36'),(300,20,15,0,_binary '\0','2026-05-30 00:19:36'),(301,21,1,2,_binary '\0','2026-05-30 00:20:50'),(302,21,2,0,_binary '\0','2026-05-30 00:20:50'),(303,21,3,1,_binary '','2026-05-30 00:20:50'),(304,21,4,1,_binary '','2026-05-30 00:20:50'),(305,21,5,1,_binary '','2026-05-30 00:20:50'),(306,21,6,0,_binary '\0','2026-05-30 00:20:50'),(307,21,7,1,_binary '','2026-05-30 00:20:50'),(308,21,8,0,_binary '\0','2026-05-30 00:20:50'),(309,21,9,0,_binary '\0','2026-05-30 00:20:50'),(310,21,10,0,_binary '\0','2026-05-30 00:20:50'),(311,21,11,0,_binary '\0','2026-05-30 00:20:50'),(312,21,12,0,_binary '\0','2026-05-30 00:20:50'),(313,21,13,0,_binary '\0','2026-05-30 00:20:50'),(314,21,14,0,_binary '\0','2026-05-30 00:20:50'),(315,21,15,0,_binary '\0','2026-05-30 00:20:50'),(316,22,1,2,_binary '\0','2026-05-30 00:22:57'),(317,22,2,0,_binary '\0','2026-05-30 00:22:57'),(318,22,3,1,_binary '','2026-05-30 00:22:57'),(319,22,4,1,_binary '','2026-05-30 00:22:57'),(320,22,5,0,_binary '\0','2026-05-30 00:22:57'),(321,22,6,0,_binary '\0','2026-05-30 00:22:57'),(322,22,7,1,_binary '','2026-05-30 00:22:57'),(323,22,8,0,_binary '\0','2026-05-30 00:22:57'),(324,22,9,0,_binary '\0','2026-05-30 00:22:57'),(325,22,10,0,_binary '\0','2026-05-30 00:22:57'),(326,22,11,0,_binary '\0','2026-05-30 00:22:57'),(327,22,12,0,_binary '\0','2026-05-30 00:22:57'),(328,22,13,0,_binary '\0','2026-05-30 00:22:57'),(329,22,14,0,_binary '\0','2026-05-30 00:22:57'),(330,22,15,0,_binary '\0','2026-05-30 00:22:57');
/*!40000 ALTER TABLE `usuario_tarea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_tareas`
--

DROP TABLE IF EXISTS `v_tareas`;
/*!50001 DROP VIEW IF EXISTS `v_tareas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_tareas` AS SELECT 
 1 AS `Titulo`,
 1 AS `Descripcion`,
 1 AS `Objetivo`,
 1 AS `Puntos`,
 1 AS `Frecuencia`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_tareas_usuario`
--

DROP TABLE IF EXISTS `v_tareas_usuario`;
/*!50001 DROP VIEW IF EXISTS `v_tareas_usuario`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_tareas_usuario` AS SELECT 
 1 AS `ID_Us`,
 1 AS `Titulo`,
 1 AS `Descripcion`,
 1 AS `Progreso`,
 1 AS `Objetivo`,
 1 AS `Puntos`,
 1 AS `Frecuencia`,
 1 AS `Completada`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'poi_chat'
--

--
-- Dumping routines for database 'poi_chat'
--
/*!50003 DROP PROCEDURE IF EXISTS `SP_CrearTarea` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `SP_CrearTarea`(
	IN P_Titulo VARCHAR(50),
    IN P_Descripcion VARCHAR(150),
    IN P_Tipo VARCHAR(15),
    IN P_Objetivo INT,
    IN P_Puntos INT,
    IN P_Diario BIT 
    )
BEGIN
	INSERT INTO tarea(tarea.Titulo,tarea.Descripcion,tarea.Tipo,tarea.Objetivo,tarea.Puntos,tarea.EsDiario)
    VALUES(P_Titulo,P_Descripcion,P_Tipo,P_Objetivo,P_Puntos,P_Diario);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_Ingresar_Tareas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `SP_Ingresar_Tareas`()
BEGIN
	CALL SP_CrearTarea("Molesta a tus amigo","Envia 5 mensajes","mensaje",5,500,1);
    CALL SP_CrearTarea("The Best Frind!","Marca a alguien como Favorito","favorito",1,1000,0);
    CALL SP_CrearTarea("Un Nuevo Colega","Agrega a Un Amigo","amistad",1,150,0);
    
    CALL SP_CrearTarea("Bienvenido!!","Iniciaste Secion en MundiChat!","login",1,2500,0);
    CALL SP_CrearTarea("Año Nuevo, Nuevo yo","Cambia tú foto de perfil","foto",1,1500,0);
    CALL SP_CrearTarea("Sé Unico","Agrega una imagen de Banner","foto",1,1500,0);
    
    CALL SP_CrearTarea("Yo te conozco...","Envia una solicitud de amistad","amistad",1,100,0);
    CALL SP_CrearTarea("¿Tú quien eres?","Rechaza una Solicitud de amistad","amistad",1,900,0);
    CALL SP_CrearTarea("Expresate!!","Envia un Stiker","stiker",1,1500,1);
    
    CALL SP_CrearTarea("Mira!!","Envia una Foto o Imagen a un chat","archivo",1,1500,1);
    CALL SP_CrearTarea("Allô? ","Haz una llamada a un amigo","amistad",1,3500,0);
    CALL SP_CrearTarea("Snake! Talk to me! Snake! Snaakeee!!","Te han Rechazado una Videollamada","amistad",1,3500,1);
    
    CALL SP_CrearTarea("Vamos a vernos","Haz una videollamada y que te contesten","amistad",1,3000,1);
    CALL SP_CrearTarea("Seción de Fotos","Envia más de 6 fotos a un amigo","foto",7,7000,1);
    CALL SP_CrearTarea("Liz, ¿En Donde estas?","Envia la Hubicación a un amigo","amistad",1,5000,1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_tareas`
--

/*!50001 DROP VIEW IF EXISTS `v_tareas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`127.0.0.1` SQL SECURITY DEFINER */
/*!50001 VIEW `v_tareas` AS select `t`.`Titulo` AS `Titulo`,`t`.`Descripcion` AS `Descripcion`,`t`.`Objetivo` AS `Objetivo`,`t`.`Puntos` AS `Puntos`,if(`t`.`EsDiario` = 0,'Una vez','Diario') AS `Frecuencia` from `tarea` `t` order by `t`.`Descripcion`,`t`.`Puntos`,`t`.`Objetivo` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_tareas_usuario`
--

/*!50001 DROP VIEW IF EXISTS `v_tareas_usuario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`127.0.0.1` SQL SECURITY DEFINER */
/*!50001 VIEW `v_tareas_usuario` AS select `u`.`ID_Us` AS `ID_Us`,`t`.`Titulo` AS `Titulo`,`t`.`Descripcion` AS `Descripcion`,`ut`.`Progreso` AS `Progreso`,`t`.`Objetivo` AS `Objetivo`,`t`.`Puntos` AS `Puntos`,if(`t`.`EsDiario` = 0,'Una vez','Diario') AS `Frecuencia`,if(`ut`.`Completada` = 0,'Pendiente','Completada') AS `Completada` from ((`usuario_tarea` `ut` join `tarea` `t` on(`ut`.`id_tarea` = `t`.`ID_Tarea`)) join `usuario` `u` on(`ut`.`id_usuario` = `u`.`ID_Us`)) order by `t`.`Descripcion`,`t`.`Puntos`,`t`.`Objetivo` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30  5:38:25
