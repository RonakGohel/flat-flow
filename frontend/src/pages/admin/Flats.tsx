import { useMemo, useState } from "react"
import {
  ChevronRight,
  Search,
  UserRound,
  Users,
} from "lucide-react"
import { flats } from "@/data/admin"

export default function Flats() {
  const [search, setSearch] = useState("")
  const [selectedFlat, setSelectedFlat] =
    useState<(typeof flats)[number] | null>(null)

  const filteredFlats = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return flats

    return flats.filter(
      (flat) =>
        flat.flat.toLowerCase().includes(query) ||
        flat.resident.toLowerCase().includes(query) ||
        flat.type.toLowerCase().includes(query) ||
        flat.status.toLowerCase().includes(query) ||
        flat.payment.toLowerCase().includes(query)
    )
  }, [search])

  const activeFlats = flats.filter(
    (flat) => flat.status === "Active"
  ).length

  const paymentsDue = flats.filter(
    (flat) => flat.payment === "Due"
  ).length

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div>
          <p className="text-sm text-neutral-500">
            Greenview Residency · September 2026
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Flats & residents
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Manage registered flats and review resident information used for
            statement allocation.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Total flats
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {flats.length}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              Registered in current dataset
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {activeFlats}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              Included in society records
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Payments due
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {paymentsDue}
            </p>

            <p className="mt-2 text-xs text-amber-700">
              Requires follow-up
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by flat, resident, or status..."
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-neutral-400">
                    Flat
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Resident
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Type
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Maintenance
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Payment
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Status
                  </th>

                  <th className="w-12 px-4 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredFlats.map((flat) => (
                  <tr
                    key={flat.flat}
                    onClick={() => setSelectedFlat(flat)}
                    className="cursor-pointer transition hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                          <Users className="h-4 w-4 text-neutral-600" />
                        </div>

                        <span className="text-sm font-medium text-neutral-950">
                          {flat.flat}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {flat.resident}
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {flat.type}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-neutral-950">
                      {flat.maintenance}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${
                          flat.payment === "Paid"
                            ? "text-emerald-700"
                            : flat.payment === "Due"
                              ? "text-amber-700"
                              : "text-neutral-400"
                        }`}
                      >
                        {flat.payment}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          flat.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {flat.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <ChevronRight className="h-4 w-4 text-neutral-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-2 md:hidden">
          {filteredFlats.map((flat) => (
            <button
              key={flat.flat}
              type="button"
              onClick={() => setSelectedFlat(flat)}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:bg-neutral-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <Users className="h-4 w-4 text-neutral-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-950">
                      {flat.flat}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {flat.resident}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    {flat.type}
                  </span>

                  <span className="text-neutral-300">·</span>

                  <span
                    className={`text-[11px] font-medium ${
                      flat.payment === "Paid"
                        ? "text-emerald-700"
                        : flat.payment === "Due"
                          ? "text-amber-700"
                          : "text-neutral-400"
                    }`}
                  >
                    {flat.payment}
                  </span>

                  <span className="ml-auto text-sm font-semibold text-neutral-950">
                    {flat.maintenance}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredFlats.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-12 text-center">
            <Search className="mx-auto h-5 w-5 text-neutral-300" />

            <p className="mt-3 text-sm font-medium text-neutral-900">
              No flats found
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Try a different flat number or resident name.
            </p>
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />

            <p className="text-xs leading-5 text-neutral-500">
              Resident information is used for statement allocation and
              account access. Residents only see their own statement data.
            </p>
          </div>
        </div>

        <div className="h-4 sm:h-6" />
      </div>

      {/* Flat detail panel */}
      {selectedFlat && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close flat details"
            className="absolute inset-0 bg-black/20"
            onClick={() => setSelectedFlat(null)}
          />

          <div className="absolute bottom-0 right-0 top-0 w-full overflow-y-auto bg-white shadow-xl sm:max-w-md">
            <div className="border-b border-neutral-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-400">
                    Resident record
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                    {selectedFlat.flat}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFlat(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="rounded-xl bg-neutral-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                    <UserRound className="h-5 w-5 text-neutral-600" />
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">
                      Resident
                    </p>

                    <p className="mt-1 text-sm font-semibold text-neutral-950">
                      {selectedFlat.resident}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">
                    Occupancy
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {selectedFlat.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {selectedFlat.status}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  September maintenance
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                  {selectedFlat.maintenance}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  Payment status
                </p>

                <p
                  className={`mt-1 text-sm font-medium ${
                    selectedFlat.payment === "Paid"
                      ? "text-emerald-700"
                      : selectedFlat.payment === "Due"
                        ? "text-amber-700"
                        : "text-neutral-400"
                  }`}
                >
                  {selectedFlat.payment}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-medium text-neutral-950">
                  Privacy
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  This information is available to authorized society
                  administrators. Residents only have access to their own
                  statement.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFlat(null)}
                className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}