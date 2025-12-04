
"use client";

import * as React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import { cn } from '@/lib/utils';

const orderItemSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn sản phẩm."),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0."),
  unit: z.enum(['Kg', 'Jar', 'Bag', 'Box']),
  unitPrice: z.coerce.number().min(0, "Đơn giá không được âm."),
});

const formSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng."),
  addressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng."),
  shippingPhone: z.string().min(1, "Vui lòng nhập SĐT người nhận."),
  deliveryDate: z.string().min(1, "Vui lòng chọn ngày giao hàng."),
  items: z.array(orderItemSchema).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm."),
});

type OrderFormValues = z.infer<typeof formSchema>;

const TotalAmount = ({ control }: { control: any }) => {
    const items = useWatch({ control, name: 'items' });
    const totalAmount = React.useMemo(() => {
        return items.reduce((acc: number, item: { quantity: number, unitPrice: number}) => {
            return acc + (item.quantity || 0) * (item.unitPrice || 0);
        }, 0);
    }, [items]);

    return (
        <div className="flex justify-end pt-4">
            <div className="w-full max-w-sm space-y-2">
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    );
}

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
      shippingPhone: '',
      deliveryDate: '',
      items: [{ productId: '', quantity: 1, unit: 'Box', unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const customerId = form.watch('customerId');
  const addressId = form.watch('addressId');
  const currentItems = form.watch('items');

  React.useEffect(() => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomerAddresses(customer.addresses);
        const primaryAddress = customer.addresses.find(a => a.isPrimary) || customer.addresses[0];
        if (primaryAddress) {
            form.setValue('addressId', primaryAddress.id);
            form.setValue('shippingPhone', primaryAddress.phone);
        } else {
             form.setValue('addressId', '');
             form.setValue('shippingPhone', '');
        }
      }
    } else {
      setSelectedCustomerAddresses([]);
      form.setValue('addressId', '');
      form.setValue('shippingPhone', '');
    }
  }, [customerId, customers, form]);
  
  React.useEffect(() => {
    if (addressId) {
        const address = selectedCustomerAddresses.find(a => a.id === addressId);
        if (address) {
            form.setValue('shippingPhone', address.phone);
        }
    }
  }, [addressId, selectedCustomerAddresses, form]);

  function onSubmit(data: OrderFormValues) {
    const customer = customers.find(c => c.id === data.customerId);
    const originalAddress = customer?.addresses.find(a => a.id === data.addressId);
    
    if (!customer || !originalAddress) {
      toast({ title: "Lỗi", description: "Không tìm thấy khách hàng hoặc địa chỉ.", variant: "destructive" });
      return;
    }

    const shippingAddress: Address = {
        ...originalAddress,
        phone: data.shippingPhone,
    };
    
    const orderItems = data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Invalid product");
        return {
            product,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
        };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    const newOrder = {
      customer,
      shippingAddress,
      deliveryDate: new Date(data.deliveryDate).toISOString(),
      items: orderItems,
      totalAmount,
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
      <SheetContent className="sm:max-w-4xl w-full">
        <SheetHeader>
          <SheetTitle>Tạo Đơn Hàng Mới</SheetTitle>
          <SheetDescription>
            Điền thông tin chi tiết để tạo một đơn hàng mới cho khách.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto max-h-[calc(100vh-10rem)] pr-6">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khách hàng</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('items', [{ productId: '', quantity: 1, unit: 'Box', unitPrice: 0 }]);
                  }} defaultValue={field.value}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
               <FormField
                control={form.control}
                name="shippingPhone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>SĐT người nhận</FormLabel>
                        <FormControl>
                            <Input placeholder="Nhập SĐT người nhận" {...field} />
                        </FormControl>
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
              {fields.map((field, index) => {
                const item = currentItems[index];
                const lineTotal = (item?.quantity || 0) * (item?.unitPrice || 0);
                return (
                 <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-md relative">
                   <div className="col-span-12 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sản phẩm</FormLabel>
                          <Select onValueChange={(value) => {
                              field.onChange(value);
                              const product = products.find(p => p.id === value);
                              form.setValue(`items.${index}.unitPrice`, product?.price || 0);
                          }} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger></FormControl>
                            <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                     <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Số lượng</FormLabel>
                          <FormControl><Input type="number" placeholder="SL" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="col-span-6 sm:col-span-2">
                     <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Đơn giá</FormLabel>
                          <FormControl><Input type="number" placeholder="Đơn giá" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                     <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Đơn vị</FormLabel>
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
                   <div className="col-span-6 sm:col-span-2">
                        <FormLabel>Thành tiền</FormLabel>
                        <div className="h-10 flex items-center justify-end pr-2 font-medium">
                            {new Intl.NumberFormat('vi-VN').format(lineTotal)}
                        </div>
                    </div>
                  <div className={cn("col-span-12 sm:col-span-1 flex items-end justify-end", fields.length > 1 && "sm:pt-7")}>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                );
            })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: '', quantity: 1, unit: 'Box', unitPrice: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Button>
            
            <TotalAmount control={form.control} />
            
            <SheetFooter className="pt-4 bg-background sticky bottom-0 z-10">
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
