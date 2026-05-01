# Backend Prompt: Add Inquiry Intake And Admin Management

Update `portfolio-app-be` to support the restored public inquiry form in `portfolio-app-fe`.

Context:
- Backend stack: NestJS + Prisma + PostgreSQL
- Existing API base: `http://localhost:3001/api`
- Existing validation style: DTOs with `class-validator`, global whitelist, error responses shaped like existing auth/admin endpoints
- Frontend currently submits `POST /api/inquiry` to its own Next.js route, and that route proxies to `POST /api/inquiries` on the backend

Goal:
- Add a real backend inquiry intake endpoint so the public portfolio contact form can submit successfully
- Add the admin inquiry inbox endpoints needed by the new frontend admin area
- Do not add unrelated CMS, messaging, or marketing features

Required API:
- `POST /api/inquiries`
- Public endpoint, no auth required
- Request body:
  - `name`: required, trimmed, min 2, max 120
  - `email`: required, valid email, trimmed, max 320
  - `message`: required, trimmed, min 24, max 5000
- Success response: `201`
  - `{ id, receivedAt }`
  - `id` should be the created inquiry id
  - `receivedAt` should be the created timestamp in ISO format
- Validation errors should follow the existing backend shape as closely as possible:
  - `{ message, errors: [{ path: string[], message: string }] }`

Required admin API:
- All routes below require Bearer access token with `ADMIN` role
- `GET /api/admin/inquiries`
  - returns inquiries sorted by status priority and newest first inside each status group
- `GET /api/admin/inquiries/:id`
- `PATCH /api/admin/inquiries/:id`
  - supports partial updates
  - accepted fields:
    - `status?: "NEW" | "IN_REVIEW" | "RESOLVED" | "ARCHIVED"`
    - `isRead?: boolean`
    - `adminNotes?: string` trimmed, max 5000, allow empty string to clear
- `DELETE /api/admin/inquiries/:id`
- Optional but useful: include inquiry counts on the existing admin dashboard only if it fits your current dashboard implementation cleanly. Do not block this task on dashboard changes.

Suggested inquiry response shape:
- `id`
- `name`
- `email`
- `message`
- `status`
- `isRead`
- `adminNotes`
- `createdAt`
- `updatedAt`

Persistence:
- Add a Prisma model for inquiries
- Suggested fields:
  - `id String @id @default(uuid())`
  - `name String`
  - `email String`
  - `message String`
  - `status InquiryStatus @default(NEW)`
  - `isRead Boolean @default(false)`
  - `adminNotes String?`
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
- Add a Prisma enum:
  - `InquiryStatus { NEW IN_REVIEW RESOLVED ARCHIVED }`
- Generate and include the Prisma migration

NestJS implementation:
- Add inquiry DTOs, controller, and service
- Register the module in the app
- Add Swagger decorators for the request/response contract
- Reuse existing backend validation conventions

Out of scope for this change:
- Admin inquiry management UI
- Email sending
- Background jobs
- Spam detection
- File uploads

Acceptance criteria:
- `POST /api/inquiries` works from the frontend form
- `GET /api/admin/inquiries` powers the admin inquiry list
- `GET /api/admin/inquiries/:id` powers the admin inquiry detail screen
- `PATCH /api/admin/inquiries/:id` updates status, read state, and notes
- `DELETE /api/admin/inquiries/:id` removes an inquiry
- Validation errors map cleanly back to individual frontend fields
- Swagger docs show the endpoint and payload
- Prisma migration is included
