import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Send,
  ShieldCheck,
} from "lucide-react"
import { useState } from "react"
import {
  publicationChecks,
  publicationSummary,
} from "@/data/admin"

export default function Publish() {
  const [published, setPublished] = useState(false)

  const readyChecks = publicationChecks.filter(
    (check) => check.passed
  ).length

  const allChecksPassed = readyChecks === publicationChecks.length

  function handlePublish() {
    if (!allChecksPassed) return
    setPublished(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-neutral-500">Admin / Publish</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
          Publish statements
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Complete the final checks before statements become visible to residents.
        </p>
      </div>

      {/* Publication status */}
      <section
        className={`rounded-xl border p-5 ${
          published
            ? "border-green-200 bg-green-50/60"
            : allChecksPassed
              ? "border-green-200 bg-green-50/60"
              : "border-amber-200 bg-amber-50/60"
        }`}
      >
        <div className="flex items-start gap-3">
          {published ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : allChecksPassed ? (
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          )}

          <div>
            <p
              className={`text-sm font-medium ${
                published ? "text-green-900" : allChecksPassed ? "text-green-900" : "text-amber-900"
              }`}
            >
              {published
                ? "Statements published"
                : allChecksPassed
                  ? "Ready to publish"
                  : "Publication blocked"}
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${
                published ? "text-green-800" : allChecksPassed ? "text-green-800" : "text-amber-800"
              }`}
            >
              {published
                ? "The September 2026 statements are now marked as published."
                : allChecksPassed
                  ? "All required validation checks have passed."
                  : "Resolve the remaining validation issues before publishing statements to residents."}
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Statements</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {publicationSummary.statements}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Total maintenance</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {publicationSummary.totalMaintenance}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Reviewed</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {publicationSummary.reviewed}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-500">Ready</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {publicationSummary.ready}
          </p>
        </div>
      </div>

      {/* Checks */}
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-neutral-900">
            Publication checks
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Statements can only be published after all required checks pass.
          </p>
        </div>

        <div className="divide-y divide-neutral-100">
          {publicationChecks.map((check) => (
            <div
              key={check.label}
              className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                {check.passed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                )}

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
                  check.passed
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {check.passed ? "Passed" : "Action required"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Action */}
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              {allChecksPassed ? (
                <Send className="h-4 w-4 text-neutral-700" />
              ) : (
                <Lock className="h-4 w-4 text-neutral-500" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-900">
                {published
                  ? "September statements are published"
                  : "Publish September statements"}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                {published
                  ? "Residents can now access their published statements."
                  : `${readyChecks} of ${publicationChecks.length} required checks are complete.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!allChecksPassed || published}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition ${
              allChecksPassed && !published
                ? "bg-[#171717] text-white hover:bg-neutral-800"
                : "cursor-not-allowed bg-neutral-100 text-neutral-400"
            }`}
          >
            {published ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Published
              </>
            ) : allChecksPassed ? (
              <>
                <Send className="h-4 w-4" />
                Publish statements
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Resolve checks first
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  )
}