import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-slate-100 text-slate-900")}>
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-xl sm:inline-block font-headline">
              Nafoods Distribution Hub
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
