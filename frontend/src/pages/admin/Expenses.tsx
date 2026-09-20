import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Filter,
  Receipt,
  Search,
} from "lucide-react"
import { expenses } from "@/data/expenses"

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

export default function Expenses() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [selectedExpense, setSelectedExpense] = useState<
    (typeof expenses)[number] | null
  >(null)

  const categories = [
    "All",
    ...Array.from(new Set(expenses.map((expense) => expense.category))),
  ]

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase()

    return expenses.filter((expense) => {
      const matchesSearch =
        !query ||
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.id.toLowerCase().includes(query)

      const matchesCategory =
        category === "All" || expense.category === category

      return matchesSearch && matchesCategory
    })
  }, [search, category])

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  const validated = expenses.filter(
    (expense) => expense.status === "Validated"
  ).length

  const needsReview = expenses.filter(
    (expense) => expense.status === "Review"
  ).length

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Greenview Residency · September 2026
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Expenses
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Review the expense records used to calculate resident
              maintenance statements.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            <Receipt className="h-4 w-4" />
            Add expense
          </button>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">Total expenses</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {formatCurrency(total)}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              {expenses.length} records
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">Validated</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {validated}
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready for calculation
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">Needs review</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {needsReview}
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs text-amber-700">
              <CircleAlert className="h-3.5 w-3.5" />
              Action required
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-neutral-200 px-3">
              <Search className="h-4 w-4 shrink-0 text-neutral-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search expenses..."
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-neutral-400" />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 outline-none sm:w-[180px]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All categories" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-neutral-400">
                    Expense
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Category
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Date
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Status
                  </th>

                  <th className="w-12 px-4 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => setSelectedExpense(expense)}
                    className="cursor-pointer transition hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-neutral-950">
                        {expense.description}
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-400">
                        {expense.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {expense.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {expense.date}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-neutral-950">
                      {formatCurrency(expense.amount)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          expense.status === "Validated"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {expense.status}
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
          {filteredExpenses.map((expense) => (
            <button
              key={expense.id}
              type="button"
              onClick={() => setSelectedExpense(expense)}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:bg-neutral-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <Receipt className="h-4 w-4 text-neutral-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-neutral-950">
                    {expense.category}
                  </p>

                  <p className="shrink-0 text-sm font-semibold text-neutral-950">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <p className="mt-1 truncate text-xs text-neutral-500">
                  {expense.description}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    {expense.id}
                  </span>

                  <span className="text-neutral-300">·</span>

                  <span className="text-[11px] text-neutral-400">
                    {expense.date}
                  </span>

                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      expense.status === "Validated"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {expense.status}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredExpenses.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-12 text-center">
            <Search className="mx-auto h-5 w-5 text-neutral-300" />

            <p className="mt-3 text-sm font-medium text-neutral-900">
              No expenses found
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Try changing your search or category filter.
            </p>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <ArrowDownUp className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />

            <p className="text-xs leading-5 text-neutral-500">
              Expense records are the source data for resident statement
              calculations. Changes should be validated before publication.
            </p>
          </div>
        </div>

        <div className="h-4 sm:h-6" />
      </div>

      {/* Expense detail panel */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close expense details"
            className="absolute inset-0 bg-black/20"
            onClick={() => setSelectedExpense(null)}
          />

          <div className="absolute bottom-0 right-0 top-0 w-full overflow-y-auto bg-white shadow-xl sm:max-w-md">
            <div className="border-b border-neutral-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-400">
                    {selectedExpense.id}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                    {selectedExpense.category}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExpense(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="rounded-xl bg-neutral-50 p-5">
                <p className="text-xs text-neutral-500">
                  Expense amount
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                  {formatCurrency(selectedExpense.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Description</p>

                <p className="mt-1 text-sm font-medium text-neutral-950">
                  {selectedExpense.description}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Date</p>

                <p className="mt-1 text-sm font-medium text-neutral-950">
                  {selectedExpense.date}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Status</p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    selectedExpense.status === "Validated"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedExpense.status}
                </span>
              </div>

              {selectedExpense.status === "Review" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <div>
                      <p className="text-sm font-medium text-amber-950">
                        Review required
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Source confirmation is required before this expense
                        can be included in publication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedExpense(null)}
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