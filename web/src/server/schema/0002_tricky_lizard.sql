DO $$ BEGIN
 CREATE TYPE "notificationType" AS ENUM('telegram', 'email');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification" (
	"userId" text NOT NULL,
	"alertId" varchar(32) NOT NULL,
	CONSTRAINT "notification_userId_alertId_pk" PRIMARY KEY("userId","alertId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shodan_alert" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"ip" "inet" NOT NULL,
	"trigger" varchar(255) DEFAULT 'any' NOT NULL,
	CONSTRAINT "shodan_alert_ip_trigger_unique" UNIQUE("ip","trigger")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userToken" (
	"userId" text NOT NULL,
	"type" "notificationType" NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "notification_userId_type_pk" PRIMARY KEY("userId","type")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_alertId_shodan_alert_id_fk" FOREIGN KEY ("alertId") REFERENCES "shodan_alert"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userToken" ADD CONSTRAINT "userToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
