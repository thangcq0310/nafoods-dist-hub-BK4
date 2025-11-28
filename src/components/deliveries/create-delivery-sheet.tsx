"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { useData } from "@/hooks/use-data";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const formSchema = z.object({
  vendorId: z.string().min(1, "Vui lòng chọn nhà vận tải."),
  deliveryDateTime: z.string().min(1, "Vui lòng chọn ngày giờ giao."),
  driverName: z.string().min(1, "Vui lòng nhập tên tài xế."),
  driverPhone: z.string().min(1, "Vui lòng nhập SĐT tài xế."),
  vehicleNumber: z.string().min(1, "Vui lòng nhập biển số xe."),
});

type DeliveryFormValues = z.infer<typeof formSchema>;

interface CreateDeliverySheetProps {
  orderId: string;
  trigger: React.ReactNode;
}

export function CreateDeliverySheet({ orderId, trigger }: CreateDeliverySheetProps) {
  const [open, setOpen] = React.useState(false);
  const { vendors, createDelivery, orders } = useData();
  const { toast } = useToast();
  
  const order = orders.find(o => o.id === orderId);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorId: '',
      deliveryDateTime: order ? format(new Date(order.deliveryDate), "yyyy-MM-dd'T'HH:mm") : '',
      driverName: '',
      driverPhone: '',
      vehicleNumber: '',
    },
  });

  function onSubmit(data: DeliveryFormValues) {
    createDelivery({
      orderId,
      ...data,
      deliveryDateTime: new Date(data.deliveryDateTime).toISOString()
    });
    toast({ title: "Thành công!", description: "Lệnh giao hàng đã được tạo." });
    form.reset();
    setOpen(false);
  }
  
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Lệnh Giao Hàng cho Đơn #{orderId}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết để tạo lệnh giao hàng.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
             <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà vận tải</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn nhà vận tải" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày giờ giao</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài xế</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driverPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SĐT tài xế</FormLabel>
                  <FormControl>
                    <Input placeholder="0901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biển số xe</FormLabel>
                  <FormControl>
                    <Input placeholder="51C-123.45" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Hủy</Button>
              </DialogClose>
              <Button type="submit">Lưu Lệnh Giao Hàng</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
