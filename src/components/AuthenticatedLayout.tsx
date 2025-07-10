"use client";
import { useAuth } from "@/AuthContext";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { token, loading } = useAuth();
  const pathname = usePathname();

  // Bypass auth for signup and callback pages
  if (pathname === "/signup" || pathname.startsWith("/callback")) {
    return <>{children}</>;
  }

  // While loading, render nothing (or a splash screen if you want)
  if (loading) {
    return null;
  }

  // If user is not authenticated, render children (which will be the welcome page)
  if (!token) {
    return <>{children}</>;
  }

  // If user is authenticated, show the sidebar layout
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
} 