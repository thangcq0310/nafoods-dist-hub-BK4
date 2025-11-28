import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "dark:bg-slate-900/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-slate-900/60")}>
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-lg sm:inline-block font-headline">
              Nafoods Distribution
            </span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
            <MainNav />
        </div>
        <div className="flex items-center justify-end">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
