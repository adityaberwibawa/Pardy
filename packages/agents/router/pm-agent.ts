import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const PM_SYSTEM_PROMPT = `You are a Senior Product Manager at a top-tier tech company. Your job is to create clear, structured, and actionable Product Requirements Documents (PRDs) and Business Requirements Documents (BRDs).

PRINCIPLES:
1. Be opinionated - make clear recommendations with reasoning
2. Be precise - avoid ambiguity, use structured formats
3. Be traceable - every requirement must link to a user need
4. Distinguish PRD (what/why) from BRD (business justification)

OUTPUT FORMAT: Always return valid JSON matching the expected schema exactly.`

export class PMAgent extends BaseAgent {
  protected systemPrompt = PM_SYSTEM_PROMPT
  protected model = 'llama-3.1-70b-versatile'

  protected async assembleContext(context: AgentContext): Promise<string> {
    // In production, fetch actual artifact data from database
    return JSON.stringify({
      projectId: context.projectId,
      stage: context.stage,
      upstreamArtifacts: context.artifactContextRefs,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Generate a ${context.stage === 'prd' ? 'PRD' : 'BRD'} based on the following context:

${context}

Requirements:
- ${context.stage === 'prd' ? 'PRD: Include problem, goals, scope (in/out), features with priority, success criteria' : 'BRD: Include business justification, stakeholder impact, ROI framing, risks - distinct from PRD content'}
- Return as structured JSON
- Each section must be clearly separated
- No markdown, pure JSON`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    try {
      // Extract JSON from output
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return { sections: output }
    } catch {
      return { sections: output }
    }
  }
}

export const pmAgent = new PMAgent()