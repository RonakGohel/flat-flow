export type AdminExpenseSummary = {
  category: string
  amount: number
  status: "Validated" | "Review"
}

export type AdminDocument = {
  id: string
  name: string
  category: string
  amount: string
  date: string
  status: "Confirmed" | "Review"
}

export type AdminFlat = {
  flat: string
  resident: string
  type: "Owner" | "Tenant"
  status: "Active" | "Inactive"
  payment: "Paid" | "Due" | "—"
  maintenance: string
}

export type AdminStatement = {
  flat: string
  resident: string
  amount: string
  status: "Reviewed" | "Calculated"
  payment: "Paid" | "Due"
}

export const society = {
  name: "Greenview Residency",
  location: "Pune",
  totalFlats: 96,
  period: "September 2026",
}

export const adminExpenseSummary: AdminExpenseSummary[] = [
  {
    category: "Security",
    amount: 142000,
    status: "Validated",
  },
  {
    category: "Electricity",
    amount: 118000,
    status: "Validated",
  },
  {
    category: "Housekeeping",
    amount: 96000,
    status: "Validated",
  },
  {
    category: "Repairs",
    amount: 73000,
    status: "Review",
  },
  {
    category: "Water",
    amount: 56000,
    status: "Validated",
  },
]

export const documents: AdminDocument[] = [
  {
    id: "DOC-041",
    name: "building-repairs-september.pdf",
    category: "Repairs",
    amount: "₹73,000",
    date: "30 Sep 2026",
    status: "Review",
  },
  {
    id: "DOC-040",
    name: "water-pumping-september.pdf",
    category: "Water",
    amount: "₹56,000",
    date: "29 Sep 2026",
    status: "Confirmed",
  },
  {
    id: "DOC-039",
    name: "housekeeping-september.pdf",
    category: "Housekeeping",
    amount: "₹96,000",
    date: "28 Sep 2026",
    status: "Confirmed",
  },
  {
    id: "DOC-038",
    name: "electricity-september.pdf",
    category: "Electricity",
    amount: "₹1,18,000",
    date: "27 Sep 2026",
    status: "Confirmed",
  },
  {
    id: "DOC-037",
    name: "security-services-september.pdf",
    category: "Security",
    amount: "₹1,42,000",
    date: "26 Sep 2026",
    status: "Confirmed",
  },
]

export const flats: AdminFlat[] = [
  {
    flat: "A-101",
    resident: "Aarav Shah",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-102",
    resident: "Priya Mehta",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-103",
    resident: "Rohan Patil",
    type: "Tenant",
    status: "Active",
    payment: "Due",
    maintenance: "₹4,850",
  },
  {
    flat: "A-104",
    resident: "Neha Kulkarni",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-201",
    resident: "Aditya Joshi",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-202",
    resident: "Sneha Deshmukh",
    type: "Tenant",
    status: "Active",
    payment: "Due",
    maintenance: "₹4,850",
  },
  {
    flat: "A-203",
    resident: "Vivek More",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-204",
    resident: "Kaustubh Marathe",
    type: "Owner",
    status: "Active",
    payment: "Due",
    maintenance: "₹4,850",
  },
  {
    flat: "A-205",
    resident: "Ishita Rao",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-206",
    resident: "Manav Gupta",
    type: "Tenant",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-207",
    resident: "Tanvi Nair",
    type: "Owner",
    status: "Active",
    payment: "Paid",
    maintenance: "₹4,850",
  },
  {
    flat: "A-208",
    resident: "Rahul Desai",
    type: "Owner",
    status: "Inactive",
    payment: "—",
    maintenance: "₹0",
  },
]

export const statements: AdminStatement[] = [
  {
    flat: "A-101",
    resident: "Aarav Shah",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Paid",
  },
  {
    flat: "A-102",
    resident: "Priya Mehta",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Paid",
  },
  {
    flat: "A-103",
    resident: "Rohan Patil",
    amount: "₹4,850",
    status: "Calculated",
    payment: "Due",
  },
  {
    flat: "A-104",
    resident: "Neha Kulkarni",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Paid",
  },
  {
    flat: "A-201",
    resident: "Aditya Joshi",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Paid",
  },
  {
    flat: "A-202",
    resident: "Sneha Deshmukh",
    amount: "₹4,850",
    status: "Calculated",
    payment: "Due",
  },
  {
    flat: "A-203",
    resident: "Vivek More",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Paid",
  },
  {
    flat: "A-204",
    resident: "Kaustubh Marathe",
    amount: "₹4,850",
    status: "Reviewed",
    payment: "Due",
  },
]

export const validationChecks = [
  {
    label: "Expense totals internally consistent",
    status: "Passed",
    detail: "Expense totals match the recorded source amounts.",
  },
  {
    label: "Duplicate expense detection",
    status: "Passed",
    detail: "No duplicate expense records were detected.",
  },
  {
    label: "Expense period consistency",
    status: "Passed",
    detail: "All reviewed expenses belong to September 2026.",
  },
  {
    label: "Supporting source records available",
    status: "Warning",
    detail:
      "Building Repairs is missing source confirmation.",
  },
  {
    label: "Allocation rules defined",
    status: "Passed",
    detail: "Equal allocation across registered flats is defined.",
  },
  {
    label: "Statement rounding check",
    status: "Passed",
    detail: "Statement values pass the rounding check.",
  },
]

export const publicationChecks = [
  {
    label: "All expense records validated",
    passed: false,
    detail: "41 of 42 expense records have been validated.",
  },
  {
    label: "Statements calculated",
    passed: true,
    detail: "96 resident statements have been calculated.",
  },
  {
    label: "Statement review completed",
    passed: true,
    detail: "96 statements have completed review.",
  },
  {
    label: "Supporting records available",
    passed: false,
    detail:
      "41 supporting records are available. 1 record still needs confirmation.",
  },
]

export const dashboardSummary = {
  totalExpenses: "₹4.85L",
  expenseRecords: 42,
  statements: 96,
  validatedExpenses: "41 / 42",
  publicationStatus: "Review",
}

export const publicationSummary = {
  statements: 96,
  totalMaintenance: "₹4,65,600",
  reviewed: 96,
  ready: 94,
}