"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  CirclePower,
  House, 
  Settings,
} from "lucide-react";

interface NavbarItem {
  title: string;
  href: string;
  icon: React.ReactElement;
}

const navbarItems: NavbarItem[] = [
  { title: "Home", href: "/", icon: <House /> },
  { title: "Settings", href: "/settings", icon: <Settings /> }, 
]

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="py-4 sm:w-20 sm:h-full bg-[#222222] rounded-2xl flex sm:flex-col items-center gap-3">
      <div className="mx-4 sm:mb-4">
        <CirclePower color="#FFFFFF" size={38} className="-rotate-12"/>
        <p className="mt-1 text-white text-center font-bold">WoL</p>
      </div>

      { navbarItems.map(item =>
        <TooltipProvider key={ item.title }>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              href={ item.href }
              className={clsx(
                "w-14 h-14 flex justify-center items-center rounded-full transition-colors text-white hover:bg-white hover:text-[#222222] focus:bg-white focus:text-[#222222] focus:outline-0",
                {
                  "!text-[#222222] bg-white hover:bg-neutral-200 focus:bg-neutral-200": pathname === item.href
                }
              )}
            >
              { item.icon }
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={24} className="text-sm rounded-full bg-[#222222]">
            { item.title }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      )}
    </nav>
  )
}