import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { AppSidebar } from "@/app/(dashboard)/dashboard/components/app-sidebar"
import { SiteHeader } from "@/app/(dashboard)/dashboard/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const SoraFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "LeadRise Pro",
  description: "Close Deals. Build Relationships. Grow with LeadRise Pro.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/signIn")
  }
  return (
    <div>
      <div
        className={`${SoraFont.variable} antialiased`}
      >
         <SidebarProvider
    className="font-sora"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" session={session}/>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
      </div>
      
    </div>
  );
}
