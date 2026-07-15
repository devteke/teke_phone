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
  `is_favorite` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_owner_number` (`owner_number`, `phone_number`),
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

CREATE TABLE IF NOT EXISTS `teke_phone_calls` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `caller_number` VARCHAR(16) NOT NULL,
  `callee_number` VARCHAR(16) NOT NULL,
  `status` VARCHAR(16) NOT NULL DEFAULT 'answered', -- answered | missed | rejected
  `duration` INT NOT NULL DEFAULT 0,                -- saniye
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_calls_caller` (`caller_number`, `created_at`),
  KEY `idx_calls_callee` (`callee_number`, `created_at`)
);