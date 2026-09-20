# FlatFlow

> A serverless, AI-powered society management platform for tracking expenses, processing bills, and keeping residents informed.

FlatFlow is a full-stack web application that helps residential societies manage their finances transparently. Administrators can upload bills, track expenses, generate statements, and publish them to residents. Residents get a clear breakdown of where their maintenance money goes, with an AI assistant that answers spending questions using verified data.

---

## Features

### For Administrators
- **Dashboard** — Overview of monthly expenses, metrics, and society health.
- **Expense Management** — Add, edit, and categorise society expenses (electricity, water, maintenance, security, cleaning, lift, etc.).
- **Flats Management** — Manage society flats and total flat count.
- **Validation** — Validate expense data before publishing.
- **Statements** — Generate monthly financial statements for residents.
- **Publish** — Publish statements to residents, making them visible in the resident portal.

### For Residents
- **Overview** — Visual breakdown of monthly expenses with charts and comparisons.
- **Maintenance Hero** — Highlight of the current month’s maintenance spend.
- **Expense Breakdown** — Category-wise spending with evidence cards.
- **What Changed** — Month-over-month comparison showing key changes.
- **Statement** — View detailed monthly statements published by the admin.
- **History** — Browse past months’ expense history.
- **Ask AI** — Chat with an AI assistant (powered by AWS Bedrock / Claude) that answers questions about expenses using **only verified DynamoDB data** — it cannot invent numbers.

### Platform-Wide
- **Role-based access** — Separate admin and resident interfaces, enforced via Cognito groups.
- **Secure authentication** — OAuth 2.0 with PKCE via AWS Cognito.
- **Responsive design** — Mobile-friendly UI with sidebar and mobile navigation.
- **Dark / light theme** — Theme provider with system preference detection.

---

## Architecture

FlatFlow follows a **serverless, event-driven architecture** on AWS:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│   Admin Portal  │  Resident Portal  │  Cognito Auth (PKCE)  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (API Gateway)
┌──────────────────────────▼──────────────────────────────────┐
│                     AWS API Gateway                          │
│   Cognito Authorizer → Lambda Proxy Integration              │
└──┬────────┬────────┬────────┬────────┬────────┬─────────────┘
   │        │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Post  │ │Upload│ │Proce-| |      | |      | |      |
|      | |      | |ss    │ │Confi-| |      | |      |
|      | |      | |      | |m     │ │Gener-│ │AI    │
│Expen-│ │Bill  │ │Bill  │ │Bill  │ │ate   │ │Chat  │
│ses   │ │      │ │      │ │      │ │State-│ │      │
│      │ │      │ │      │ │      │ │ment  │ │      │
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   │        │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────┐
│                        AWS Services                         │
│   DynamoDB (single-table)  │  S3 (bill storage)             │
│   Textract (OCR)           │  Bedrock / Claude (AI)         │
└─────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **Single-table DynamoDB design** — All entities (expenses, drafts, statements) share one table with composite keys (`PK = SOCIETY#<id>`, `SK = EXPENSE#<month>#<category>#<id>`).
- **One Lambda per API action** — Each endpoint is its own Lambda function for granular permissions and scaling.
- **Cognito groups for RBAC** — `admin` and `resident` groups are checked in every Lambda via `require_group()`.
- **PKCE OAuth flow** — The frontend never handles client secrets; code verifier/challenge is stored in `localStorage`.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| shadcn/ui | Component library (Radix-based) |
| Tailwind CSS 4 | Utility-first styling |
| React Router 7 | Client-side routing |
| TanStack Query 5 | Server state management |
| React Hook Form + Zod | Form handling & validation |
| Recharts | Expense charts & visualisations |
| Motion (Framer Motion) | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| AWS Lambda (Python 3.x) | Serverless compute |
| AWS API Gateway | REST API & Cognito authorizer |
| Amazon DynamoDB | Single-table NoSQL database |
| Amazon S3 | Bill / document storage |
| AWS Cognito | User pools, groups, OAuth 2.0 + PKCE |

### DevOps & Testing
| Technology | Purpose |
|---|---|
| pytest | Lambda unit tests |
| moto | AWS service mocking |
| ESLint + Prettier | Frontend linting & formatting |
| Python `boto3` | AWS SDK for Python |

