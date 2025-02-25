"use client"

import { 
  useSWRConfig,
  ScopedMutator,
} from "swr";
import { toast } from "sonner";

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
import EditComputerForm from "@/components/edit-computer-form";

import { Computer } from "@/lib/types";
import deleteComputer from "@/lib/actions/delete-computer";

import { 
  MoreHorizontal, 
  Pencil,
  Trash2,
} from "lucide-react";

export default function ComputersTableActions({ computer }: { computer: Computer }) {
  const { mutate } = useSWRConfig();

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
  return (
    <div className="flex justify-end">
      
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
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                  <Pencil />Edit computer
                </DropdownMenuItem>
              </DialogTrigger>
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
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive hover:!text-destructive cursor-pointer"
                >
                  <Trash2 />Delete computer
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  Are you sure, you want to delete this computer?
                </DialogDescription>
              </DialogHeader>
              <Button 
                onClick={() => handleDelete(computer.id, mutate)} 
                className="bg-destructive hover:bg-red-600"
              >
                <Trash2 />Delete computer
              </Button>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}