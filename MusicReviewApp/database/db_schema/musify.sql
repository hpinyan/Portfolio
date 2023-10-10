/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_first_name` varchar(100) NOT NULL,
  `usr_last_name` varchar(100) NOT NULL,
  `usr_username` varchar(150) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_salt` varchar(100) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `review` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
-- r_type is track, album, or artist
  `r_type` varchar(7) NOT NULL,
  `r_mbid` varchar(50) NOT NULL,
  `r_usr_id` int(11) unsigned NOT NULL,
  `r_score` decimal(3,1) NOT NULL,
  `r_liked` BOOLEAN NOT NULL,
-- r_method only used for artist reviews. TRUE means custom and FALSE for average of albums
  `r_method` BOOLEAN,
  `r_review` varchar(1000),
  `r_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`r_id`),
  CONSTRAINT `FK_R_USR`FOREIGN KEY (`r_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `playlist` (
  `p_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `p_usr_id` int(11) unsigned NOT NULL,
  `p_name` varchar(100) NOT NULL,
  PRIMARY KEY (`p_id`),
  CONSTRAINT `FK_P_USR`FOREIGN KEY (`p_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `song` (
  `s_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `s_plist_id` int(10) unsigned NOT NULL,
  `s_usr_id` int(11) unsigned NOT NULL,
  `s_mbid` varchar(50) NOT NULL,
  PRIMARY KEY (`s_id`),
  CONSTRAINT `FK_S_USR`FOREIGN KEY (`s_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_S_PLIST`FOREIGN KEY (`s_plist_id`) REFERENCES `playlist` (`p_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user`;
INSERT INTO `user` (`usr_id`, `usr_first_name`, `usr_last_name`, `usr_username`, `usr_password`, `usr_salt`) VALUES
	(1, 'Stu', 'Dent', 'student', '83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4', '48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9'),
	(2, 'Gra', 'Duate', 'graduate', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc');

DELETE FROM `review`;
INSERT INTO `review` (`r_type`, `r_mbid`, `r_usr_id`, `r_score`, `r_liked`, `r_review`, `r_time`) VALUES
	('song', '1kTPQnabROVkW9bUXdCGrB', 1, 1.8, TRUE, 'Kind of dissappointed by this one.', '1998-01-23 12:45:56'),
	('song', '3GCL1PydwsLodcpv0Ll1ch', 1, 3.2, FALSE, 'You Belong With Me was one of my favorites last year.', '1999-01-25 12:45:56'),
	('album', '2fenSS68JI1h4Fo296JfGr', 1, 8.2, TRUE, 'This folklore album is alright.', '2000-01-25 12:45:56'),
	('album', '151w1FgRZfnKZA9FEcg9Z3', 1, 7.2, TRUE, 'This Midnights album was good.', '2000-01-25 12:45:57');

INSERT INTO `review` (`r_type`, `r_mbid`, `r_usr_id`, `r_score`, `r_liked`, `r_method`, `r_review`, `r_time`) VALUES
	('artist', '06HL4z0CvFAxyc27GXpf02', 1, 9.8, TRUE, TRUE, 'Taylor Swift is the best!', '2008-01-23 12:45:56'),
  ('artist', '5BvJzeQpmsdsFp4HGUYUEx', 1, 9.8, TRUE, TRUE, 'Vampire Weekend is one of my favorites.', '2008-01-23 12:45:56');

DELETE FROM `playlist`;
INSERT INTO `playlist` (`p_usr_id`, `p_name`) VALUES
  (1, 'My Playlist 1'),
  (1, 'My Playlist 2');

DELETE FROM `song`;
INSERT into `song` (`s_plist_id`, `s_usr_id`, `s_mbid`) VALUES
  (1, 1, '0V3wPSX9ygBnCm8psDIegu'),
  (1, 1, '15DeqWWQB4dcEWzJg15VrN'),
  (2, 1, '4P9Q0GojKVXpRTJCaL3kyy'),
  (2, 1, '3GCL1PydwsLodcpv0Ll1ch');
  
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

