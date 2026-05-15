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

  const prompt = `You are a senior full-stack engineer. Generate a complete, production-ready project scaffold for the following app idea.

App Idea: "${idea}"
Project Name: "${projectName}"

Default stack: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS v3, Supabase.

You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no explanation.

Use this exact structure:
{
  "projectName": "${projectName}",
  "stack": {
    "frontend": "Next.js 14 (App Router)",
    "styling": "TailwindCSS v3",
    "language": "TypeScript",
    "database": "Supabase (PostgreSQL)",
    "auth": "Supabase Auth",
    "deployment": "Vercel"
  },
  "folders": [
    "app",
    "app/api",
    "components",
    "components/ui",
    "lib",
    "hooks",
    "types",
    "public"
  ],
  "files": [
    {
      "path": "package.json",
      "content": "<full realistic package.json content as a JSON string with proper escaping>"
    },
    {
      "path": "tsconfig.json",
      "content": "<full tsconfig.json>"
    },
    {
      "path": "tailwind.config.ts",
      "content": "<full tailwind config>"
    },
    {
      "path": "next.config.ts",
      "content": "<full next config>"
    },
    {
      "path": "app/layout.tsx",
      "content": "<root layout with metadata, fonts, global styles>"
    },
    {
      "path": "app/page.tsx",
      "content": "<main landing page for this specific app idea>"
    },
    {
      "path": "app/globals.css",
      "content": "<tailwind directives and CSS variables>"
    },
    {
      "path": "components/Navbar.tsx",
      "content": "<responsive navbar specific to this app>"
    },
    {
      "path": "components/Hero.tsx",
      "content": "<hero section specific to this app>"
    },
    {
      "path": "lib/supabase.ts",
      "content": "<supabase client setup with createClient>"
    },
    {
      "path": "lib/utils.ts",
      "content": "<utility functions like cn() for classnames>"
    },
    {
      "path": "types/index.ts",
      "content": "<TypeScript interfaces and types for this app's domain models>"
    },
    {
      "path": "hooks/use-auth.ts",
      "content": "<custom hook for Supabase auth state>"
    },
    {
      "path": "app/api/route.ts",
      "content": "<main API route handler relevant to this app>"
    },
    {
      "path": ".env.local.example",
      "content": "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    },
    {
      "path": "README.md",
      "content": "<markdown README with setup instructions for this project>"
    }
  ]
}

IMPORTANT RULES:
- Every file must have complete, realistic, working code — not placeholders or comments like "add your code here"
- All code must be tailored to the specific app idea, not generic
- Package.json must include all real dependencies (next, react, react-dom, typescript, tailwindcss, @supabase/supabase-js, etc.)
- Use TypeScript strictly
- Components must be complete functional components with real JSX
- All strings must be properly JSON-escaped (no literal newlines inside JSON strings, use \\n)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const raw = response.text ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      req.log.error({ raw: raw.slice(0, 500) }, "Failed to parse Gemini JSON for project");
      res.status(500).json({ error: "AI returned an unparseable response. Please try again." });
      return;
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Gemini generate-project error");
    res.status(500).json({ error: "Project generation failed. Please try again." });
  }
});

export default router;
