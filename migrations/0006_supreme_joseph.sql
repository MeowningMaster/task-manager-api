CREATE TABLE `notification` (
	`task_id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`job_id` int NOT NULL
);
--> statement-breakpoint
CREATE INDEX `job_id_idx` ON `notification` (`task_id`);--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_task_id_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE cascade ON UPDATE no action;