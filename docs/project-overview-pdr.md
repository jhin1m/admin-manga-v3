# Project Overview & Product Development Requirements (PDR)

**Project**: Admin Manga v3 | **Last Updated**: 2025-12-22 | **Current Phase**: Phase 06 - Admin Dashboard

---

## Project Vision

Create a modern, user-friendly admin panel for managing manga content. The application allows administrators to:
- Authenticate securely
- View and manage manga titles
- Organize chapters and content
- Moderate user-generated content
- Monitor system statistics
- Manage site announcements

**Technology Stack**:
- Frontend: Nuxt 4 + Vue 3 + TypeScript
- UI Framework: Nuxt UI v4 (Tailwind CSS + Radix UI)
- Validation: Zod
- Testing: Vitest + @nuxt/test-utils
- Backend: Laravel (separate, see API_ADMIN_DOCUMENTATION.md)
- Package Manager: pnpm
- Deployment: TBD

---

## Project Scope

### In Scope
- Admin authentication (login/logout)
- Manga CRUD operations
- Chapter management
- User management
- Content moderation
- System statistics dashboard
- Dark/light theme support
- Unit and integration testing

### Out of Scope (V4+)
- Real-time notifications
- Advanced analytics
- Bulk data imports
- Third-party integrations
- Mobile app (web-responsive only)

---

## Target Users

1. **Site Administrators** - Full system access, user management
2. **Content Moderators** - Approve/edit manga, manage reports
3. **Content Creators** - Create/edit manga chapters (limited)

---

## Functional Requirements (FRs)

### FR-001: User Authentication
- **Description**: Admin users must log in with email/password
- **Acceptance Criteria**:
  - User enters email + password on login page
  - **Validation**: Email format and minimum password length (8 chars) enforced via Zod (Implemented Phase 03)
  - Backend validates credentials
  - System returns JWT token on success
  - Token persisted in localStorage
  - User info (name, email) displayed in header
  - Logout clears token and redirects to login page
  - **API Client**: $fetch wrapper with configurable baseURL and error handling (Implemented Phase 01)
  - **Loading State**: Visual feedback during authentication (Implemented Phase 03)
  - **Route Protection**: Unauthenticated users redirected from admin routes to /login (Implemented Phase 04)
  - **Guest Protection**: Authenticated users redirected from /login to dashboard (Implemented Phase 04)
- **Priority**: P0 (Critical)
- **Phase**: Phase 01-05 (Completed)

### FR-002: Dashboard
- **Description**: Display overview of system statistics
- **Acceptance Criteria**:
  - Sidebar navigation with collapsible state (Implemented Phase 06)
  - Keyboard shortcut 'C' for sidebar toggle (Implemented Phase 06)
  - Total users count ✓
  - Total manga count ✓
  - Total chapters count ✓
  - Total companions (pets) count ✓
  - Loading and error states for data fetching ✓
- **Priority**: P1 (High)
- **Phase**: Phase 06 (Completed)

### FR-003: Manga Management
- **Description**: Admins manage manga catalog
- **Acceptance Criteria**:
  - List all manga with pagination
  - View manga details
  - Create new manga
  - Edit manga information
  - Delete manga (with confirmation)
  - Search/filter by title, status, etc.
  - Upload manga cover image
- **Priority**: P1 (High)
- **Phase**: Phase 04

### FR-004: Chapter Management
- **Description**: Manage chapters within manga
- **Acceptance Criteria**:
  - Add chapter to manga
  - Set chapter order
  - Upload chapter images
  - Reorder chapters (drag-and-drop, future)
  - Delete chapter(s)
  - Bulk operations
- **Priority**: P1 (High)
- **Phase**: Phase 04

### FR-005: User Management
- **Description**: Admin manages site users
- **Acceptance Criteria**:
  - List all users with pagination
  - View user details
  - Edit user information
  - Delete user account
  - Assign roles/permissions
- **Priority**: P2 (Medium)
- **Phase**: Phase 06+

### FR-006: Content Moderation
- **Description**: Review and moderate user reports
- **Acceptance Criteria**:
  - View chapter reports (broken images, etc.)
  - Filter/sort reports
  - Approve or reject corrections
  - Delete report entries
- **Priority**: P2 (Medium)
- **Phase**: Phase 07+

