# Mihirkumar Lad — Portfolio & Admin CMS

A premium, editorial portfolio website for **Mihirkumar Lad**, UI/UX Designer · Interaction Designer · Figma Specialist, paired with a secure admin CMS for managing all content — projects, case studies, skills, experience, education, social links, site settings, and contact messages.

Built with React 19, TanStack Start, Tailwind CSS v4, Framer Motion, and Supabase (Lovable Cloud).

---

## Highlights

- **Editorial, design-led aesthetic** — warm ivory paper backgrounds, deep ink text, and a rich oxblood/claret accent. Premium typography pairing of Manrope (sans) and Instrument Serif.
- **Light & dark themes** — persisted via localStorage, respects system preference on first visit, animated toggle.
- **Animated hero** — background-free avatar cut-out floating over a rotating conic aura sweep, a counter-rotating dashed orbit with an accent node, a breathing ground shadow, and staggered floating labels (desktop mouse parallax, disabled on touch / reduced-motion).
- **Selected work** — large alternating case-study rows with category, year, tools, and Figma prototype links.
- **Dynamic case studies** — each project (`/work/:slug`) renders overview, problem/goal, research, design system, gallery sections, user flow, and embedded Figma prototypes.
- **About** — design philosophy, experience timeline, and education.
- **Contact** — validated contact form writing to the `messages` table, plus a resume viewer (`/resume`) with inline PDF.
- **Admin CMS at `/admin`** — protected by Supabase Auth; the first signed-up account is auto-promoted to admin.
  - Project CRUD with image + multi-image uploads (gallery, wireframes, final UI, design exploration)
  - Tabbed editor for site settings, skills, experience, education, and social links
  - Message inbox with read/unread management
- **Premium interactions** — custom cursor, scroll progress, magnetic buttons, scroll-reveal animations, sticky nav with backdrop blur.
- **SEO** — per-route `head()` metadata (titles, descriptions, Open Graph), semantic HTML, lazy loading.

---

## Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | TanStack Start v1 (SSR/SSG) on React 19                 |
| Routing      | TanStack Router (file-based)                           |
| Data         | TanStack Query + server functions (`createServerFn`)   |
| Styling      | Tailwind CSS v4 (native `@import` + OKLCH theme tokens) |
| Animation    | Framer Motion                                          |
| Backend      | Supabase (Postgres, Auth, Storage) via Lovable Cloud   |
| Build        | Vite 7 (Cloudflare Worker target)                      |
| Language     | TypeScript                                             |

---

## Project Structure

```
src/
├─ routes/                # File-based routing
│  ├─ __root.tsx          # Root layout, nav/footer gating, theme provider
│  ├─ index.tsx           # Home (hero, selected work, process, skills)
│  ├─ work/
│  │  ├─ index.tsx        # Project gallery with category filters
│  │  └─ $slug.tsx        # Dynamic case study template
│  ├─ about.tsx           # Philosophy, experience, education
│  ├─ contact.tsx        # Contact form
│  ├─ resume.tsx          # Resume viewer / download
│  ├─ auth.tsx            # Sign in / sign up
│  └─ admin/             # Protected CMS
│     ├─ route.tsx        # Auth gate
│     ├─ index.tsx        # Dashboard stats
│     ├─ projects.tsx     # Project CRUD + image uploads
│     ├─ content.tsx      # Site settings, skills, experience, education, socials
│     └─ messages.tsx     # Contact message inbox
├─ sections/             # Hero, CTA, Sections (intro/process/skills/education)
├─ components/           # Navbar, Footer, ProjectCard, CustomCursor, Magnetic, etc.
│  └─ admin/             # ImageUpload, admin UI primitives
├─ lib/                  # Types, server functions, media utils, theme
├─ integrations/supabase/ # Auto-generated Supabase client + auth middleware
└─ styles.css            # Tailwind v4 theme tokens (palette, typography, tokens)
```

---

## Database

Managed in Supabase (Lovable Cloud). Tables are public-read for published content and admin-write only via RLS policies using the `has_role()` security-definer function.

| Table          | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `projects`     | Case studies — overview, research, galleries, Figma embeds   |
| `skills`       | Categorized skill list                                         |
| `experience`   | Roles/organizations timeline                                   |
| `education`    | Academic background                                            |
| `social_links` | External platform links                                        |
| `messages`     | Contact form submissions                                       |
| `site_settings`| Single-row site profile (hero, about, contact, avatar, resume)|
| `user_roles`   | `admin` / `user` role assignments                             |

**Storage:** a private `media` bucket holds project images and the resume PDF; signed URLs are generated on read. Public buckets are disabled.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (or use Lovable Cloud) with the env vars below

### Environment

The project reads Supabase config via Vite env vars (client) and `process.env` (SSR):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

These are managed automatically when the project is connected to Lovable Cloud. Do not commit secrets.

### Install & run

```bash
bun install
bun run dev        # start dev server
bun run build      # production build (Cloudflare Worker target)
bun run preview    # preview the production build
bun run lint       # eslint
bun run format     # prettier
```

---

## Admin Access

1. Visit `/auth` and create an account. The **first** account is automatically assigned the `admin` role by a database trigger.
2. Subsequent accounts receive the default `user` role and cannot access `/admin`.
3. Sign in at `/auth`; the admin dashboard is at `/admin`.

> Admin role checks are enforced server-side via RLS and the `has_role()` function — never via client-side storage.

---

## Design Tokens

All colors, shadows, and radii are semantic tokens defined in `src/styles.css` using OKLCH, themed through CSS variables for light/dark. The accent color (`--color-accent`) flows through the hero aura, links, focus rings, and UI elements — change it in one place to re-theme the whole site.

- **Light:** warm ivory paper background, deep ink text, oxblood/claret accent (`oklch(0.5 0.145 28)`).
- **Dark:** near-black canvas, soft paper text, brighter claret accent (`oklch(0.66 0.145 30)`).

---

## Deployment

The project targets Cloudflare Workers (Edge). On Lovable, publishing deploys automatically. To self-host:

1. Connect a GitHub repo from the Lovable chat (Plus menu → GitHub → Connect project).
2. Point Cloudflare Pages/Workers at the repo with build command `bun run build`.
3. Ensure Supabase env vars are present in the deployment environment.

---

## License

Personal portfolio for Mihirkumar Lad. Code structure may be referenced; personal content (projects, copy, imagery, avatar, resume) is not licensed for reuse.
