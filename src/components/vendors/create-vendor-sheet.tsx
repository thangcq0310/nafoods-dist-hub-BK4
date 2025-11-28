
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";

// This is a placeholder component.
// The form implementation will be added in a future step.
export function CreateVendorSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo Nhà vận tải
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tạo Nhà Vận Tải Mới</SheetTitle>
          <SheetDescription>
            Điền thông tin chi tiết để tạo một nhà vận tải mới.
            (Chức năng đang được phát triển)
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
            Form tạo nhà vận tải sẽ được hiển thị ở đây.
        </div>
      </SheetContent>
    </Sheet>
  );
}
