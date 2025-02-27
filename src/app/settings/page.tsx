import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ComputersTable from "@/components/computers-table";
import AddComputerForm from "@/components/add-computer-form";

import { Plus } from "lucide-react";

export default function Page() {
  return (
    <section className="mt-4 sm:mt-0 sm:ps-8 px-2 sm:pr-4 pb-1 overflow-auto">
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <section>
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Computers</h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus />Add computer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add computer</DialogTitle>
                <DialogDescription>
                  Enter computer details.
                </DialogDescription>
              </DialogHeader>
              <AddComputerForm />
            </DialogContent>
          </Dialog>
        </header>
        <ComputersTable />
      </section>
    </section>
  );
}