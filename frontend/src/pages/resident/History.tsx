import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FileText,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const history = [
  {
    month: "September 2026",
    shortMonth: "Sep",
    amount: 4850,
    status: "Due",
  },
  {
    month: "August 2026",
    shortMonth: "Aug",
    amount: 4320,
    status: "Paid",
  },
  {
    month: "July 2026",
    shortMonth: "Jul",
    amount: 4210,
    status: "Paid",
  },
  {
    month: "June 2026",
    shortMonth: "Jun",
    amount: 4050,
    status: "Paid",
  },
  {
    month: "May 2026",
    shortMonth: "May",
    amount: 4120,
    status: "Paid",
  },
  {
    month: "April 2026",
    shortMonth: "Apr",
    amount: 3980,
    status: "Paid",
  },
]

const chartData = [...history]
  .reverse()
  .map((item) => ({
    month: item.shortMonth,
    amount: item.amount,
  }))

const average = Math.round(
  history.reduce((sum, item) => sum + item.amount, 0) / history.length
)

export default function History() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div>
          <p className="text-sm text-neutral-500">
            Flat A-204 · April–September 2026
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Statement history
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            See how your monthly maintenance contribution has changed over
            time.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Current maintenance
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              ₹4,850
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              ₹530 vs August
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Six-month average
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              ₹{average.toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              Based on published statements
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">
              Change since April
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              +₹870
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Higher than April
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
          <div>
            <h2 className="font-semibold tracking-tight text-neutral-950">
              Maintenance trend
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Monthly statement total
            </p>
          </div>

          <div className="mt-6 h-[240px] w-full sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 5,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="historyFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#171717"
                      stopOpacity={0.12}
                    />
                    <stop
                      offset="100%"
                      stopColor="#171717"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#e5e5e5"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#737373",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#a3a3a3",
                  }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  domain={["dataMin - 200", "dataMax + 200"]}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e5e5",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Maintenance",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#171717"
                  strokeWidth={2}
                  fill="url(#historyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <ArrowUpRight className="h-4 w-4 text-neutral-700" />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-950">
                September is the highest statement in this period
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                The increase from August is ₹530. Open the September
                statement to see which expense categories contributed to
                the change.
              </p>

              <Link
                to="/resident/statement"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-800 hover:text-neutral-950"
              >
                View September statement
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Statement list */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-5 sm:px-7">
            <h2 className="font-semibold tracking-tight text-neutral-950">
              Previous statements
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Your published monthly statements.
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {history.map((item, index) => {
              const isCurrent = index === 0

              return (
                <Link
                  key={item.month}
                  to="/resident/statement"
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-neutral-50 sm:px-7"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <FileText className="h-4 w-4 text-neutral-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-950">
                        {item.month}
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-400">
                        Flat A-204
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-950">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>

                      <div
                        className={`mt-0.5 flex items-center justify-end gap-1 text-xs ${
                          isCurrent
                            ? "text-amber-700"
                            : "text-emerald-600"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-neutral-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="h-4 sm:h-6" />
      </div>
    </div>
  )
}