
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhà vận tải."),
  contactPerson: z.string().min(1, "Vui lòng nhập tên người liên hệ."),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại."),
});

type VendorFormValues = z.infer<typeof formSchema>;

export function CreateVendorSheet() {
  const [open, setOpen] = React.useState(false);
  const { createVendor } = useData();
  const { toast } = useToast();

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
    },
  });

  function onSubmit(data: VendorFormValues) {
    createVendor({ ...data, status: 'Active' });
    toast({ title: "Thành công!", description: "Nhà vận tải đã được tạo." });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Nhà vận tải</FormLabel>
                  <FormControl>
                    <Input placeholder="Giao Hàng Nhanh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người liên hệ</FormLabel>
                  <FormControl>
                    <Input placeholder="Anh Phúc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="19001234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Hủy</Button>
              </SheetClose>
              <Button type="submit">Lưu Nhà vận tải</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
