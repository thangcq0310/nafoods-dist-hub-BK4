import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Truck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/dashboard" className="mr-6 flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            Distribution App Nafoods
          </span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center justify-end">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
