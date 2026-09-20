import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileText,
  Receipt,
  RefreshCw,
} from "lucide-react"
import { Link } from "react-router-dom"

import {
  getExpenses,
  getStatement,
  type Expense,
  type StatementResponse,
} from "@/lib/api"

const SOCIETY_ID = "TEST001"
const MONTH = "2026-09"

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-")

  if (!year || !monthNumber) {
    return month
  }

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  )

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [statement, setStatement] =
    useState<StatementResponse | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadDashboard() {
    try {
      setLoading(true)
      setError(null)

      const [expensesResponse, statementResponse] =
        await Promise.all([
          getExpenses(SOCIETY_ID, MONTH),
          getStatement(SOCIETY_ID, MONTH),
        ])

      setExpenses(expensesResponse.expenses)
      setStatement(statementResponse)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const totalExpense = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      ),
    [expenses]
  )

  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>()

    for (const expense of expenses) {
      const current = totals.get(expense.category) ?? 0

      totals.set(
        expense.category,
        current + Number(expense.amount)
      )
    }

    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses])

  const recentExpenses = expenses.slice(0, 5)

  const societyName =
    statement?.society_id === SOCIETY_ID
      ? "Sunrise Heights CHS"
      : SOCIETY_ID

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {formatMonth(MONTH)}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Society overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Live financial overview for {societyName}.
              Expense figures are loaded directly from the
              FlatFlow backend.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <Link
              to="/admin/expenses"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
            >
              View expenses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-red-950">
                  Dashboard data could not be loaded
                </p>

                <p className="mt-1 text-sm leading-5 text-red-800">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadDashboard()}
                  className="mt-3 text-sm font-medium text-red-900 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !statement ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500">
                    Total expenses
                  </p>

                  <Receipt className="h-4 w-4 text-neutral-400" />
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {formatCurrency(totalExpense)}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Current month
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500">
                    Expense records
                  </p>

                  <FileText className="h-4 w-4 text-neutral-400" />
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {expenses.length}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Loaded from DynamoDB
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500">
                    Flats
                  </p>

                  <FileCheck2 className="h-4 w-4 text-neutral-400" />
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {statement?.total_flats ?? "—"}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Society configuration
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500">
                    Per-flat contribution
                  </p>

                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {statement
                    ? formatCurrency(
                        Number(statement.per_flat_amount)
                      )
                    : "—"}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Equal split
                </p>
              </div>
            </div>

            {/* Backend status */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-medium text-emerald-950">
                    Live backend connection
                  </p>

                  <p className="mt-1 text-sm leading-5 text-emerald-800">
                    Expense and statement data is being
                    retrieved through API Gateway and Lambda
                    from DynamoDB.
                  </p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">

              {/* Recent expenses */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold tracking-tight text-neutral-950">
                      Current expenses
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      Live records for {formatMonth(MONTH)}
                    </p>
                  </div>

                  <Link
                    to="/admin/expenses"
                    className="hidden items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-950 sm:flex"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {recentExpenses.length > 0 ? (
                  <div className="mt-6 space-y-1">
                    {recentExpenses.map((expense, index) => (
                      <div
                        key={
                          expense.expense_id ??
                          `${expense.category}-${index}`
                        }
                        className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-neutral-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                          <Receipt className="h-4 w-4 text-neutral-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-950">
                            {expense.category}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-neutral-400">
                            {expense.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-950">
                            {formatCurrency(
                              Number(expense.amount)
                            )}
                          </p>

                          <span className="text-[11px] font-medium text-emerald-600">
                            Backend record
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg bg-neutral-50 p-5 text-sm text-neutral-500">
                    No expense records found for this month.
                  </div>
                )}

                <Link
                  to="/admin/expenses"
                  className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm sm:hidden"
                >
                  <span className="font-medium text-neutral-700">
                    View all expenses
                  </span>

                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </Link>
              </div>

              {/* Category breakdown */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
                <div>
                  <h2 className="font-semibold tracking-tight text-neutral-950">
                    Expense breakdown
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Current month by category
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  {categoryTotals.map((item) => {
                    const percentage =
                      totalExpense > 0
                        ? (item.amount / totalExpense) * 100
                        : 0

                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-neutral-800">
                            {item.category}
                          </p>

                          <p className="text-sm font-medium text-neutral-950">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-neutral-800 transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                          {percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    )
                  })}

                  {categoryTotals.length === 0 && (
                    <p className="text-sm text-neutral-500">
                      No category data available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Statement status */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                    <h2 className="font-semibold tracking-tight text-neutral-950">
                      Statement calculation
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-neutral-500">
                    Backend calculation for {formatMonth(MONTH)}
                    is available.
                  </p>
                </div>

                {statement && (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <p className="text-xs text-neutral-500">
                      Calculated contribution
                    </p>

                    <p className="mt-1 text-lg font-semibold text-neutral-950">
                      {formatCurrency(
                        Number(statement.per_flat_amount)
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              <Link
                to="/admin/expenses"
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                <Receipt className="h-5 w-5 text-neutral-600" />

                <p className="mt-4 text-sm font-medium text-neutral-950">
                  Manage expenses
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-500">
                    Add and review expense records
                  </p>

                  <ArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-700" />
                </div>
              </Link>

              <Link
                to="/admin/validation"
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                <FileCheck2 className="h-5 w-5 text-neutral-600" />

                <p className="mt-4 text-sm font-medium text-neutral-950">
                  Run validation
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-500">
                    Check records before publication
                  </p>

                  <ArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-700" />
                </div>
              </Link>

              <Link
                to="/admin/publish"
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                <FileText className="h-5 w-5 text-neutral-600" />

                <p className="mt-4 text-sm font-medium text-neutral-950">
                  Publication
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-500">
                    Review publication readiness
                  </p>

                  <ArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-700" />
                </div>
              </Link>

            </div>

            <div className="h-4 sm:h-6" />
          </>
        )}
      </div>
    </div>
  )
}