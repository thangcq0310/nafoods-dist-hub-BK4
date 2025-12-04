
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useData } from "@/hooks/use-data"

const chartConfig = {
  count: {
    label: "Số chuyến",
  },
} satisfies ChartConfig

export function VendorDistributionChart() {
  const { deliveries, vendors } = useData()

  const chartData = React.useMemo(() => {
    const vendorCounts: Record<string, number> = {};

    vendors.forEach(v => {
      vendorCounts[v.name] = 0;
    });

    deliveries.forEach(delivery => {
      if (delivery.vendor) {
        vendorCounts[delivery.vendor.name]++;
      }
    });
    
    return Object.entries(vendorCounts).map(([vendor, count]) => ({
      vendor,
      count,
      fill: `hsl(var(--chart-${Object.keys(vendorCounts).indexOf(vendor) + 1}))`
    }));
  }, [deliveries, vendors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bổ Nhà vận tải</CardTitle>
        <CardDescription>Số lượng chuyến giao hàng theo từng nhà vận tải.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="vendor"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              name="Số chuyến"
              radius={4}
              barSize={32}
            >
               {chartData.map((entry, index) => (
                    <div key={`cell-${index}`} style={{ backgroundColor: entry.fill }} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
