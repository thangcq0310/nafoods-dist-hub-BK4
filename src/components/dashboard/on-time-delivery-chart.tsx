
"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import { isAfter, parseISO } from "date-fns"

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
} from "@/components/ui/chart"
import { useData } from "@/hooks/use-data"

const chartConfig = {
  onTime: {
    label: "Đúng giờ",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Thất bại/Hủy",
    color: "hsl(var(--chart-5))",
  },
}

export function OnTimeDeliveryChart() {
  const { deliveries } = useData()

  const chartData = React.useMemo(() => {
    let onTime = 0;
    let failed = 0;

    deliveries.forEach(d => {
      if (d.status === 'Đã giao' && d.deliveryDateTime && d.order.deliveryDate) {
         if (!isAfter(parseISO(d.deliveryDateTime), parseISO(d.order.deliveryDate))) {
            onTime++;
         } else {
            failed++; // Considered "failed" if delivered after planned date
         }
      } else if (d.status === 'Thất bại' || d.status === 'Đã hủy') {
        failed++;
      }
    })

    return [
      { status: "onTime", count: onTime, fill: chartConfig.onTime.color },
      { status: "failed", count: failed, fill: chartConfig.failed.color },
    ]
  }, [deliveries])
  
  const totalDeliveries = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Hiệu suất Giao hàng</CardTitle>
        <CardDescription>Tỷ lệ giao hàng đúng giờ và thất bại</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
              innerRadius={50}
              strokeWidth={5}
              label={({ viewBox }) => {
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
                        {totalDeliveries}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground"
                      >
                        Chuyến
                      </tspan>
                    </text>
                  )
                }
              }}
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {chartData.map((item) => (
              <div key={item.status} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.fill}}></div>
                  {chartConfig[item.status as keyof typeof chartConfig].label}
              </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
