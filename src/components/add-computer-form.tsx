"use client"

import clsx from "clsx";
import Form from "next/form";
import { 
  useEffect, 
  useActionState, 
} from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { addComputerAction } from "@/lib/actions/add-computer";

import { LoaderCircle } from "lucide-react";

export default function AddComputerForm() {
  const { mutate } = useSWRConfig();

  const [state, formAction, isPending] = useActionState(addComputerAction, {
    message: "",
    errors: undefined,
    fieldValues: {
      computerName: "",
      ipAddress: "",
      macAddress: "",
    }
  });

  useEffect(() => {
    switch (state.message) {
      case "success":
        toast.success("Computer has been added.");
        mutate("getComputers");
        break;
      case "db-error":
        toast.error("There was a database error.", {
          classNames: {
            toast: '!bg-destructive !text-white !border-0',
          },
        });
        break;
    }
  }, [state]);

  return (
    <Form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label 
          htmlFor="computerName"
        >Name</Label>
        <Input 
          id="computerName"
          name="computerName"
          placeholder="My PC"
          defaultValue={state.fieldValues.computerName}
          aria-describedby="computerNameError"
          minLength={1}
          maxLength={50}
          required
          className={clsx({
            "border-destructive": state.errors?.computerName
          })}
        />
        { state.errors?.computerName && (
          <span id="computerNameError" className="block pt-1 text-sm text-destructive">{ state.errors.computerName }</span>
        )}
      </div>

      <div className="space-y-1">
        <Label 
          htmlFor="ipAddress"
        >IP address</Label>
        <Input 
          id="ipAddress"
          name="ipAddress"
          placeholder="192.168.1.100"
          defaultValue={state.fieldValues.ipAddress}
          aria-describedby="ipAddressError"
          minLength={7}
          maxLength={15}
          required
          className={clsx({
            "border-destructive": state.errors?.ipAddress
          })}
        />
        { state.errors?.ipAddress && (
          <span id="ipAddressError" className="block pt-1 text-sm text-destructive">{ state.errors.ipAddress }</span>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="macAddress">MAC address</Label>
        <Input 
          id="macAddress"
          name="macAddress"
          placeholder="00:00:00:00:00:00"
          aria-describedby="macAddressError"
          defaultValue={state.fieldValues.macAddress}
          minLength={17}
          maxLength={17}
          required
          className={clsx({
            "border-destructive": state.errors?.macAddress
          })}
        />
        { state.errors?.macAddress && (
          <span id="macAddressError" className="block pt-1 text-sm text-destructive">{ state.errors.macAddress }</span>
        )}
      </div>

      <div className="pt-2 flex justify-end">
        { isPending ? <Button disabled><LoaderCircle className="animate-spin" /></Button> : <Button>Add computer</Button> }
      </div>
    </Form>
  );
}