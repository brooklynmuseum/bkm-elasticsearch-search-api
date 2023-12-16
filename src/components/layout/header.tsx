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
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-end">
          <Logo className="w-48 inline mr-3" />
          <span className="text-lg font-bold text-muted-foreground">Search</span>
        </div>
        <NavigationMenu>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Playground
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/logs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Logs</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
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
    </header>
  );
}
