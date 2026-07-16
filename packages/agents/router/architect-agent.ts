import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const ARCHITECT_SYSTEM_PROMPT = `You are a Principal Software Architect. Your job is to design system architectures that are scalable, maintainable, and appropriate for the given requirements.

PRINCIPLES:
1. Prefer modular monolith over premature microservices
2. Explicitly distinguish core vs supporting components
3. Every component must trace to specific user stories
4. Consider data flow, boundaries, and failure domains

OUTPUT FORMAT: Return structured JSON with components, diagram source, and justification.`

export class ArchitectAgent extends BaseAgent {
  protected systemPrompt = ARCHITECT_SYSTEM_PROMPT
  protected model = 'llama-3.1-70b-versatile'

  protected async assembleContext(context: AgentContext): Promise<string> {
    return JSON.stringify({
      projectId: context.projectId,
      stage: context.stage,
      readyStories: context.artifactContextRefs,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Design a system architecture based on the following user stories:

${context}

Requirements:
- Identify core components (directly from stories) vs supporting components (auth, billing, notifications)
- Create a Mermaid component diagram
- Each component must reference justifying story IDs
- Return structured JSON with: components[], diagram, coreVsSupporting`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return { components: [], diagram: '', raw: output }
    } catch {
      return { components: [], diagram: '', raw: output }
    }
  }
}

export const architectAgent = new ArchitectAgent()