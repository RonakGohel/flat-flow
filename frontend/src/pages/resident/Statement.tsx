import { useState } from "react"
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

const expenses = [
  {
    category: "Security",
    amount: 1420,
    societyAmount: 142000,
    allocation: "Equal split across 100 flats",
    source: "Security Services — September",
  },
  {
    category: "Electricity",
    amount: 1180,
    societyAmount: 118000,
    allocation: "Equal split across 100 flats",
    source: "Common Area Electricity — September",
  },
  {
    category: "Housekeeping",
    amount: 960,
    societyAmount: 96000,
    allocation: "Equal split across 100 flats",
    source: "Housekeeping Services — September",
  },
  {
    category: "Repairs",
    amount: 730,
    societyAmount: 73000,
    allocation: "Equal split across 100 flats",
    source: "Building Repairs — September",
  },
  {
    category: "Water",
    amount: 560,
    societyAmount: 56000,
    allocation: "Equal split across 100 flats",
    source: "Water & Pumping — September",
  },
]

const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

export default function Statement() {
  const [selectedExpense, setSelectedExpense] =
    useState<(typeof expenses)[number] | null>(null)

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
              September 2026 · Flat A-204
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Maintenance statement
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              A complete breakdown of your monthly maintenance contribution.
              Select any expense to see the supporting calculation.
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

        {/* Total */}
        <div className="mt-7 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Total maintenance
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Statement verified
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-neutral-500">Previous month</p>
              <p className="mt-1 text-sm font-medium text-neutral-950">
                ₹4,320
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Change</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-amber-700">
                <ArrowUpRight className="h-3.5 w-3.5" />
                ₹530
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Allocation method</p>
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
              Your share of each published society expense.
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {expenses.map((expense) => (
              <button
                key={expense.category}
                type="button"
                onClick={() => setSelectedExpense(expense)}
                className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-neutral-50 sm:px-7"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-950">
                    {expense.category}
                  </p>

                  <p className="mt-1 truncate text-xs text-neutral-500">
                    {expense.allocation}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <p className="text-sm font-semibold text-neutral-950">
                    {formatCurrency(expense.amount)}
                  </p>

                  <ArrowUpRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-700" />
                </div>
              </button>
            ))}
          </div>

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
                Each amount above is derived from the society expense record
                and the published allocation rule. FlatFlow does not
                independently alter the underlying financial figures.
              </p>
            </div>
          </div>
        </div>
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
                  Supporting calculation for your September statement.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 py-6">
                <div className="rounded-xl bg-neutral-50 p-5">
                  <p className="text-xs text-neutral-500">
                    Your share
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                    {formatCurrency(selectedExpense.amount)}
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
                      {selectedExpense.source}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        Verified expense
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                        This expense is included in the published
                        statement calculation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-5">
                  <p className="text-xs leading-5 text-neutral-400">
                    FlatFlow uses the society's published records and
                    allocation rules as the source of truth for this
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