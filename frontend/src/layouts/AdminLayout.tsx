import {
  BarChart3,
  Building2,
  FileCheck2,
  FileText,
  Home,
  Receipt,
  Upload,
  Users,
} from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import MobileNav from "@/components/shared/MobileNav"

const links = [
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

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-neutral-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171717] text-white">
              <Building2 className="h-4 w-4" />
            </div>

            <div>
              <p className="font-semibold tracking-tight text-neutral-950">
                FlatFlow
              </p>

              <p className="text-xs text-neutral-500">
                Admin workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Management
          </p>

          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
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

        <div className="border-t border-neutral-100 p-4">
          <div className="rounded-lg bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">Society</p>

            <p className="mt-1 text-sm font-medium text-neutral-950">
              Greenview Residency
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              96 flats · Pune
            </p>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-neutral-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <MobileNav mode="admin" />

          <div className="ml-3">
            <p className="text-sm font-semibold text-neutral-950">
              FlatFlow
            </p>

            <p className="text-[11px] text-neutral-400">
              Admin workspace
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}