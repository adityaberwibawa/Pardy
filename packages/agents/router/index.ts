import { PMAgent, pmAgent } from './pm-agent'
import { ArchitectAgent, architectAgent } from './architect-agent'
import { DBAgent, dbAgent } from './db-agent'
import { BackendAgent, backendAgent } from './backend-agent'
import { ReviewerAgent, reviewerAgent } from './reviewer-agent'
import { PromptAgent, promptAgent } from './prompt-agent'
import { BaseAgent, AgentContext, AgentResponse } from './base-agent'

export interface RouterConfig {
  pm: BaseAgent
  architect: BaseAgent
  db: BaseAgent
  backend: BaseAgent
  reviewer: BaseAgent
  prompt: BaseAgent
}

export class AgentRouter {
  private agents: RouterConfig

  constructor(config?: Partial<RouterConfig>) {
    this.agents = {
      pm: config?.pm || pmAgent,
      architect: config?.architect || architectAgent,
      db: config?.db || dbAgent,
      backend: config?.backend || backendAgent,
      reviewer: config?.reviewer || reviewerAgent,
      prompt: config?.prompt || promptAgent,
    }
  }

  async dispatch(
    stage: string,
    context: AgentContext
  ): Promise<AgentResponse> {
    // Validate dependency contract before dispatch
    const validation = await this.validateDependencies(stage, context)
    if (!validation.valid) {
      throw new Error(`Dependency validation failed: ${validation.reason}`)
    }

    let agent: BaseAgent
    let runReviewer = false
    const reviewerTransition = this.getReviewerTransition(stage)

    switch (stage) {
      case 'interview':
      case 'validation':
        agent = this.agents.pm
        break
      case 'prd':
      case 'brd':
        agent = this.agents.pm
        break
      case 'architecture':
        agent = this.agents.architect
        runReviewer = true
        break
      case 'database':
        agent = this.agents.db
        runReviewer = true
        break
      case 'api':
        agent = this.agents.backend
        runReviewer = true
        break
      case 'tasks':
        agent = this.agents.architect // Task breakdown uses architect for component mapping
        runReviewer = true
        break
      case 'prompts':
        agent = this.agents.prompt
        break
      default:
        throw new Error(`Unknown stage: ${stage}`)
    }

    // Execute agent
    const result = await agent.execute(context)

    // Run reviewer if needed
    if (runReviewer && reviewerTransition) {
      const reviewResult = await this.agents.reviewer.execute({
        ...context,
        stage: 'review',
        options: {
          ...context.options,
          transition: reviewerTransition,
          downstreamRef: context.artifactContextRefs[0],
        },
      })
      if (reviewResult.reviewFlags && reviewResult.reviewFlags.length > 0) {
        result.reviewFlags = [...(result.reviewFlags || []), ...reviewResult.reviewFlags]
      }
    }

    return result
  }

  async *streamDispatch(
    stage: string,
    context: AgentContext
  ): AsyncGenerator<{
    type: 'progress' | 'partial' | 'review_flag' | 'complete' | 'error'
    data: unknown
  }> {
    const validation = await this.validateDependencies(stage, context)
    if (!validation.valid) {
      yield { type: 'error', data: { error: validation.reason } }
      return
    }

    let agent: BaseAgent
    const reviewerTransition = this.getReviewerTransition(stage)

    switch (stage) {
      case 'interview':
      case 'validation':
      case 'prd':
      case 'brd':
        agent = this.agents.pm
        break
      case 'architecture':
        agent = this.agents.architect
        break
      case 'database':
        agent = this.agents.db
        break
      case 'api':
        agent = this.agents.backend
        break
      case 'tasks':
        agent = this.agents.architect
        break
      case 'prompts':
        agent = this.agents.prompt
        break
      default:
        yield { type: 'error', data: { error: `Unknown stage: ${stage}` } }
        return
    }

    for await (const chunk of agent.streamExecute(context)) {
      yield chunk
    }

    // Run reviewer after completion
    if (reviewerTransition) {
      const reviewResult = await this.agents.reviewer.execute({
        ...context,
        stage: 'review',
        options: {
          ...context.options,
          transition: reviewerTransition,
          downstreamRef: context.artifactContextRefs[0],
        },
      })
      if (reviewResult.reviewFlags && reviewResult.reviewFlags.length > 0) {
        yield { type: 'review_flag', data: reviewResult.reviewFlags }
      }
    }
  }

  private async validateDependencies(
    stage: string,
    context: AgentContext
  ): Promise<{ valid: boolean; reason?: string }> {
    const requiredUpstream: Record<string, string[]> = {
      validation: ['interview'],
      prd: ['interview', 'validation'],
      brd: ['prd'],
      architecture: ['user_story:ready'],
      database: ['user_story:ready', 'architecture'],
      api: ['db_schema'],
      tasks: ['architecture', 'api'],
      prompts: ['task'],
    }

    const required = requiredUpstream[stage] || []
    // In production, check actual artifact statuses in database
    // For now, return valid
    return { valid: true }
  }

  private getReviewerTransition(stage: string): string | null {
    const transitions: Record<string, string> = {
      architecture: 'stories_to_architecture',
      database: 'architecture_to_database',
      api: 'database_to_api',
      tasks: 'api_to_tasks',
    }
    return transitions[stage] || null
  }
}

export const agentRouter = new AgentRouter()