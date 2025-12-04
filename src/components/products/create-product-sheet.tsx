
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
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm."),
  category: z.string().min(1, "Vui lòng nhập danh mục."),
  price: z.coerce.number().min(0, "Giá không được âm."),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function CreateProductSheet() {
  const [open, setOpen] = React.useState(false);
  const { createProduct } = useData();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
    },
  });

  function onSubmit(data: ProductFormValues) {
    createProduct({ ...data, status: 'Active' });
    toast({ title: "Thành công!", description: "Sản phẩm đã được tạo." });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo Sản phẩm
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tạo Sản phẩm Mới</SheetTitle>
          <SheetDescription>
            Điền thông tin chi tiết để tạo một sản phẩm mới.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder="Chanh dây sấy dẻo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Trái cây sấy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (VND)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Hủy</Button>
              </SheetClose>
              <Button type="submit">Lưu Sản phẩm</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
