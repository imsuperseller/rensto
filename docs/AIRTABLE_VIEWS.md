# Airtable Views Documentation

## Base Configuration

**Base ID**: `appQijHhqqP4z6wGe`  
**API Key**: Store in environment variable `AIRTABLE_API_KEY`  
**Timezone**: America/Chicago (all datetime fields)

## Table Structure

### 1. Leads Table

**Purpose**: Track potential clients and opportunities

**Fields**:

- `id` (Auto Number): Primary key
- `company` (Single Line Text): Company name
- `contact_name` (Single Line Text): Primary contact
- `email` (Email): Contact email
- `phone` (Phone): Contact phone
- `source` (Single Select): Lead source
  - Options: Website, Referral, LinkedIn, Cold Outreach, Event
- `status` (Single Select): Lead status
  - Options: New, Contacted, Qualified, Proposal, Won, Lost
- `next_action_at` (Date): When to follow up
- `notes` (Long Text): Additional information
- `value` (Currency): Estimated deal value
- `created_at` (Created Time): Auto timestamp
- `updated_at` (Last Modified): Auto update

**Views**:

#### 🔥 Active

- **Filter**: `AND(OR(status = "Contacted", status = "Qualified"), next_action_at <= TODAY())`
- **Sort**: `next_action_at` ASC, `value` DESC
- **Fields shown**: company, contact_name, status, next_action_at, value
- **Purpose**: Daily follow-up list for sales team

#### 📊 Pipeline

- **Filter**: `NOT(OR(status = "Won", status = "Lost"))`
- **Group by**: status
- **Sort**: `value` DESC
- **Purpose**: Visual sales pipeline

#### 🎯 High Value

- **Filter**: `value >= 5000`
- **Sort**: `value` DESC
- **Purpose**: Focus on large opportunities

### 2. Projects Table

**Purpose**: Manage active client projects

**Fields**:

- `id` (Auto Number): Primary key
- `project_name` (Single Line Text): Project title
- `client` (Link to Leads): Related client record
- `status` (Single Select): Project status
  - Options: Planning, Building, Review, Deployed, Maintenance
- `start_date` (Date): Project start
- `end_date` (Date): Expected completion
- `actual_end` (Date): Actual completion
- `budget` (Currency): Project budget
- `spent` (Currency): Actual spend
- `tech_stack` (Multiple Select): Technologies used
  - Options: n8n, Next.js, MongoDB, PostgreSQL, Stripe
- `deliverables` (Long Text): What's included
- `risks` (Long Text): Identified risks
- `last_updated` (Last Modified): Auto update

**Views**:

#### 🔨 In Progress

- **Filter**: `OR(status = "Building", status = "Review")`
- **Sort**: `end_date` ASC, `last_updated` DESC
- **Fields shown**: project_name, client, status, end_date, budget
- **Purpose**: Active projects requiring attention

#### ⏰ Overdue

- **Filter**: `AND(end_date < TODAY(), NOT(status = "Deployed"))`
- **Sort**: `end_date` ASC
- **Color**: Red for overdue items
- **Purpose**: Projects needing immediate attention

#### 📈 Performance

- **Filter**: All projects
- **Group by**: client
- **Summary**: SUM(budget), AVG(spent/budget)
- **Purpose**: Client profitability analysis

### 3. Finance Table

**Purpose**: Track invoices and payments

**Fields**:

- `id` (Auto Number): Primary key
- `invoice_number` (Single Line Text): Unique invoice ID
- `project` (Link to Projects): Related project
- `client` (Link to Leads): Related client
- `amount` (Currency): Invoice amount
- `status` (Single Select): Payment status
  - Options: Draft, Sent, Partial, Paid, Overdue, Cancelled
- `issue_date` (Date): Invoice date
- `due_date` (Date): Payment due
- `paid_date` (Date): Payment received
- `payment_method` (Single Select): How paid
  - Options: Stripe, ACH, Check, Wire, Other
