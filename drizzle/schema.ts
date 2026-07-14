import { pgTable, integer, varchar, unique, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const city = pgTable("city", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "city_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }),
	stateId: integer("state_id"),
});

export const device = pgTable("device", {
	id: integer().primaryKey().notNull(),
	working: boolean(),
	fountainId: integer("fountain_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("device_id_unique").on(table.id),
]);

export const fountain = pgTable("fountain", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "fountain_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	reference: varchar({ length: 255 }),
	institutionId: integer("institution_id"),
});

export const institution = pgTable("institution", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "institution_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }),
	address: json(),
	cityId: integer("city_id"),
});

export const measure = pgTable("measure", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "measure_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	fountainId: integer("fountain_id"),
	deviceId: integer("device_id"),
	userId: integer("user_id"),
	ph: doublePrecision(),
	temperature: doublePrecision(),
	turbidity: doublePrecision(),
	hardness: doublePrecision(),
	chloride: doublePrecision(),
	frc: doublePrecision(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const state = pgTable("state", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "state_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	abbreviation: varchar({ length: 255 }),
});

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	institutionId: integer("institution_id"),
	cpf: varchar("CPF", { length: 11 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_CPF_unique").on(table.cpf),
]);
