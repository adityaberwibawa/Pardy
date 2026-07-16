import { streamCompletion, completePrompt } from '../lib/groq-client'
import { ArtifactType, ArtifactVersion } from '@pardi/domain/artifacts'

export interface AgentContext {
  projectId: string
  artifactContextRefs: string[] // artifact_version_ids
  stage: string
  options: Record<string, unknown>
}

export interface AgentResponse {
  output: Record<string, unknown>
  reviewFlags?: Array<{
    severity: 'info' | 'warning' | 'error'
    artifactRef: string
    description: string
  }>
  sourceRefs: Record<string, string>
}

export abstract class BaseAgent {
  protected abstract systemPrompt: string
  protected abstract model: string

  async execute(context: AgentContext): Promise<AgentResponse> {
    const assembledContext = await this.assembleContext(context)
    const prompt = this.buildPrompt(assembledContext)
    
    const output = await this.generateOutput(prompt)
    const reviewFlags = await this.runReview(output, context)
    
    return {
      output,
      reviewFlags,
      sourceRefs: this.extractSourceRefs(context.artifactContextRefs),
    }
  }

  async *streamExecute(context: AgentContext): AsyncGenerator<{
    type: 'progress' | 'partial' | 'review_flag' | 'complete' | 'error'
    data: unknown
  }> {
    const assembledContext = await this.assembleContext(context)
    const prompt = this.buildPrompt(assembledContext)
    
    let fullOutput = ''
    
    try {
      for await (const chunk of streamCompletion(prompt, this.systemPrompt, this.model)) {
        fullOutput += chunk.content
        
        if (!chunk.done) {
          yield { type: 'partial', data: { content: chunk.content } }
        }
      }
      
      const output = this.parseOutput(fullOutput)
      const reviewFlags = await this.runReview(output, context)
      
      yield { type: 'complete', data: { output, reviewFlags, sourceRefs: this.extractSourceRefs(context.artifactContextRefs) } }
    } catch (error) {
      yield { type: 'error', data: { error: (error as Error).message } }
    }
  }

  protected abstract assembleContext(context: AgentContext): Promise<string>
  protected abstract buildPrompt(context: string): string
  protected abstract parseOutput(output: string): Record<string, unknown>
  
  protected async generateOutput(prompt: string): Promise<Record<string, unknown>> {
    const raw = await completePrompt(prompt, this.systemPrompt, this.model)
    return this.parseOutput(raw)
  }

  protected async runReview(output: Record<string, unknown>, context: AgentContext): Promise<Array<{
    severity: 'info' | 'warning' | 'error'
    artifactRef: string
    description: string
  }>> {
    return []
  }

  protected extractSourceRefs(artifactRefs: string[]): Record<string, string> {
    const refs: Record<string, string> = {}
    artifactRefs.forEach((ref, index) => {
      refs[`source_${index}`] = ref
    })
    return refs
  }
}