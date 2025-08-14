#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

class N8nMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'n8n-mcp-server',
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
      apiKey:
        process.env.N8N_API_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MWJlOWY1MC1hYjM2LTRiMjEtYjE0ZS03ZmJkOTc1YjVkM2MiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU1MTk0ODMxfQ.jWtkUl32xeGcxAIWabry6z8gWCF4CMjCSCjeAjiphgE',
      licenseKey:
        process.env.N8N_LICENSE_KEY || 'd21cb1e4-4b41-4b09-8e86-c0021884b446',
    };

    this.setupTools();
  }

  setupTools() {
    // Core Workflow Management
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Workflow Creation & Management
          case 'create_workflow':
            return await this.createWorkflow(args);
          case 'list_workflows':
            return await this.listWorkflows(args);
          case 'get_workflow':
            return await this.getWorkflow(args);
          case 'update_workflow':
            return await this.updateWorkflow(args);
          case 'delete_workflow':
            return await this.deleteWorkflow(args);
          case 'activate_workflow':
            return await this.activateWorkflow(args);
          case 'deactivate_workflow':
            return await this.deactivateWorkflow(args);

          // Workflow Execution
          case 'trigger_workflow':
            return await this.triggerWorkflow(args);
          case 'get_workflow_executions':
            return await this.getWorkflowExecutions(args);

          // Node Management
          case 'search_nodes':
            return await this.searchNodes(args);
          case 'get_node_documentation':
            return await this.getNodeDocumentation(args);
          case 'validate_workflow':
            return await this.validateWorkflow(args);

          // Credentials Management
          case 'list_credentials':
            return await this.listCredentials(args);
          case 'create_credential':
            return await this.createCredential(args);
          case 'test_credential':
            return await this.testCredential(args);

          // Advanced Features
          case 'generate_workflow_from_prompt':
            return await this.generateWorkflowFromPrompt(args);
          case 'optimize_workflow':
            return await this.optimizeWorkflow(args);
          case 'backup_workflows':
            return await this.backupWorkflows(args);
          case 'restore_workflows':
            return await this.restoreWorkflows(args);

          // Health & Monitoring
          case 'health_check':
            return await this.healthCheck(args);
          case 'get_workflow_metrics':
            return await this.getWorkflowMetrics(args);
          case 'get_system_status':
            return await this.getSystemStatus(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  // Core Workflow Management Methods
  async createWorkflow(args) {
    const { workflowData } = args;

    try {
      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        {
          name: workflowData.name,
          nodes: workflowData.nodes || [],
          connections: workflowData.connections || {},
          settings: workflowData.settings || { executionOrder: 'v1' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `✅ Workflow "${workflowData.name}" created successfully with ID: ${response.data.id}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to create workflow: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async listWorkflows(args) {
    try {
      const response = await axios.get(
        `${this.n8nConfig.url}/api/v1/workflows`,
        {
          headers: {
            'X-N8N-API-KEY': this.n8nConfig.apiKey,
          },
        }
      );

      const workflows = response.data.map(wf => ({
        id: wf.id,
        name: wf.name,
        active: wf.active,
        createdAt: wf.createdAt,
        updatedAt: wf.updatedAt,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `📋 Found ${workflows.length} workflows:\n\n${workflows
              .map(
                wf =>
                  `• ${wf.name} (ID: ${wf.id}) - ${
                    wf.active ? '🟢 Active' : '🔴 Inactive'
                  }`
              )
              .join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to list workflows: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getWorkflow(args) {
    const { workflowId } = args;

    try {
      const response = await axios.get(
        `${this.n8nConfig.url}/api/v1/workflows/${workflowId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.n8nConfig.apiKey,
          },
        }
      );

      const workflow = response.data;
      return {
        content: [
          {
            type: 'text',
            text: `📊 Workflow Details:\n\nName: ${workflow.name}\nID: ${
              workflow.id
            }\nStatus: ${workflow.active ? 'Active' : 'Inactive'}\nNodes: ${
              workflow.nodes?.length || 0
            }\nCreated: ${workflow.createdAt}\nUpdated: ${workflow.updatedAt}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get workflow: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async activateWorkflow(args) {
    const { workflowId } = args;

    try {
      await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows/${workflowId}/activate`,
        {},
        {
          headers: {
            'X-N8N-API-KEY': this.n8nConfig.apiKey,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `✅ Workflow activated successfully`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to activate workflow: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Advanced Workflow Generation
  async generateWorkflowFromPrompt(args) {
    const { prompt, workflowName } = args;

    // This would integrate with an AI service to generate workflow JSON
    // For now, we'll create a basic template
    const workflowTemplate = {
      name: workflowName || 'AI Generated Workflow',
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'webhook',
            options: {},
          },
          id: 'webhook-trigger',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
        },
      ],
      connections: {},
      settings: { executionOrder: 'v1' },
    };

    try {
      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        workflowTemplate,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `🤖 AI Generated Workflow created from prompt: "${prompt}"\n\nWorkflow ID: ${response.data.id}\nName: ${workflowTemplate.name}\n\nThis is a basic template. You can now customize it in the n8n interface.`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to generate workflow: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Node Search and Documentation
  async searchNodes(args) {
    const { query } = args;

    // This would search through n8n node documentation
    const commonNodes = [
      'HTTP Request',
      'Webhook',
      'Code',
      'Airtable',
      'Slack',
      'Email',
      'OpenAI',
      'Google Sheets',
      'Stripe',
      'Zapier',
      'IFTTT',
    ];

    const matchingNodes = commonNodes.filter(node =>
      node.toLowerCase().includes(query.toLowerCase())
    );

    return {
      content: [
        {
          type: 'text',
          text: `🔍 Found ${
            matchingNodes.length
          } nodes matching "${query}":\n\n${matchingNodes
            .map(node => `• ${node}`)
            .join('\n')}`,
        },
      ],
    };
  }

  // Health and Monitoring
  async healthCheck(args) {
    try {
      const response = await axios.get(`${this.n8nConfig.url}/healthz`);

      return {
        content: [
          {
            type: 'text',
            text: `✅ n8n Health Check: ${
              response.status === 200 ? 'HEALTHY' : 'UNHEALTHY'
            }\nURL: ${this.n8nConfig.url}\nStatus: ${response.status}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ n8n Health Check: UNHEALTHY\nURL: ${this.n8nConfig.url}\nError: ${error.message}`,
          },
        ],
      };
    }
  }

  async getSystemStatus(args) {
    try {
      const [healthResponse, workflowsResponse] = await Promise.all([
        axios.get(`${this.n8nConfig.url}/healthz`),
        axios.get(`${this.n8nConfig.url}/api/v1/workflows`, {
          headers: { 'X-N8N-API-KEY': this.n8nConfig.apiKey },
        }),
      ]);

      const activeWorkflows = workflowsResponse.data.filter(
        wf => wf.active
      ).length;
      const totalWorkflows = workflowsResponse.data.length;

      return {
        content: [
          {
            type: 'text',
            text: `📊 System Status:\n\n🟢 n8n Platform: HEALTHY\n📋 Total Workflows: ${totalWorkflows}\n🟢 Active Workflows: ${activeWorkflows}\n🔴 Inactive Workflows: ${
              totalWorkflows - activeWorkflows
            }\n🌐 URL: ${this.n8nConfig.url}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ System Status: ERROR\nError: ${error.message}`,
          },
        ],
      };
    }
  }

  // Placeholder methods for other tools
  async updateWorkflow(args) {
    return {
      content: [
        { type: 'text', text: '🔄 Workflow update functionality coming soon' },
      ],
    };
  }

  async deleteWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '🗑️ Workflow deletion functionality coming soon',
        },
      ],
    };
  }

  async deactivateWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '⏸️ Workflow deactivation functionality coming soon',
        },
      ],
    };
  }

  async triggerWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '🚀 Workflow triggering functionality coming soon',
        },
      ],
    };
  }

  async getWorkflowExecutions(args) {
    return {
      content: [
        {
          type: 'text',
          text: '📈 Workflow executions functionality coming soon',
        },
      ],
    };
  }

  async getNodeDocumentation(args) {
    return {
      content: [
        {
          type: 'text',
          text: '📚 Node documentation functionality coming soon',
        },
      ],
    };
  }

  async validateWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '✅ Workflow validation functionality coming soon',
        },
      ],
    };
  }

  async listCredentials(args) {
    return {
      content: [
        {
          type: 'text',
          text: '🔑 Credentials management functionality coming soon',
        },
      ],
    };
  }

  async createCredential(args) {
    return {
      content: [
        {
          type: 'text',
          text: '🔑 Credential creation functionality coming soon',
        },
      ],
    };
  }

  async testCredential(args) {
    return {
      content: [
        {
          type: 'text',
          text: '🧪 Credential testing functionality coming soon',
        },
      ],
    };
  }

  async optimizeWorkflow(args) {
    return {
      content: [
        {
          type: 'text',
          text: '⚡ Workflow optimization functionality coming soon',
        },
      ],
    };
  }

  async backupWorkflows(args) {
    return {
      content: [
        { type: 'text', text: '💾 Workflow backup functionality coming soon' },
      ],
    };
  }

  async restoreWorkflows(args) {
    return {
      content: [
        { type: 'text', text: '🔄 Workflow restore functionality coming soon' },
      ],
    };
  }

  async getWorkflowMetrics(args) {
    return {
      content: [
        { type: 'text', text: '📊 Workflow metrics functionality coming soon' },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('n8n MCP Server running on stdio');
  }
}

// Start the server
const server = new N8nMCPServer();
server.run().catch(console.error);
