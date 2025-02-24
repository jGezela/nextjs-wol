"use server"

import { drizzle } from "drizzle-orm/libsql";

import { computersTable } from "@/db/schema";
import { Computer } from "@/lib/types";

export interface getComputersState {
  message: string;
  errors: string | undefined;
  computers: Computer[];
}

export async function getComputers(): Promise<getComputersState> {
  const db = drizzle(process.env.DB_FILE_NAME!);

  try {
    const computers = await db.select().from(computersTable);
    
    return {
      message: "success",
      errors: undefined,
      computers,
    }
  } catch (error: unknown) {
    return {
      message: "db-error",
      errors: String(error),
      computers: [],
    }
  }
}