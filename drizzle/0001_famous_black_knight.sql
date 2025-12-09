CREATE TABLE `userLists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listType` enum('wheel','group') NOT NULL,
	`name` varchar(100) NOT NULL DEFAULT '預設名單',
	`items` text NOT NULL,
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userLists_id` PRIMARY KEY(`id`)
);
