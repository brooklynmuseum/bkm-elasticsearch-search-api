'use client';

import { Logo } from '../logo';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { GithubIcon } from 'lucide-react';

const githubUrl = 'https://github.com/brooklynmuseum/bkm-elasticsearch-search-api';
const logsUrl = 'https://vercel.com/brooklynmuseum/bkm-elasticsearch-search-api/logs';

export function Header() {
  return (
    <header className="top-0 z-40 w-full">
      <div className="px-4 flex flex-wrap items-center sm:justify-between sm:space-x-4">
        <div className="flex items-center h-14 justify-end">
          <Logo className="w-48 inline mr-3" />
          <span className="text-lg font-bold text-muted-foreground">Search API</span>
        </div>
        <div className="flex items-center justify-start h-12 sm:h-14">
          <NavigationMenu className="">
            <NavigationMenuItem>
              <Link href={logsUrl} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Logs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={githubUrl} legacyBehavior passHref>
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
