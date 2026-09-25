"use client";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth/auth-store";
import LogoutButton from "@/components/layout/logout-button";

const Header = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <h1 className="text-xl font-semibold md:hidden">Task Manager</h1>
      <div className="ml-auto">
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer rounded-full"
              aria-label="Open account menu"
            >
              <User className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Signed in as</p>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <LogoutButton />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;