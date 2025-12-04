"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

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
    color: "hsl(var(--chart-4))",
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
    }))
  }, [deliveries])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái Lệnh Giao hàng</CardTitle>
        <CardDescription>Số lượng lệnh giao hàng đang ở các trạng thái hoạt động chính.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Legend />
            <Bar
              dataKey="count"
              name="Số lượng"
              fill="hsl(var(--chart-1))"
              radius={4}
              barSize={60}
            >
                {chartData.map((entry, index) => (
                    <div key={`cell-${index}`} style={{ backgroundColor: chartConfig[entry.status as keyof typeof chartConfig]?.color }} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
