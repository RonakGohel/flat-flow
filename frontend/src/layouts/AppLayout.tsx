$pages = @(
    "src/pages/resident/Overview.tsx",
    "src/pages/resident/Statement.tsx",
    "src/pages/resident/History.tsx",
    "src/pages/resident/Ask.tsx",
    "src/pages/admin/Dashboard.tsx",
    "src/pages/admin/Expenses.tsx",
    "src/pages/admin/Documents.tsx",
    "src/pages/admin/Flats.tsx",
    "src/pages/admin/Validation.tsx",
    "src/pages/admin/Statements.tsx",
    "src/pages/admin/Publish.tsx"
)

foreach ($page in $pages) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($page)
    @"
export default function $name() {
  return <div className="p-8">$name</div>
}
"@ | Set-Content $page
}