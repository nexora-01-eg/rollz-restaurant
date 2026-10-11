CREATE TABLE `offer_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`campaign` varchar(64) NOT NULL,
	`browserKey` varchar(72) NOT NULL,
	`orderReference` varchar(72) NOT NULL,
	`kind` enum('fivePercent','burgerReward') NOT NULL,
	`status` enum('issued','verified','redeemed','revoked') NOT NULL DEFAULT 'issued',
	`monthKey` varchar(7) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`verifiedAt` timestamp,
	`redeemedAt` timestamp,
	CONSTRAINT `offer_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `offer_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
