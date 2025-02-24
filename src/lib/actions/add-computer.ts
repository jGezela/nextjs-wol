"use server"

import { 
  z, 
  ZodError,
} from "zod";
import { drizzle } from "drizzle-orm/libsql";

import { computersTable } from "@/db/schema";

interface FormFields {
  computerName: string;
  ipAddress: string;
  macAddress: string;
}
interface FormState {
  message: string;
  errors: Record<keyof FormFields, string> | undefined;
  fieldValues: {
    computerName: string,
    ipAddress: string,
    macAddress: string,
  }
}

const formSchema = z.object({
  computerName: z.string().min(1).max(50),
  ipAddress: z.string().ip({ message: "Invalid IP address" }),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
});

export async function addComputerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const db = drizzle(process.env.DB_FILE_NAME!);

  const computerName = formData.get("computerName") as string;
  const ipAddress = formData.get("ipAddress") as string;
  const macAddress = formData.get("macAddress") as string;

  try {
    formSchema.parse({
      computerName,
      ipAddress,
      macAddress,
    });

    await db.insert(computersTable).values({
      name: computerName,
      ip: ipAddress,
      mac: macAddress.toUpperCase(),
    });

    return {
      message: "success",
      errors: undefined,
      fieldValues: {
        computerName: "",
        ipAddress: "",
        macAddress: "",
      }
    };
  } catch (error: unknown) {
    if(error instanceof ZodError) {
      const zodError = error;
      const errorMap = zodError.flatten().fieldErrors;
      return {
        message: "zod-error",
        errors: {
          computerName: errorMap["computerName"]?.[0] ?? "", 
          ipAddress: errorMap["ipAddress"]?.[0] ?? "",
          macAddress: errorMap["macAddress"]?.[0] ?? "",
        },
        fieldValues: {
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
          computerName,
          ipAddress,
          macAddress,
        }
      }
    }
  }
}