"use server"

import { 
  z, 
  ZodError,
} from "zod";

interface FormFields {
  computerName: string;
  macAddress: string;
}
interface FormState {
  message: string;
  errors: Record<keyof FormFields, string> | undefined;
  fieldValues: {
    computerName: string,
    macAddress: string,
  }
}

const formSchema = z.object({
  computerName: z.string().min(1).max(50),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
});

export async function addComputerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const computerName = formData.get("computerName") as string;
  const macAddress = formData.get("macAddress") as string;

  try {
    formSchema.parse({
      computerName,
      macAddress,
    });
    return {
      message: "success",
      errors: undefined,
      fieldValues: {
        computerName: "",
        macAddress: "",
      }
    };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      message: "error",
      errors: {
        computerName: errorMap["computerName"]?.[0] ?? "", 
        macAddress: errorMap["macAddress"]?.[0] ?? "",
      },
      fieldValues: {
        computerName,
        macAddress,
      }
    }
  }
}