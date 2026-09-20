const API_BASE_URL =
  "https://x2eauob8dj.execute-api.ap-south-1.amazonaws.com/dev"

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export async function getToken(): Promise<string> {
  const token = localStorage.getItem("id_token")

  if (!token) {
    throw new Error("Not authenticated")
  }

  return token
}

/* -------------------------------------------------------------------------- */
/* Generic API client                                                         */
/* -------------------------------------------------------------------------- */

type ApiOptions = RequestInit & {
  token?: string
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = options.token ?? (await getToken())

  const headers = new Headers(options.headers)

  headers.set("Authorization", `Bearer ${token}`)

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get("content-type") ?? ""

  if (response.status === 204) {
    return undefined as T
  }

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (response.status === 401) {
    throw new Error("Unauthorized")
  }

  if (response.status === 403) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(data.message)
        : "Forbidden"

    throw new Error(message)
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(data.message)
        : typeof data === "string"
          ? data
          : `API request failed: ${response.status}`

    throw new Error(message)
  }

  return data as T
}

/* -------------------------------------------------------------------------- */
/* Statement                                                                  */
/* -------------------------------------------------------------------------- */

export type StatementBreakdown = {
  category: string
  amount: string | number
  description: string
}

export type StatementResponse = {
  society_id: string
  month: string
  total_expense: string | number
  per_flat_amount: string | number
  total_flats: number
  breakdown: StatementBreakdown[]
}

export async function getStatement(
  societyId: string,
  month: string
): Promise<StatementResponse> {
  const params = new URLSearchParams({
    society_id: societyId,
    month,
  })

  return apiFetch<StatementResponse>(
    `/statements?${params.toString()}`
  )
}

/* -------------------------------------------------------------------------- */
/* Expenses                                                                   */
/* -------------------------------------------------------------------------- */

export type Expense = {
  expense_id?: string
  category: string
  amount: string | number
  description: string
}

export type ExpensesResponse = {
  society_id: string
  month: string
  count: number
  expenses: Expense[]
}

export async function getExpenses(
  societyId: string,
  month: string
): Promise<ExpensesResponse> {
  const params = new URLSearchParams({
    society_id: societyId,
    month,
  })

  return apiFetch<ExpensesResponse>(
    `/expenses?${params.toString()}`
  )
}

export async function createExpenses(
  societyId: string,
  month: string,
  expenses: Array<{
    category: string
    amount: number
    description: string
  }>
): Promise<{
  message?: string
  count?: number
}> {
  return apiFetch("/expenses", {
    method: "POST",
    body: JSON.stringify({
      society_id: societyId,
      month,
      expenses,
    }),
  })
}

/* -------------------------------------------------------------------------- */
/* Statement generation                                                       */
/* -------------------------------------------------------------------------- */

export type GenerateStatementResponse = StatementResponse & {
  message: string
  expense_count: number
}

export async function generateStatement(
  societyId: string,
  month: string,
  totalFlats: number
): Promise<GenerateStatementResponse> {
  return apiFetch<GenerateStatementResponse>(
    "/statements/generate",
    {
      method: "POST",
      body: JSON.stringify({
        society_id: societyId,
        month,
        total_flats: totalFlats,
      }),
    }
  )
}

/* -------------------------------------------------------------------------- */
/* AI resident questions                                                      */
/* -------------------------------------------------------------------------- */

export type AskResponse = {
  message: string
  society_id: string
  month: string
  question: string
  answer: string
}

export async function askResidentQuestion(
  societyId: string,
  month: string,
  question: string
): Promise<AskResponse> {
  return apiFetch<AskResponse>(
    "/residents/ask",
    {
      method: "POST",
      body: JSON.stringify({
        society_id: societyId,
        month,
        resident_question: question,
      }),
    }
  )
}