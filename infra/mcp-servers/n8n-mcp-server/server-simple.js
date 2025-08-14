#!/usr/bin/env node

import axios from 'axios';

// Simple n8n MCP Server for testing
class SimpleN8nMCPServer {
  constructor() {
    this.n8nConfig = {
      url: process.env.N8N_URL || 'http://173.254.201.134:5678',
      apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MWJlOWY1MC1hYjM2LTRiMjEtYjE0ZS03ZmJkOTc1YjVkM2MiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU1MTk0ODMxfQ.jWtkUl32xeGcxAIWabry6z8gWCF4CMjCSCjeAjiphgE'
    };
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.n8nConfig.url}/healthz`);
      return {
        success: true,
        message: `✅ n8n Health Check: HEALTHY\nURL: ${this.n8nConfig.url}\nStatus: ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ n8n Health Check: UNHEALTHY\nURL: ${this.n8nConfig.url}\nError: ${error.message}`
      };
    }
  }

  async listWorkflows() {
    try {
      const response = await axios.get(
        `${this.n8nConfig.url}/api/v1/workflows`,
        {
          headers: {
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      const workflows = response.data.map(wf => ({
        id: wf.id,
        name: wf.name,
        active: wf.active
      }));

      return {
        success: true,
        message: `📋 Found ${workflows.length} workflows:\n\n${workflows.map(wf => 
          `• ${wf.name} (ID: ${wf.id}) - ${wf.active ? '🟢 Active' : '🔴 Inactive'}`
        ).join('\n')}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list workflows: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async createWorkflow(workflowData) {
    try {
      const response = await axios.post(
        `${this.n8nConfig.url}/api/v1/workflows`,
        {
          name: workflowData.name,
          nodes: workflowData.nodes || [],
          connections: workflowData.connections || {},
          settings: workflowData.settings || { executionOrder: 'v1' }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.n8nConfig.apiKey
          }
        }
      );

      return {
        success: true,
        message: `✅ Workflow "${workflowData.name}" created successfully with ID: ${response.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create workflow: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async run() {
    console.error('Simple n8n MCP Server running');
    
    // Test the server functionality
    console.error('Testing health check...');
    const health = await this.healthCheck();
    console.error(health.message);
    
    console.error('Testing workflow listing...');
    const workflows = await this.listWorkflows();
    console.error(workflows.message);
    
    // Keep the server running
    process.stdin.on('data', (data) => {
      const input = data.toString().trim();
      console.error(`Received input: ${input}`);
    });
  }
}

// Start the server
const server = new SimpleN8nMCPServer();
server.run().catch(console.error);
