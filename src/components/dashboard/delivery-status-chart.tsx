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
import type { DeliveryStatus } from "@/lib/types"

const chartConfig = {
  count: {
    label: "Số lượng",
  },
  "Cần giao": {
    label: "Cần giao",
    color: "hsl(var(--chart-1))",
  },
  "Chờ giao": {
    label: "Chờ giao",
    color: "hsl(var(--chart-2))",
  },
  "Đang giao": {
    label: "Đang giao",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function DeliveryStatusChart() {
  const { deliveries } = useData()

  const chartData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {
        "Cần giao": 0,
        "Chờ giao": 0,
        "Đang giao": 0,
    }
    
    deliveries.forEach(delivery => {
        if (delivery.status in statusCounts) {
            statusCounts[delivery.status]++
        }
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status,
      count: count,
      fill: chartConfig[status as keyof typeof chartConfig]?.color || 'hsl(var(--chart-1))',
    }))
  }, [deliveries])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trạng thái Giao hàng</CardTitle>
        <CardDescription>Số lượng lệnh giao hàng đang hoạt động</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              radius={4}
              barSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
