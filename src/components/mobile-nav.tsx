"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Bảng điều khiển" },
  { href: "/orders", label: "Đơn hàng" },
  { href: "/deliveries", label: "Giao hàng" },
];

const masterDataItems = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/customers", label: "Khách hàng" },
  { href: "/vendors", label: "Nhà vận tải" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Distribution App</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="master-data" className="border-b-0">
                <AccordionTrigger className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:no-underline">
                  Dữ liệu gốc
                </AccordionTrigger>
                <AccordionContent className="pl-6">
                  <div className="flex flex-col gap-2">
                    {masterDataItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
