# Rensto Executable Specification

## Web Application Spec

### Component Graph
```
App Layout
├── Header (logo, nav, CTA)
├── Pages
│   ├── Home (Hero + Features + CTA)
│   ├── Offers (Cards + Pricing Table)
│   ├── Process (Timeline + WIP Limits)
│   ├── Contact (Form + Info)
│   └── Legal (Privacy + Terms)
├── Footer (links, social)
└── Analytics (Rollbar stub)
```

### Design Tokens
```css
--background: #0B1318
--card: #111827
--text: #E5E7EB
--muted: #94A3B8
--accent1: #2F6A92
--accent2: #FF6536
--border: rgba(255,255,255,0.08)
--radius: 1rem
--shadow: 0 10px 30px rgba(0,0,0,0.25)
```

### GSAP Animations
- Fade-up: power3.out, 0.9s, stagger 0.08s
- Parallax: subtle on scroll
- Logo glow: CSS animation

### E2E Test Steps
1. Navigate to home → verify hero renders
2. Check all CTAs → verify env vars used
3. Navigate each page → verify content loads
4. Test contact form → verify validation
5. Check SEO meta → verify OG tags present
6. Run Lighthouse → verify score ≥95

## n8n Workflow Specs

### 1. Leads Daily Follow-ups
**Nodes:**
- Cron Trigger: 08:00 CT
- Airtable Get: Leads view "🔥 Active"
- Filter: next_action_at ≤ now
- Slack Send: #alerts channel
- Email Fallback: service@rensto.com

### 2. Projects In Progress Digest
**Nodes:**
- Cron Trigger: 09:00 CT
- Airtable Get: Projects view "🔨 In Progress"
- Sort: last_updated desc
- Format: HTML digest
- Slack + Email send

### 3. Finance Unpaid Invoices
**Nodes:**
- Cron Trigger: 09:15 CT
- Airtable Get: Finance view "📄 Unpaid"
- Calculate: days overdue
- Format: urgency levels
- Slack notify with mentions

### 4. Assets Renewals < 30d
**Nodes:**
- Cron Trigger: 07:45 CT
- Airtable Get: Assets view "Renewals < 30d"
- Enrich: owner, criticality, cost
- Sort: by renewal date
- Slack digest with action items

### 5. Contact Intake (Stub)
**Nodes:**
- Webhook Trigger: /webhook/contact
- Normalize: extract fields
- Dedupe: check existing by email
- Airtable Create: add to Leads
- Slack Notify: new lead alert

## Infrastructure Spec

### Docker Services
```yaml
postgres:15-alpine:
  - Port: internal only
  - Volume: ./data/postgres
  - Env: POSTGRES_DB=n8n

n8n:latest:
  - Port: internal only
  - Volume: ./data/n8n
  - Requires: N8N_ENCRYPTION_KEY

mongo:7:
  - Port: internal only
  - Volume: ./data/mongo
  - Auth: root user required
```

### Cloudflare Tunnel
```yaml
ingress:
  - hostname: n8n.rensto.com
    service: http://n8n:5678
  - service: http_status:404
```

### Backup Process
1. Export n8n workflows → JSON
2. Export n8n credentials → encrypted
3. pg_dump postgres → SQL
4. mongodump → BSON
5. tar.gz all → timestamped
6. rclone sync → Icedrive

## Acceptance Gates

### Required Checks
```bash
# Format check
npm run format:check

# Lint check
npm run lint

# Type check
npm run typecheck

# Unit tests
npm test -- --coverage

# E2E tests
npm run test:e2e

# Build check
npm run build

# Security scan
npm audit --audit-level=high
```

### Coverage Thresholds
- Statements: 85%
- Branches: 80%
- Functions: 85%
- Lines: 85%

### Performance Metrics
- Lighthouse Performance: ≥95
- Lighthouse Accessibility: ≥95
- Lighthouse Best Practices: ≥95
- Lighthouse SEO: 100

## Validation Rules

### Environment Variables
- All NEXT_PUBLIC_* vars optional with fallbacks
- N8N_ENCRYPTION_KEY required (64 chars)
- POSTGRES_PASSWORD strong (≥16 chars)
- No secrets in repository

### Security Requirements
- No exposed ports in docker-compose
- HTTPS only via Cloudflare
- Basic auth on n8n interface
- Encrypted credential storage
- CSP headers configured

### Data Consistency
- Timezone: America/Chicago everywhere
- Email: service@rensto.com as default
- Airtable views: exact emoji names
- Workflow names: kebab-case

## Testing Matrix

| Component | Unit | Integration | E2E |
|-----------|------|-------------|-----|
| Web Pages | ✓ | ✓ | ✓ |
| API Routes | ✓ | ✓ | - |
| Components | ✓ | - | ✓ |
| Workflows | - | ✓ | ✓ |
| Backup | - | ✓ | - |
