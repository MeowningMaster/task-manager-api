CREATE INDEX `user_id_idx` ON `task` (`user_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `task` (`name`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `task` (`status`);--> statement-breakpoint
CREATE INDEX `notify_date_idx` ON `task` (`notify_date`);--> statement-breakpoint
CREATE INDEX `due_date_idx` ON `task` (`due_date`);