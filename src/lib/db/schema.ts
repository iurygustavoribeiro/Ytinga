import { integer, pgTable, varchar, doublePrecision, timestamp, boolean, json} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  institution_id: integer(),
  CPF: varchar({ length: 11 }).notNull().unique(),
});

export const measureTable = pgTable("measure", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fountain_id: integer(),
  device_id: integer(),
  user_id: integer(),
  ph: doublePrecision(),
  temperature: doublePrecision(),
  turbidity: doublePrecision(),
  hardness: doublePrecision(),
  chloride: doublePrecision(),
  frc: doublePrecision(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deviceTable = pgTable("device", {
  id: integer().primaryKey().unique(),
  working: boolean(),
  fountain_id: integer(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  last_calibration: date({mode:'string'}),
});

export const fountainTable = pgTable("fountain", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reference: varchar({length: 255}),
  institution_id: integer(),
});

export const institutionTable = pgTable("institution", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}),
  address: json(),
  city_id: integer(),
});

export const cityTable = pgTable("city", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}),
  state_id: integer(),
});

export const stateTable = pgTable("state", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  abbreviation: varchar({length: 255}),
});

export const cityRelations = relations(cityTable, ({ one }) => ({
  state: one(stateTable, {
    fields: [cityTable.state_id],
    references: [stateTable.id],
  }),
}))

export const institutionRelations = relations(institutionTable, ({ one }) => ({
  city: one(cityTable, {
    fields: [institutionTable.city_id],
    references: [cityTable.id],
  }),
}))

export const fountainRelations = relations(fountainTable, ({ one }) => ({
  institution: one(institutionTable, {
    fields: [fountainTable.institution_id],
    references: [institutionTable.id], 
  }),
})) 

export const deviceRelations = relations(deviceTable, ({ one }) => ({
  fountain: one(fountainTable, {
    fields: [deviceTable.fountain_id],
    references: [fountainTable.id],
  }),
})) 

export const measureRelations = relations(measureTable, ({ one }) => ({
  device: one(deviceTable, {
    fields: [measureTable.device_id],
    references: [deviceTable.id],
  }),
  user: one(usersTable, {
    fields: [measureTable.user_id],
    references: [usersTable.id],
  }),
  fountain: one(fountainTable, {
    fields: [measureTable.fountain_id],
    references: [fountainTable.id],
  }),
})) 

export const userRelations = relations(usersTable, ({ one }) => ({
  institution: one(institutionTable, {
    fields: [usersTable.institution_id],
    references: [institutionTable.id],
  }),
})) 