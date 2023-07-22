CREATE TABLE `task` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`status` enum('pending','in-progress','completed') NOT NULL DEFAULT 'pending',
	`notify_date` datetime,
	`due_date` datetime
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`login` varchar(256) NOT NULL,
	`password_hash` char(60) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `task` ADD CONSTRAINT `task_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;