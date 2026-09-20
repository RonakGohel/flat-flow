import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

const expenses = [
  { label: "Security", amount: 1420, percent: 29 },
  { label: "Electricity", amount: 1180, percent: 24 },
  { label: "Housekeeping", amount: 960, percent: 20 },
  { label: "Repairs", amount: 730, percent: 15 },
  { label: "Water", amount: 560, percent: 12 },
]

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

function OverviewSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header skeleton */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
            <div className="h-8 w-64 animate-pulse rounded bg-neutral-200 sm:w-80" />
            <div className="h-4 w-72 animate-pulse rounded bg-neutral-200 sm:w-96" />
          </div>

          <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-200 sm:w-40" />
        </div>

        {/* Main cards */}
        <div className="mt-7 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
                <div className="h-10 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
              </div>

              <div className="h-11 w-11 animate-pulse rounded-lg bg-neutral-200" />
            </div>

            <div className="mt-7 border-t border-neutral-100 pt-5">
              <div className="flex justify-between">
                <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
              </div>

              <div className="mt-3 h-2 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>

          <div className="rounded-xl bg-neutral-200 p-5 sm:p-7">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-300" />
            <div className="mt-7 h-4 w-40 animate-pulse rounded bg-neutral-300" />
            <div className="mt-3 h-12 w-full animate-pulse rounded bg-neutral-300" />
            <div className="mt-4 h-12 w-full animate-pulse rounded bg-neutral-300" />
          </div>
        </div>

        {/* Lower cards */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="h-5 w-44 animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-60 animate-pulse rounded bg-neutral-200" />

            <div className="mt-7 space-y-6">
              {expenses.map((expense) => (
                <div key={expense.label}>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                  </div>

                  <div className="mt-2 h-1.5 animate-pulse rounded-full bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="h-5 w-28 animate-pulse rounded bg-neutral-200" />

            <div className="mt-7 space-y-7">
              <div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mt-2 h-3 w-48 animate-pulse rounded bg-neutral-200" />
              </div>

              <div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mt-2 h-3 w-52 animate-pulse rounded bg-neutral-200" />
              </div>

              <div>
                <div className="flex justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mt-2 h-3 w-44 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="h-28 animate-pulse rounded-xl border border-neutral-200 bg-white" />
          <div className="h-28 animate-pulse rounded-xl border border-neutral-200 bg-white" />
        </div>
      </div>
    </div>
  )
}

export default function Overview() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 700)

    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <OverviewSkeleton />
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              September 2026 · Flat A-204
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Good morning, Kaustubh
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              Your maintenance statement is ready. Here's where your
              contribution went this month.
            </p>
          </div>

          <Link
            to="/resident/statement"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
          >
            View full statement
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Main maintenance card */}
        <div className="mt-7 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-neutral-500">
                  September maintenance
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  ₹4,850
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <ArrowUpRight className="h-4 w-4" />
                    ₹530
                  </span>

                  <span className="text-neutral-400">
                    from ₹4,320 last month
                  </span>
                </div>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <CreditCard className="h-5 w-5 text-neutral-700" />
              </div>
            </div>

            <div className="mt-7 border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                  Your monthly contribution
                </span>

                <span className="font-medium text-neutral-800">
                  100% allocated
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full w-full rounded-full bg-neutral-900" />
              </div>
            </div>
          </div>

          {/* AI explanation */}
          <Link
            to="/resident/ask"
            className="group rounded-xl bg-[#171717] p-5 text-white transition hover:bg-[#202020] sm:p-7"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-neutral-500 transition group-hover:text-white" />
            </div>

            <p className="mt-6 text-sm font-medium text-neutral-300">
              Ask about your statement
            </p>

            <p className="mt-2 text-lg font-medium leading-7">
              Why did my maintenance increase this month?
            </p>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              FlatFlow can explain the change using the actual expense
              records behind your statement.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium">
              Ask FlatFlow
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Expense breakdown */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold tracking-tight text-neutral-950">
                  Where your money went
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Your share of September society expenses
                </p>
              </div>

              <Link
                to="/resident/statement"
                className="hidden text-sm font-medium text-neutral-700 hover:text-neutral-950 sm:block"
              >
                Details
              </Link>
            </div>

            <div className="mt-6 space-y-5">
              {expenses.map((expense) => (
                <div key={expense.label}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="min-w-0 truncate text-sm text-neutral-700">
                      {expense.label}
                    </span>

                    <span className="shrink-0 text-sm font-medium text-neutral-950">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-neutral-800"
                      style={{ width: `${expense.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/resident/statement"
              className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm sm:hidden"
            >
              <span className="font-medium text-neutral-700">
                View full breakdown
              </span>

              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </Link>
          </div>

          {/* Change explanation */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-amber-600" />

              <h2 className="font-semibold tracking-tight text-neutral-950">
                What changed
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-600">
                    Repairs
                  </span>

                  <span className="text-sm font-medium text-neutral-950">
                    +₹310
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  Higher common-area repair spending this month.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-600">
                    Electricity
                  </span>

                  <span className="text-sm font-medium text-neutral-950">
                    +₹140
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  Common-area electricity costs increased.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-600">
                    Other categories
                  </span>

                  <span className="text-sm font-medium text-neutral-950">
                    +₹80
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  Smaller changes across remaining expenses.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-neutral-50 p-4">
              <p className="text-xs leading-5 text-neutral-500">
                The figures above are based on the published statement
                records for your society.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom status cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-950">
                  Statement verified
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Your September statement has passed the society's
                  validation checks.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <CircleAlert className="h-4 w-4 text-amber-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-950">
                  Payment due
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  ₹4,850 is due for September 2026. Check your society's
                  payment schedule for the due date.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4 sm:h-6" />
      </div>
    </div>
  )
}