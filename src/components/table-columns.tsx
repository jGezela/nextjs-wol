"use client"

import { 
  useSWRConfig,
  ScopedMutator,
} from "swr";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Computer } from "@/lib/types";

import { 
  MoreHorizontal, 
  Pencil,
  Trash2,
} from "lucide-react";
import deleteComputer from "@/lib/actions/delete-computer";
import EditComputerForm from "./edit-computer-form";

const handleDelete = async (computerID: number, mutate: ScopedMutator) => {
  const state = await deleteComputer(computerID);

  switch (state.message) {
    case "success":
      toast.success("Computer has been deleted.");
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
}

export const computerColumns: ColumnDef<Computer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "ip",
    header: "IP address",
  },
  {
    accessorKey: "mac",
    header: "MAC address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { mutate } = useSWRConfig();

      const computer = row.original;

      return (
        <div className="flex justify-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil />Edit computer
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() => handleDelete(computer.id, mutate)}
                  className="text-destructive hover:!text-destructive cursor-pointer"
                >
                  <Trash2 />Delete computer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit computer</DialogTitle>
                <DialogDescription>
                  Change computer details.
                </DialogDescription>
              </DialogHeader>
              <EditComputerForm id={String(computer.id)} name={computer.name} ip={computer.ip} mac={computer.mac} />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
