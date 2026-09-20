import { BarChart3, FileText, History, MessageCircle, Receipt } from "lucide-react"
import { NavLink } from "react-router-dom"

const links = [
  { label: "Overview", icon: BarChart3, to: "/resident" },
  { label: "Statement", icon: Receipt, to: "/resident/statement" },
  { label: "History", icon: History, to: "/resident/history" },
  { label: "Ask", icon: MessageCircle, to: "/resident/ask" },
]

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-neutral-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171717] text-white">
            <FileText className="h-4 w-4" />
          </div>

          <div>
            <p className="font-semibold tracking-tight">FlatFlow</p>
            <p className="text-xs text-neutral-500">Resident portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/resident"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-neutral-100 font-medium text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
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
          <p className="text-xs text-neutral-500">Current flat</p>
          <p className="mt-1 text-sm font-medium">A-204</p>
        </div>
      </div>
    </aside>
  )
}