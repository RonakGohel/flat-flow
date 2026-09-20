import { FileText, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { statements } from "@/data/admin"

export default function Statements() {
  const [search, setSearch] = useState("")

  const filteredStatements = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return statements
    }

    return statements.filter(
      (statement) =>
        statement.flat.toLowerCase().includes(query) ||
        statement.resident.toLowerCase().includes(query)
    )
  }, [search])

  const reviewed = statements.filter(
    (statement) => statement.status === "Reviewed"
  ).length

  const calculated = statements.filter(
    (statement) => statement.status === "Calculated"
  ).length

  const due = statements.filter(
    (statement) => statement.payment === "Due"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-neutral-500">Admin / Statements</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
          Statements
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review calculated maintenance statements before publication.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Total statements</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {statements.length}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Reviewed</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {reviewed}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {calculated} still marked as calculated
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Payment due</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {due}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Across displayed statements
          </p>
        </div>
      </div>

      {/* Statements table */}
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-neutral-900">
              Resident statements
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              September 2026 maintenance calculations.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search flat or resident"
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Flat</th>
                <th className="px-5 py-3 font-medium">Resident</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Payment</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredStatements.map((statement) => (
                <tr
                  key={statement.flat}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-5 py-4 font-medium text-neutral-900">
                    {statement.flat}
                  </td>

                  <td className="px-5 py-4 text-neutral-700">
                    {statement.resident}
                  </td>

                  <td className="px-5 py-4 font-medium text-neutral-900">
                    {statement.amount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statement.status === "Reviewed"
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {statement.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statement.payment === "Paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {statement.payment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-neutral-100 md:hidden">
          {filteredStatements.map((statement) => (
            <div key={statement.flat} className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <FileText className="h-4 w-4 text-neutral-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">
                      {statement.flat}
                    </p>
                    <p className="truncate text-sm text-neutral-500">
                      {statement.resident}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 font-semibold text-neutral-900">
                  {statement.amount}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statement.status === "Reviewed"
                      ? "bg-green-50 text-green-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {statement.status}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statement.payment === "Paid"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {statement.payment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredStatements.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-neutral-900">
              No statements found
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Try a different flat number or resident name.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}