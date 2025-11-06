CREATE TABLE `event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date-event` text NOT NULL,
	`number-event` text NOT NULL,
	`address` text NOT NULL,
	`phone-number` text NOT NULL,
	`mail` text,
	`incident_description` text NOT NULL,
	`incident_cause` text NOT NULL,
	`root_cause` text NOT NULL,
	`affected_components` text NOT NULL,
	`business_impact` text NOT NULL,
	`identified_vulnerabilities` text NOT NULL,
	`event_start_time` text NOT NULL,
	`event_detection_time` text NOT NULL,
	`event_report_time` text NOT NULL,
	`is_event_resolved` integer NOT NULL,
	`event_duration` text
);
