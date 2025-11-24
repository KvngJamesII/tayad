import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { User as UserType, Notification } from "@shared/schema";

export function Header() {
  const { data: user } = useQuery<UserType>({ queryKey: ["/api/auth/me"] });
  const { data: notifications } = useQuery<Notification[]>({ 
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Profile and Notifications */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/profile" data-testid="link-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history" data-testid="link-history">
                  History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="w-full text-left" data-testid="button-logout">
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 py-3">
                    <div className="font-semibold text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">{notification.message}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            OTP King
          </h1>
        </Link>

        {/* Right: Credits and Theme Toggle */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="px-4 py-2 font-mono text-sm font-semibold"
            data-testid="badge-credits"
          >
            Credits: {user?.credits ?? 0}
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
