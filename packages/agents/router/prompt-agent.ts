import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

const PROMPT_SYSTEM_PROMPT = `You are a Prompt Engineer. Your job is to ASSEMBLE (not generate) self-contained coding prompts.

PRINCIPLES:
1. NEVER say "see the PRD" - embed everything the coding agent needs
2. Include: schema fragment, API fragment, acceptance criteria, constraints, out-of-scope
3. Use the canonical template structure exactly
4. Low creativity - deterministic assembly from validated upstream content

OUTPUT: Markdown or JSON format of the canonical prompt template.`

export class PromptAgent extends BaseAgent {
  protected systemPrompt = PROMPT_SYSTEM_PROMPT
  protected model = 'llama-3.1-8b-instant'

  protected async assembleContext(context: AgentContext): Promise<string> {
    return JSON.stringify({
      projectId: context.projectId,
      task: context.options.task,
      schemaFragment: context.options.schemaFragment,
      apiFragment: context.options.apiFragment,
      acceptanceCriteria: context.options.acceptanceCriteria,
      techStack: context.options.techStack,
      milestone: context.options.milestone,
    }, null, 2)
  }

  protected buildPrompt(context: string): string {
    return `Assemble a coding prompt using the canonical template:

${context}

Template:
## Task: {task.title}

### Context
{One or two sentences: what this task accomplishes and why}

### Relevant Schema
{Embedded schema fragment for entities this task touches}

### Relevant API Contract
{Embedded endpoint fragment for endpoints this task touches}

### Acceptance Criteria
{Given/When/Then criteria verbatim}

### Constraints
{Tech stack / architecture constraints}

### Out of Scope for This Task
{Explicit boundary from milestone sequencing}

Return as markdown.`
  }

  protected parseOutput(output: string): Record<string, unknown> {
    return { content: output, format: 'markdown' }
  }
}

export const promptAgent = new PromptAgent()