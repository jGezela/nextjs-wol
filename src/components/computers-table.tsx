"use client"

import useSWR from "swr";
import { toast } from "sonner";
import { useEffect } from "react";

import { DataTable } from "@/components/ui/data-table";
import { computerColumns } from "@/components/table-columns";
import { getComputers } from "@/lib/actions/get-computers";

import { LoaderCircle } from "lucide-react";

export default function ComputersTable() {
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
    <div className="mt-4">
      {
        isLoading ? 
          <div className="p-2 flex justify-center items-center rounded-md border">
            <LoaderCircle className="animate-spin" />
          </div> :
          <DataTable columns={computerColumns} data={data?.computers ?? []} />
      }
    </div>
  );
}