import { useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  Search,
  Upload,
} from "lucide-react"
import { documents } from "@/data/admin"

export default function Documents() {
  const [search, setSearch] = useState("")
  const [selectedDocument, setSelectedDocument] =
    useState<(typeof documents)[number] | null>(null)

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return documents

    return documents.filter(
      (document) =>
        document.name.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query) ||
        document.id.toLowerCase().includes(query)
    )
  }, [search])

  const confirmedCount = documents.filter(
    (document) => document.status === "Confirmed"
  ).length

  const reviewCount = documents.filter(
    (document) => document.status === "Review"
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
              Documents
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Review supporting records used to verify society expenses.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            <Upload className="h-4 w-4" />
            Upload document
          </button>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Documents
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {documents.length}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              September records
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Confirmed
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {confirmedCount}
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Source verified
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Needs review
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {reviewCount}
            </p>

            <p className="mt-2 text-xs text-amber-700">
              Source confirmation required
            </p>
          </div>
        </div>

        {/* Upload area */}
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white p-5 sm:p-7">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <Upload className="h-4 w-4 text-neutral-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-950">
                Add supporting records
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Upload invoices, bills, receipts, or other records used to
                support an expense.
              </p>
            </div>

            <button
              type="button"
              className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
            >
              Choose file
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents..."
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Desktop list */}
        <div className="mt-4 hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-neutral-400">
                    Document
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Category
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Date
                  </th>

                  <th className="px-4 py-4 text-xs font-medium text-neutral-400">
                    Status
                  </th>

                  <th className="w-12 px-4 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    onClick={() => setSelectedDocument(document)}
                    className="cursor-pointer transition hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                          <FileText className="h-4 w-4 text-neutral-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-950">
                            {document.name}
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-400">
                            {document.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {document.category}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-neutral-950">
                      {document.amount}
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {document.date}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          document.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {document.status}
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
          {filteredDocuments.map((document) => (
            <button
              key={document.id}
              type="button"
              onClick={() => setSelectedDocument(document)}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:bg-neutral-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <FileText className="h-4 w-4 text-neutral-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-neutral-950">
                    {document.name}
                  </p>

                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  {document.category} · {document.amount}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    {document.id}
                  </span>

                  <span className="text-neutral-300">·</span>

                  <span className="text-[11px] text-neutral-400">
                    {document.date}
                  </span>

                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      document.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {document.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredDocuments.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-12 text-center">
            <Search className="mx-auto h-5 w-5 text-neutral-300" />

            <p className="mt-3 text-sm font-medium text-neutral-900">
              No documents found
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Try a different document name or category.
            </p>
          </div>
        )}

        {/* Note */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs leading-5 text-neutral-500">
            Extracted document values should be confirmed by an admin before
            they are treated as verified financial records.
          </p>
        </div>

        <div className="h-4 sm:h-6" />
      </div>

      {/* Document detail panel */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close document details"
            className="absolute inset-0 bg-black/20"
            onClick={() => setSelectedDocument(null)}
          />

          <div className="absolute bottom-0 right-0 top-0 w-full overflow-y-auto bg-white shadow-xl sm:max-w-md">
            <div className="border-b border-neutral-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">
                    {selectedDocument.id}
                  </p>

                  <h2 className="mt-1 break-words text-lg font-semibold tracking-tight text-neutral-950">
                    {selectedDocument.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDocument(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="rounded-xl bg-neutral-50 p-5">
                <p className="text-xs text-neutral-500">
                  Extracted amount
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                  {selectedDocument.amount}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {selectedDocument.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {selectedDocument.date}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    selectedDocument.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedDocument.status}
                </span>
              </div>

              {selectedDocument.status === "Review" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-950">
                    Confirmation required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    The extracted information should be checked against the
                    source document before this record is treated as verified.
                  </p>
                </div>
              )}

              {selectedDocument.status === "Confirmed" && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-xs leading-5 text-emerald-800">
                      This document has been confirmed as a supporting record.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
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