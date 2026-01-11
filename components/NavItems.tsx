"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/lib/constants";
import SearchCommand from "./SearchCommand";

const NavItems = ({ initialStocks }: { initialStocks?: StockWithWatchlistStatus[] } = {}): React.ReactElement => {
  const pathname = usePathname();

  const isActive = (path: string): boolean =>
    pathname === path || (path === "/dashboard" && pathname === "/");

  return (
    <ul className="flex items-center gap-6 text-sm font-medium text-gray-300">
      {NAV_ITEMS.map(({ href, label }) => {
        if (label === "Search") {
          return (
            <li key="search-trigger">
              <SearchCommand renderAs="text"
               label="Search" 
               initialStocks={initialStocks || []} />
            </li>
          );
        }
        return (
          <li key={href}>
            <Link
              href={href}
              className={`hover:text-yellow-400 transition-colors ${
                isActive(href)
                  ? "text-white font-semibold"
                  : "text-gray-300"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;