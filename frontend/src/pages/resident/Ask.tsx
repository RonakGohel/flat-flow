import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

const suggestions = [
  "Why did my maintenance increase this month?",
  "Why did electricity increase?",
  "How much went to repairs?",
  "Show me the supporting records.",
]

const answers: Record<
  string,
  {
    summary: string
    increase?: string
    reasons: {
      category: string
      amount: string
      detail: string
    }[]
  }
> = {
  "Why did my maintenance increase this month?": {
    summary:
      "Your September maintenance is ₹4,850, which is ₹530 higher than August's ₹4,320.",
    increase: "+₹530",
    reasons: [
      {
        category: "Security",
        amount: "+₹120",
        detail: "Higher security service expense allocated to your flat.",
      },
      {
        category: "Electricity",
        amount: "+₹180",
        detail: "Common-area electricity contributed to the increase.",
      },
      {
        category: "Repairs",
        amount: "+₹230",
        detail: "Building repair expenses increased this month.",
      },
    ],
  },

  "Why did electricity increase?": {
    summary:
      "Electricity accounts for ₹1,180 of your September maintenance contribution.",
    reasons: [
      {
        category: "Electricity",
        amount: "₹1,180",
        detail: "Your share of the September common-area electricity expense.",
      },
    ],
  },

  "How much went to repairs?": {
    summary:
      "₹730 of your September maintenance contribution was allocated to building repairs.",
    reasons: [
      {
        category: "Repairs",
        amount: "₹730",
        detail: "Your share of the September building repair expense.",
      },
    ],
  },

  "Show me the supporting records.": {
    summary:
      "Your statement currently has five verified expense records supporting the September allocation.",
    reasons: [
      {
        category: "Security",
        amount: "₹1,420",
        detail: "Security Services — September",
      },
      {
        category: "Electricity",
        amount: "₹1,180",
        detail: "Common Area Electricity — September",
      },
      {
        category: "Housekeeping",
        amount: "₹960",
        detail: "Housekeeping Services — September",
      },
      {
        category: "Repairs",
        amount: "₹730",
        detail: "Building Repairs — September",
      },
      {
        category: "Water",
        amount: "₹560",
        detail: "Water Supply — September",
      },
    ],
  },
}

export default function Ask() {
  const [question, setQuestion] = useState("")
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)

  const answer = activeQuestion ? answers[activeQuestion] : null

  function submitQuestion(value: string) {
    const trimmed = value.trim()

    if (!trimmed) return

    const matchedQuestion = answers[trimmed]
      ? trimmed
      : "Why did my maintenance increase this month?"

    setQuestion(trimmed)
    setActiveQuestion(matchedQuestion)
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div>
          <p className="text-sm text-neutral-500">
            Flat A-204 · September 2026
          </p>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
              Ask about your maintenance
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            Ask questions about your statement. Answers are based on the
            expense records used to calculate your maintenance.
          </p>
        </div>

        {/* Search */}
        <section className="mt-7 sm:mt-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                submitQuestion(question)
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Search className="ml-2 h-5 w-5 shrink-0 text-neutral-400 sm:ml-3" />

              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask why your maintenance changed..."
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
              />

              <button
                type="submit"
                disabled={!question.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Submit question"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>

        {/* Suggested questions */}
        {!answer && (
          <section className="mt-7 sm:mt-8">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Suggested questions
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuestion(suggestion)
                    setActiveQuestion(suggestion)
                  }}
                  className="group flex min-h-[60px] items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-4 text-left transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <span className="text-sm leading-5 text-neutral-700">
                    {suggestion}
                  </span>

                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition group-hover:text-neutral-700" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Answer */}
        {answer && (
          <section className="mt-7 space-y-4 sm:mt-8 sm:space-y-5">
            {/* Question */}
            <div className="flex justify-end">
              <div className="max-w-[90%] rounded-2xl bg-neutral-900 px-4 py-3 text-sm leading-6 text-white sm:max-w-xl sm:px-5 sm:py-4">
                {question}
              </div>
            </div>

            {/* Answer card */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Sparkles className="h-4 w-4 text-neutral-700" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-950">
                      FlatFlow explanation
                    </p>

                    <p className="text-xs text-neutral-400">
                      Based on verified statement records
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-neutral-800 sm:mt-6 sm:text-base">
                  {answer.summary}
                </p>

                {answer.increase && (
                  <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                    <span>{answer.increase} compared with August</span>
                  </div>
                )}
              </div>

              {/* Evidence */}
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-950">
                      Supporting records
                    </h2>

                    <p className="mt-1 text-xs text-neutral-400">
                      Figures used in your statement
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </div>
                </div>

                <div className="mt-4 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 sm:mt-5">
                  {answer.reasons.map((reason) => (
                    <div
                      key={`${reason.category}-${reason.amount}`}
                      className="flex items-start gap-3 px-4 py-4 sm:items-center sm:gap-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <FileText className="h-4 w-4 text-neutral-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <p className="text-sm font-medium text-neutral-950">
                            {reason.category}
                          </p>

                          <p className="shrink-0 text-sm font-semibold text-neutral-950">
                            {reason.amount}
                          </p>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          {reason.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounding notice */}
              <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-neutral-500">
                    This explanation uses the figures and records associated
                    with your published statement. FlatFlow does not estimate
                    or invent missing financial information.
                  </p>
                </div>
              </div>
            </div>

            {/* Ask another */}
            <button
              type="button"
              onClick={() => {
                setActiveQuestion(null)
                setQuestion("")
              }}
              className="text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              ← Ask another question
            </button>
          </section>
        )}

        <div className="h-4 sm:h-6" />
      </div>
    </main>
  )
}