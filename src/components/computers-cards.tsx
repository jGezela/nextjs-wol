"use client"

import { 
  useState, 
  useEffect, 
  useCallback, 
} from "react";
import { toast } from "sonner";
import useSWR from "swr";

import ComputerCard from "@/components/computer-card";

import pingComputer from "@/lib/actions/ping-computer";
import getComputers from "@/lib/actions/get-computers";

import { LoaderCircle } from "lucide-react";

interface Status {
  id: number;
  isAlive: boolean;
}

export default function ComputersCards() {
  const { data, isLoading } = useSWR("getComputers", getComputers);
  const [ computersStatus, setComputersStatus ] = useState<Status[]>([]);

  const handlePing = useCallback(async () => {
    if(!isLoading && data?.computers) {
      await Promise.all(
        data.computers.map(async computer => {
          await pingComputer(computer.ip)
            .then( res => {
              setComputersStatus(prevStatus =>
                prevStatus.map(item => item.id === computer.id ? { ...item, isAlive: res.alive } : item)
              );
            });
        })
      );
    }
  }, [isLoading, data]);

  useEffect(() => {
    if(data?.message === "db-error") {
      toast.error("There was a database error.", {
        classNames: {
          toast: '!bg-destructive !text-white !border-0',
        },
      });
    }

    if (!isLoading && data?.computers) {
      setComputersStatus(data.computers.map(computer => ({ id: computer.id, isAlive: false })));
      handlePing();
    }
  }, [data, isLoading, handlePing]); 

  useEffect(() => {
    const pingInterval = setInterval(() => {
      handlePing();
    }, 60000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [isLoading, handlePing]);

  return (
    <>
      {
        isLoading ? 
          <div className="flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            { data?.computers.length === 0 ?
              <p>No computers. Go to settings and add new computer.</p> :
              data?.computers.map( computer => (
                <ComputerCard key={computer.id} computer={computer} 
                isAlive={computersStatus.find( item => computer.id===item.id)?.isAlive ?? false} />
              ))
            }
          </div>
      }
    </>
  );
}