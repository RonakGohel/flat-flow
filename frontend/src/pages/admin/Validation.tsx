import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"
import { validationChecks } from "@/data/admin"

export default function Validation() {
  const passed = validationChecks.filter(
    (check) => check.status === "Passed"
  ).length

  const warnings = validationChecks.filter(
    (check) => check.status === "Warning"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-neutral-500">Admin / Validation</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
          Validation
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review data consistency and publication readiness.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <ShieldCheck className="h-4 w-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Checks</p>
              <p className="text-xl font-semibold text-neutral-900">
                {validationChecks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Passed</p>
              <p className="text-xl font-semibold text-neutral-900">
                {passed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Warnings</p>
              <p className="text-xl font-semibold text-neutral-900">
                {warnings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation checks */}
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-neutral-900">
            Validation checks
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Automated checks performed before statements are published.
          </p>
        </div>

        <div className="divide-y divide-neutral-100">
          {validationChecks.map((check) => {
            const isPassed = check.status === "Passed"

            return (
              <div
                key={check.label}
                className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isPassed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {check.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      {check.detail}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isPassed
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {check.status}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Overall state */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Validation requires attention
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              One validation check is still unresolved. Review the supporting
              source record before publishing the September statements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}