CREATE TABLE IF NOT EXISTS `teke_phones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `citizenid` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_phone_number` (`phone_number`),
  UNIQUE KEY `uq_citizenid` (`citizenid`)
);