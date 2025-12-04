
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { customerColumns } from "./customer-columns";
import type { Customer } from "@/lib/types";
import { Card } from "../ui/card";
import { exportToExcel } from "@/lib/export";

export function CustomerDataTable() {
  const { customers } = useData();
  const [data, setData] = React.useState<Customer[]>(customers);

  React.useEffect(() => {
    setData(customers);
  }, [customers]);

  const table = useReactTable({
    data,
    columns: customerColumns as ColumnDef<Customer, unknown>[],
    getCoreRowModel: getCoreRowModel(),
  });
  
  const handleExport = () => {
    const dataToExport = data.map(c => ({
      'Mã Khách hàng': c.id,
      'Tên Khách hàng': c.name,
      'Khu vực': c.area,
      'Kênh bán hàng': c.salesChannel,
      'Trạng thái': c.status,
      'Địa chỉ': c.addresses.map(a => `${a.street}, ${a.city} (Phone: ${a.phone})`).join('; ')
    }));
    exportToExcel(dataToExport, "Danh_sach_khach_hang");
  };

  return (
    <Card className="p-4 bg-card">
      <div className="flex justify-end mb-4">
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" /> Export Excel
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
           <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-card-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="[&_td]:text-card-foreground"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={customerColumns.length}
                  className="h-24 text-center text-card-foreground"
                >
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
