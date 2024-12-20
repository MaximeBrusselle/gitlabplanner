PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_application_members` (
	`application_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`available_hours` real DEFAULT 0 NOT NULL,
	`spent_hours` real DEFAULT 0 NOT NULL,
	`planned_hours` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_application_members`("application_id", "user_id", "available_hours", "spent_hours", "planned_hours") SELECT "application_id", "user_id", "available_hours", "spent_hours", "planned_hours" FROM `application_members`;--> statement-breakpoint
DROP TABLE `application_members`;--> statement-breakpoint
ALTER TABLE `__new_application_members` RENAME TO `application_members`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_organization_members` (
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT '2024-12-20T15:10:15.263Z' NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_organization_members`("organization_id", "user_id", "created_at", "role") SELECT "organization_id", "user_id", "created_at", "role" FROM `organization_members`;--> statement-breakpoint
DROP TABLE `organization_members`;--> statement-breakpoint
ALTER TABLE `__new_organization_members` RENAME TO `organization_members`;--> statement-breakpoint
CREATE TABLE `__new_sprint_applications` (
	`sprint_id` integer NOT NULL,
	`application_id` integer NOT NULL,
	`available_hours` integer DEFAULT 0 NOT NULL,
	`spent_hours` integer DEFAULT 0 NOT NULL,
	`planned_hours` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sprint_id`) REFERENCES `sprints`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sprint_applications`("sprint_id", "application_id", "available_hours", "spent_hours", "planned_hours") SELECT "sprint_id", "application_id", "available_hours", "spent_hours", "planned_hours" FROM `sprint_applications`;--> statement-breakpoint
DROP TABLE `sprint_applications`;--> statement-breakpoint
ALTER TABLE `__new_sprint_applications` RENAME TO `sprint_applications`;--> statement-breakpoint
CREATE TABLE `__new_sprints` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by` text NOT NULL,
	`available_hours` integer DEFAULT 0 NOT NULL,
	`spent_hours` integer DEFAULT 0 NOT NULL,
	`planned_hours` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sprints`("id", "name", "description", "start_date", "end_date", "status", "created_by", "available_hours", "spent_hours", "planned_hours") SELECT "id", "name", "description", "start_date", "end_date", "status", "created_by", "available_hours", "spent_hours", "planned_hours" FROM `sprints`;--> statement-breakpoint
DROP TABLE `sprints`;--> statement-breakpoint
ALTER TABLE `__new_sprints` RENAME TO `sprints`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT '2024-12-20T15:10:15.263Z' NOT NULL,
	`last_sign_in` text DEFAULT '2024-12-20T15:10:15.263Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "image_url", "created_at", "last_sign_in") SELECT "id", "name", "email", "image_url", "created_at", "last_sign_in" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);