- `stripe_link` (URL): Payment link
- `notes` (Long Text): Additional details

**Views**:

#### 📄 Unpaid

- **Filter**: `OR(status = "Sent", status = "Partial")`
- **Sort**: `due_date` ASC
- **Fields shown**: invoice_number, client, amount, due_date, days_overdue
- **Formula field**: `days_overdue = IF(due_date < TODAY(), DATETIME_DIFF(TODAY(), due_date, 'days'), 0)`
- **Purpose**: Outstanding invoices requiring collection

#### 💰 Revenue MTD

- **Filter**: `AND(paid_date >= START_OF_MONTH(), status = "Paid")`
- **Summary**: SUM(amount)
- **Group by**: Week
- **Purpose**: Month-to-date revenue tracking

#### 📊 Aging Report

- **Filter**: `status != "Paid"`
- **Group by**: Days overdue (0-30, 31-60, 61-90, 90+)
- **Summary**: COUNT(), SUM(amount)
- **Purpose**: Accounts receivable aging

### 4. Assets Table

**Purpose**: Track client assets and renewals

**Fields**:

- `id` (Auto Number): Primary key
- `asset_name` (Single Line Text): Asset description
- `client` (Link to Leads): Asset owner
- `type` (Single Select): Asset type
  - Options: Domain, Hosting, SSL, API Key, License, Subscription
- `provider` (Single Line Text): Service provider
- `cost` (Currency): Annual/monthly cost
- `billing_cycle` (Single Select): Payment frequency
  - Options: Monthly, Quarterly, Annual, One-time
- `renewal_date` (Date): Next renewal
- `auto_renew` (Checkbox): Auto-renewal enabled
- `criticality` (Single Select): How critical
  - Options: Critical, High, Medium, Low
- `owner` (Single Line Text): Who manages
- `notes` (Long Text): Access details, etc.

**Views**:

#### Renewals < 30d

- **Filter**: `AND(renewal_date <= DATEADD(TODAY(), 30, 'days'), renewal_date >= TODAY())`
- **Sort**: `renewal_date` ASC, `criticality` ASC
- **Fields shown**: asset_name, client, renewal_date, cost, auto_renew, criticality
- **Formula field**: `days_to_renew = DATETIME_DIFF(renewal_date, TODAY(), 'days')`
- **Purpose**: Upcoming renewals requiring action

#### 💳 Monthly Costs

- **Filter**: `billing_cycle = "Monthly"`
- **Group by**: client
- **Summary**: SUM(cost)
- **Purpose**: Recurring revenue tracking

#### 🔴 Critical Assets

- **Filter**: `criticality = "Critical"`
- **Sort**: `renewal_date` ASC
- **Purpose**: High-priority asset management

## n8n Integration

### Authentication

```javascript
// n8n Credentials
{
  "apiKey": "{{AIRTABLE_API_KEY}}",
  "baseId": "appQijHhqqP4z6wGe"
}
```

### Common Operations

#### Get Records from View

```javascript
// Airtable node configuration
{
  "operation": "list",
  "application": "appQijHhqqP4z6wGe",
  "table": "Leads",
  "view": "🔥 Active",
  "additionalOptions": {
    "filterByFormula": "next_action_at <= TODAY()",
    "sort": [
      {
        "field": "next_action_at",
        "direction": "asc"
      }
    ]
  }
}
```

#### Create Record

```javascript
// Airtable node configuration
{
  "operation": "create",
  "application": "appQijHhqqP4z6wGe",
  "table": "Leads",
  "fields": {
    "company": "{{$json.company}}",
    "contact_name": "{{$json.name}}",
    "email": "{{$json.email}}",
    "status": "New",
    "source": "Website",
    "next_action_at": "{{$now.format('YYYY-MM-DD')}}"
  }
}
```

#### Update Record