### FR-007: Theme Toggle
- **Description**: Support light/dark mode
- **Acceptance Criteria**:
  - Color mode button in header
  - Remembers user preference
  - All components support both themes
  - Smooth transition
- **Priority**: P3 (Nice-to-have)
- **Phase**: Phase 05 (Implemented)

### FR-008: Responsive Design
- **Description**: UI works on desktop and tablet
- **Acceptance Criteria**:
  - Mobile-friendly navigation
  - Tables scroll on small screens
  - Touch-friendly buttons
  - No horizontal scrolling
- **Priority**: P1 (High)
- **Phase**: All phases

---

## Non-Functional Requirements (NFRs)

### NFR-001: Performance
- **Requirement**: Dashboard loads in < 2 seconds (first load)
- **Measurement**: Lighthouse score >= 85
- **Implementation**: Code splitting, lazy loading, API caching

### NFR-002: Accessibility
- **Requirement**: WCAG 2.1 AA compliance
- **Measurement**: Automated axe/Pa11y audit passes
- **Implementation**: Semantic HTML, ARIA labels, keyboard navigation

### NFR-003: Security
- **Requirement**: Protect against OWASP Top 10
- **Measurement**: Security audit passes
- **Implementation**:
  - XSS: Template auto-escaping
  - CSRF: Backend token validation
  - Authentication: JWT tokens, refresh rotation
  - Authorization: Route middleware + backend checks

### NFR-004: Reliability
- **Requirement**: 99.5% uptime
- **Measurement**: Monitoring via uptime tracker
- **Implementation**: Error boundaries, fallback UI

### NFR-005: Maintainability
- **Requirement**: Code follows standards, easy to understand
- **Measurement**: Code review approval, linting passes
- **Implementation**: TypeScript, ESLint, documentation

### NFR-006: Scalability
- **Requirement**: Support 1000+ concurrent users
- **Measurement**: Load testing >= 1000 concurrent
- **Implementation**: Optimized API calls, caching, CDN

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Nuxt 4 | Server-side rendering capable |
| UI Library | Vue 3 | Composition API |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first, via Nuxt UI |
| Components | Nuxt UI v4 | Pre-built, accessible |
| Icons | Iconify | Lucide + Simple Icons |
| State Mgmt | Nuxt useState | Simple, server-friendly |
| HTTP | $fetch | Built-in, no axios needed |
| Testing | Vitest | Unit/integration tests |
| Package Mgr | pnpm | Workspace-ready |
| Backend | Laravel | REST API (separate repo) |

### Architectural Decisions

1. **Layouts Pattern**: Separate admin/auth layouts (Phase 05)
2. **Composables**: Reusable logic via `useAuth()`, etc.
3. **File-based Routing**: Auto-generated routes
4. **Component-driven**: Nuxt UI components for consistency
5. **Client-side Auth**: localStorage token (upgrade Phase 02)

---

## Development Phases

### Phase 01 - Runtime Config & API Setup (Completed)
- **Deliverables**:
  - Runtime config for API base URL ✓
  - API response/error TypeScript interfaces ✓
  - useApi() utility with standardized error handling ✓
  - .env support for API configuration ✓

### Phase 05 - Layout Separation (Completed)
- **Deliverables**:
  - Default layout with header/footer ✓
  - Auth layout (minimal) ✓
  - Login page stub ✓
  - useAuth() composable stub ✓
  - App.vue simplified to use NuxtLayout ✓

- **Timeline**: 2025-12-21
- **Status**: Completed

### Phase 02 - Auth Implementation (Next)
- **Deliverables**:
  - Full login flow (email/password)
  - JWT token management
  - Token refresh logic
  - Route protection middleware
  - useAuth() full implementation

- **Estimated Timeline**: 1-2 weeks
- **Dependencies**: Phase 05 (layouts)

### Phase 03 - Login Page UI
- **Deliverables**:
  - Login form with validation
  - Error/success messages
  - Remember me checkbox (future)
  - Forgot password link (future)
  - Loading states

- **Estimated Timeline**: 1 week
- **Dependencies**: Phase 02 (auth composable)

### Phase 04 - Admin Dashboard (Completed)
- **Deliverables**:
  - Dashboard overview page ✓
  - Statistics widget ✓
  - Navigation menu config ✓
  - Sidebar layout implementation ✓

