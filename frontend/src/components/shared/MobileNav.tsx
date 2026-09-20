import { useState } from "react"
import {
  BarChart3,
  Building2,
  FileCheck2,
  FileText,
  Home,
  Menu,
  Receipt,
  Upload,
  Users,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type MobileNavProps = {
  mode: "resident" | "admin"
}

const residentLinks = [
  {
    label: "Overview",
    icon: BarChart3,
    to: "/resident",
    end: true,
  },
  {
    label: "Statement",
    icon: Receipt,
    to: "/resident/statement",
  },
  {
    label: "History",
    icon: FileText,
    to: "/resident/history",
  },
  {
    label: "Ask",
    icon: FileCheck2,
    to: "/resident/ask",
  },
]

const adminLinks = [
  {
    label: "Overview",
    icon: Home,
    to: "/admin",
    end: true,
  },
  {
    label: "Expenses",
    icon: Receipt,
    to: "/admin/expenses",
  },
  {
    label: "Documents",
    icon: Upload,
    to: "/admin/documents",
  },
  {
    label: "Flats",
    icon: Users,
    to: "/admin/flats",
  },
  {
    label: "Validation",
    icon: FileCheck2,
    to: "/admin/validation",
  },
  {
    label: "Statements",
    icon: FileText,
    to: "/admin/statements",
  },
  {
    label: "Publish",
    icon: BarChart3,
    to: "/admin/publish",
  },
]

export default function MobileNav({ mode }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const isAdmin = mode === "admin"
  const links = isAdmin ? adminLinks : residentLinks

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[280px] bg-white p-0"
      >
        <SheetHeader className="border-b border-neutral-100 px-6 py-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171717] text-white">
              <Building2 className="h-4 w-4" />
            </div>

            <div>
              <SheetTitle className="text-left text-base">
                FlatFlow
              </SheetTitle>

              <p className="text-xs text-neutral-500">
                {isAdmin ? "Admin workspace" : "Resident portal"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <nav className="space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            {isAdmin ? "Management" : "My account"}
          </p>

          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-neutral-100 font-medium text-neutral-950"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 p-4">
          <div className="rounded-lg bg-neutral-50 p-3">
            {isAdmin ? (
              <>
                <p className="text-xs text-neutral-500">
                  Society
                </p>

                <p className="mt-1 text-sm font-medium text-neutral-950">
                  Greenview Residency
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  96 flats · Pune
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-neutral-500">
                  Current flat
                </p>

                <p className="mt-1 text-sm font-medium text-neutral-950">
                  A-204
                </p>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}