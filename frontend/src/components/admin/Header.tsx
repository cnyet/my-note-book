"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="z-10 w-full px-6 pt-4 pb-2">
      <div className="flex items-center justify-between px-6 py-2 bg-white/80 dark:bg-[#2b2c40]/80 backdrop-blur-md rounded-md sneat-card-shadow border-none">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#697a8d]"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center w-64 lg:w-96">
            <Search className="w-[1.125rem] h-[1.125rem] mr-3 text-[#b4bdc6]" />
            <Input
              type="text"
              placeholder="Search (Ctrl+K)"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-[#b4bdc6] text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[#697a8d] hover:text-[#696cff] transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#697a8d] hover:text-[#696cff] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-[#ff3e1d] rounded-full border-2 border-white dark:border-[#2b2c40]"></span>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-0 shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                      alt={user?.username}
                    />
                    <AvatarFallback className="bg-[#696cff]/10 text-[#696cff]">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#71dd37] border-2 border-white dark:border-[#2b2c40] rounded-full"></span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                    />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-[#566a7f] dark:text-[#a3b1c2]">
                      {user?.username || "John Doe"}
                    </p>
                    <p className="text-xs leading-none text-[#8592a3]">Admin</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 px-4 text-[#ff3e1d] focus:text-[#ff3e1d] focus:bg-[#ff3e1d]/10 cursor-pointer"
                onClick={logout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
