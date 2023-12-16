'use client';

import { Logo } from '../logo';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { GithubIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="top-0 z-40 w-full">
      <div className="container flex flex-wrap items-center sm:justify-between sm:space-x-4">
        <div className="flex items-center h-16 justify-end">
          <Logo className="w-48 inline mr-3" />
          <span className="text-lg font-bold text-muted-foreground">Search</span>
        </div>
        <div className="flex items-center justify-start h-12 sm:h-16">
          <NavigationMenu className="">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Playground
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/logs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Logs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="https://github.com" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <GithubIcon className="w-5 h-5" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
