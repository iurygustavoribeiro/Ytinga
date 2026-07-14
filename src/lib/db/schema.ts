import { integer, index, pgTable, varchar, doublePrecision, timestamp, boolean, json, text} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  institution_id: integer().references(() => institutionTable.id),
  CPF: varchar({ length: 11 }).notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const measureTable = pgTable("measure", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fountain_id: integer().references(() => fountainTable.id),
  device_id: integer().references(() => deviceTable.id),
  user_id: text().references(() => usersTable.id),
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
  fountain_id: integer().references(() => fountainTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  last_calibration: date({mode:'string'}),
});

export const fountainTable = pgTable("fountain", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reference: varchar({length: 255}),
  institution_id: integer().references(() => institutionTable.id),
});

export const institutionTable = pgTable("institution", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}),
  address: json(),
  city_id: integer().references(() => cityTable.id),
});

export const cityTable = pgTable("city", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}),
  state_id: integer().references(() => stateTable.id),
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

export const userRelations = relations(usersTable, ({ one, many }) => ({
  institution: one(institutionTable, {
    fields: [usersTable.institution_id],
    references: [institutionTable.id],
  }),
  sessions: many(session),
  accounts: many(account),
})) 

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(usersTable, {
    fields: [session.userId],
    references: [usersTable.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(usersTable, {
    fields: [account.userId],
    references: [usersTable.id],
  }),
}));