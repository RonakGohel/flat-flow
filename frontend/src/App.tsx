import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/resident" replace />} />

        {/* Resident */}
        <Route element={<ResidentLayout />}>
          <Route path="/resident" element={<Overview />} />
          <Route path="/resident/statement" element={<Statement />} />
          <Route path="/resident/history" element={<History />} />
          <Route path="/resident/ask" element={<Ask />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/expenses" element={<Expenses />} />
          <Route path="/admin/documents" element={<Documents />} />
          <Route path="/admin/flats" element={<Flats />} />
          <Route path="/admin/validation" element={<Validation />} />
          <Route path="/admin/statements" element={<Statements />} />
          <Route path="/admin/publish" element={<Publish />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App