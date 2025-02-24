"use server"

import { 
  z, 
  ZodError,
} from "zod";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import { computersTable } from "@/db/schema";

interface FormFields {
  computerID: string;
  computerName: string;
  ipAddress: string;
  macAddress: string;
}
interface FormState {
  message: string;
  errors: Record<keyof FormFields, string> | undefined;
  fieldValues: {
    computerID: string,
    computerName: string,
    ipAddress: string,
    macAddress: string,
  }
}

const formSchema = z.object({
  computerID: z.coerce.number(),
  computerName: z.string().min(1).max(50),
  ipAddress: z.string().ip({ message: "Invalid IP address" }),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
});

export async function editComputerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const db = drizzle(process.env.DB_FILE_NAME!);

  const computerID = formData.get("computerID") as string;
  const computerName = formData.get("computerName") as string;
  const ipAddress = formData.get("ipAddress") as string;
  const macAddress = formData.get("macAddress") as string;
  
  try {
    const data = formSchema.parse({
      computerID,
      computerName,
      ipAddress,
      macAddress,
    });

    await db.update(computersTable).set({
      name: data.computerName,
      ip: data.ipAddress,
      mac: data.macAddress,
    }).where(eq(computersTable.id, data.computerID));

    return {
      message: "success",
      errors: undefined,
      fieldValues: {
        computerID,
        computerName,
        ipAddress,
        macAddress,
      }
    };
  } catch (error: unknown) {
    if(error instanceof ZodError) {
      const zodError = error;
      const errorMap = zodError.flatten().fieldErrors;
      return {
        message: "zod-error",
        errors: {
          computerID: errorMap["computerID"]?.[0] ?? "",
          computerName: errorMap["computerName"]?.[0] ?? "", 
          ipAddress: errorMap["ipAddress"]?.[0] ?? "",
          macAddress: errorMap["macAddress"]?.[0] ?? "",
        },
        fieldValues: {
          computerID,
          computerName,
          ipAddress,
          macAddress,
        }
      }
    } else {
      return {
        message: "db-error",
        errors: undefined,
        fieldValues: {
          computerID,
          computerName,
          ipAddress,
          macAddress,
        }
      }
    }
  }
}