---

## Project Structure

```
flat-flow/
├── frontend/                    # React + Vite application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin-only components
│   │   │   │   ├── ExpenseTable.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── PublishStatus.tsx
│   │   │   │   ├── UploadBill.tsx
│   │   │   │   └── ValidationAlert.tsx
│   │   │   ├── resident/        # Resident-only components
│   │   │   │   ├── AIEntry.tsx
│   │   │   │   ├── EvidenceCard.tsx
│   │   │   │   ├── ExpenseBreakdown.tsx
│   │   │   │   ├── MaintenanceHero.tsx
│   │   │   │   ├── MonthComparison.tsx
│   │   │   │   └── WhatChanged.tsx
│   │   │   ├── shared/          # Shared components
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── MonthSelector.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   └── theme-provider.tsx
│   │   ├── data/                # Static data / constants
│   │   ├── layouts/             # Route layouts
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   └── ResidentLayout.tsx
│   │   ├── lib/                 # Utilities
│   │   │   └── auth.ts          # Cognito PKCE auth helpers
│   │   ├── pages/
│   │   │   ├── admin/           # Admin pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Documents.tsx
│   │   │   │   ├── Expenses.tsx
│   │   │   │   ├── Flats.tsx
│   │   │   │   ├── Publish.tsx
│   │   │   │   ├── Statements.tsx
│   │   │   │   └── Validation.tsx
│   │   │   └── resident/        # Resident pages
│   │   │       ├── Ask.tsx
│   │   │       ├── History.tsx
│   │   │       ├── Overview.tsx
│   │   │       └── Statement.tsx
│   │   ├── App.tsx              # Router & auth guards
│   │   ├── index.css            # Tailwind entry
│   │   └── main.tsx             # React entry
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── services/
│       └── s3_service.py        # S3 upload helper (local dev)
│
├── lambda/                      # AWS Lambda functions
│   ├── admin_api/               # Admin API aggregator
│   ├── ai_chat/                 # AI chat (Bedrock + Claude)
│   ├── confirm_bill/            # Confirm OCR draft → expense
│   ├── generate_statement/      # Generate monthly statement
│   ├── post_expenses/           # Create expenses
│   ├── process_bill/            # OCR processing (Textract)
│   ├── resident_api/            # Resident API aggregator
│   └── upload_bill/             # Upload bill to S3
│
├── tests/                       # Python tests
│   ├── __init__.py
│   └── test_lambda_post_expenses.py
│
├── .gitignore
├── .vscode/
├── requirements.txt             # Runtime deps (boto3)
├── requirements-dev.txt         # Dev deps (moto, pytest)
├── s3-lambda-policy.json        # IAM policy for S3 access
└── package.json                 # Root (empty / workspace placeholder)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 and **npm** ≥ 10
- **Python** ≥ 3.11
- **AWS account** with access to:
  - Cognito (user pool + app client)
  - DynamoDB
  - S3
  - Lambda
  - API Gateway
  - Textract
  - Bedrock (Claude model access)
- **AWS CLI** configured with appropriate credentials

### 1. Clone the Repository

```bash
git clone https://github.com/RonakGohel/flat-flow.git
cd flat-flow
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (or update `src/lib/auth.ts`) with your Cognito details:

```env
VITE_COGNITO_DOMAIN=https://<your-domain>.auth.<region>.amazoncognito.com
VITE_COGNITO_CLIENT_ID=<your-client-id>
VITE_API_BASE_URL=https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>
```

> **Note:** The current `auth.ts` hardcodes the Cognito domain, client ID, and redirect URI. Replace these with your own values or migrate them to environment variables.

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Backend / Lambda Setup

Install Python dependencies:

```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt   # for testing
```

Each Lambda function in `lambda/` is self-contained. To deploy:

1. **Create the DynamoDB table** — Single table named `FlatFlow` with:
   - Partition key: `PK` (String)
   - Sort key: `SK` (String)

2. **Create the S3 bucket** — e.g. `flat-flow-bhakti2701` (or set the `BILL_BUCKET` environment variable).

3. **Attach the IAM policy** — Use `s3-lambda-policy.json` as a base for the Lambda execution role, granting `s3:PutObject` and `s3:GetObject` on your bucket.

