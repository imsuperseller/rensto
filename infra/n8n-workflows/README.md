# n8n Workflows

## 📋 **WORKFLOW COLLECTION**

This directory contains all n8n workflow definitions for the Rensto automation system.

## 🔄 **WORKFLOWS INCLUDED**

| Workflow | File | Description |
|----------|------|-------------|
| **Contact Intake** | `contact-intake.json` | Contact form processing and lead creation |
| **Leads Daily Follow-ups** | `leads-daily-followups.json` | Automated lead follow-up system |
| **Projects Digest** | `projects-digest.json` | Daily project status reports |
| **Assets Renewals** | `assets-renewals.json` | Domain and service renewal alerts |
| **Finance Unpaid Invoices** | `finance-unpaid-invoices.json` | Invoice payment reminders |

## 🚀 **IMPORT INSTRUCTIONS**

**⚠️ IMPORTANT**: Use the main operations guide for import instructions.

See: [`../RENSTO-OPERATIONS-GUIDE.md`](../RENSTO-OPERATIONS-GUIDE.md)

### **Quick Import Command**
```bash
# Use the consolidated import script
./import-remaining-workflows-v3.sh
```

## 🔧 **FIELD MAPPINGS**

All workflows have been updated to match the Airtable schema:
- `contact_name` → `name`
- `client_name` → `company`
- `client_email` → `email`
- `renewal_date` → `renewal`
- `due_date` → added to Finances table

## 📊 **CURRENT STATUS**

All workflows are imported and operational in n8n.

**For complete operations information, see the main guide: [`../RENSTO-OPERATIONS-GUIDE.md`](../RENSTO-OPERATIONS-GUIDE.md)**
