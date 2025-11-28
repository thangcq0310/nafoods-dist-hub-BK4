"use client";

import { DeliveryDataTable } from "@/components/deliveries/delivery-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeliveryStatus } from "@/lib/types";

const deliveryTabs: { value: DeliveryStatus | 'all', label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Needs Delivery', label: 'Cần giao' },
    { value: 'Waiting for Pickup', label: 'Chờ giao' },
    { value: 'In Transit', label: 'Đang vận chuyển' },
    { value: 'Delivered', label: 'Đã giao' },
    { value: 'Failed', label: 'Lỗi/Hủy' },
];

export default function DeliveriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Giao hàng</h1>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            {deliveryTabs.map(tab => (
                 <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {deliveryTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                <DeliveryDataTable statusFilter={tab.value === 'Failed' ? ['Failed', 'Canceled'] : tab.value === 'all' ? null : [tab.value]}/>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
