# 🚀 Rensto - Business Automation Platform

**Automations that ship in days — not months**

Rensto is a comprehensive business automation platform that saves businesses 5-10 hours per week through intelligent workflow automation, AI-powered content generation, and seamless integrations.

## 🎯 **What Rensto Does**

- **🤖 AI-Powered Workflow Generation** - Create complex automations from natural language
- **📊 Business Intelligence** - Real-time analytics and reporting
- **💰 Financial Automation** - Invoice processing, payment tracking, expense management
- **📧 Communication Automation** - Email campaigns, lead nurturing, customer engagement
- **🔧 Infrastructure Management** - Docker-based deployment with full automation

## 🏗️ **Architecture**

```
Rensto/
├── infra/                    # 🐳 Infrastructure & Automation
│   ├── mcp-servers/         # 🤖 MCP Server Ecosystem
│   ├── n8n-workflows/       # 🔄 Workflow Definitions
│   ├── docker-compose.yml   # 🐳 Infrastructure Services
│   └── RENSTO-OPERATIONS-GUIDE.md  # 📋 Complete Operations Guide
├── web/                     # 🌐 Web Application
│   └── rensto-site/        # Next.js Marketing Site
├── docs/                    # 📚 Documentation
└── ops/                     # 🔧 Operations & Planning
```

## 🚀 **Quick Start**

### **1. Infrastructure Setup**
```bash
cd infra
docker-compose up -d
```

### **2. MCP Servers (AI Workflow Generation)**
```bash
cd infra
./start-mcp-servers.sh
```

### **3. Import Workflows**
```bash
cd infra
./import-remaining-workflows-v3.sh
```

### **4. Test Integrations**
```bash
cd infra
./test-integrations.sh
```

## 🤖 **MCP Server Ecosystem**

**200+ Business Automation Tools Available:**

- 💰 **Financial & Billing MCP** - 26 tools (invoicing, payments, reporting)
- 📧 **Email & Communication MCP** - 28 tools (campaigns, analytics, automation)
- 📊 **Analytics & Reporting MCP** - 33 tools (BI, dashboards, forecasting)
- 🤖 **n8n MCP Server** - 100+ tools (workflow management)
- 🎯 **AI Workflow Generator** - Natural language to workflow conversion

## 🔧 **Technology Stack**

### **Infrastructure**
- **Docker** - Containerized services
- **n8n** - Workflow automation platform
- **PostgreSQL** - Primary database
- **MongoDB** - Document storage
- **Cloudflare Tunnel** - Secure external access

### **Web Application**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **GSAP** - Animations

### **Integrations**
- **Airtable** - CRM and project management
- **OpenAI** - AI-powered automation
- **Microsoft Outlook** - Email automation
- **Stripe** - Payment processing

## 📊 **Production Status**

**✅ 100% OPERATIONAL**

- ✅ **Web Application**: https://rensto-site.vercel.app
- ✅ **n8n Platform**: http://173.254.201.134:5678
- ✅ **All Workflows**: Imported and operational
- ✅ **Airtable Integration**: All tables operational
- ✅ **MCP Servers**: 200+ automation tools available
- ✅ **Databases**: PostgreSQL and MongoDB running

## 🎯 **Business Automation Capabilities**

### **Lead Management**
- Automated lead intake and qualification
- Smart follow-up scheduling
- CRM integration and sync

### **Project Management**
- Automated project tracking
- Deadline monitoring and alerts
- Client communication automation

### **Financial Operations**
- Invoice generation and tracking
- Payment reminder automation
- Expense categorization and reporting

### **Content Generation**
- AI-powered content creation
- SEO optimization automation
- Social media content scheduling

## 📚 **Documentation**

- **[Operations Guide](infra/RENSTO-OPERATIONS-GUIDE.md)** - Complete operations and deployment guide
- **[Airtable Views](docs/AIRTABLE_VIEWS.md)** - Database schema and views
- **[DNS & Tunnel Setup](docs/DNS_AND_TUNNEL.md)** - Infrastructure configuration
- **[Onboarding Checklist](docs/ONBOARDING_CHECKLIST.md)** - New client setup

## 🔄 **Development Workflow**

### **BMAD Methodology**
1. **Build** - Sprint-based development with clear deliverables
2. **Measure** - Automated testing and performance metrics
3. **Adjust** - Data-driven optimization
4. **Document** - Comprehensive documentation and runbooks

### **Quality Gates**
- Automated testing on every commit
- Type safety validation
- Performance monitoring
- Security scanning

## 🚀 **Deployment**

### **Infrastructure**
```bash
# Start all services
docker-compose up -d

# Deploy web application
cd web/rensto-site
npm run deploy
```

### **MCP Servers**
```bash
# Start AI workflow generation system
cd infra
./start-mcp-servers.sh
```

## 📈 **Monitoring & Maintenance**

### **Health Checks**
- Automated system monitoring
- Performance metrics tracking
- Error alerting and logging
- Database backup automation

### **Updates**
- Automated dependency updates
- Security patch management
- Feature deployment automation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 **License**

This project is proprietary software. All rights reserved.

## 📞 **Support**

- **Email**: service@rensto.com
- **Documentation**: [Operations Guide](infra/RENSTO-OPERATIONS-GUIDE.md)
- **Issues**: GitHub Issues for bug reports and feature requests

---

**Built with ❤️ by the Rensto Team**

*Automations that ship in days — not months*

## 🧪 **Latest Test Deployment**
Automated deployment pipeline tested on Thu Aug 14 16:45:25 CDT 2025