4. **Set Lambda environment variables:**

   | Variable | Description | Default |
   |---|---|---|
   | `TABLE_NAME` | DynamoDB table name | `FlatFlow` |
   | `BILL_BUCKET` | S3 bucket for bills | `flat-flow-bhakti2701` |

5. **Deploy each Lambda** — Zip the function and upload via AWS CLI or the console. Ensure the API Gateway routes point to the correct function and that the Cognito authorizer is attached.

6. **Configure Cognito groups** — Create `admin` and `resident` groups in your user pool. Users in `admin` can access admin endpoints; `resident` users can access resident endpoints.

### 4. Running Tests

```bash
pytest tests/
```

Tests use `moto` to mock DynamoDB, so no real AWS resources are required.

---

## API Endpoints

All endpoints are exposed via API Gateway and require a valid Cognito ID token in the `Authorization` header.

### Admin Endpoints

| Method | Path | Lambda | Description |
|---|---|---|---|
| `POST` | `/expenses` | `post_expenses` | Create/upsert society expenses for a month |
| `POST` | `/bills/upload` | `upload_bill` | Upload a bill file to S3 (base64-encoded) |
| `POST` | `/bills/confirm` | `confirm_bill` | Confirm a draft into a verified expense |
| `POST` | `/statements/generate` | `generate_statement` | Generate a monthly statement |

### Resident Endpoints

| Method | Path | Lambda | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | `ai_chat` | Ask the AI assistant a question about expenses |

### Common Response Shape

```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  },
  "body": "{ ... }"
}
```

Errors return appropriate HTTP status codes (`400`, `403`, `404`, `500`) with a `message` field in the body.

---

## Authentication & Authorization

FlatFlow uses **AWS Cognito** with the **Authorization Code flow + PKCE**.

1. The frontend redirects the user to the Cognito Hosted UI.
2. After login, Cognito redirects back to `/callback` with an authorization code.
3. The frontend exchanges the code for tokens (ID token, access token, refresh token) using the stored PKCE verifier.
4. The ID token is stored in `localStorage` and sent as a `Bearer` token on API requests.
5. API Gateway validates the token and passes claims to Lambda via `event.requestContext.authorizer.claims`.
6. Each Lambda calls `require_group(event, 'admin')` or `require_group(event, 'resident')` to enforce role-based access.

### Cognito Groups

| Group | Access |
|---|---|
| `admin` | Full access to admin endpoints (expenses, bills, statements) |
| `resident` | Read-only access to statements and AI chat |

---

## Testing

The project includes Python tests for Lambda functions using `pytest` and `moto`.

**What’s covered:**
- `test_lambda_post_expenses.py` — Validates input handling, DynamoDB writes, and error responses for the expense creation endpoint.

**Run tests:**

```bash
pytest tests/ -v
```

**Add new tests:**
Create a new file in `tests/` following the pattern `test_lambda_<function_name>.py`. Use `moto`’s `mock_dynamodb` to avoid hitting real AWS services.

---

## Deployment

### Frontend (Vite → Static Hosting)

```bash
cd frontend
npm run build
# Deploy the dist/ folder to S3 + CloudFront, Vercel, Netlify, or any static host
```

### Backend (Lambda)

Each Lambda is deployed independently. A typical workflow:

```bash
cd lambda/post_expenses
zip -r function.zip lambda_function.py
aws lambda update-function-code \
  --function-name FlatFlowPostExpenses \
  --zip-file fileb://function.zip
```

> **Tip:** Consider using the [AWS SAM](https://aws.amazon.com/serverless/sam/) or [Serverless Framework](https://www.serverless.com/) for infrastructure-as-code deployments.

### Environment Configuration

Ensure the following are set for each Lambda:
- `TABLE_NAME` → DynamoDB table name
- `BILL_BUCKET` → S3 bucket name

And for the frontend:
- Cognito domain, client ID, and API base URL.

---

## Contributing

Contributions are welcome! Here’s how to get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request.

Please ensure:
- Frontend code passes `npm run lint` and `npm run typecheck`.
- Backend changes include tests where applicable.
- Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (the repo already uses this style).

---
---

**FlatFlow** — transparent society finances, powered by serverless AI.
