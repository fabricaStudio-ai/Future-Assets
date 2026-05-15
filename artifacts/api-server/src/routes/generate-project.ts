import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import { GenerateProjectBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/generate-project", async (req, res) => {
  const parsed = GenerateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request: 'idea' field is required." });
    return;
  }

  const { idea, projectName: rawName } = parsed.data;
  const projectName = (rawName ?? idea.split(" ").slice(0, 3).join("-").toLowerCase().replace(/[^a-z0-9-]/g, "-")).slice(0, 40);

  const prompt = `You are a world-class senior full-stack engineer at a top tech company. Generate a complete, production-ready, immediately runnable project scaffold.

App Idea: "${idea}"
Project Name: "${projectName}"

Stack: Next.js 14 (App Router), TypeScript 5, TailwindCSS v3, Supabase.

RESPOND WITH ONLY a valid JSON object. No markdown, no code fences, no explanation whatsoever.

JSON structure:
{
  "projectName": "${projectName}",
  "stack": {
    "frontend": "Next.js 14 (App Router)",
    "styling": "TailwindCSS v3",
    "language": "TypeScript 5",
    "database": "Supabase (PostgreSQL)",
    "auth": "Supabase Auth",
    "deployment": "Vercel"
  },
  "folders": ["app","app/api","components","components/ui","lib","hooks","types","public"],
  "files": [
    {
      "path": "package.json",
      "content": "{\\n  \\"name\\": \\"${projectName}\\",\\n  \\"version\\": \\"0.1.0\\",\\n  \\"private\\": true,\\n  \\"scripts\\": {\\n    \\"dev\\": \\"next dev\\",\\n    \\"build\\": \\"next build\\",\\n    \\"start\\": \\"next start\\",\\n    \\"lint\\": \\"next lint\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"next\\": \\"14.2.3\\",\\n    \\"react\\": \\"^18\\",\\n    \\"react-dom\\": \\"^18\\",\\n    \\"@supabase/supabase-js\\": \\"^2.43.0\\",\\n    \\"@supabase/ssr\\": \\"^0.3.0\\",\\n    \\"clsx\\": \\"^2.1.1\\",\\n    \\"tailwind-merge\\": \\"^2.3.0\\"\\n  },\\n  \\"devDependencies\\": {\\n    \\"typescript\\": \\"^5\\",\\n    \\"@types/node\\": \\"^20\\",\\n    \\"@types/react\\": \\"^18\\",\\n    \\"@types/react-dom\\": \\"^18\\",\\n    \\"tailwindcss\\": \\"^3.4.1\\",\\n    \\"postcss\\": \\"^8\\",\\n    \\"autoprefixer\\": \\"^10.0.1\\",\\n    \\"eslint\\": \\"^8\\",\\n    \\"eslint-config-next\\": \\"14.2.3\\"\\n  }\\n}"
    },
    {
      "path": "tsconfig.json",
      "content": "<complete tsconfig.json for Next.js 14 with strict mode, path aliases @/* -> ./src/*>"
    },
    {
      "path": "tailwind.config.ts",
      "content": "<complete tailwind config with content paths for app and components, extend theme with brand colors tailored to this app idea>"
    },
    {
      "path": "next.config.ts",
      "content": "<minimal next.config.ts with typescript and tailwind setup>"
    },
    {
      "path": "app/layout.tsx",
      "content": "<complete root layout: imports Inter font, sets metadata with app-specific title and description, wraps children in html/body with dark mode class>"
    },
    {
      "path": "app/page.tsx",
      "content": "<COMPLETE landing page component SPECIFIC to this app idea — not generic. Include: header/nav, hero section with app-specific headline and CTA, features section with 3-4 specific features, footer. Use Tailwind classes. Export default function Home().>"
    },
    {
      "path": "app/globals.css",
      "content": "@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\n\\n@layer base {\\n  :root {\\n    --background: 0 0% 100%;\\n    --foreground: 240 10% 3.9%;\\n  }\\n  .dark {\\n    --background: 240 10% 3.9%;\\n    --foreground: 0 0% 98%;\\n  }\\n  * { @apply border-border; }\\n  body { @apply bg-background text-foreground; }\\n}"
    },
    {
      "path": "components/Navbar.tsx",
      "content": "<complete responsive Navbar component with logo, navigation links specific to this app, a CTA button, mobile menu state. Use TypeScript. Export default.>"
    },
    {
      "path": "components/Hero.tsx",
      "content": "<complete Hero component with app-specific headline, subheadline, two CTA buttons, and a visual element (stat badges or feature pill badges). Props interface. Export default.>"
    },
    {
      "path": "components/ui/Button.tsx",
      "content": "<reusable Button component with variant prop (primary, secondary, ghost, outline), size prop (sm, md, lg), className merge. Uses clsx. Export default and ButtonProps.>"
    },
    {
      "path": "lib/supabase.ts",
      "content": "<createClient from @supabase/supabase-js with NEXT_PUBLIC env vars, typed with Database generic (use unknown for now). Export supabase client singleton.>"
    },
    {
      "path": "lib/utils.ts",
      "content": "import { type ClassValue, clsx } from \\"clsx\\";\\nimport { twMerge } from \\"tailwind-merge\\";\\n\\nexport function cn(...inputs: ClassValue[]) {\\n  return twMerge(clsx(inputs));\\n}\\n\\nexport function formatDate(date: Date | string): string {\\n  return new Intl.DateTimeFormat(\\"en-US\\", {\\n    year: \\"numeric\\",\\n    month: \\"long\\",\\n    day: \\"numeric\\",\\n  }).format(new Date(date));\\n}\\n\\nexport function truncate(str: string, length: number): string {\\n  return str.length > length ? str.substring(0, length) + \\"...\\" : str;\\n}"
    },
    {
      "path": "types/index.ts",
      "content": "<TypeScript interfaces and types SPECIFIC to this app's domain. Define 3-5 key domain models with proper typing, optional fields marked with ?, include status enums where relevant.>"
    },
    {
      "path": "hooks/use-auth.ts",
      "content": "<complete React hook using @supabase/supabase-js: tracks user session state, exposes user, session, signIn, signOut, loading. useEffect for onAuthStateChange.>"
    },
    {
      "path": "app/api/route.ts",
      "content": "<Next.js App Router API route (Route Handler) with GET and POST handlers relevant to the core functionality of this app. Typed Request/Response, uses Supabase server client, returns proper JSON responses.>"
    },
    {
      "path": ".env.local.example",
      "content": "# Supabase\\nNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\\n\\n# App\\nNEXT_PUBLIC_APP_URL=http://localhost:3000"
    },
    {
      "path": "README.md",
      "content": "<professional README with: project title, description specific to the idea, tech stack table, quick start (clone, install, env setup, dev), folder structure overview, deployment guide for Vercel, Supabase setup steps>"
    },
    {
      "path": "preview.html",
      "content": "<CRITICAL: A complete, standalone, self-contained HTML file that visually previews this app in a browser. Requirements: (1) NO external dependencies — embed Tailwind CSS via CDN script tag: <script src=\\"https://cdn.tailwindcss.com\\"></script>. (2) Include realistic, app-specific content — actual page title, navigation with relevant links, hero section with specific headline and CTA button for THIS app, 3 feature cards with icons (use Unicode emoji icons), a simple footer. (3) Use a modern dark color scheme appropriate for this app. (4) The HTML must be 100% complete — starting with <!DOCTYPE html> and ending with </html>. (5) All CSS must be Tailwind utility classes only. (6) No React, no JSX, no TypeScript — pure HTML only. (7) Must render correctly in a sandboxed iframe. Return the entire HTML as a JSON string with proper escaping.>"
    }
  ]
}

CRITICAL RULES — failure to follow these will break the app:
1. Every file content must be a complete, working implementation — zero placeholders like "// TODO" or "add your code here"
2. All code must be SPECIFIC to the app idea ("${idea}") — no generic boilerplate
3. JSON strings must use \\n for newlines, \\" for quotes inside strings — never literal newlines inside JSON string values
4. preview.html must be 100% standalone — no external URLs except the Tailwind CDN script
5. TypeScript interfaces in types/index.ts must reflect the actual domain of this specific app
6. The app/page.tsx hero section headline must specifically describe what "${idea}" does
7. All JSX in .tsx files must have proper React import-free syntax (React 17+ JSX transform)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const raw = response.text ?? "";

    let result: unknown;
    try {
      result = JSON.parse(raw);
    } catch {
      req.log.error({ raw: raw.slice(0, 500) }, "Failed to parse Gemini JSON for project");
      res.status(500).json({ error: "AI returned an unparseable response. Please try again." });
      return;
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Gemini generate-project error");
    res.status(500).json({ error: "Project generation failed. Please try again." });
  }
});

export default router;
