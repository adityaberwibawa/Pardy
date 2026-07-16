// Artifact type definitions
export type ArtifactType =
  | 'interview'
  | 'validation'
  | 'market_analysis'
  | 'prd'
  | 'brd'
  | 'user_story'
  | 'architecture'
  | 'db_schema'
  | 'api_contract'
  | 'task'
  | 'prompt'

export type StoryStatus = 'draft' | 'ready' | 'in_progress' | 'completed'
export type ProjectStatus = 'interview_pending' | 'in_progress' | 'completed' | 'archived'

// Artifact version with dependencies
export interface ArtifactVersion {
  id: string
  projectId: string
  artifactType: ArtifactType
  versionNumber: number
  supersededBy: string | null
  isStale: boolean
  staleReason: string | null
  createdBy: string
  createdAt: Date
}

// Dependency graph edge
export interface ArtifactDependency {
  id: string
  parentArtifactVersionId: string
  childArtifactVersionId: string
  createdAt: Date
}

// Interview data structure
export interface InterviewData {
  problem?: string
  targetUser?: string
  valueProposition?: string
  constraints?: {
    budget?: string
    timeline?: string
    teamSize?: string
  }
}

// PRD sections
export interface PrdSections {
  problem?: string
  goals?: string[]
  scope?: {
    inScope?: string[]
    outOfScope?: string[]
  }
  features?: Array<{
    id: string
    name: string
    description: string
    priority: 'P0' | 'P1' | 'P2'
  }>
  successCriteria?: string[]
}

// User story
export interface UserStory {
  artifactVersionId: string
  personaRef: string
  asA: string
  iWant: string
  soThat: string
  status: StoryStatus
}

// Acceptance criteria
export interface AcceptanceCriteria {
  id: string
  storyArtifactVersionId: string
  givenText?: string
  whenText?: string
  thenText?: string
}
