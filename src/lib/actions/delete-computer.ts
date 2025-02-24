"use server"

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import { computersTable } from "@/db/schema";

export interface deleteComputerState {
  message: string;
  errors: string | undefined;
}

export default async function deleteComputer(id: number): Promise<deleteComputerState> {
  const db = drizzle(process.env.DB_FILE_NAME!);

  try {
    await db.delete(computersTable).where(eq(computersTable.id, id));
    
    return {
      message: "success",
      errors: undefined,
    }
  } catch (error: unknown) {
    return {
      message: "db-error",
      errors: String(error),
    }
  }
}