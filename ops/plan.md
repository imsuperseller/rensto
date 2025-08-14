# Rensto Project Plan - BMAD Method

## Sprint 1: Foundation (Current)

### Goals
- Deliver production-ready marketing site on Vercel
- Set up infrastructure with n8n + MongoDB + Postgres
- Create automation handoffs aligned to Airtable
- Establish security-first deployment

### Stories

#### STORY-001: Repository Foundation
**Tasks:**
- Initialize repo structure with config files
- Set up ESLint, Prettier, TypeScript configs
- Create CI/CD pipeline with GitHub Actions
- Establish security policies and gitignore

**Acceptance:** Clean repo, CI passing, no secrets exposed

#### STORY-002: Infrastructure Setup
**Tasks:**
- Create Docker Compose for n8n + Postgres + MongoDB
- Configure Cloudflare Tunnel without exposed ports
- Set up backup scripts to Icedrive
- Document infrastructure runbooks

**Acceptance:** Services run securely, backups automated

#### STORY-003: Marketing Site
**Tasks:**
- Scaffold Next.js 14 with app router
- Implement dark theme with GSAP animations
- Create all pages (Home, Offers, Process, Contact, Legal)
- Add SEO assets and accessibility

**Acceptance:** Lighthouse ≥95, AA compliant, CTAs work

#### STORY-004: n8n Automations
**Tasks:**
- Set up n8n MCP integration
- Create 5 core workflows (Leads, Projects, Finance, Assets, Contact)
- Validate workflows against Airtable views
- Document workflow specs

**Acceptance:** All workflows validated and enabled

## Sprint 2: Enhancement (Next)

### Goals
- Add advanced automation features
- Implement client portal foundation
- Enhance monitoring and analytics

### Stories

#### STORY-005: Advanced Automations
- Multi-step approval workflows
- Smart lead scoring
- Invoice generation from projects

#### STORY-006: Client Portal
- Authentication system
- Project status dashboard
- Document management

## Non-Goals
- Custom CRM (use Airtable)
- Payment processing (use Stripe Links)
- Complex user management

## Risks
- n8n MCP server availability
- Airtable API rate limits
- Cloudflare Tunnel stability

## Done Definition
- All acceptance criteria met
- Documentation complete
- CI/CD green
- Security scan passed
- Deployed to production
