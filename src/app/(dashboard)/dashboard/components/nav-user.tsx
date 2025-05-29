"use client"
import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Session } from "@/lib/auth-types"
import Image from "next/image"

export function NavUser({
  session,
}: {
  session: Session | null
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  return (
    <SidebarMenu>
      <SidebarMenuItem className="overflow-clip">
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {session?.user.name
                    ? session.user.name
                        .split(' ')
                        .map(name => name[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : '??'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {session?.user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg font-sora"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{session?.user.name
                    ? session.user.name
                        .split(' ')
                        .map(name => name[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : '??'}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={
              async () => {
                await signOut({
                  fetchOptions: {
                    onSuccess() {
                      router.push("/signIn");
                    },
                  },
                });
              }
            } className="text-red-500">
              <IconLogout className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <div className="h-[1px] w-full bg-gray-200 my-3" />
      <div className="flex items-center gap-2 justify-center text-sm">

      <Image 
          src="https://pub-89c71be2d1fb4e5988b265a5dcd75b02.r2.dev/roshai-logo.webp" 
          width={3508} 
          height={1080} 
          className="w-24"
          alt="RoshAi Company Logo"
          priority
        />
      </div>
    </SidebarMenu>
  )
}
