CREATE TABLE `email` (
	`user_id` int PRIMARY KEY NOT NULL,
	`email` varchar(256) NOT NULL,
	`confirmed` boolean NOT NULL,
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `email` ADD CONSTRAINT `email_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;