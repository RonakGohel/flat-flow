import { Outlet } from "react-router-dom"
import Sidebar from "@/components/shared/Sidebar"
import MobileNav from "@/components/shared/MobileNav"

export default function ResidentLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-neutral-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <MobileNav mode="resident" />

          <div className="ml-3">
            <p className="text-sm font-semibold text-neutral-950">
              FlatFlow
            </p>

            <p className="text-[11px] text-neutral-400">
              Resident portal
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}