# Stackshare
Stackshare (Frontend) is a Next.js web app where developers, designers, marketers, and other professionals discover and publish curated AI tool stacks and step-by-step workflows. It's built for anyone looking to automate their work smarter — whether browsing trending workflows, rating tools, or submitting their own process with a live preview. It was built to make real-world AI productivity knowledge shareable and searchable in one community-driven hub.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Image Handling | Next.js Image + Cloudinary |
| API Layer | Next.js Route Handlers (proxy to backend) |
| Linting | ESLint + typescript-eslint |
| Font | Inter + Space Grotesk (Google Fonts) |

## Features

- **Workflow Discovery** — Browse, filter, and search published 
  workflows by role, category, or tool stack
- **Tool Catalogue** — Explore AI tools with ratings, reviews, 
  pricing tiers, alternatives, and best/poor use cases
- **Workflow Builder** — Multi-step form with live preview panel, 
  draft saving, and outcome file upload
- **Community Engagement** — Like, clone, and comment on workflows 
  with optimistic UI updates for instant feedback
- **Smart Filtering** — Sidebar filters for role, task type, and 
  pricing with real-time client-side filtering
- **Sorting & Pagination** — Sort workflows by Trending, Top Rated, 
  or Newest with server-driven pagination
- **Polished Animations** — Smooth page transitions, staggered card 
  entrances, and micro-interactions powered by Framer Motion
- **Responsive Design** — Mobile-friendly layout with a collapsible 
  navigation drawer and adaptive grid
- Protected Routes** — Auth-aware API proxying through Next.js route 
  handlers keeping tokens server-side
- Newsletter Signup** — Built-in subscription flow with disposable 
  email detection and validation

  ## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.x
- [Git](https://git-scm.com/)
- A running instance of 
  [WorkflowHub Server](https://github.com/your-username/workflowhub-server)

---

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/stackshare.git
   cd stackshare
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env.local
```

   Then open `.env.local` and fill in your values:
```env
   # Point this to your running WorkflowHub Server
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1

   # Optional: hardcoded token for dev testing
   NEXT_PUBLIC_ACCESS_TOKEN=your_dev_token_here
```

4. **Start the development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Building for Production
```bash
npm run build
npm start
```

## License

Distributed under the MIT License.
