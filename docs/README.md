# Documentation Index - Admin Manga v3

**Last Updated**: 2025-12-21 | **Maintained by**: Docs Manager

Welcome to the Admin Manga v3 documentation. This directory contains comprehensive guides for developers, architects, and team members.

---

## Quick Start for Different Roles

### I'm a Developer
Start here to understand the codebase and development standards:

1. **[Code Standards](./code-standards.md)** - How to write code
   - File naming conventions
   - Component patterns
   - Code style rules (ESLint)
   - Common patterns and anti-patterns

2. **[Codebase Summary](./codebase-summary.md)** - Understanding the structure
   - Directory layout
   - Key components
   - Development workflow commands

3. **[API Admin Documentation](./API_ADMIN_DOCUMENTATION.md)** - Backend API reference
   - Authentication endpoints
   - CRUD operations
   - Response formats

### I'm a New Team Member
Start here for the big picture:

1. **[Project Overview & PDR](./project-overview-pdr.md)** - What are we building?
   - Project vision and scope
   - Functional requirements
   - Phases and roadmap
   - Success metrics

2. **[Codebase Summary](./codebase-summary.md)** - How is it organized?
   - Directory structure
   - Technology stack
   - Key files and components

3. **[Code Standards](./code-standards.md)** - Development guidelines

### I'm an Architect
Focus on design and decisions:

1. **[System Architecture](./system-architecture.md)** - How is it designed?
   - Architecture layers
   - Layout system
   - Component hierarchy
   - Data flows
   - Design decisions with rationale

2. **[Project Overview & PDR](./project-overview-pdr.md)** - Requirements context
   - Functional and non-functional requirements
   - Constraints
   - Technical decisions

### I'm Doing Code Review
Use this checklist:

1. **[Code Standards](./code-standards.md)** - Verification checklist
2. **[System Architecture](./system-architecture.md)** - Design consistency
3. **[Project Overview & PDR](./project-overview-pdr.md)** - Requirement compliance

---

## Documentation Files

### Core Documentation

#### [project-overview-pdr.md](./project-overview-pdr.md)
**Scope**: Comprehensive project requirements and roadmap
- Project vision, scope, and users
- 8 Functional Requirements (detailed)
- 6 Non-Functional Requirements
- Phase-based roadmap (Phase 01 → Phase 06+)
- Success metrics
- Testing strategy
- Risk assessment
- Deployment strategy

**Use when**: Understanding project scope, verifying requirements, planning phases.

#### [codebase-summary.md](./codebase-summary.md)
**Scope**: Current codebase structure and state
- Directory structure with all files
- Key components and composables
- Technology stack overview
- Development workflow commands
- Configuration files
- Current implementation status
- Recent changes (Phase 05)

**Use when**: Onboarding, understanding file organization, checking what exists.

#### [code-standards.md](./code-standards.md)
**Scope**: Development standards and coding patterns
- Code style rules (ESLint enforcement)
- TypeScript conventions
- File naming standards
- Vue component patterns
- Auto-imports reference
- Nuxt UI component usage
- Layout system implementation
- Composables patterns
- Security patterns
- Code quality checklist

**Use when**: Writing code, doing code reviews, learning patterns.

#### [system-architecture.md](./system-architecture.md)
**Scope**: Technical architecture and design decisions
- System architecture overview
- Layout system architecture
- Component hierarchy
- State management patterns
- Routing architecture
- Data flows
- Architectural decisions with rationale
- Security considerations
- Performance optimizations
- Deployment architecture

**Use when**: Architecture review, understanding design decisions, proposing changes.

#### [API_ADMIN_DOCUMENTATION.md](./API_ADMIN_DOCUMENTATION.md)
**Scope**: Backend API endpoints reference
- Authentication endpoints
- Resource endpoints (manga, users, chapters, etc.)
- Request/response formats
- Error responses
- Permissions and access control

**Use when**: Integrating frontend with backend, understanding API contract.

### Generated Files

