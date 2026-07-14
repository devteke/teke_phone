CREATE TABLE IF NOT EXISTS `teke_phones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `citizenid` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_phone_number` (`phone_number`),
  UNIQUE KEY `uq_citizenid` (`citizenid`)
);

CREATE TABLE IF NOT EXISTS `teke_phone_contacts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_number` VARCHAR(16) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_owner` (`owner_number`)
);

CREATE TABLE IF NOT EXISTS `teke_phone_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_number` VARCHAR(16) NOT NULL,
  `receiver_number` VARCHAR(16) NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_convo` (`sender_number`, `receiver_number`),
  KEY `idx_receiver` (`receiver_number`)
);