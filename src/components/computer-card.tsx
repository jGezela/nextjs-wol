"use client"

import { 
  useState, 
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { Computer } from "@/lib/types";
import wakeComputer from "@/lib/actions/wake-computer";
import shutdownComputer from "@/lib/actions/shutdown-computer";

import { 
  LoaderCircle, 
  Power, 
} from "lucide-react";

export default function ComputerCard({ computer, isAlive }: { computer: Computer, isAlive: boolean }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkIsAlive = useCallback(async () => {
    setIsPending(true);
    setIsChecked(isAlive);
    setIsPending(false);
  }, [isAlive]);

  const handleSwitch = async () => {
    if(!isChecked) {
      setIsChecked(prevState => !prevState);
      setIsPending(true);
      await wakeComputer(computer.ip, computer.mac)
        .then((response) => {
          if(response.message === "wol-error" || response.message === "ping-error") {
            toast.error(response.details, {classNames: {toast: '!bg-destructive !text-white !border-0',}});
            setIsChecked(false);
          } else {
            toast.success(response.details);
          }
        });
      setIsPending(false);
    } else {
      setIsDialogOpen(true);
    }
  }

  const handleShutdown = async () => {
    setIsDialogOpen(false);
    setIsPending(true);
    await shutdownComputer(computer.ip)
      .then((response) => {
        if(response.message === "shutdown-error") {
          toast.error(response.details, {classNames: {toast: '!bg-destructive !text-white !border-0',}});
          setIsChecked(true);
        } else {
          toast.success(response.details);
          setIsChecked(false);
        }
      });
    setIsPending(false);
  }

  useEffect(() => {
    checkIsAlive();
  }, [isAlive, checkIsAlive]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{ computer.name }</CardTitle>
          <CardDescription className="mt-1">{ computer.ip }</CardDescription>
        </div>
        {
          isPending ?
          <div className="!mt-0 mr-1 flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div> :
          <Switch 
            checked={ isChecked }
            onCheckedChange={ () => handleSwitch() }
            className="!mt-0 data-[state=unchecked]:bg-red-500 data-[state=checked]:bg-green-500" 
          />
        }
      </CardHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Are you sure, you want to shutdown this computer?
            </DialogDescription>
          </DialogHeader>
          <Button 
            className="bg-destructive hover:bg-red-600"
            onClick={() => handleShutdown()}
          >
            <Power />Shutdown computer
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}