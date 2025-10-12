"use client";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { path: "/recipes", label: "Recipes" },
    { path: "/calendar", label: "Calendar" },
    { path: "/shoppinglist", label: "Shopping List" },
  ];

  return (
    <div className="w-full flex justify-center border-b border-gray-300 py-4 fixed top-2 left-0 bg-white z-50 shadow-sm">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === item.path && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={item.path} className="flex items-center gap-2">
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
