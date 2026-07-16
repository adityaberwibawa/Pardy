import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const BACKEND_SYSTEM_PROMPT = `You are a Senior Backend Engineer. Your job is to design clean, contract-first APIs.

PRINCIPLES:
1. Map entities to CRUD endpoints where implied by stories
2. For non-CRUD actions (checkout, invite, etc.), design purpose-built endpoints
3. Every endpoint needs: method, path, auth, request/response shapes, errors
4. Auth requirements must match data ownership model
5. Version contracts explicitly once consumed downstream

OUTPUT FORMAT: Return JSON with endpoints[], specVersion.`

export class BackendAgent extends BaseAgent {
  protected systemPrompt = BACKEND_SYSTEM_PROMPT
  protected model = 'llama-3.1-70b-versatile'

  protected async assembleContext(context: AgentContext): Promise<string> {
    return JSON.stringify({
      projectId: context.projectId,
      stage: context.stage,
      schema: context.options.schemaRef,
      stories: context.artifactContextRefs,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Design API contracts based on the database schema and stories:

${context}

Requirements:
- Map entities to CRUD where stories imply standard operations
- Design purpose-built endpoints for non-CRUD story actions
- Each endpoint: method, path, authRequired, requestSchema, responseSchema, errorCases
- Justify each endpoint with story IDs
- Return endpoints[] and specVersion`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return { endpoints: [], specVersion: 'v1' }
    } catch {
      return { endpoints: [], specVersion: 'v1' }
    }
  }
}

export const backendAgent = new BackendAgent()