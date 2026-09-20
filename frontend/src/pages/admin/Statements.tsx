import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  getStatement,
  type StatementBreakdown,
  type StatementResponse,
} from "@/lib/api"

const SOCIETY_ID = "TEST001"
const MONTH = "2026-09"

type SelectedExpense = StatementBreakdown & {
  residentAmount: number
  societyAmount: number
  allocation: string
}

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

const toNumber = (value: string | number) => Number(value)

export default function Statement() {
  const [statement, setStatement] = useState<StatementResponse | null>(null)
  const [selectedExpense, setSelectedExpense] =
    useState<SelectedExpense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStatement() {
      try {
        setLoading(true)
        setError(null)

        const data = await getStatement(SOCIETY_ID, MONTH)

        if (!cancelled) {
          setStatement(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your statement."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStatement()

    return () => {
      cancelled = true
    }
  }, [])

  const total = statement
    ? toNumber(statement.per_flat_amount)
    : 0

  const totalSocietyExpense = statement
    ? toNumber(statement.total_expense)
    : 0

  const totalFlats = statement?.total_flats ?? 0

  const openExpense = (expense: StatementBreakdown) => {
    if (!statement) return

    const societyAmount = toNumber(expense.amount)

    const residentAmount =
      totalFlats > 0 ? societyAmount / totalFlats : 0

    setSelectedExpense({
      ...expense,
      residentAmount,
      societyAmount,
      allocation:
        totalFlats > 0
          ? `Equal split across ${totalFlats} flats`
          : "Allocation information unavailable",
    })
  }

  const monthLabel = statement?.month
    ? new Date(`${statement.month}-01T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "September 2026"

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Back */}
        <Link
          to="/resident"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Overview
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {monthLabel} · Society statement
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Maintenance statement
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              A complete breakdown of your monthly maintenance contribution
              calculated from the society expense records.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <>
            <div className="mt-7 animate-pulse rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
              <div className="h-4 w-32 rounded bg-neutral-100" />
              <div className="mt-3 h-10 w-40 rounded bg-neutral-100" />

              <div className="mt-6 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-3">
                <div className="h-12 rounded bg-neutral-100" />
                <div className="h-12 rounded bg-neutral-100" />
                <div className="h-12 rounded bg-neutral-100" />
              </div>
            </div>

            <div className="mt-4 animate-pulse rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-5 sm:px-7">
                <div className="h-5 w-36 rounded bg-neutral-100" />
                <div className="mt-2 h-4 w-64 rounded bg-neutral-100" />
              </div>

              <div className="space-y-1 p-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 rounded-lg bg-neutral-50"
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-900">
              Unable to load your statement
            </p>

            <p className="mt-1 text-sm leading-6 text-red-800">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statement */}
        {!loading && !error && statement && (
          <>
            {/* Total */}
            <div className="mt-7 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">
                    Your maintenance contribution
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                    {formatCurrency(total)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Calculated from published records
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-500">
                    Society expenses
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {formatCurrency(totalSocietyExpense)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Total flats
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {totalFlats}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Allocation method
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    Equal split
                  </p>
                </div>
              </div>
            </div>

            {/* Expense breakdown */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-5 sm:px-7">
                <h2 className="font-semibold tracking-tight text-neutral-950">
                  Expense breakdown
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Your share of each society expense.
                </p>
              </div>

              {statement.breakdown.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {statement.breakdown.map((expense, index) => {
                    const societyAmount = toNumber(expense.amount)

                    const residentAmount =
                      totalFlats > 0
                        ? societyAmount / totalFlats
                        : 0

                    return (
                      <button
                        key={`${expense.category}-${index}`}
                        type="button"
                        onClick={() => openExpense(expense)}
                        className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-neutral-50 sm:px-7"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-950">
                            {expense.category}
                          </p>

                          <p className="mt-1 truncate text-xs text-neutral-500">
                            {expense.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-sm font-semibold text-neutral-950">
                            {formatCurrency(residentAmount)}
                          </p>

                          <ArrowUpRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-700" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="px-5 py-10 text-center sm:px-7">
                  <p className="text-sm font-medium text-neutral-900">
                    No expenses found
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    There are no expense records for this statement period.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-5 py-5 sm:px-7">
                <span className="text-sm font-medium text-neutral-700">
                  Total
                </span>

                <span className="text-base font-semibold text-neutral-950">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Verification */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <ShieldCheck className="h-4 w-4 text-neutral-700" />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-950">
                    Calculation transparency
                  </p>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500">
                    FlatFlow calculates your contribution from the society
                    expense records returned by the backend and the current
                    allocation count. The underlying financial figures come
                    from the society data source.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Evidence drawer */}
      <Sheet
        open={Boolean(selectedExpense)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExpense(null)
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md"
        >
          {selectedExpense && (
            <>
              <SheetHeader className="border-b border-neutral-100 pb-5">
                <SheetTitle>
                  {selectedExpense.category}
                </SheetTitle>

                <SheetDescription>
                  Supporting calculation for your {monthLabel} statement.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 py-6">
                <div className="rounded-xl bg-neutral-50 p-5">
                  <p className="text-xs text-neutral-500">
                    Your share
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                    {formatCurrency(selectedExpense.residentAmount)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-500">
                      Society expense
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-950">
                      {formatCurrency(selectedExpense.societyAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">
                      Allocation
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-950">
                      {selectedExpense.allocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">
                      Source record
                    </p>

                    <p className="mt-1 text-sm font-medium leading-5 text-neutral-950">
                      {selectedExpense.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        Included in calculation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                        This expense was returned by the backend and included
                        in the current statement calculation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-5">
                  <p className="text-xs leading-5 text-neutral-400">
                    FlatFlow uses the society's backend expense records and
                    allocation data as the source of truth for this
                    calculation.
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}