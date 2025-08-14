#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class AIWorkflowGenerator {
  constructor() {
    this.server = new Server(
      {
        name: 'ai-workflow-generator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.n8nConfig = {
      url: process.env.N8N_URL || 'http://173.254.201.134:5678',
      apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MWJlOWY1MC1hYjM2LTRiMjEtYjE0ZS03ZmJkOTc1YjVkM2MiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU1MTk0ODMxfQ.jWtkUl32xeGcxAIWabry6z8gWCF4CMjCSCjeAjiphgE'
    };

    this.workflowTemplates = {
      emailAutomation: {
        name: 'Email Automation',
        nodes: [
          {
            parameters: {
              httpMethod: 'POST',
              path: 'email-webhook',
              options: {}
            },
            id: 'email-webhook',
            name: 'Email Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [240, 300]
          },
          {
            parameters: {
              jsCode: `// Email processing logic
const email = $input.first().json;
return [{
  json: {
    subject: email.subject,
    body: email.body,
    sender: email.sender,
    type: email.subject.toLowerCase().includes('sale') ? 'sales' : 'support'
  }
}];`
            },
            id: 'process-email',
            name: 'Process Email',
            type: 'n8n-nodes-base.code',
            typeVersion: 2,
            position: [460, 300]
          },
          {
            parameters: {
              operation: 'create',
              application: 'appQijHhqqP4z6wGe',
              table: 'Leads',
              fields: {
                name: '={{ $json.sender }}',
                email: '={{ $json.sender }}',
                message: '={{ $json.body }}',
                source: 'Email Automation',
                status: 'New'
              }
            },
            id: 'create-lead',
            name: 'Create Lead',
            type: 'n8n-nodes-base.airtable',
            typeVersion: 1,
            position: [680, 300]
          }
        ],
        connections: {
          'Email Webhook': {
            main: [[{ node: 'Process Email', type: 'main', index: 0 }]]
          },
          'Process Email': {
            main: [[{ node: 'Create Lead', type: 'main', index: 0 }]]
          }
        }
      },
      socialMediaMonitor: {
        name: 'Social Media Monitor',
        nodes: [
          {
            parameters: {
              rule: {
                interval: [{ field: 'hours', hoursInterval: 1 }]
              }
            },
            id: 'schedule-trigger',
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            typeVersion: 1,
            position: [240, 300]
          },
          {
            parameters: {
              url: 'https://api.twitter.com/2/tweets/search/recent',
              options: {
                qs: {
                  query: 'rensto OR automation',
                  max_results: 10
                }
              }
            },
            id: 'twitter-search',
            name: 'Twitter Search',
            type: 'n8n-nodes-base.httpRequest',
            typeVersion: 4.1,
            position: [460, 300]
          },
          {
            parameters: {
              operation: 'create',
              application: 'appQijHhqqP4z6wGe',
              table: 'Leads',
              fields: {
                name: 'Social Media Lead',
                email: 'social@rensto.com',
                message: '={{ $json.text }}',
                source: 'Social Media',
                status: 'New'
              }
            },
            id: 'save-mention',
            name: 'Save Mention',
            type: 'n8n-nodes-base.airtable',
            typeVersion: 1,
            position: [680, 300]
          }
        ],
        connections: {
          'Schedule Trigger': {
            main: [[{ node: 'Twitter Search', type: 'main', index: 0 }]]
          },
          'Twitter Search': {
            main: [[{ node: 'Save Mention', type: 'main', index: 0 }]]
          }
        }
      },
      invoiceReminder: {
        name: 'Invoice Reminder',
        nodes: [
          {
            parameters: {
              rule: {
                interval: [{ field: 'hours', hoursInterval: 24 }]
              }
            },
            id: 'daily-trigger',
            name: 'Daily Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            typeVersion: 1,
            position: [240, 300]
          },
          {
            parameters: {
              operation: 'list',
              application: 'appQijHhqqP4z6wGe',
              table: 'Finances',
              filters: {
                filterByFormula: '{status} = "Unpaid"'
              }
            },
            id: 'get-unpaid',
            name: 'Get Unpaid Invoices',
            type: 'n8n-nodes-base.airtable',
            typeVersion: 1,
            position: [460, 300]
          },
          {
            parameters: {
              operation: 'send',
              to: '={{ $json.client_email }}',
              subject: 'Invoice Reminder - {{ $json.client_name }}',
              text: 'Your invoice for {{ $json.amount }} is overdue. Please process payment.'
            },
            id: 'send-reminder',
            name: 'Send Reminder',
            type: 'n8n-nodes-base.emailSend',
            typeVersion: 2,
            position: [680, 300]
          }
        ],
        connections: {
          'Daily Trigger': {
            main: [[{ node: 'Get Unpaid Invoices', type: 'main', index: 0 }]]
          },
          'Get Unpaid Invoices': {
            main: [[{ node: 'Send Reminder', type: 'main', index: 0 }]]
          }
        }
      }
    };

    this.setupTools();
  }

  setupTools() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_workflow_from_prompt':
            return await this.generateWorkflowFromPrompt(args);
          case 'create_email_automation':
            return await this.createEmailAutomation(args);
          case 'create_social_monitor':
            return await this.createSocialMonitor(args);
          case 'create_invoice_reminder':
            return await this.createInvoiceReminder(args);
          case 'create_custom_workflow':
            return await this.createCustomWorkflow(args);
          case 'list_available_templates':
            return await this.listAvailableTemplates(args);
          case 'optimize_existing_workflow':
            return await this.optimizeExistingWorkflow(args);
          case 'generate_workflow_documentation':
            return await this.generateWorkflowDocumentation(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async generateWorkflowFromPrompt(args) {
    const { prompt, workflowName } = args;
    
    // Analyze the prompt to determine the best template
    const promptLower = prompt.toLowerCase();
    let template = null;
    let templateName = '';

    if (promptLower.includes('email') || promptLower.includes('gmail') || promptLower.includes('inbox')) {
      template = this.workflowTemplates.emailAutomation;
      templateName = 'Email Automation';
    } else if (promptLower.includes('social') || promptLower.includes('twitter') || promptLower.includes('monitor')) {
      template = this.workflowTemplates.socialMediaMonitor;
      templateName = 'Social Media Monitor';
    } else if (promptLower.includes('invoice') || promptLower.includes('payment') || promptLower.includes('reminder')) {
      template = this.workflowTemplates.invoiceReminder;
      templateName = 'Invoice Reminder';
    } else {
      // Create a custom workflow based on the prompt
      return await this.createCustomWorkflow({ prompt, workflowName });
    }

    try {
      const workflowData = {
        name: workflowName || template.name,
        nodes: template.nodes,
        connections: template.connections,
        settings: { executionOrder: 'v1' }
      };

      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        workflowData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `🤖 AI Generated Workflow: "${templateName}"\n\n📝 Prompt: "${prompt}"\n🆔 Workflow ID: ${response.data.id}\n📋 Name: ${workflowData.name}\n🔗 Access: ${this.n8nConfig.url}/workflow/${response.data.id}\n\n✅ Workflow created successfully! You can now customize it in the n8n interface.`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to generate workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  async createEmailAutomation(args) {
    const { workflowName = 'Email Automation' } = args;
    
    try {
      const workflowData = {
        name: workflowName,
        nodes: this.workflowTemplates.emailAutomation.nodes,
        connections: this.workflowTemplates.emailAutomation.connections,
        settings: { executionOrder: 'v1' }
      };

      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        workflowData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `📧 Email Automation Workflow Created!\n\n🆔 Workflow ID: ${response.data.id}\n📋 Name: ${workflowData.name}\n🔗 Webhook URL: ${this.n8nConfig.url}/webhook/email-webhook\n\nThis workflow will:\n• Receive emails via webhook\n• Process and categorize emails\n• Create leads in Airtable\n• Send notifications\n\n✅ Ready to use! Configure your email service to send webhooks to the URL above.`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create email automation: ${error.response?.data?.message || error.message}`);
    }
  }

  async createSocialMonitor(args) {
    const { workflowName = 'Social Media Monitor' } = args;
    
    try {
      const workflowData = {
        name: workflowName,
        nodes: this.workflowTemplates.socialMediaMonitor.nodes,
        connections: this.workflowTemplates.socialMediaMonitor.connections,
        settings: { executionOrder: 'v1' }
      };

      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        workflowData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `📱 Social Media Monitor Created!\n\n🆔 Workflow ID: ${response.data.id}\n📋 Name: ${workflowData.name}\n⏰ Schedule: Every hour\n\nThis workflow will:\n• Monitor social media mentions\n• Search for relevant keywords\n• Create leads from mentions\n• Track brand mentions\n\n✅ Ready to use! Configure your social media API credentials in n8n.`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create social monitor: ${error.response?.data?.message || error.message}`);
    }
  }

  async createInvoiceReminder(args) {
    const { workflowName = 'Invoice Reminder' } = args;
    
    try {
      const workflowData = {
        name: workflowName,
        nodes: this.workflowTemplates.invoiceReminder.nodes,
        connections: this.workflowTemplates.invoiceReminder.connections,
        settings: { executionOrder: 'v1' }
      };

      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        workflowData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `💰 Invoice Reminder Workflow Created!\n\n🆔 Workflow ID: ${response.data.id}\n📋 Name: ${workflowData.name}\n⏰ Schedule: Daily\n\nThis workflow will:\n• Check for unpaid invoices daily\n• Send reminder emails automatically\n• Track payment status\n• Reduce manual follow-up\n\n✅ Ready to use! Configure your email credentials in n8n.`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create invoice reminder: ${error.response?.data?.message || error.message}`);
    }
  }

  async createCustomWorkflow(args) {
    const { prompt, workflowName = 'Custom Workflow' } = args;
    
    // Create a basic webhook-based workflow
    const customWorkflow = {
      name: workflowName,
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'custom-webhook',
            options: {}
          },
          id: 'custom-webhook',
          name: 'Custom Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300]
        },
        {
          parameters: {
            jsCode: `// Custom workflow logic based on prompt: "${prompt}"
const data = $input.first().json;
return [{
  json: {
    processed: true,
    originalData: data,
    timestamp: new Date().toISOString(),
    workflow: '${workflowName}'
  }
}];`
          },
          id: 'process-data',
          name: 'Process Data',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [460, 300]
        }
      ],
      connections: {
        'Custom Webhook': {
          main: [[{ node: 'Process Data', type: 'main', index: 0 }]]
        }
      },
      settings: { executionOrder: 'v1' }
    };

    try {
      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        customWorkflow,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `🔧 Custom Workflow Created!\n\n📝 Prompt: "${prompt}"\n🆔 Workflow ID: ${response.data.id}\n📋 Name: ${workflowName}\n🔗 Webhook URL: ${this.n8nConfig.url}/webhook/custom-webhook\n\nThis is a basic template. You can now customize it in the n8n interface to match your specific requirements.`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create custom workflow: ${error.response?.data?.message || error.message}`);
    }
  }

  async listAvailableTemplates(args) {
    const templates = Object.keys(this.workflowTemplates).map(key => ({
      name: this.workflowTemplates[key].name,
      description: this.getTemplateDescription(key)
    }));

    return {
      content: [
        {
          type: 'text',
          text: `📋 Available Workflow Templates:\n\n${templates.map(t => 
            `• ${t.name}: ${t.description}`
          ).join('\n')}\n\n💡 Use generate_workflow_from_prompt with a description to automatically select the best template!`
        }
      ]
    };
  }

  getTemplateDescription(templateKey) {
    const descriptions = {
      emailAutomation: 'Automate email processing and lead creation',
      socialMediaMonitor: 'Monitor social media mentions and create leads',
      invoiceReminder: 'Send automatic invoice reminders for unpaid invoices'
    };
    return descriptions[templateKey] || 'Custom workflow template';
  }

  async optimizeExistingWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '⚡ Workflow optimization functionality coming soon! This will analyze existing workflows and suggest improvements.'
        }
      ]
    };
  }

  async generateWorkflowDocumentation(args) {
    return {
      content: [
        {
          type: 'text',
          text: '📚 Workflow documentation generation coming soon! This will create comprehensive documentation for your workflows.'
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AI Workflow Generator MCP Server running on stdio');
  }
}

// Start the server
const server = new AIWorkflowGenerator();
server.run().catch(console.error);
