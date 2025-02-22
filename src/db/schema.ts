import { 
  int, 
  text,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

export const computersTable = sqliteTable("computers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  mac: text().notNull(),
});
