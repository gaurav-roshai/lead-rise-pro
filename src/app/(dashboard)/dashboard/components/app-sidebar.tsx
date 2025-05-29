"use client"
import * as React from "react"
import { LayoutDashboard, UserRoundPlus } from "lucide-react"
import  Image from "next/image"
import { NavMain } from "@/app/(dashboard)/dashboard/components/nav-main"
import { NavUser } from "@/app/(dashboard)/dashboard/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Session } from "@/lib/auth-types"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: UserRoundPlus,
    },
  ],

}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { session: Session | null }) {
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent"
            >
              
              <Link href="/" className="flex justify-center items-center">
              <Image
                alt="LeadRise Logo"
                width={560}
                height={560}
                src="/logo-lead.svg"
                className="h-10 w-auto"
              />
               <h1 className="text-3xl font-bold flex items-center gap-0">
                  <span className="text-slate-800">Lead</span>
                  <span className="text-[#1D91D8]">Rise</span>
                  <sup className="text-xs ml-1 text-slate-600 font-medium">
                    Pro
                  </sup>
                </h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  )
}
