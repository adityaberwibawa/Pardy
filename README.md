# PARDI - AI Product Architect

Transform ideas into complete, implementation-ready software blueprints.

## What is PARDI?

PARDI is an AI-native SaaS product that takes you from a raw idea to a complete software specification:

**Idea → Validation → PRD → BRD → Stories → Architecture → Database → API → Tasks → Coding Prompts → Deployment Checklist**

Every stage produces a durable, versioned artifact. The database design is *derived from* user stories. The API contract is *derived from* the database design. Everything is traceable.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Next.js API Routes & Server Actions
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Drizzle ORM
- **AI**: Groq API (Llama 3, Mixtral models)
- **Cache/Queue**: Upstash Redis
- **Vector Search**: Supabase pg_vector extension
- **Deployment**: Vercel

## Project Structure

```
pardi/
├── apps/
│   └── web/                 # Next.js application
│       ├── app/             # App Router (routes, layouts, pages)
│       ├── components/      # React components
│       └── lib/             # Utilities
├── packages/
│   ├── domain/              # Domain logic (framework-agnostic)
│   ├── agents/              # AI agent implementations
│   ├── db/                  # Database schema & migrations
│   └── ui/                  # Design system components
└── docs/                    # Product documentation
```

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm 9+
- Supabase account (free tier)
- Groq API key (free tier)
- Upstash Redis account (optional for Phase 1)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityaberwibawa/Pardy.git
   cd Pardy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - from your Supabase project
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - from Supabase project settings
   - `SUPABASE_SERVICE_ROLE_KEY` - from Supabase project settings (keep secret!)
   - `GROQ_API_KEY` - from console.groq.com

4. **Setup Supabase database**
   ```bash
   # Run migrations (after Supabase project is created)
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

### Database Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Architecture

See `/docs` for comprehensive documentation:

- Product strategy and market research
- Complete functional and non-functional requirements
- System architecture and database design
- API specification
- Multi-agent AI workflow
- UI/UX design system
- Security, performance, and testing strategies

## Contributing

This is currently a solo-developed project following the Phase 1 MVP roadmap. Contributions welcome after initial launch.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please use GitHub Issues.

---

Built with ❤️ following the complete 32-file PRD in `/docs`
