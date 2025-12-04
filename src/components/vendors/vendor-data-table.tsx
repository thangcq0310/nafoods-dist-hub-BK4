
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
import { vendorColumns } from "./vendor-columns";
import type { Vendor } from "@/lib/types";
import { Card } from "../ui/card";
import { exportToExcel } from "@/lib/export";

export function VendorDataTable() {
  const { vendors } = useData();
  const [data, setData] = React.useState<Vendor[]>(vendors);

  React.useEffect(() => {
    setData(vendors);
  }, [vendors]);

  const table = useReactTable({
    data,
    columns: vendorColumns as ColumnDef<Vendor, unknown>[],
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExport = () => {
    const dataToExport = data.map(v => ({
      'Mã Nhà vận tải': v.id,
      'Tên Nhà vận tải': v.name,
      'Người liên hệ': v.contactPerson,
      'Số điện thoại': v.phone,
      'Trạng thái': v.status,
    }));
    exportToExcel(dataToExport, "Danh_sach_nha_van_tai");
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
                  colSpan={vendorColumns.length}
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
