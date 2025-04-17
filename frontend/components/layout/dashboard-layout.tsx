"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Shield, LayoutDashboard, Clipboard, FileText, Users, Settings, LogOut, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { isAuthenticated, getCurrentUser, logout, type User, type UserRole } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["hospital", "manufacturer", "regulator"],
  },
  {
    title: "Trials",
    href: "/dashboard/trials",
    icon: Clipboard,
    roles: ["hospital", "manufacturer", "regulator"],
    children: [
      {
        title: "All Trials",
        href: "/dashboard/trials",
        icon: Clipboard,
        roles: ["hospital", "manufacturer", "regulator"],
      },
      {
        title: "Create Trial",
        href: "/dashboard/trials/create",
        icon: Clipboard,
        roles: ["manufacturer"],
      },
    ],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["hospital", "manufacturer", "regulator"],
    children: [
      {
        title: "All Reports",
        href: "/dashboard/reports",
        icon: FileText,
        roles: ["hospital", "manufacturer", "regulator"],
      },
      {
        title: "Submit Report",
        href: "/dashboard/reports/submit",
        icon: FileText,
        roles: ["hospital"],
      },
      {
        title: "Final Reports",
        href: "/dashboard/reports/final",
        icon: FileText,
        roles: ["manufacturer", "regulator"],
      },
    ],
  },
  {
    title: "Hospitals",
    href: "/dashboard/hospitals",
    icon: Users,
    roles: ["manufacturer"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["hospital", "manufacturer", "regulator"],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setIsMounted(true)

    if (!isAuthenticated()) {
      router.push("/auth/login")
      return
    }

    setUser(getCurrentUser())
  }, [router])

  const handleLogout = () => {
    logout()
  }

  const toggleCollapsible = (title: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  if (!isMounted || !user) {
    return null
  }

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b bg-background lg:hidden">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Veridose</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 py-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                  <span className="text-xl font-bold">Veridose</span>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="grid gap-1">
                    {filteredNavItems.map((item) => (
                      <li key={item.title}>
                        {item.children ? (
                          <Collapsible
                            open={openCollapsibles[item.title]}
                            onOpenChange={() => toggleCollapsible(item.title)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                  <item.icon className="mr-2 h-5 w-5" />
                                  {item.title}
                                </div>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <ul className="grid gap-1 pl-6 pt-1">
                                {item.children
                                  .filter((child) => child.roles.includes(user.role))
                                  .map((child) => (
                                    <li key={child.title}>
                                      <Button
                                        variant="ghost"
                                        className={cn("w-full justify-start", pathname === child.href && "bg-muted")}
                                        asChild
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        <Link href={child.href}>
                                          <child.icon className="mr-2 h-5 w-5" />
                                          {child.title}
                                        </Link>
                                      </Button>
                                    </li>
                                  ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <Button
                            variant="ghost"
                            className={cn("w-full justify-start", pathname === item.href && "bg-muted")}
                            asChild
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link href={item.href}>
                              <item.icon className="mr-2 h-5 w-5" />
                              {item.title}
                            </Link>
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t py-4">
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Veridose</span>
          </div>
          <nav className="flex-1 overflow-auto py-6 px-4">
            <ul className="grid gap-1">
              {filteredNavItems.map((item) => (
                <li key={item.title}>
                  {item.children ? (
                    <Collapsible open={openCollapsibles[item.title]} onOpenChange={() => toggleCollapsible(item.title)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between">
                          <div className="flex items-center">
                            <item.icon className="mr-2 h-5 w-5" />
                            {item.title}
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="grid gap-1 pl-6 pt-1">
                          {item.children
                            .filter((child) => child.roles.includes(user.role))
                            .map((child) => (
                              <li key={child.title}>
                                <Button
                                  variant="ghost"
                                  className={cn("w-full justify-start", pathname === child.href && "bg-muted")}
                                  asChild
                                >
                                  <Link href={child.href}>
                                    <child.icon className="mr-2 h-5 w-5" />
                                    {child.title}
                                  </Link>
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start", pathname === item.href && "bg-muted")}
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.title}
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-4 py-2">
              <Avatar>
                <AvatarFallback className="bg-emerald-100 text-emerald-800">
                  {/* Add optional chaining and fallback for user name */}
                  {user?.name?.substring(0, 2)?.toUpperCase() ?? '??'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-destructive mt-2" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
