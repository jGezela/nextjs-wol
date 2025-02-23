"use client"

import { 
  useState,
} from "react";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { Computer } from "@/lib/types";
//import pingComputer from "@/lib/actions/ping-computer";
import wakeComputer from "@/lib/actions/wake-computer";
import shutdownComputer from "@/lib/actions/shutdown-computer";

import { LoaderCircle } from "lucide-react";

export default function ComputerCard({ computer }: { computer: Computer }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // const checkIsAlive = async () => {
  //   setIsPending(true);
  //   const isAlive = await pingComputer(computer.ip).then(res => res.alive);
  //   setIsChecked(isAlive);
  //   setIsPending(false);
  // }

  const handleSwitch = async () => {
    setIsChecked(prevState => !prevState);

    if(!isChecked) {
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
      setIsPending(true);
      await shutdownComputer(computer.ip)
        .then((response) => {
          if(response.message === "shutdown-error") {
            toast.error(response.details, {classNames: {toast: '!bg-destructive !text-white !border-0',}});
            setIsChecked(true);
          } else {
            toast.success(response.details);
          }
        });
      setIsPending(false);
    }
  }
  
  // useEffect(() => {
  //   checkIsAlive();
  // }, []);

  // useEffect(() => {
  //   const pingInterval = setInterval(() => {
  //     checkIsAlive();
  //   }, 60000);

  //   return () => {
  //     clearInterval(pingInterval);
  //   };
  // });

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
    </Card>
  );
}