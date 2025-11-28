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
import type { Address } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const orderItemSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn sản phẩm."),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0."),
  unit: z.enum(['Kg', 'Jar', 'Bag', 'Box']),
});

const formSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng."),
  addressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng."),
  deliveryDate: z.string().min(1, "Vui lòng chọn ngày giao hàng."),
  items: z.array(orderItemSchema).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm."),
});

type OrderFormValues = z.infer<typeof formSchema>;

export function CreateOrderSheet() {
  const [open, setOpen] = React.useState(false);
  const { customers, products, createOrder } = useData();
  const { toast } = useToast();
  const [selectedCustomerAddresses, setSelectedCustomerAddresses] = React.useState<Address[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      addressId: '',
      deliveryDate: '',
      items: [{ productId: '', quantity: 1, unit: 'Box' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const customerId = form.watch('customerId');

  React.useEffect(() => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomerAddresses(customer.addresses);
        const primaryAddress = customer.addresses.find(a => a.isPrimary);
        form.setValue('addressId', primaryAddress?.id || customer.addresses[0]?.id || '');
      }
    } else {
      setSelectedCustomerAddresses([]);
      form.setValue('addressId', '');
    }
  }, [customerId, customers, form]);

  function onSubmit(data: OrderFormValues) {
    const customer = customers.find(c => c.id === data.customerId);
    const shippingAddress = customer?.addresses.find(a => a.id === data.addressId);
    
    if (!customer || !shippingAddress) {
      toast({ title: "Lỗi", description: "Không tìm thấy khách hàng hoặc địa chỉ.", variant: "destructive" });
      return;
    }

    const newOrder = {
      customer,
      shippingAddress,
      deliveryDate: new Date(data.deliveryDate).toISOString(),
      items: data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Invalid product");
        return { product, quantity: item.quantity, unit: item.unit };
      }),
      status: 'Pending Approval' as const,
    };

    createOrder(newOrder);
    toast({ title: "Thành công!", description: "Đơn hàng đã được tạo." });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo Đơn hàng
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle>Tạo Đơn Hàng Mới</SheetTitle>
          <SheetDescription>
            Điền thông tin chi tiết để tạo một đơn hàng mới cho khách.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khách hàng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ giao hàng</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!customerId}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Chọn địa chỉ" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCustomerAddresses.map(a => <SelectItem key={a.id} value={a.id}>{a.street}, {a.city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày giao yêu cầu</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Chi tiết sản phẩm</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-10 gap-2 items-end p-3 border rounded-md relative">
                   <div className="col-span-10 sm:col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Sản phẩm</FormLabel>}
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger></FormControl>
                            <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                     <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                           {index === 0 && <FormLabel>Số lượng</FormLabel>}
                          <FormControl><Input type="number" placeholder="SL" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                     <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                           {index === 0 && <FormLabel>Đơn vị</FormLabel>}
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Đơn vị" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Kg">Kg</SelectItem>
                                <SelectItem value="Jar">Hũ</SelectItem>
                                <SelectItem value="Bag">Túi</SelectItem>
                                <SelectItem value="Box">Thùng</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-10 sm:col-span-1 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: '', quantity: 1, unit: 'Box' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Button>
            
            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Hủy</Button>
              </SheetClose>
              <Button type="submit">Lưu Đơn Hàng</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