#### [project-roadmap.md](./project-roadmap.md)
**Scope**: Phase timeline and milestone planning
- Phase breakdown
- Timeline estimates
- Deliverables per phase
- Dependencies

**Use when**: Planning sprints, tracking progress.

---

## Documentation Structure

```
docs/
├── README.md (this file)
├── project-overview-pdr.md         # START: Project scope & requirements
├── codebase-summary.md             # Understanding structure
├── code-standards.md               # Development rules
├── system-architecture.md          # Design decisions
├── API_ADMIN_DOCUMENTATION.md      # Backend API reference
└── project-roadmap.md              # Timeline & phases
```

---

## Common Tasks

### "How do I set up the project?"
1. See CLAUDE.md for package manager info
2. See codebase-summary.md → Development Workflow section

### "What are the code style rules?"
1. See code-standards.md → Code Style Rules section
2. Run `pnpm lint` to verify

### "How do I create a new component?"
1. See code-standards.md → Vue Component Patterns section
2. See codebase-summary.md → Key Components section for examples

### "What are we building?"
1. See project-overview-pdr.md → Project Vision section
2. See project-overview-pdr.md → Functional Requirements section

### "What's the current status?"
1. See project-overview-pdr.md → Development Phases section
2. See codebase-summary.md → Current Implementation Status section

### "How is authentication implemented?"
1. See system-architecture.md → State Management Architecture section
2. See code-standards.md → Composables Pattern section
3. See codebase-summary.md → Auth Flow section

### "How do I add a new page?"
1. See codebase-summary.md → Routing section
2. See code-standards.md → Routing Conventions section
3. Create file in `app/pages/` with layout meta if needed

### "What's the layout system?"
1. See system-architecture.md → Layout System (Phase 05) section
2. See code-standards.md → Layout System section

### "How do I integrate with the API?"
1. See API_ADMIN_DOCUMENTATION.md for endpoints
2. See code-standards.md → API Integration Pattern section
3. Future: See deployment-guide.md for environment setup

---

## Documentation Maintenance

### Updating Documentation

When making changes:
1. Update relevant documentation file(s)
2. Update "Last Updated" date at top of file
3. Add entry to version/changelog (if applicable)
4. Cross-check references in other docs
5. Commit with clear message: `docs: update [section] for [reason]`

### Adding New Documentation

Structure:
1. Add clear filename (lowercase, hyphens, descriptive)
2. Include header: title, last updated, scope
3. Add to this README.md index
4. Cross-link from related docs
5. Include "Related Documentation" section

### Review Before Publishing

- [ ] Grammar/spelling checked
- [ ] Code examples verified against codebase
- [ ] File paths are absolute and correct
- [ ] Links between docs are valid
- [ ] Terminology consistent with other docs
- [ ] Date format consistent (YYYY-MM-DD)
- [ ] All sections have clear purpose

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-21 | Initial documentation set for Phase 05 Layout Separation |

---

## Quick Links

**Development**:
- Framework: [Nuxt](https://nuxt.com/)
- UI: [Nuxt UI](https://ui.nuxt.com/)
- Language: [TypeScript](https://www.typescriptlang.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Icons: [Iconify](https://iconify.design/)

**Project Files**:
- Main Config: [nuxt.config.ts](../nuxt.config.ts)
- App Config: [app.config.ts](../app/app.config.ts)
- TypeScript: [tsconfig.json](../tsconfig.json)
- ESLint: [.eslintrc.json](../.eslintrc.json)
- Package Manager: [pnpm](https://pnpm.io/)

---

## Support

For questions or issues:

1. **Development questions**: Check relevant doc section or code comments
2. **Code style questions**: See code-standards.md
3. **Architecture questions**: See system-architecture.md
4. **Requirements questions**: See project-overview-pdr.md
5. **API integration**: See API_ADMIN_DOCUMENTATION.md

---

**Maintained by**: Docs Manager | **Last Updated**: 2025-12-21
