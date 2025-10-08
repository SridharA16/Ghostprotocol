import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useLocation } from "react-router-dom"

const routeTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/create-post": "Create Post",
  "/lead-magnet": "Lead Magnet AI", 
  "/post-library": "Post Library",
  "/content-calendar": "Content Calendar"
}

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const currentTitle = routeTitles[location.pathname] || "Content Hub"

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}