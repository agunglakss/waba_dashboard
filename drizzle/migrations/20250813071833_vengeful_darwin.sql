CREATE TABLE "customers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "customers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"waba_id" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_waba_id_unique" UNIQUE("waba_id")
);
--> statement-breakpoint
CREATE TABLE "pricing_analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pricing_analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"waba_id" varchar(20) NOT NULL,
	"volume" integer,
	"cost" numeric(20, 6) NOT NULL,
	"start_date" integer NOT NULL,
	"end_date" integer NOT NULL,
	"phone_number" varchar NOT NULL,
	"country_code" varchar,
	"pricing_type" varchar,
	"pricing_category" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
