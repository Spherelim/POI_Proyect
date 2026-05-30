-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: poi_chat2
-- ------------------------------------------------------
-- Server version	9.2.0

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
  `ID_Amistad` int NOT NULL AUTO_INCREMENT,
  `usuario1` int DEFAULT NULL,
  `usuario2` int DEFAULT NULL,
  `estado` enum('pendiente','aceptado','bloqueado','rechazado') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sileciar` bit(1) DEFAULT NULL,
  `Favorito` bit(1) DEFAULT NULL,
  PRIMARY KEY (`ID_Amistad`),
  KEY `usuario1` (`usuario1`),
  KEY `usuario2` (`usuario2`),
  CONSTRAINT `amistad_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuario` (`ID_Us`),
  CONSTRAINT `amistad_ibfk_2` FOREIGN KEY (`usuario2`) REFERENCES `usuario` (`ID_Us`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amistad`
--

LOCK TABLES `amistad` WRITE;
/*!40000 ALTER TABLE `amistad` DISABLE KEYS */;
INSERT INTO `amistad` VALUES (1,3,2,'aceptado',NULL,NULL),(2,5,3,'aceptado',NULL,NULL),(3,4,3,'aceptado',NULL,NULL),(5,7,3,'aceptado',NULL,NULL),(6,8,3,'aceptado',NULL,NULL),(7,9,3,'aceptado',NULL,NULL),(9,6,4,'aceptado',NULL,NULL),(14,2,4,'aceptado',_binary '\0',_binary '\0'),(15,4,10,'aceptado',_binary '\0',_binary ' '),(17,5,4,'aceptado',_binary ' ',_binary '\0');
/*!40000 ALTER TABLE `amistad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversacion`
--

DROP TABLE IF EXISTS `conversacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversacion` (
  `ID_Conversacion` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID_Conversacion`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversacion`
--

LOCK TABLES `conversacion` WRITE;
/*!40000 ALTER TABLE `conversacion` DISABLE KEYS */;
INSERT INTO `conversacion` VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9);
/*!40000 ALTER TABLE `conversacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversacion_usuario`
--

DROP TABLE IF EXISTS `conversacion_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversacion_usuario` (
  `id_conversacion` int NOT NULL,
  `id_usuario` int NOT NULL,
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
INSERT INTO `conversacion_usuario` VALUES (1,2),(8,2),(1,3),(2,3),(3,3),(4,3),(5,3),(6,3),(3,4),(7,4),(8,4),(9,4),(2,5),(7,6),(4,7),(6,8),(5,9),(9,10);
/*!40000 ALTER TABLE `conversacion_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `ID_Item` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Tipo` enum('banner','marco','sticker','color','insignia') DEFAULT NULL,
  `Precio` int DEFAULT NULL,
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
  `ID_Mensaje` int NOT NULL AUTO_INCREMENT,
  `id_conversacion` int DEFAULT NULL,
  `id_remitente` int DEFAULT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci,
  `fechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Mensaje`),
  KEY `id_conversacion` (`id_conversacion`),
  KEY `id_remitente` (`id_remitente`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`id_conversacion`) REFERENCES `conversacion` (`ID_Conversacion`),
  CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`id_remitente`) REFERENCES `usuario` (`ID_Us`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensaje`
--

LOCK TABLES `mensaje` WRITE;
/*!40000 ALTER TABLE `mensaje` DISABLE KEYS */;
INSERT INTO `mensaje` VALUES (1,1,2,'Hola','2026-04-24 19:34:25'),(2,1,3,'Increible funciona','2026-04-24 19:37:50'),(3,1,3,'Asies','2026-04-24 19:37:57'),(4,1,3,'que rollo se invirtio o soy yo?','2026-04-24 19:42:17'),(5,1,3,'nAH ESTA BIEN','2026-04-24 19:42:26'),(6,1,3,'fUNCIONA?','2026-04-24 19:46:45'),(7,1,2,'eSPERO QUE SI','2026-04-24 19:46:58'),(8,1,3,'Haber','2026-04-24 19:49:32'),(9,1,3,'Genial ya lo logré','2026-04-24 19:49:40'),(10,1,2,'Epico','2026-04-24 19:49:44'),(11,1,3,'yA FUNCIONA MIRA','2026-04-24 19:51:07'),(12,1,2,'tREMENDO','2026-04-24 19:51:13'),(13,1,2,'cASI MAGICO','2026-04-24 19:51:17'),(14,1,3,'aSIES MI COMPADRE xd','2026-04-24 19:51:28'),(15,1,3,'hola','2026-04-25 00:09:23'),(16,1,3,'Probando','2026-04-25 00:23:21'),(17,1,2,'Vamoo','2026-04-25 00:23:30'),(18,1,2,'Prueba 3','2026-04-25 00:26:44'),(19,2,3,'hola','2026-04-25 00:33:42'),(20,2,5,'Que onda','2026-04-25 00:33:46'),(21,3,4,'hola mamasita, como estas?, estas solita?','2026-04-25 00:37:59'),(22,3,3,'Esto lo va a ver el profe sabes jajaja','2026-04-25 00:39:19'),(23,3,4,'xd','2026-04-25 00:39:24'),(24,3,4,'hola profe uwu','2026-04-25 00:39:29'),(25,3,4,'lo quiero mucho','2026-04-25 00:39:33'),(26,3,4,'KJSAHDHKASJDH','2026-04-25 00:39:36'),(27,3,3,'jajajaja','2026-04-25 00:39:45'),(28,3,3,'pos ta con madre','2026-04-25 00:39:54'),(29,3,3,'batalle un poco pero ya jala','2026-04-25 00:40:07'),(30,3,4,'EIT YO TAMBIEN HICE UNA PRUEVA CON NGROK','2026-04-25 00:40:12'),(31,3,3,'solo que pues como ves no carga los iconos mas que nada','2026-04-25 00:40:21'),(32,3,4,'PERO PUES MEJOR LA HUBIERA ECHO EN EL PROYECTO XD','2026-04-25 00:40:25'),(33,3,3,'jajajaja','2026-04-25 00:40:36'),(34,3,4,'ESO LO ARREGLAMOS DESPUES','2026-04-25 00:40:37'),(35,3,3,'yo','2026-04-25 00:40:39'),(36,3,4,'AHORITA JALA EL CHAT','2026-04-25 00:40:45'),(37,3,3,'no crees que nos diga algo o si del diseño?','2026-04-25 00:40:54'),(38,3,4,'EH ASE SCROLL CON DOS MUCHOS MENSAJES?','2026-04-25 00:40:56'),(39,3,4,'AGUESO','2026-04-25 00:40:59'),(40,3,4,'QUE RICO','2026-04-25 00:41:02'),(41,3,3,'ei','2026-04-25 00:41:03'),(42,3,4,'YO DIGO QUE...','2026-04-25 00:41:19'),(43,3,4,'MMMMM','2026-04-25 00:41:21'),(44,3,4,'NAH SI','2026-04-25 00:41:30'),(45,3,3,'tambien cuando te conectas desde otro dispositivo agarra de la bd los registros de mensajes si entras con la misma cuenta pero en otro dispositivo','2026-04-25 00:41:33'),(46,3,4,'OJO','2026-04-25 00:41:45'),(47,3,4,'CONMADRE','2026-04-25 00:41:48'),(48,3,3,'y pos te trae tu chat','2026-04-25 00:41:48'),(49,3,4,'GRACIAS RAUL','2026-04-25 00:41:52'),(50,3,4,'UWU','2026-04-25 00:41:53'),(51,3,4,'<#','2026-04-25 00:41:57'),(52,3,3,'tarda menos que el messenger o whatsapp jajaja','2026-04-25 00:42:00'),(53,3,4,'IIIIH','2026-04-25 00:42:00'),(54,3,4,'3','2026-04-25 00:42:02'),(55,3,4,'A NO SI JALÑA','2026-04-25 00:42:06'),(56,3,4,'XD','2026-04-25 00:42:10'),(57,3,4,'ANDALE','2026-04-25 00:42:11'),(58,3,4,'VAMOS A REVOLUCIONAR EL CHAT','2026-04-25 00:42:19'),(59,3,4,'DDDDD','2026-04-25 00:42:21'),(60,3,3,'pero bueno ya quedo asi lo dejo?','2026-04-25 00:42:22'),(61,3,4,'MMMM','2026-04-25 00:42:32'),(62,3,3,'pa mandar un ultimo push al repositorio','2026-04-25 00:42:33'),(63,3,3,'o que onda?','2026-04-25 00:42:44'),(64,3,4,'MANDA EL PUSH, Y SI PUEDES NADA MÁS...','2026-04-25 00:42:59'),(65,3,4,'PEA','2026-04-25 00:43:00'),(66,3,4,'NADAMÁS VE COMO SE ARREGLA UNO','2026-04-25 00:43:09'),(67,3,3,'si puedo que?','2026-04-25 00:43:22'),(68,3,3,'no te entendi perdon','2026-04-25 00:43:26'),(69,3,4,'O PONLE UNA IMAGEN PREDETERMINADA A LOS USUARIOS','2026-04-25 00:43:27'),(70,3,4,'LO DE LOS ICONOS','2026-04-25 00:43:34'),(71,3,3,'ah smn voy a intentar hacer eso','2026-04-25 00:43:36'),(72,3,4,'VAVA','2026-04-25 00:43:42'),(73,3,4,'THX','2026-04-25 00:43:44'),(74,3,4,'YO VOY A SEGUIR DANDOLE A PW2','2026-04-25 00:43:53'),(75,3,3,'espero no tardarme pero voy a mandar el push asi como quiera pa por si la llego a cajetear pos tener un backup con lo que sirve','2026-04-25 00:44:08'),(76,3,3,'dale','2026-04-25 00:44:15'),(77,3,4,'YA ME VOY A SALIR DE ESTA MAUSER','2026-04-25 00:44:21'),(78,3,3,'date','2026-04-25 00:44:24'),(79,3,4,'* DESAPARECE *','2026-04-25 01:25:50'),(80,2,5,'Estás despierto?','2026-04-25 01:25:50'),(81,2,3,'sip','2026-04-25 01:25:53'),(82,4,7,'queondi','2026-04-25 01:29:13'),(83,4,3,'que rollo','2026-04-25 01:29:18'),(84,4,3,'que te parece?','2026-04-25 01:29:24'),(85,4,7,'ala','2026-04-25 01:29:25'),(86,4,7,'wriz','2026-04-25 01:29:29'),(87,4,3,'responde al moment padre','2026-04-25 01:29:32'),(88,4,7,'ei','2026-04-25 01:29:36'),(89,4,7,'wasap 2','2026-04-25 01:29:39'),(90,4,3,'magico','2026-04-25 01:29:39'),(91,4,3,'jajajajaja','2026-04-25 01:29:42'),(92,4,7,'top tier','2026-04-25 01:29:43'),(93,4,3,'pero bueno ya esta hasta aqui lo dejo ya con eso no deberia haber queja','2026-04-25 01:30:00'),(94,4,7,'goti','2026-04-25 01:30:14'),(95,4,3,'jala todotodito','2026-04-25 01:30:16'),(96,4,3,'bueno lo necesario','2026-04-25 01:30:25'),(97,4,7,'⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀ ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀⢴⣶⣶⣿⣿⣿⣆ ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟ ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀ ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀ ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢸⣿⣀⣀⣀⣼⡿⢿⣿⣿⣿⣿⣿⡿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠙⠛⠛⠛⠋⠁⠀⠙⠻⠿⠟⠋⠑⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀','2026-04-25 01:30:28'),(98,4,3,'jajajaja','2026-04-25 01:30:40'),(99,4,7,'⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠉⠉⠉⠉⠉⠉⠉⠙⠻⢶⣄⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀    ⠀⠙⣷⡀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡟⠀⣠⣶⠛⠛⠛⠛⠛⠛⠳⣦⡀⠀⠘⣿⡄⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠁⠀⢹⣿⣦⣀⣀⣀⣀⣀⣠⣼⡇⠀⠀⠸⣷⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡏⠀⠀⠀⠉⠛⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⣿ ⠀⠀           ⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀                  ⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀ ⠀⠀⠀⠀⠀⠀⠀⢸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠀ ⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⣿⠀ ⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⣿⠀ ⠀⠀⠀⠀⠀⠀⢰⣿⠀⠀⠀⠀⣠⡶⠶⠿⠿⠿⠿⢷⣦⠀⠀⠀⠀⠀    ⣿⠀ ⠀⠀⣀⣀⣀⠀⣸⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⣿⠀ ⣠⡿⠛⠛⠛⠛⠻⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀ ⠀⣿⠀ ⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡟⠀⠀⢀⣤⣤⣴⣿⠀⠀⠀⠀⠀⠀  ⠀⣿⠀ ⠈⠙⢷⣶⣦⣤⣤⣤⣴⣶⣾⠿⠛⠁⢀⣶⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀                                ⠀⠀⠀⠀⠈⣿⣆⡀⠀⠀⠀⠀⠀⠀⢀⣠⣴⡾⠃⠀ ⠀                        ⠀⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣾⣿⡿⠿⠟⠋⠁⠀⠀⠀','2026-04-25 01:30:48'),(100,4,7,'⣿⣿⠟⢹⣶⣶⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⡟⢰⡌⠿⢿⣿⡾⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⢸⣿⣤⣒⣶⣾⣳⡻⣿⣿⣿⣿⡿⢛⣯⣭⣭⣭⣽⣻⣿⣿ ⣿⣿⢸⣿⣿⣿⣿⢿⡇⣶⡽⣿⠟⣡⣶⣾⣯⣭⣽⣟⡻⣿⣷⡽ ⣿⣿⠸⣿⣿⣿⣿⢇⠃⣟⣷⠃⢸⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣇⢻⣿⣿⣯⣕⠧⢿⢿⣇⢯⣝⣒⣛⣯⣭⣛⣛⣣⣿⣿⣿ ⣿⣿⣿⣌⢿⣿⣿⣿⣿⡘⣞⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣦⠻⠿⣿⣿⣷⠈⢞⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣗⠄⢿⣿⣿⡆⡈⣽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⡿⣻⣽⣿⣆⠹⣿⡇⠁⣿⡼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟ ⠿⣛⣽⣾⣿⣿⠿⠋⠄⢻⣷⣾⣿⣧⠟⣡⣾⣿⣿⣿⣿⣿⣿⡇ ⡟⢿⣿⡿⠋⠁⣀⡀⠄⠘⠊⣨⣽⠁⠰⣿⣿⣿⣿⣿⣿⣿⡍⠗ ⣿⠄⠄⠄⠄⣼⣿⡗⢠⣶⣿⣿⡇⠄⠄⣿⣿⣿⣿⣿⣿⣿⣇⢠ ⣝⠄⠄⢀⠄⢻⡟⠄⣿⣿⣿⣿⠃⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⢹ ⣿⣿⣿⣿⣧⣄⣁⡀⠙⢿⡿⠋⠄⣸⡆⠄⠻⣿⡿⠟⢛⣩⣝⣚ ⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣾⣿⣿⣄⠄⠄⠄⣴⣿⣿⣿⣇ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠛⠿⣿⣫⣾','2026-04-25 01:32:20'),(101,5,3,'Hola','2026-04-25 07:14:21'),(102,5,9,'Hola','2026-04-25 07:14:33'),(103,6,8,'Hola','2026-04-25 07:14:47'),(104,6,3,'Jsjxjsjd','2026-04-25 07:15:26'),(105,6,8,'Funcionó','2026-04-25 07:15:54'),(106,5,9,'hola','2026-04-25 07:23:59'),(107,5,3,'awdsadw','2026-04-25 07:24:04'),(108,5,3,'fghfghfg','2026-04-25 07:24:23'),(109,7,4,'hola xd','2026-05-27 23:40:31'),(110,7,6,'nigger','2026-05-28 00:50:41'),(111,7,4,'que fue?','2026-05-28 00:50:50'),(112,7,6,'ada','2026-05-28 00:50:52'),(113,7,6,'nada*','2026-05-28 00:50:56'),(114,7,6,'xd','2026-05-28 00:50:57'),(115,7,4,'1','2026-05-28 17:38:08'),(116,7,4,'2','2026-05-28 17:38:09'),(117,7,4,'3','2026-05-28 17:38:10'),(118,7,4,'4','2026-05-28 17:38:10'),(119,7,4,'5','2026-05-28 17:38:12'),(120,7,4,'6','2026-05-28 17:38:12'),(121,7,4,'hola','2026-05-28 17:39:21'),(122,7,4,'2','2026-05-28 17:39:36'),(123,7,4,'3','2026-05-28 17:39:37'),(124,7,4,'4','2026-05-28 17:39:40'),(125,7,4,'5','2026-05-28 17:39:41'),(126,7,4,'hola','2026-05-28 17:57:33'),(127,7,4,'dame esos puntos','2026-05-28 18:07:15'),(128,7,4,'si','2026-05-28 18:07:16'),(129,7,4,'hola','2026-05-28 18:07:17'),(130,7,4,'xd','2026-05-28 18:07:22'),(131,7,4,'1','2026-05-28 18:29:13'),(132,7,4,'2','2026-05-28 18:29:14'),(133,7,4,'3','2026-05-28 18:29:14'),(134,7,4,'4','2026-05-28 18:29:15'),(135,7,4,'5','2026-05-28 18:29:15'),(136,7,4,'6','2026-05-28 18:29:37'),(137,8,4,'wasaaaaaaaa','2026-05-28 21:34:18'),(138,9,4,'wazaaaa','2026-05-28 21:44:21'),(139,9,10,'Hi','2026-05-28 21:44:22'),(140,9,4,'KLJSAKDJASJD','2026-05-28 21:44:35'),(141,9,4,'si jala kasjdkajsd','2026-05-28 21:44:38'),(142,9,10,'Ci','2026-05-28 21:44:57'),(143,9,10,'Te quedó con maye','2026-05-28 21:45:02'),(144,9,4,'devolon con 6150 puntos','2026-05-28 21:45:06'),(145,9,10,'Las llamadas jalan?','2026-05-28 21:45:22'),(146,9,4,'noppi','2026-05-28 21:45:26'),(147,9,4,'no estan implementadas','2026-05-28 21:45:30'),(148,9,10,'Waos','2026-05-28 21:45:37'),(149,9,10,'Que usaste?','2026-05-28 21:45:44'),(150,9,10,'Sockets?','2026-05-28 21:45:48'),(151,9,4,'yepi','2026-05-28 21:45:52'),(152,9,10,'Oh porque sale esa página del inicio?','2026-05-28 21:46:03'),(153,9,4,'bueno, se supone que usa socket','2026-05-28 21:46:04'),(154,9,4,'cual? cuandos e muestra los developers?','2026-05-28 21:46:22'),(155,9,4,'nopas para darle estilo','2026-05-28 21:46:29'),(156,9,4,'jsjsjsjs','2026-05-28 21:46:30'),(157,9,10,'Es que mandas como una página no?','2026-05-28 21:46:52'),(158,9,4,'yepi','2026-05-28 21:47:00'),(159,9,10,'Al inicio M','2026-05-28 21:47:00'),(160,9,10,'No me hagas mucho caso jsjs','2026-05-28 21:47:06'),(161,9,10,'Toy loquito','2026-05-28 21:47:09'),(162,9,4,'se supone que es la pagina de \"conoce la app\"','2026-05-28 21:47:12'),(163,9,10,'AAAH','2026-05-28 21:47:19'),(164,9,10,'YABYA','2026-05-28 21:47:21'),(165,9,4,'pero pues nada más le psue el nombre de la pagina y los integrantes del equipo','2026-05-28 21:47:50'),(166,9,4,'por que refrescas tanto la pagina?','2026-05-28 21:48:30'),(167,9,4,'wa happen?','2026-05-28 21:48:39'),(168,9,10,'Que fueM','2026-05-28 21:48:50'),(169,9,10,'?','2026-05-28 21:48:51'),(170,9,4,'ya vi xd','2026-05-28 21:48:51'),(171,9,10,'Cambie foto de perfil ','2026-05-28 21:48:57'),(172,9,4,'ya vi ya vi aksjdkasjd','2026-05-28 21:49:03'),(173,9,10,'Me gusta más ese','2026-05-28 21:49:11'),(174,9,10,'De mi juego','2026-05-28 21:49:14'),(175,9,4,'igual se guarda en la carpeta de uploads xd','2026-05-28 21:49:23'),(176,9,10,'Comom','2026-05-28 21:49:32'),(177,9,10,'?','2026-05-28 21:49:33'),(178,9,4,'AKJHSDKJASD','2026-05-28 21:49:43'),(179,9,4,'WASHA','2026-05-28 21:49:45'),(180,9,4,'el whats','2026-05-28 21:50:07'),(181,7,4,'https://maps.app.goo.gl/C6dewG3YayD3aXKp9','2026-05-29 01:08:51');
/*!40000 ALTER TABLE `mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `ID_Per` int NOT NULL AUTO_INCREMENT,
  `NombreCompleto` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FechaNac` date DEFAULT NULL,
  PRIMARY KEY (`ID_Per`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'John Doe','1990-01-01'),(2,'Mauricio Eleuterio','2004-12-06'),(3,'Raul Cortez','2004-06-05'),(4,'Maurico Eleuterio Ortiz Rodriguez','2004-12-06'),(5,'Juan Carlos Bodoque','2004-06-10'),(6,'Carlos Alejandro Hernandez','2004-12-06'),(7,'iggy pro','2005-08-04'),(8,'Ian','2005-08-10'),(9,'Alan Dario Gomez Treviño','2004-10-19'),(10,'Lizbeth Hernández Hernández ','2003-05-05');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarea`
--

DROP TABLE IF EXISTS `tarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarea` (
  `ID_Tarea` int NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(50) NOT NULL,
  `Descripcion` varchar(150) DEFAULT NULL,
  `Tipo` enum('mensaje','archivo','stiker','favorito','foto','amistad','login') DEFAULT NULL,
  `Objetivo` int DEFAULT '1',
  `Puntos` int DEFAULT '0',
  `EsDiario` bit(1) DEFAULT b'0',
  PRIMARY KEY (`ID_Tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea`
--

LOCK TABLES `tarea` WRITE;
/*!40000 ALTER TABLE `tarea` DISABLE KEYS */;
INSERT INTO `tarea` VALUES (1,'Molesta a tus amigo','envia 5 mensajes (500pts c/u)','mensaje',5,500,_binary ' '),(2,'The Best Frind!','Marca a alguien como Favorito','favorito',1,1000,_binary '\0'),(3,'Un Nuevo Colega','Agrega a Un Amigo','amistad',1,150,_binary '\0'),(4,'Bienvenido!!','Iniciaste Secion en MundiChat!','login',1,2500,_binary '\0'),(5,'Año Nuevo, Nuevo yo','Cambia tú foto de perfil','foto',1,1500,_binary '\0'),(6,'Sé Unico','Agrega una imagen de Banner','foto',1,1500,_binary '\0'),(7,'Yo te conozco...','Envia una solicitud de amistad','amistad',1,100,_binary '\0'),(8,'¿Tú quien eres?','Rechaza una Solicitud de amistad','amistad',1,900,_binary '\0'),(9,'Expresate!!','Envia un Stiker','stiker',1,1500,_binary ' '),(10,'Mira!!','Envia una Foto o Imagen a un chat','archivo',1,1500,_binary ' '),(11,'Allô? ','Haz una llamada a un amigo','amistad',1,3500,_binary '\0'),(12,'Snake! Talk to me! Snake! Snaakeee!!','Te han Rechazado una Videollamada','amistad',1,3500,_binary ' '),(13,'Vamos a vernos','Haz una videollamada y que te contesten','amistad',1,3000,_binary ' '),(14,'Seción de Fotos','envia más de 6 Fotos a un amigo (1000pts c/u)','foto',7,1000,_binary ' '),(15,'Liz, ¿En Donde estas?','Envia la Hubicación a un amigo','amistad',1,5000,_binary ' ');
/*!40000 ALTER TABLE `tarea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID_Us` int NOT NULL AUTO_INCREMENT,
  `NombreUsuario` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Contraseña` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Foto` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Banner` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_per` int DEFAULT NULL,
  `Puntos` int DEFAULT '0',
  `FechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `Descripcion` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`ID_Us`),
  KEY `id_per` (`id_per`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_per`) REFERENCES `persona` (`ID_Per`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,NULL,'johndoe@example.com','password123',NULL,NULL,1,0,'2026-05-27 00:22:18',NULL),(2,'Chetto','mau.ortiz350@gmail.com','123456578','/uploads/1780025492950-519170418.gif','/uploads/1780025493084-743478887.jpg',2,6650,'2026-05-27 00:22:18',''),(3,'Ruly','Raul@gmail.com','T6fmrtBy','/uploads/1779874687945-515134468.jpg','/uploads/1779874687950-234902647.jpg',3,0,'2026-05-27 00:22:18',''),(4,'Chetito','mau.ortiz@gmail.com','Hola_SOY_ADMIN.','/uploads/1780025700614-98978894.gif','/uploads/1780025700653-955427447.gif',4,10150,'2026-05-27 00:22:18','si vez esto significa que logre implementarlo'),(5,'Juan Bodoque','bodoque@gmail.com','T6fmrtBy',NULL,NULL,5,4650,'2026-05-27 00:22:18',NULL),(6,'SoplaPoyasXxxx','Carlos@gmail.com','Hola_SOY1.','/uploads/1779873848541-98257399.jpg','/uploads/1779950686934-585031086.jpg',6,3400,'2026-05-27 00:22:18','Skibidi Sigma Papu'),(7,'iggy','aczino02ytIGGY@outlook.com','T6fmrtByIGGY',NULL,NULL,7,0,'2026-05-27 00:22:18',NULL),(8,'Naitzumi','ian@gmail.com','987654321',NULL,NULL,8,0,'2026-05-27 00:22:18',NULL),(9,'Alan','alan@gmail.com','T6fmrtBy',NULL,NULL,9,0,'2026-05-27 00:22:18',NULL),(10,'zuazuito','marthahdezmartinez@gmail.com','zuazuito05','/uploads/1780026509965-993921493.jpg','/uploads/1780026190002-980353022.jpg',10,8150,'2026-05-28 21:41:17','');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_item`
--

DROP TABLE IF EXISTS `usuario_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_item` (
  `id_usuario` int NOT NULL,
  `id_item` int NOT NULL,
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
  `ID_UsTar` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_tarea` int DEFAULT NULL,
  `Progreso` int DEFAULT '0',
  `Completada` bit(1) DEFAULT b'0',
  `Fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_UsTar`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tarea` (`id_tarea`),
  CONSTRAINT `usuario_tarea_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Us`),
  CONSTRAINT `usuario_tarea_ibfk_2` FOREIGN KEY (`id_tarea`) REFERENCES `tarea` (`ID_Tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_tarea`
--

LOCK TABLES `usuario_tarea` WRITE;
/*!40000 ALTER TABLE `usuario_tarea` DISABLE KEYS */;
INSERT INTO `usuario_tarea` VALUES (1,9,1,0,_binary '\0','2026-05-25 23:51:48'),(2,8,1,0,_binary '\0','2026-05-25 23:51:48'),(3,7,1,0,_binary '\0','2026-05-25 23:51:48'),(4,6,1,0,_binary '\0','2026-05-25 23:51:48'),(5,5,1,0,_binary '\0','2026-05-25 23:51:48'),(6,4,1,5,_binary ' ','2026-05-25 23:51:48'),(7,3,1,0,_binary '\0','2026-05-25 23:51:48'),(8,2,1,0,_binary '\0','2026-05-25 23:51:48'),(9,1,1,0,_binary '\0','2026-05-25 23:51:48'),(10,9,2,0,_binary '\0','2026-05-25 23:51:48'),(11,8,2,0,_binary '\0','2026-05-25 23:51:48'),(12,7,2,0,_binary '\0','2026-05-25 23:51:48'),(13,6,2,0,_binary '\0','2026-05-25 23:51:48'),(14,5,2,1,_binary ' ','2026-05-25 23:51:48'),(15,4,2,1,_binary ' ','2026-05-25 23:51:48'),(16,3,2,0,_binary '\0','2026-05-25 23:51:48'),(17,2,2,0,_binary '\0','2026-05-25 23:51:48'),(18,1,2,0,_binary '\0','2026-05-25 23:51:48'),(19,9,3,0,_binary '\0','2026-05-25 23:51:48'),(20,8,3,0,_binary '\0','2026-05-25 23:51:48'),(21,7,3,0,_binary '\0','2026-05-25 23:51:48'),(22,6,3,0,_binary '\0','2026-05-25 23:51:48'),(23,5,3,1,_binary ' ','2026-05-25 23:51:48'),(24,4,3,1,_binary ' ','2026-05-25 23:51:48'),(25,3,3,0,_binary '\0','2026-05-25 23:51:48'),(26,2,3,1,_binary ' ','2026-05-25 23:51:48'),(27,1,3,0,_binary '\0','2026-05-25 23:51:48'),(28,9,4,0,_binary '\0','2026-05-25 23:51:48'),(29,8,4,0,_binary '\0','2026-05-25 23:51:48'),(30,7,4,0,_binary '\0','2026-05-25 23:51:48'),(31,6,4,2,_binary ' ','2026-05-25 23:51:48'),(32,5,4,1,_binary ' ','2026-05-25 23:51:48'),(33,4,4,1,_binary ' ','2026-05-25 23:51:48'),(34,3,4,0,_binary '\0','2026-05-25 23:51:48'),(35,2,4,1,_binary ' ','2026-05-25 23:51:48'),(36,1,4,0,_binary '\0','2026-05-25 23:51:48'),(37,9,5,0,_binary '\0','2026-05-25 23:51:48'),(38,8,5,0,_binary '\0','2026-05-25 23:51:48'),(39,7,5,0,_binary '\0','2026-05-25 23:51:48'),(40,6,5,0,_binary '\0','2026-05-25 23:51:48'),(41,5,5,0,_binary '\0','2026-05-25 23:51:48'),(42,4,5,1,_binary ' ','2026-05-25 23:51:48'),(43,3,5,0,_binary '\0','2026-05-25 23:51:48'),(44,2,5,1,_binary ' ','2026-05-25 23:51:48'),(45,1,5,0,_binary '\0','2026-05-25 23:51:48'),(46,9,6,0,_binary '\0','2026-05-25 23:51:48'),(47,8,6,0,_binary '\0','2026-05-25 23:51:48'),(48,7,6,0,_binary '\0','2026-05-25 23:51:48'),(49,6,6,0,_binary '\0','2026-05-25 23:51:48'),(50,5,6,0,_binary '\0','2026-05-25 23:51:48'),(51,4,6,1,_binary ' ','2026-05-25 23:51:48'),(52,3,6,0,_binary '\0','2026-05-25 23:51:48'),(53,2,6,1,_binary ' ','2026-05-25 23:51:48'),(54,1,6,0,_binary '\0','2026-05-25 23:51:48'),(55,9,7,0,_binary '\0','2026-05-25 23:51:48'),(56,8,7,0,_binary '\0','2026-05-25 23:51:48'),(57,7,7,0,_binary '\0','2026-05-25 23:51:48'),(58,6,7,0,_binary '\0','2026-05-25 23:51:48'),(59,5,7,1,_binary ' ','2026-05-25 23:51:48'),(60,4,7,1,_binary ' ','2026-05-25 23:51:48'),(61,3,7,0,_binary '\0','2026-05-25 23:51:48'),(62,2,7,1,_binary ' ','2026-05-25 23:51:48'),(63,1,7,0,_binary '\0','2026-05-25 23:51:48'),(64,9,8,0,_binary '\0','2026-05-25 23:51:48'),(65,8,8,0,_binary '\0','2026-05-25 23:51:48'),(66,7,8,0,_binary '\0','2026-05-25 23:51:48'),(67,6,8,1,_binary ' ','2026-05-25 23:51:48'),(68,5,8,1,_binary ' ','2026-05-25 23:51:48'),(69,4,8,1,_binary ' ','2026-05-25 23:51:48'),(70,3,8,0,_binary '\0','2026-05-25 23:51:48'),(71,2,8,1,_binary ' ','2026-05-25 23:51:48'),(72,1,8,0,_binary '\0','2026-05-25 23:51:48'),(73,9,9,0,_binary '\0','2026-05-25 23:51:48'),(74,8,9,0,_binary '\0','2026-05-25 23:51:48'),(75,7,9,0,_binary '\0','2026-05-25 23:51:48'),(76,6,9,0,_binary '\0','2026-05-25 23:51:48'),(77,5,9,0,_binary '\0','2026-05-25 23:51:48'),(78,4,9,0,_binary '\0','2026-05-25 23:51:48'),(79,3,9,0,_binary '\0','2026-05-25 23:51:48'),(80,2,9,0,_binary '\0','2026-05-25 23:51:48'),(81,1,9,0,_binary '\0','2026-05-25 23:51:48'),(82,9,10,0,_binary '\0','2026-05-25 23:51:48'),(83,8,10,0,_binary '\0','2026-05-25 23:51:48'),(84,7,10,0,_binary '\0','2026-05-25 23:51:48'),(85,6,10,0,_binary '\0','2026-05-25 23:51:48'),(86,5,10,0,_binary '\0','2026-05-25 23:51:48'),(87,4,10,0,_binary '\0','2026-05-25 23:51:48'),(88,3,10,0,_binary '\0','2026-05-25 23:51:48'),(89,2,10,0,_binary '\0','2026-05-25 23:51:48'),(90,1,10,0,_binary '\0','2026-05-25 23:51:48'),(91,9,11,0,_binary '\0','2026-05-25 23:51:48'),(92,8,11,0,_binary '\0','2026-05-25 23:51:48'),(93,7,11,0,_binary '\0','2026-05-25 23:51:48'),(94,6,11,0,_binary '\0','2026-05-25 23:51:48'),(95,5,11,0,_binary '\0','2026-05-25 23:51:48'),(96,4,11,0,_binary '\0','2026-05-25 23:51:48'),(97,3,11,0,_binary '\0','2026-05-25 23:51:48'),(98,2,11,0,_binary '\0','2026-05-25 23:51:48'),(99,1,11,0,_binary '\0','2026-05-25 23:51:48'),(100,9,12,0,_binary '\0','2026-05-25 23:51:48'),(101,8,12,0,_binary '\0','2026-05-25 23:51:48'),(102,7,12,0,_binary '\0','2026-05-25 23:51:48'),(103,6,12,0,_binary '\0','2026-05-25 23:51:48'),(104,5,12,0,_binary '\0','2026-05-25 23:51:48'),(105,4,12,0,_binary '\0','2026-05-25 23:51:48'),(106,3,12,0,_binary '\0','2026-05-25 23:51:48'),(107,2,12,0,_binary '\0','2026-05-25 23:51:48'),(108,1,12,0,_binary '\0','2026-05-25 23:51:48'),(109,9,13,0,_binary '\0','2026-05-25 23:51:48'),(110,8,13,0,_binary '\0','2026-05-25 23:51:48'),(111,7,13,0,_binary '\0','2026-05-25 23:51:48'),(112,6,13,0,_binary '\0','2026-05-25 23:51:48'),(113,5,13,0,_binary '\0','2026-05-25 23:51:48'),(114,4,13,0,_binary '\0','2026-05-25 23:51:48'),(115,3,13,0,_binary '\0','2026-05-25 23:51:48'),(116,2,13,0,_binary '\0','2026-05-25 23:51:48'),(117,1,13,0,_binary '\0','2026-05-25 23:51:48'),(118,9,14,0,_binary '\0','2026-05-25 23:51:48'),(119,8,14,0,_binary '\0','2026-05-25 23:51:48'),(120,7,14,0,_binary '\0','2026-05-25 23:51:48'),(121,6,14,0,_binary '\0','2026-05-25 23:51:48'),(122,5,14,0,_binary '\0','2026-05-25 23:51:48'),(123,4,14,0,_binary '\0','2026-05-25 23:51:48'),(124,3,14,0,_binary '\0','2026-05-25 23:51:48'),(125,2,14,0,_binary '\0','2026-05-25 23:51:48'),(126,1,14,0,_binary '\0','2026-05-25 23:51:48'),(127,9,15,0,_binary '\0','2026-05-25 23:51:48'),(128,8,15,0,_binary '\0','2026-05-25 23:51:48'),(129,7,15,0,_binary '\0','2026-05-25 23:51:48'),(130,6,15,0,_binary '\0','2026-05-25 23:51:48'),(131,5,15,0,_binary '\0','2026-05-25 23:51:48'),(132,4,15,0,_binary '\0','2026-05-25 23:51:48'),(133,3,15,0,_binary '\0','2026-05-25 23:51:48'),(134,2,15,0,_binary '\0','2026-05-25 23:51:48'),(135,1,15,0,_binary '\0','2026-05-25 23:51:48'),(136,10,1,5,_binary ' ','2026-05-28 21:41:17'),(137,10,2,0,_binary '\0','2026-05-28 21:41:17'),(138,10,3,1,_binary ' ','2026-05-28 21:41:17'),(139,10,4,1,_binary ' ','2026-05-28 21:41:17'),(140,10,5,1,_binary ' ','2026-05-28 21:41:17'),(141,10,6,1,_binary ' ','2026-05-28 21:41:17'),(142,10,7,0,_binary '\0','2026-05-28 21:41:17'),(143,10,8,0,_binary '\0','2026-05-28 21:41:17'),(144,10,9,0,_binary '\0','2026-05-28 21:41:17'),(145,10,10,0,_binary '\0','2026-05-28 21:41:17'),(146,10,11,0,_binary '\0','2026-05-28 21:41:17'),(147,10,12,0,_binary '\0','2026-05-28 21:41:17'),(148,10,13,0,_binary '\0','2026-05-28 21:41:17'),(149,10,14,0,_binary '\0','2026-05-28 21:41:17'),(150,10,15,0,_binary '\0','2026-05-28 21:41:17');
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
-- Dumping routines for database 'poi_chat2'
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
/*!50001 VIEW `v_tareas` AS select `t`.`Titulo` AS `Titulo`,`t`.`Descripcion` AS `Descripcion`,`t`.`Objetivo` AS `Objetivo`,`t`.`Puntos` AS `Puntos`,if((`t`.`EsDiario` = 0),'Una vez','Diario') AS `Frecuencia` from `tarea` `t` order by `t`.`Descripcion`,`t`.`Puntos`,`t`.`Objetivo` desc */;
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
/*!50001 VIEW `v_tareas_usuario` AS select `u`.`ID_Us` AS `ID_Us`,`t`.`Titulo` AS `Titulo`,`t`.`Descripcion` AS `Descripcion`,`ut`.`Progreso` AS `Progreso`,`t`.`Objetivo` AS `Objetivo`,`t`.`Puntos` AS `Puntos`,if((`t`.`EsDiario` = 0),'Una vez','Diario') AS `Frecuencia`,if((`ut`.`Completada` = 0),'Pendiente','Completada') AS `Completada` from ((`usuario_tarea` `ut` join `tarea` `t` on((`ut`.`id_tarea` = `t`.`ID_Tarea`))) join `usuario` `u` on((`ut`.`id_usuario` = `u`.`ID_Us`))) order by `t`.`Descripcion`,`t`.`Puntos`,`t`.`Objetivo` desc */;
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

-- Dump completed on 2026-05-29  1:10:07