- **Timeline**: 2025-12-22
- **Status**: Completed
- **Dependencies**: Phase 02-03 (auth + UI)

### Phase 06 - Sidebar & Professional Layout (Completed)
- **Deliverables**:
  - Collapsible/Resizable sidebar ✓
  - Keyboard shortcuts ('C') ✓
  - Centralized navigation config ✓
  - Integrated theme toggle & user logout in sidebar ✓

- **Timeline**: 2025-12-22
- **Status**: Completed
---

## Success Metrics

### User Metrics
- Login success rate >= 99%
- Page load time < 2 seconds
- User can complete task in <= 3 clicks (80% of tasks)

### Quality Metrics
- Test coverage >= 80%
- Lighthouse score >= 85
- Zero critical security vulnerabilities
- ESLint passes on all commits

### Business Metrics
- Zero data loss incidents
- 99.5% uptime
- Support ticket resolution < 24 hours

---

## Testing Strategy

### Unit Tests
- Composables: `useAuth()`, API calls
- Utilities: Helper functions
- Target Coverage: >= 80%

### Integration Tests
- Login flow end-to-end
- Manga CRUD operations
- Authentication middleware

### E2E Tests
- User journey: login → dashboard → logout
- Data management workflows
- Error recovery

### Manual Testing
- Cross-browser: Chrome, Firefox, Safari
- Devices: Desktop, Tablet, Mobile
- Accessibility: Keyboard navigation, screen readers

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| API unavailable | High | Medium | Implement error boundaries + offline mode |
| XSS vulnerability | Critical | Low | Template escaping + security audit |
| Performance degradation | High | Medium | Load testing + optimization |
| Token expiration | Medium | High | Implement refresh token flow |
| Browser compatibility | Medium | Low | Cross-browser testing |

---

## Deployment Strategy

### Development Environment
- Local: `pnpm dev` (http://localhost:3000)
- HMR enabled for fast feedback

### Staging Environment
- TBD (via CI/CD)
- Test API endpoint (staging backend)
- Smoke tests on deployment

### Production Environment
- TBD (cloud hosting)
- Production API endpoint
- Monitoring + error tracking
- CDN for static assets

---

## Constraints & Assumptions

### Constraints
- Must use Nuxt 4 (not Next.js, etc.)
- Must use pnpm (project-wide standard)
- API at http://127.0.0.1:8000 (development)
- Vietnamese language support required

### Assumptions
- Backend API follows REST conventions
- JWT tokens used for authentication
- Users have modern browsers (ES2020+)
- Network connection available (no offline support yet)

---

## Maintenance & Support

### Bug Fix SLA
- Critical (data loss): 1 hour
- High (feature broken): 4 hours
- Medium (partial functionality): 1 day
- Low (cosmetic): 1 week

### Support Channels
- GitHub Issues (bugs/features)
- Documentation (questions)
- Code reviews (quality)

### Knowledge Transfer
- Code documentation (code-standards.md, etc.)
- Architecture docs (system-architecture.md)
- API docs (API_ADMIN_DOCUMENTATION.md)
- Runbook for deployments (TBD)

---

## Future Roadmap (V4+)

1. **Internationalization (i18n)** - Multi-language support
2. **Real-time Notifications** - WebSocket events
3. **Advanced Analytics** - Custom reports
4. **Bulk Operations** - CSV import/export
5. **Mobile App** - React Native version
6. **API Webhooks** - External integrations
7. **Audit Logging** - Track all admin actions
8. **SSO Integration** - OAuth2/SAML support

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-21 | Docs Manager | Initial PDR - Phase 01 & 05 Completion |
| 1.1 | 2025-12-21 | Docs Manager | Update Phase 02, 03, 04 - Auth & Middleware |

---

## Related Documentation
- [codebase-summary.md](./codebase-summary.md) - Directory structure overview
- [code-standards.md](./code-standards.md) - Development standards
- [system-architecture.md](./system-architecture.md) - Technical architecture
- [API_ADMIN_DOCUMENTATION.md](./API_ADMIN_DOCUMENTATION.md) - Backend API reference
- [CLAUDE.md](../CLAUDE.md) - Project workflows & guidelines
