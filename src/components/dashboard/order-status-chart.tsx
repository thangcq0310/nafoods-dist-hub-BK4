"use client"

import * as React from "react"
import { Donut, Legend, Pie, PieChart, PieLabel } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Confirmed: {
    label: "Đã xác nhận",
    color: "hsl(var(--chart-1))",
  },
  Pending: {
    label: "Chờ duyệt",
    color: "hsl(var(--chart-2))",
  },
  Canceled: {
    label: "Đã hủy",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function OrderStatusChart() {
  const { orders } = useData()
  const totalOrders = orders.length

  const chartData = React.useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<"Confirmed" | "Pending" | "Canceled", number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: chartConfig[status as keyof typeof chartConfig].label,
      count: count,
      fill: chartConfig[status as keyof typeof chartConfig].color,
    }))
  }, [orders])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trạng thái Đơn hàng</CardTitle>
        <CardDescription>Thống kê tỷ lệ các trạng thái đơn hàng</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <PieLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Đơn hàng
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Hiển thị thống kê cho toàn bộ đơn hàng.
        </div>
         <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {chartData.map((item) => (
              <div key={item.status} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.fill}}></div>
                  {item.status}
              </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
