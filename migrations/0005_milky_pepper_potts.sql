ALTER TABLE `email` DROP FOREIGN KEY `email_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `task` DROP FOREIGN KEY `task_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `email` ADD CONSTRAINT `email_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task` ADD CONSTRAINT `task_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;