```javascript
// Airtable node configuration
{
  "operation": "update",
  "application": "appQijHhqqP4z6wGe",
  "table": "Projects",
  "id": "{{$json.id}}",
  "fields": {
    "status": "Review",
    "last_updated": "{{$now}}"
  }
}
```

## Automation Workflows

### 1. Daily Follow-ups (08:00 CT)

- Source: Leads → 🔥 Active view
- Filter: `next_action_at <= TODAY()`
- Action: Send Slack notification with list
- Fallback: Email to service@rensto.com

### 2. Project Status (09:00 CT)

- Source: Projects → 🔨 In Progress view
- Group by: status
- Action: Generate HTML digest
- Send to: Slack #projects channel

### 3. Invoice Reminders (09:15 CT)

- Source: Finance → 📄 Unpaid view
- Calculate: days_overdue
- Action: Send escalating reminders
  - 0-7 days: Friendly reminder
  - 8-30 days: Follow-up
  - 30+ days: Urgent notice

### 4. Renewal Alerts (07:45 CT)

- Source: Assets → Renewals < 30d view
- Group by: criticality
- Action: Create task list
- Send to: Slack #operations

### 5. New Lead Intake (Webhook)

- Trigger: Form submission
- Dedupe: Check email exists
- Create: New Lead record
- Notify: Slack #sales

## Best Practices

### Field Naming

- Use lowercase with underscores
- Be descriptive but concise
- Include units (e.g., `cost_usd`, `days_to_renew`)

### Formula Fields

```javascript
// Days until renewal
IF(renewal_date, DATETIME_DIFF(renewal_date, TODAY(), 'days'), 999);

// Overdue amount
IF(AND(status != 'Paid', due_date < TODAY()), amount, 0);

// Project health
IF(
  end_date < TODAY(),
  '🔴 Overdue',
  IF(
    DATETIME_DIFF(end_date, TODAY(), 'days') <= 7,
    '🟡 Due Soon',
    '🟢 On Track'
  )
);
```

### View Filters

```javascript
// Active projects this month
AND(
  (status = 'Building'),
  start_date >= START_OF_MONTH(),
  end_date <= END_OF_MONTH()
);

// High-value unpaid invoices
AND(
  amount >= 1000,
  OR((status = 'Sent'), (status = 'Partial')),
  due_date <= DATEADD(TODAY(), 7, 'days')
);

// Critical renewals
AND(
  (criticality = 'Critical'),
  renewal_date <= DATEADD(TODAY(), 14, 'days'),
  (auto_renew = FALSE())
);
```

## API Rate Limits

- **Requests**: 5 requests/second
- **Records**: 100 records per request
- **Pagination**: Use offset for large datasets

```javascript
// n8n pagination settings
{
  "limit": 100,
  "offset": "{{$json.offset}}",
  "returnAll": true
}
```

## Error Handling

### Common Errors

1. **Invalid View Name**

   - Ensure exact match including emojis
   - Check for trailing spaces

2. **Rate Limit Exceeded**

   - Add delay between requests
   - Use batch operations

3. **Field Type Mismatch**
   - Dates must be YYYY-MM-DD format
   - Numbers without currency symbols
   - Select fields must match exactly

### n8n Error Handling

```javascript
// Try-catch in n8n
{
  "continueOnFail": true,
  "alwaysOutputData": true,
  "retry": {
    "maxTries": 3,
    "waitBetweenTries": 1000
  }
}
```

## Security

### API Key Management

- Never commit API keys
- Rotate quarterly
- Use read-only keys where possible
- Restrict by IP if available

### Data Access

- Create separate views for automation
- Limit fields returned
- Use formula fields for calculations
- Don't expose sensitive data

## Maintenance

### Weekly Tasks

- Review and clean up old records
- Update next_action_at dates
- Archive completed projects
- Verify automation runs

### Monthly Tasks

- Audit user permissions
- Review and optimize views
- Update formula fields
- Export backups

---

_Last updated: 2024-01-06_  
_Base Version: 1.0_
