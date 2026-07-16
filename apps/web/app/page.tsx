export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            PARDI
          </h1>
          <p className="text-xl text-muted-foreground">
            AI Product Architect
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform ideas into complete, implementation-ready software blueprints.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/sign-up"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/sign-in"
            className="px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
          >
            Sign In
          </a>
        </div>

        <div className="pt-12 text-sm text-muted-foreground">
          <p>Building Phase 1 MVP...</p>
          <p className="mt-2">
            Idea → Validation → PRD → BRD → Stories → Architecture → Database → API → Tasks → Prompts
          </p>
        </div>
      </div>
    </main>
  )
}
