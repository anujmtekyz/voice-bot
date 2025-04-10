"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Briefcase, Home, Mic, Settings, Ticket, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [open, onClose])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (open) {
      onClose()
    }
  }, [pathname, open, onClose])

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-lg font-semibold">Navigation</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              <NavItem href="/" icon={<Home className="h-5 w-5" />} active={pathname === "/"}>
                Dashboard
              </NavItem>
              <NavItem href="/tickets" icon={<Ticket className="h-5 w-5" />} active={pathname === "/tickets"}>
                Tickets
              </NavItem>
              <NavItem href="/projects" icon={<Briefcase className="h-5 w-5" />} active={pathname === "/projects"}>
                Projects
              </NavItem>
              <NavItem
                href="/voice-commands"
                icon={<Mic className="h-5 w-5" />}
                active={pathname === "/voice-commands"}
              >
                Voice Commands
              </NavItem>
              <NavItem href="/voice-history" icon={<Mic className="h-5 w-5" />} active={pathname === "/voice-history"}>
                Voice History
              </NavItem>
              <NavItem href="/reports" icon={<BarChart className="h-5 w-5" />} active={pathname === "/reports"}>
                Reports
              </NavItem>
              <NavItem
                href="/voice-settings"
                icon={<Settings className="h-5 w-5" />}
                active={pathname === "/voice-settings"}
              >
                Voice Settings
              </NavItem>
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  active: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
