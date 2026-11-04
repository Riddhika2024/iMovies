# 👥 Engineering Roles & Core Responsibilities

This document defines the team organization, functional disciplines, and responsibility matrix for the design, development, and ongoing maintenance of the **iMovies - Movie Ticket Booking Platform**.

---

## 1. Engineering Roles & Responsibilities Table

| Role Title | Primary Discipline | Core Responsibilities in iMovies | Primary Tech Stack |
| :--- | :--- | :--- | :--- |
| **Full-Stack Lead & Systems Architect** | System Architecture & Technical Direction | • Overall application architecture, technical roadmap, and MVC enforcement.<br>• Code reviews, PR approvals, and cross-layer integration.<br>• Data contract definition between frontend views and backend REST APIs.<br>• System resilience and performance optimization. | React 18, Node.js, Express, MongoDB, Socket.IO |
| **Frontend Engineer & UI/UX Specialist** | User Interface & Experience Design | • Implementation of the Amazon Prime Video dark aesthetic design system.<br>• Responsive 5-column catalog grid, category rails, and billboard spotlight.<br>• Interactive real-time seat selection map with tier color coding.<br>• Code-splitting (`React.lazy` / `Suspense`), confetti animations, and toasts. | React (Vite), Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend & API Engineer** | Server-Side Engineering & REST Services | • Express.js REST API routes and business logic controller orchestration.<br>• JWT authentication, password hashing (`bcryptjs`), and RBAC middlewares.<br>• TMDB multi-page catalog synchronization and movie/theatre CRUD endpoints.<br>• Error handling middleware and standard API response envelope formatting. | Node.js, Express.js, JWT, bcryptjs, REST APIs |
| **Database Administrator & Data Architect** | Data Persistence & Concurrency Rules | • Mongoose ODM schemas, compound indexes, and validation rules.<br>• In-memory MongoDB fallback configuration (`mongodb-memory-server`).<br>• Concurrency handling for 10-minute temporary seat locking (TTL).<br>• Automated seed scripts generating 26+ blockbusters and 520 show schedules. | MongoDB, Mongoose ODM, MongoMemoryServer |
| **Real-Time Systems & Payment Integrator** | WebSockets & Financial Transactions | • Socket.IO bi-directional WebSocket rooms for live seat locking.<br>• 5-step Razorpay Test-Mode integration (UPI, QR, Cards, NetBanking).<br>• Server-side HMAC-SHA256 signature verification and refund automation.<br>• Nodemailer HTML ticket dispatch and 1-click WhatsApp message formatting. | Socket.IO, Razorpay SDK, Nodemailer, Node-cron, Crypto |
| **DevOps, Security & QA Engineer** | Infrastructure, Deployment & Quality Assurance | • Production builds, Vite optimization, and bundle size monitoring.<br>• Vercel Single Page Application (SPA) rewrites and cloud routing rules.<br>• Environment variable hygiene (`.env.example` vs `.env`) and Git security.<br>• End-to-end 12-stage automated test verification suite (`test-verification.js`). | Vercel, Git, PowerShell, Bash, Node.js Test Harness |

---

## 2. Feature Responsibility Matrix (RACI Model)

The RACI model classifies each role's involvement across the core features of the iMovies platform:
- **R - Responsible**: The role that conducts the actual implementation work.
- **A - Accountable**: The role with final approval and ownership of the deliverable.
- **C - Consulted**: The role that provides architectural or technical input.
- **I - Informed**: The role updated on progress and deployment status.

| Feature / Module | Full-Stack Lead | Frontend Specialist | Backend Engineer | Data Architect | Real-Time / Payment | DevOps & QA |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **JWT Authentication & RBAC** | **A** | R | R | C | I | C |
| **Movie Catalog & TMDB Multi-Page Sync** | **A** | R | R | R | I | I |
| **Cinema Theatre & Show Scheduling** | **A** | C | R | R | I | I |
| **Interactive Seat Map & TTL Lock** | **A** | R | C | R | R | I |
| **Socket.IO Live Seat Sync** | **A** | R | C | I | R | C |
| **Razorpay Checkout & HMAC Verification** | **A** | R | R | I | R | C |
| **Digital Tickets, Nodemailer & WhatsApp** | **A** | R | C | I | R | I |
| **Admin Dashboard & Gateway Refunds** | **A** | R | R | C | R | I |
| **In-Memory MongoDB & Seed Harness** | **A** | I | C | R | I | C |
| **Production Build, Vercel SPA & CI/CD** | **A** | C | I | I | I | R |
| **12-Stage Test Verification Suite** | **A** | I | R | C | R | R |

---

## 3. Engineering Workflow & Contribution Standards

### 3.1 Git Branching Model
- **`main`**: Production-ready branch. Deployed automatically to Vercel and production environments.
- **`develop`**: Integration branch for active sprint deliverables.
- **`feature/<feature-name>`**: Isolated feature branches branched off `develop`.
- **`hotfix/<fix-name>`**: Emergency fixes branched directly off `main`.

### 3.2 Commit Message Standards (Conventional Commits)
All team members must adhere to conventional commit conventions:

```bash
<type>(<scope>): <short imperative description>
```

- **`feat`**: A new user-facing feature (e.g., `feat(catalog): add 5-column grid and TMDB sync`)
- **`fix`**: A bug fix (e.g., `fix(deployment): add Vercel SPA rewrites and configurable API URL`)
- **`docs`**: Documentation changes (e.g., `docs(architecture): add MVC implementation and ER diagrams`)
- **`style`**: Code formatting or UI styling without logic alteration
- **`refactor`**: Code refactoring that neither fixes a bug nor adds a feature
- **`test`**: Adding or modifying test scripts (e.g., `test(backend): add 12-stage test verification`)
- **`chore`**: Build system, dependency updates, or git configuration

### 3.3 Security & Secret Management Protocols
1. **Never Commit Secrets**: Never commit `.env` or files containing live API credentials, personal access tokens (PAT), or JWT secrets.
2. **Environment Variable Parity**: Always maintain [`server/.env.example`](file:///C:/Users/Riddhika%20Verma/.gemini/antigravity/scratch/iMovies/server/.env.example) with sanitized placeholders whenever introducing new environment variables.
3. **Automated Verification**: Before submitting a PR or merging to `main`, run `node test-verification.js` in the backend and `npm run build` in the frontend to guarantee zero compilation errors.
