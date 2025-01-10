CREATE TABLE `application_members` (
	`application_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`available_hours` integer DEFAULT 0 NOT NULL,
	`percentage` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organization_members` (
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT '2025-01-10T13:35:34.080Z' NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `sprint_applications` (
	`sprint_id` integer NOT NULL,
	`application_id` integer NOT NULL,
	`available_hours` integer DEFAULT 0 NOT NULL,
	`spent_hours` integer DEFAULT 0 NOT NULL,
	`planned_hours` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sprint_id`) REFERENCES `sprints`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sprint_members` (
	`sprint_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`available_hours` integer DEFAULT 0 NOT NULL,
	`spent_hours` integer DEFAULT 0 NOT NULL,
	`planned_hours` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sprint_id`) REFERENCES `sprints`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sprints` (
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
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT '2025-01-10T13:35:34.078Z' NOT NULL,
	`last_sign_in` text DEFAULT '2025-01-10T13:35:34.078Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);