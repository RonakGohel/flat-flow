import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileText,
  Receipt,
  Upload,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  dashboardSummary,
  adminExpenseSummary,
} from "@/data/admin"

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`

const workflow = [
  {
    label: "Draft",
    description: "Expense records entered",
    complete: true,
  },
  {
    label: "Validated",
    description: "Source records checked",
    complete: false,
  },
  {
    label: "Calculated",
    description: "Resident statements generated",
    complete: true,
  },
  {
    label: "Reviewed",
    description: "Statements reviewed",
    complete: true,
  },
  {
    label: "Published",
    description: "Visible to residents",
    complete: false,
  },
]

export default function Dashboard() {
  const recentExpenses = adminExpenseSummary.slice(0, 4)

  const totalExpenseAmount = adminExpenseSummary.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  const reviewExpense = adminExpenseSummary.find(
    (expense) => expense.status === "Review"
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {dashboardSummary.period ?? "September 2026"}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Society overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Review the current maintenance cycle, expense validation, and
              statement publication status.
            </p>
          </div>

          <Link
            to="/admin/expenses"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
          >
            View expenses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

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
              {dashboardSummary.totalExpenses}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              {dashboardSummary.expenseRecords} records
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                Statements
              </p>

              <FileText className="h-4 w-4 text-neutral-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {dashboardSummary.statements}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              Resident statements
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                Validation
              </p>

              <FileCheck2 className="h-4 w-4 text-neutral-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {dashboardSummary.validatedExpenses}
            </p>

            <p className="mt-2 text-xs text-amber-700">
              One record needs attention
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                Publication
              </p>

              <Upload className="h-4 w-4 text-neutral-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {dashboardSummary.publicationStatus}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              Statements not yet published
            </p>
          </div>
        </div>

        {/* Workflow */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
          <div>
            <h2 className="font-semibold tracking-tight text-neutral-950">
              Monthly workflow
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              September statement preparation
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {workflow.map((step, index) => (
              <div
                key={step.label}
                className="relative rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.complete
                        ? "bg-emerald-50"
                        : "bg-neutral-100"
                    }`}
                  >
                    {step.complete ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <span className="text-xs font-semibold text-neutral-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-950">
                      {step.label}
                    </p>

                    <p className="mt-1 text-xs leading-4 text-neutral-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Recent expenses */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold tracking-tight text-neutral-950">
                  Recent expenses
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Latest records in the September cycle
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

            <div className="mt-6 space-y-1">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.category}
                  className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-neutral-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Receipt className="h-4 w-4 text-neutral-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-950">
                      {expense.category}
                    </p>

                    <p className="mt-0.5 text-xs text-neutral-400">
                      September expense
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-950">
                      {formatCurrency(expense.amount)}
                    </p>

                    <span
                      className={`text-[11px] font-medium ${
                        expense.status === "Validated"
                          ? "text-emerald-600"
                          : "text-amber-700"
                      }`}
                    >
                      {expense.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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

          {/* Needs attention */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-4 w-4 text-amber-600" />

              <h2 className="font-semibold tracking-tight text-neutral-950">
                Needs attention
              </h2>
            </div>

            {reviewExpense ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-950">
                  {reviewExpense.category}
                </p>

                <p className="mt-1 text-lg font-semibold text-amber-950">
                  {formatCurrency(reviewExpense.amount)}
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-800">
                  Source confirmation is missing. This expense should be
                  reviewed before statements are published.
                </p>

                <Link
                  to="/admin/documents"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-900 hover:text-amber-950"
                >
                  Review source
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />

                  <p className="text-sm leading-5 text-emerald-800">
                    All current expense records have passed validation.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <p className="text-xs text-neutral-500">
                Total tracked in current dataset
              </p>

              <p className="mt-1 text-lg font-semibold text-neutral-950">
                {formatCurrency(totalExpenseAmount)}
              </p>
            </div>
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
            <Upload className="h-5 w-5 text-neutral-600" />

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
      </div>
    </div>
  )
}