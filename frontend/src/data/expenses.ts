export type ExpenseStatus = "Validated" | "Review"

export type Expense = {
  id: string
  category: string
  description: string
  amount: number
  date: string
  status: ExpenseStatus
}

export const expenses: Expense[] = [
  {
    id: "EXP-042",
    category: "Repairs",
    description: "Building Repairs — September",
    amount: 73000,
    date: "30 Sep 2026",
    status: "Review",
  },
  {
    id: "EXP-041",
    category: "Water",
    description: "Water & Pumping — September",
    amount: 56000,
    date: "29 Sep 2026",
    status: "Validated",
  },
  {
    id: "EXP-040",
    category: "Housekeeping",
    description: "Housekeeping Services — September",
    amount: 96000,
    date: "28 Sep 2026",
    status: "Validated",
  },
  {
    id: "EXP-039",
    category: "Electricity",
    description: "Common Area Electricity — September",
    amount: 118000,
    date: "27 Sep 2026",
    status: "Validated",
  },
  {
    id: "EXP-038",
    category: "Security",
    description: "Security Services — September",
    amount: 142000,
    date: "26 Sep 2026",
    status: "Validated",
  },
]