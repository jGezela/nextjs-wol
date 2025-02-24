"use client"

import { ColumnDef } from "@tanstack/react-table";

import ComputersTableActions from "@/components/computers-table-actions";

import { Computer } from "@/lib/types";

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
      const computer = row.original;
      return (
        <ComputersTableActions computer={computer} />
      );
    },
  },
];
