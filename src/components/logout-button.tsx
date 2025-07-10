"use client";
import { useAuth } from "@/AuthContext";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    
  };

  return (
    <SidebarMenuButton onClick={handleLogout}>
      Logout
    </SidebarMenuButton>
  );
} 