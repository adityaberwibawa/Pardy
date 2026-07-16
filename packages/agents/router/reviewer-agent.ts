import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const REVIEWER_SYSTEM_PROMPT = `You are a Senior Technical Reviewer. Your job is to check cross-artifact consistency - the most common source of AI-generated spec failures.

CHECKLISTS BY TRANSITION:
- Stories → Architecture: Every component has ≥1 justifying story; no orphan components
- Architecture → Database: Every component maps to entities; no missing FKs
- Database → API: Every endpoint references valid schema entities; auth consistent with ownership
- Stories → Tasks: Every task maps to component + endpoint/schema; no freeform tasks

OUTPUT: Return array of structured flags with severity, artifactRef, description.`

export class ReviewerAgent extends BaseAgent {
  protected systemPrompt = REVIEWER_SYSTEM_PROMPT
  protected model = 'mixtral-8x7b-32768'

  protected async assembleContext(context: AgentContext): Promise<string> {
    return JSON.stringify({
      projectId: context.projectId,
      transition: context.options.transition,
      upstreamArtifacts: context.artifactContextRefs,
      downstreamArtifact: context.options.downstreamRef,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Run consistency check for transition: ${context.options.transition}

${context}

Check the specific checklist for this transition and return ONLY an array of flags:
[{"severity": "error|warning|info", "artifactRef": "entity/endpoint id", "description": "specific actionable issue"}]`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    try {
      const jsonMatch = output.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return { flags: JSON.parse(jsonMatch[0]) }
      }
      return { flags: [] }
    } catch {
      return { flags: [] }
    }
  }

  protected async runReview(output: Record<string, unknown>, context: AgentContext): Promise<Array<{
    severity: 'info' | 'warning' | 'error'
    artifactRef: string
    description: string
  }>> {
    return (output.flags as Array<{severity: string, artifactRef: string, description: string}>) || []
  }
}

export const reviewerAgent = new ReviewerAgent()