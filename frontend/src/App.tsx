import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom"

import { handleAuthCallback, isAuthenticated, login } from "@/lib/auth"

import AdminLayout from "@/layouts/AdminLayout"
import ResidentLayout from "@/layouts/ResidentLayout"

import Overview from "@/pages/resident/Overview"
import Statement from "@/pages/resident/Statement"
import History from "@/pages/resident/History"
import Ask from "@/pages/resident/Ask"

import Dashboard from "@/pages/admin/Dashboard"
import Expenses from "@/pages/admin/Expenses"
import Documents from "@/pages/admin/Documents"
import Flats from "@/pages/admin/Flats"
import Validation from "@/pages/admin/Validation"
import Statements from "@/pages/admin/Statements"
import Publish from "@/pages/admin/Publish"

function RequireAuth() {
  const authenticated = isAuthenticated()

  useEffect(() => {
    if (!authenticated) {
      void login()
    }
  }, [authenticated])

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-900">
            Redirecting to secure login…
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Connecting to FlatFlow authentication
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function completeLogin() {
      try {
        const authenticated = await handleAuthCallback()

        if (authenticated) {
          navigate("/resident", { replace: true })
          return
        }

        navigate("/", { replace: true })
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Authentication could not be completed."
        )
      }
    }

    void completeLogin()
  }, [navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6">
          <p className="text-sm font-semibold text-red-700">
            Authentication failed
          </p>

          <p className="mt-2 text-sm text-neutral-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/"
            }}
            className="mt-5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            Return to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-900">
          Completing secure login…
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/callback" element={<Callback />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Navigate to="/resident" replace />} />

          <Route element={<ResidentLayout />}>
            <Route path="/resident" element={<Overview />} />
            <Route path="/resident/statement" element={<Statement />} />
            <Route path="/resident/history" element={<History />} />
            <Route path="/resident/ask" element={<Ask />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/expenses" element={<Expenses />} />
            <Route path="/admin/documents" element={<Documents />} />
            <Route path="/admin/flats" element={<Flats />} />
            <Route path="/admin/validation" element={<Validation />} />
            <Route path="/admin/statements" element={<Statements />} />
            <Route path="/admin/publish" element={<Publish />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App