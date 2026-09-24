"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth-store";
import { LOGIN_PATH } from "@/lib/constants/route-path-constants";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace(LOGIN_PATH);
  };

  return (
    <Button className="w-full cursor-pointer" type="button" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;