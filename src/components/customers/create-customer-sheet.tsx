
"use client";

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const addressSchema = z.object({
  street: z.string().min(1, "Vui lòng nhập tên đường."),
  city: z.string().min(1, "Vui lòng nhập thành phố."),
  phone: z.string().min(1, "Vui lòng nhập SĐT."),
});

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khách hàng."),
  area: z.string().min(1, "Vui lòng nhập khu vực."),
  salesChannel: z.enum(['Modern Trade', 'General Trade', 'HORECA']),
  addresses: z.array(addressSchema).min(1, "Phải có ít nhất một địa chỉ."),
});

type CustomerFormValues = z.infer<typeof formSchema>;

export function CreateCustomerSheet() {
  const [open, setOpen] = React.useState(false);
  const { createCustomer } = useData();
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      area: '',
      salesChannel: 'General Trade',
      addresses: [{ street: '', city: '', phone: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  function onSubmit(data: CustomerFormValues) {
    const newCustomer = {
      ...data,
      status: 'Active' as const,
      addresses: data.addresses.map((addr, index) => ({
        ...addr,
        id: `A${Date.now()}${index}`,
        isPrimary: index === 0, // Mark the first address as primary by default
      })),
    };
    createCustomer(newCustomer);
    toast({ title: "Thành công!", description: "Khách hàng đã được tạo." });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo Khách hàng
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle>Tạo Khách hàng Mới</SheetTitle>
          <SheetDescription>
            Điền thông tin chi tiết để tạo một khách hàng mới.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto max-h-[calc(100vh-10rem)] pr-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khách hàng</FormLabel>
                  <FormControl><Input placeholder="Siêu thị CoopMart" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Khu vực</FormLabel>
                    <FormControl><Input placeholder="TP.HCM" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="salesChannel"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Kênh bán hàng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="Modern Trade">Modern Trade</SelectItem>
                        <SelectItem value="General Trade">General Trade</SelectItem>
                        <SelectItem value="HORECA">HORECA</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Địa chỉ</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 p-3 border rounded-md relative">
                   <FormField
                      control={form.control}
                      name={`addresses.${index}.street`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl><Input placeholder="123 Cống Quỳnh, Q.1" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.city`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Thành phố</FormLabel>
                            <FormControl><Input placeholder="TP.HCM" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`addresses.${index}.phone`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>SĐT</FormLabel>
                            <FormControl><Input placeholder="0901234567" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                  
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ street: '', city: '', phone: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm địa chỉ
            </Button>
            
            <SheetFooter className="pt-4 bg-background sticky bottom-0">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Hủy</Button>
              </SheetClose>
              <Button type="submit">Lưu Khách Hàng</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
