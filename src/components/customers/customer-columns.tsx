
"use client";

import type { Customer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export const customerColumns = [
  {
    accessorKey: "id",
    header: "Mã Khách hàng",
    cell: ({ row }: { row: { original: Customer } }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên Khách hàng",
    cell: ({ row }: { row: { original: Customer } }) => row.original.name,
  },
  {
    accessorKey: "area",
    header: "Khu vực",
    cell: ({ row }: { row: { original: Customer } }) => row.original.area,
  },
    {
    accessorKey: "salesChannel",
    header: "Kênh bán hàng",
    cell: ({ row }: { row: { original: Customer } }) => row.original.salesChannel,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Customer } }) => {
      const status = row.original.status;
      return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
    },
  },
];
