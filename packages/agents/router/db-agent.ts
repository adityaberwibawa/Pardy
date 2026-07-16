import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const DB_SYSTEM_PROMPT = `You are a Senior Database Engineer. Your job is to design normalized, production-ready database schemas.

PRINCIPLES:
1. Every entity and field must be justified by a user story
2. Normalize to 3NF minimum - flag denormalization tradeoffs
3. Explicit foreign keys for all relationships
4. Generate both JSON schema model AND SQL DDL from same source
5. Index strategically for query patterns

OUTPUT FORMAT: Return JSON with entities[], relationships[], and rawDdl.`

export class DBAgent extends BaseAgent {
  protected systemPrompt = DB_SYSTEM_PROMPT
  protected model = 'llama-3.1-70b-versatile'

  protected async assembleContext(context: AgentContext): Promise<string> {
    return JSON.stringify({
      projectId: context.projectId,
      stage: context.stage,
      stories: context.artifactContextRefs,
      architecture: context.options.architectureRef,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Design a database schema based on the following stories and architecture:

${context}

Requirements:
- Extract entities from story nouns
- Infer relationships from story verbs/associations
- Normalize: flag repeating groups, missing FKs
- Output: entities[] with fields, relationships[], rawDdl
- Each entity/field must list justifying story IDs`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return { entities: [], relationships: [], rawDdl: '' }
    } catch {
      return { entities: [], relationships: [], rawDdl: '' }
    }
  }
}

export const dbAgent = new DBAgent()