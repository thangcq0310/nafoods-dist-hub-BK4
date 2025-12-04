"use client";

import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
} from "lucide-react";
import { isThisMonth, parseISO } from 'date-fns';

type Kpi = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
};

export function DeliveryKpiCards() {
  const { deliveries } = useData();

  const currentMonthDeliveries = deliveries.filter(d => d.deliveryDateTime && isThisMonth(parseISO(d.deliveryDateTime)));
  
  const totalDeliveryCostMonth = currentMonthDeliveries
    .reduce((acc, d) => acc + (d.deliveryFee || 0), 0);

  
  const kpis: Kpi[] = [
    {
      title: "Tổng chi phí giao hàng (tháng)",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDeliveryCostMonth),
      icon: Truck,
      description: "Tổng chi phí cho các đơn hàng đã giao trong tháng.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
