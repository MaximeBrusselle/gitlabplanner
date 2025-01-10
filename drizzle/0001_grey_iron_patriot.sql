PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organization_members` (
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT '2025-01-10T13:58:06.162Z' NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_organization_members`("organization_id", "user_id", "created_at", "role") SELECT "organization_id", "user_id", "created_at", "role" FROM `organization_members`;--> statement-breakpoint
DROP TABLE `organization_members`;--> statement-breakpoint
ALTER TABLE `__new_organization_members` RENAME TO `organization_members`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT '2025-01-10T13:58:06.160Z' NOT NULL,
	`last_sign_in` text DEFAULT '2025-01-10T13:58:06.160Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "image_url", "created_at", "last_sign_in") SELECT "id", "name", "email", "image_url", "created_at", "last_sign_in" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `sprints` ADD `buffer` integer DEFAULT 0 NOT NULL;