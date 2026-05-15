import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import { GenerateAppBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/generate", async (req, res) => {
  const parsed = GenerateAppBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request: 'idea' field is required." });
    return;
  }

  const { idea } = parsed.data;

  const prompt = `You are an expert AI software development team. A user has described their app idea below. 
Your job is to act as four senior specialists simultaneously and produce a detailed, professional, structured plan.

App Idea: "${idea}"

Respond ONLY with a valid JSON object (no markdown, no code fences, no explanation). Use exactly this structure:

{
  "scrumMaster": {
    "projectScope": "A detailed description of the project scope, goals, and success metrics (2-3 sentences)",
    "architecture": "The high-level system architecture description (2-3 sentences)",
    "roadmap": ["Sprint 1: ...", "Sprint 2: ...", "Sprint 3: ...", "Sprint 4: ...", "Sprint 5: ..."],
    "stackRecommendation": "Recommended full tech stack with justification (2-3 sentences)"
  },
  "uiux": {
    "designSystem": "Design system description including color palette, typography, spacing system, and component library recommendation (2-3 sentences)",
    "uxStrategy": "UX strategy covering user flows, key interactions, and accessibility approach (2-3 sentences)",
    "pageStructure": ["Page 1: Name — description", "Page 2: Name — description", "Page 3: Name — description", "Page 4: Name — description", "Page 5: Name — description"],
    "responsiveBehavior": "Responsive design strategy for mobile, tablet, and desktop (1-2 sentences)"
  },
  "frontend": {
    "componentArchitecture": "Component architecture description including atomic design principles and folder structure (2-3 sentences)",
    "reactStructure": "React project structure with key directories and patterns (2-3 sentences)",
    "pages": ["Page: Name — route and responsibilities", "Page: Name — route and responsibilities", "Page: Name — route and responsibilities", "Page: Name — route and responsibilities"],
    "stateManagement": "State management strategy including chosen library and patterns (1-2 sentences)"
  },
  "backend": {
    "apis": ["POST /api/resource — description", "GET /api/resource — description", "PUT /api/resource/:id — description", "DELETE /api/resource/:id — description", "GET /api/resource/search — description"],
    "databaseSchema": "Database schema description with main tables, relationships, and key fields (3-4 sentences)",
    "authentication": "Authentication strategy including chosen method, token handling, and security measures (2 sentences)",
    "backendArchitecture": "Backend architecture description including framework, patterns, and key services (2-3 sentences)"
  }
}`;

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
      req.log.error({ raw }, "Failed to parse Gemini JSON response");
      res.status(500).json({ error: "AI returned an unparseable response. Please try again." });
      return;
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Gemini generate error");
    res.status(500).json({ error: "AI generation failed. Please try again." });
  }
});

export default router;
