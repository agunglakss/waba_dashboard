import { integer, numeric, pgTable, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const customers = pgTable("customers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wabaId: varchar('waba_id', { length: 20 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const pricing_analytics = pgTable("pricing_analytics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wabaId: varchar('waba_id', { length: 20 }).notNull(),
  volume: integer(),
  cost: numeric('cost', { precision: 20, scale: 6 }).notNull(),
  startDate: integer('start_date').notNull(),
  endDate: integer('end_date').notNull(),
  phoneNumber: varchar('phone_number').notNull(),
  countryCode: varchar('country_code'),
  tier: varchar(),
  pricingType: varchar('pricing_type'),
  pricingCategory: varchar('pricing_category'),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
}, (table) => ({
  wabaDateIdx: index('waba_date_idx').on(table.wabaId, table.startDate, table.endDate),
}));


