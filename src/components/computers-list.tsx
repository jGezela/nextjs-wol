"use client"

import useSWR from "swr";
import { toast } from "sonner";
import { useEffect } from "react";

import ComputerCard from "@/components/computer-card";

import { getComputers } from "@/lib/actions/get-computers";

import { LoaderCircle } from "lucide-react";

export default function ComputersList() {
  const { data, isLoading } = useSWR("getComputers", getComputers);

  useEffect(() => {
    if(data?.message === "db-error") {
      toast.error("There was a database error.", {
        classNames: {
          toast: '!bg-destructive !text-white !border-0',
        },
      });
    }
  }, [data]);

  return (
    <>
      
      {
        isLoading ? 
          <div className="flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              data?.computers.map( computer => (
                <ComputerCard key={computer.id} computer={computer} />
              ))
            }
          </div>
      }
    </>
  );
}