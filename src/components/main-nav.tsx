'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BedDouble, MessageSquare, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/lib/data';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/matches', label: 'Matches', icon: Users },
  { href: '/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
];

function ThemeToggle() {
    const { setTheme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function NavContent() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className="justify-start"
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Nav */}
      <div className="md:hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <Link href="/dashboard" className="font-bold text-lg">
            RoomHarmony
          </Link>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="p-4 border-b">
                        <Link href="/dashboard" className="font-bold text-lg">
                            RoomHarmony
                        </Link>
                    </div>
                <NavContent />
                </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r">
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-primary">RoomHarmony</h1>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">@{currentUser.name.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
