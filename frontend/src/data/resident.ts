export type ResidentExpense = {
  label: string
  amount: number
  percent: number
}

export type MonthlyStatement = {
  month: string
  amount: number
}

export type ChangeItem = {
  label: string
  change: number
  description: string
}

export type SupportingRecord = {
  title: string
  category: string
  amount: number
  date: string
}

export const residentProfile = {
  name: "Kaustubh",
  flat: "A-204",
  society: "Greenview Residency",
  city: "Pune",
}

export const currentStatement = {
  month: "September 2026",
  currentAmount: 4850,
  previousAmount: 4320,
  increase: 530,
}

export const residentExpenses: ResidentExpense[] = [
  {
    label: "Security",
    amount: 1420,
    percent: 29,
  },
  {
    label: "Electricity",
    amount: 1180,
    percent: 24,
  },
  {
    label: "Housekeeping",
    amount: 960,
    percent: 20,
  },
  {
    label: "Repairs",
    amount: 730,
    percent: 15,
  },
  {
    label: "Water",
    amount: 560,
    percent: 12,
  },
]

export const monthlyStatements: MonthlyStatement[] = [
  { month: "Apr", amount: 3980 },
  { month: "May", amount: 4120 },
  { month: "Jun", amount: 4050 },
  { month: "Jul", amount: 4210 },
  { month: "Aug", amount: 4320 },
  { month: "Sep", amount: 4850 },
]

export const statementChanges: ChangeItem[] = [
  {
    label: "Repairs",
    change: 310,
    description: "Higher common-area repair spending this month.",
  },
  {
    label: "Electricity",
    change: 140,
    description: "Common-area electricity costs increased.",
  },
  {
    label: "Other categories",
    change: 80,
    description: "Smaller changes across remaining expenses.",
  },
]

export const supportingRecords: SupportingRecord[] = [
  {
    title: "Security Services — September",
    category: "Security",
    amount: 142000,
    date: "26 Sep 2026",
  },
  {
    title: "Common Area Electricity — September",
    category: "Electricity",
    amount: 118000,
    date: "27 Sep 2026",
  },
  {
    title: "Housekeeping Services — September",
    category: "Housekeeping",
    amount: 96000,
    date: "28 Sep 2026",
  },
  {
    title: "Building Repairs — September",
    category: "Repairs",
    amount: 73000,
    date: "30 Sep 2026",
  },
  {
    title: "Water & Pumping — September",
    category: "Water",
    amount: 56000,
    date: "29 Sep 2026",
  },
]

export const askSuggestions = [
  "Why did my maintenance increase this month?",
  "Why did electricity increase?",
  "How much went to repairs?",
  "Show me the supporting records.",
]

export const paymentStatus = {
  status: "Due",
  amount: 4850,
}