import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  PenTool,
  Code2,
  Database,
  Layers,
  Zap,
  Rocket,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { IDE, type ProjectOutput } from "@/components/IDE";

interface ScrumMasterOutput {
  projectScope: string;
  architecture: string;
  roadmap: string[];
  stackRecommendation: string;
}

interface UIUXOutput {
  designSystem: string;
  uxStrategy: string;
  pageStructure: string[];
  responsiveBehavior: string;
}

interface FrontendOutput {
  componentArchitecture: string;
  reactStructure: string;
  pages: string[];
  stateManagement: string;
}

interface BackendOutput {
  apis: string[];
  databaseSchema: string;
  authentication: string;
  backendArchitecture: string;
}

interface GenerateAppOutput {
  scrumMaster: ScrumMasterOutput;
  uiux: UIUXOutput;
  frontend: FrontendOutput;
  backend: BackendOutput;
}

type AgentStatus = "idle" | "working" | "done";

interface Agent {
  key: keyof GenerateAppOutput;
  name: string;
  task: string;
  icon: typeof Bot;
  color: string;
  status: AgentStatus;
  progress: number;
}

const BASE_AGENTS: Omit<Agent, "status" | "progress">[] = [
  { key: "scrumMaster", name: "Scrum Master", task: "Analyzing requirements", icon: Bot, color: "text-blue-400" },
  { key: "uiux", name: "UI/UX Designer", task: "Designing wireframes", icon: PenTool, color: "text-purple-400" },
  { key: "frontend", name: "Front-End Dev", task: "Generating components", icon: Code2, color: "text-cyan-400" },
  { key: "backend", name: "Back-End Dev", task: "Structuring APIs", icon: Database, color: "text-emerald-400" },
];

const features = [
  { title: "AI Scrum Master", description: "Breaks down your idea into actionable epics, sprints, and tasks.", icon: Bot },
  { title: "Senior UI/UX Designer", description: "Crafts a premium design system and high-fidelity wireframes.", icon: PenTool },
  { title: "Senior Front-End Engineer", description: "Builds pixel-perfect React components with smooth animations.", icon: Code2 },
  { title: "Senior Back-End Engineer", description: "Architects scalable databases and secure, fast APIs.", icon: Database },
  { title: "Automated Architecture", description: "Chooses the optimal stack for your specific requirements.", icon: Layers },
  { title: "Deploy Ready Projects", description: "Generates Vercel, Docker, and CI/CD configurations automatically.", icon: Rocket },
];

function TypewriterText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateAppOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(
    BASE_AGENTS.map((a) => ({ ...a, status: "idle", progress: 0 }))
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const ideRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<ProjectOutput | null>(null);
  const [ideGenerating, setIdeGenerating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showIDE, setShowIDE] = useState(false);

  const generateProject = async (blueprint: GenerateAppOutput) => {
    setIdeGenerating(true);
    setShowIDE(true);
    setTerminalLogs(["$ npx create-next-app@latest --typescript --tailwind"]);

    const logs = [
      "Installing dependencies...",
      "$ npm install @supabase/supabase-js clsx tailwind-merge",
      "Creating folder structure...",
      "→ app/ components/ lib/ hooks/ types/",
      "Generating components...",
      "Configuring TailwindCSS...",
      "Setting up Supabase client...",
      "Generating API routes...",
      "Writing TypeScript types...",
      "Generating live preview...",
      "Finalizing project configuration...",
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 750);

    setTimeout(() => {
      ideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const res = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), blueprint }),
      });
      if (!res.ok) throw new Error("Failed to generate project files");
      const projectData: ProjectOutput = await res.json();
      clearInterval(interval);
      setTerminalLogs((prev) => [...prev, "✓ Project generated successfully!", "✓ Preview ready — open the Preview tab"]);
      setProject(projectData);
    } catch (err) {
      clearInterval(interval);
      setTerminalLogs((prev) => [...prev, `Error: ${err instanceof Error ? err.message : "Unknown error"}`]);
    } finally {
      setIdeGenerating(false);
    }
  };

  const animateAgents = () => {
    const targets = [92, 67, 45, 31];
    agents.forEach((_, i) => {
      setTimeout(() => {
        setAgents((prev) => prev.map((a, j) => (j === i ? { ...a, status: "working", progress: 0 } : a)));
        let p = 0;
        const tick = setInterval(() => {
          p += Math.random() * 8 + 3;
          if (p >= targets[i]) {
            p = targets[i];
            clearInterval(tick);
            setAgents((prev) => prev.map((a, j) => (j === i ? { ...a, status: "done", progress: p } : a)));
          } else {
            setAgents((prev) => prev.map((a, j) => (j === i ? { ...a, progress: Math.round(p) } : a)));
          }
        }, 120);
      }, i * 600);
    });
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAgents(BASE_AGENTS.map((a) => ({ ...a, status: "idle", progress: 0 })));
    animateAgents();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Generation failed");
      }
      const data: GenerateAppOutput = await res.json();
      setResult(data);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
      generateProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setAgents(BASE_AGENTS.map((a) => ({ ...a, status: "idle", progress: 0 })));
    } finally {
      setLoading(false);
    }
  };

  const agentBarColors: Record<string, string> = {
    "text-blue-400": "bg-blue-500",
    "text-purple-400": "bg-purple-500",
    "text-cyan-400": "bg-cyan-500",
    "text-emerald-400": "bg-emerald-500",
  };

  const scrollToInput = () => {
    document.getElementById("input-section")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden relative selection:bg-primary selection:text-white">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-violet-600/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-cyan-600/15 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">DevSquad AI</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Button
              onClick={scrollToInput}
              className="bg-primary hover:bg-primary/90 text-white border-0 h-9 px-4 text-sm shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
            >
              Create App
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-[#0B0F19]/95 border-b border-white/5 px-4 overflow-hidden"
            >
              <div className="py-3 space-y-1">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                    <Layers className="w-4 h-4" /> Dashboard
                  </div>
                </Link>
                <button onClick={scrollToInput} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                  <Sparkles className="w-4 h-4" /> Create App
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-20 sm:pt-28 pb-20 relative z-10">
        {/* ── Hero ── */}
        <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-[1.1]"
          >
            Your AI Software<br className="hidden sm:block" />{" "}
            Development Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Describe your idea and let senior AI specialists architect, design and develop your
            application automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
          >
            <Button
              size="lg"
              onClick={scrollToInput}
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all border border-primary/50"
              data-testid="button-hero-create"
            >
              Create App <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all"
                data-testid="button-hero-demo"
              >
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* ── Input Section ── */}
        <section id="input-section" className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <Card className="relative bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 p-5 sm:p-8 rounded-2xl shadow-2xl">
            <h2 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              Describe Your App Idea
            </h2>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Create a food delivery app with admin dashboard and real-time order tracking."
              className="min-h-[120px] sm:min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 text-sm sm:text-base resize-none mb-4 sm:mb-6"
              data-testid="input-app-idea"
              disabled={loading}
            />
            {error && (
              <div className="flex items-start gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-3" data-testid="error-generate">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading || !idea.trim()}
              className="w-full sm:w-auto sm:ml-auto sm:flex h-11 sm:h-12 px-6 bg-secondary hover:bg-secondary/90 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              data-testid="button-generate"
            >
              {loading ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="mr-2 w-4 h-4" /> Generate Application</>
              )}
            </Button>
          </Card>
        </section>

        {/* ── Agent Cards ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Meet Your Squad</h2>
            <p className="text-sm sm:text-base text-gray-400">Autonomous agents working in parallel to build your vision.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-testid={`card-agent-${agent.key}`}
              >
                <Card className="bg-white/5 border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all hover:border-white/20 relative overflow-hidden h-full">
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    {agent.status === "done" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    ) : (
                      <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        {agent.status === "working" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 ${agent.status === "working" ? "bg-emerald-500" : "bg-gray-600"}`} />
                      </span>
                    )}
                  </div>
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center mb-3 sm:mb-4 ${agent.color}`}>
                    <agent.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 leading-tight">{agent.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 min-h-[1.25rem]">
                    {agent.status === "done" ? "Complete" : agent.status === "working" ? `${agent.task}...` : "Standby"}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${agentBarColors[agent.color] ?? "bg-primary"}`}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── AI Output Tabs ── */}
        <AnimatePresence>
          {result && (
            <motion.section
              ref={outputRef}
              key="output"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24"
              data-testid="section-output"
            >
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Generation complete
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Your Application Blueprint</h2>
                <p className="text-sm sm:text-base text-gray-400">AI-generated plan tailored to your specific idea.</p>
              </div>
              <Card className="bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 overflow-hidden">
                <Tabs defaultValue="scrum" className="w-full">
                  <TabsList className="w-full flex justify-start p-0 h-auto bg-transparent border-b border-white/10 rounded-none overflow-x-auto overflow-y-hidden">
                    {[
                      { value: "scrum", label: "Architecture" },
                      { value: "uiux", label: "UI/UX" },
                      { value: "frontend", label: "Front-End" },
                      { value: "backend", label: "Back-End" },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white rounded-none py-3 sm:py-4 px-4 sm:px-6 text-gray-400 flex-shrink-0 text-sm"
                        data-testid={`tab-${tab.value}`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="p-4 sm:p-6 md:p-8">
                    <TabsContent value="scrum" className="mt-0 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2 text-sm sm:text-base">
                            <Layers className="w-4 h-4" /> Project Scope
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.projectScope} />
                          </p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2 text-sm sm:text-base">
                            <Bot className="w-4 h-4" /> System Architecture
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.architecture} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2 text-sm sm:text-base">
                            <Rocket className="w-4 h-4" /> Stack Recommendation
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.stackRecommendation} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-purple-400 flex items-center gap-2 text-sm sm:text-base">
                            <CheckCircle2 className="w-4 h-4" /> Roadmap
                          </h4>
                          <div className="space-y-2">
                            {result.scrumMaster.roadmap.map((item, i) => (
                              <div key={i} className="text-xs sm:text-sm text-gray-300 bg-white/5 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/5 flex items-start gap-2" data-testid={`roadmap-item-${i}`}>
                                <span className="text-primary font-mono text-[10px] sm:text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="uiux" className="mt-0 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2 text-sm sm:text-base"><PenTool className="w-4 h-4" /> Design System</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.uiux.designSystem} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2 text-sm sm:text-base"><Zap className="w-4 h-4" /> UX Strategy</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.uiux.uxStrategy} speed={8} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3 md:col-span-2">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2 text-sm sm:text-base"><Layers className="w-4 h-4" /> Page Structure</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {result.uiux.pageStructure.map((page, i) => (
                              <div key={i} className="text-xs sm:text-sm text-gray-300 bg-white/5 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/5 flex items-start gap-2" data-testid={`uiux-page-${i}`}>
                                <span className="text-secondary font-mono text-[10px] sm:text-xs mt-0.5 flex-shrink-0">PG</span>
                                {page}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3 md:col-span-2">
                          <h4 className="font-medium text-purple-400 text-sm sm:text-base">Responsive Behavior</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">{result.uiux.responsiveBehavior}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="frontend" className="mt-0 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-cyan-400 flex items-center gap-2 text-sm sm:text-base"><Code2 className="w-4 h-4" /> Component Architecture</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.frontend.componentArchitecture} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2 text-sm sm:text-base"><Layers className="w-4 h-4" /> React Structure</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.frontend.reactStructure} speed={8} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2 text-sm sm:text-base"><Rocket className="w-4 h-4" /> Pages</h4>
                          <div className="space-y-1.5">
                            {result.frontend.pages.map((page, i) => (
                              <div key={i} className="font-mono text-[11px] sm:text-xs text-gray-300 bg-white/5 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/5" data-testid={`frontend-page-${i}`}>{page}</div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-emerald-400 text-sm sm:text-base">State Management</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">{result.frontend.stateManagement}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="backend" className="mt-0 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3 md:col-span-2">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2 text-sm sm:text-base"><Database className="w-4 h-4" /> API Routes</h4>
                          <div className="space-y-1.5">
                            {result.backend.apis.map((api, i) => (
                              <div key={i} className="font-mono text-[11px] sm:text-xs text-gray-300 bg-white/5 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/5 flex items-center gap-2 sm:gap-3" data-testid={`backend-api-${i}`}>
                                <span className={`text-[10px] sm:text-xs font-bold flex-shrink-0 ${api.startsWith("POST") ? "text-emerald-400" : api.startsWith("GET") ? "text-blue-400" : api.startsWith("PUT") || api.startsWith("PATCH") ? "text-yellow-400" : api.startsWith("DELETE") ? "text-red-400" : "text-gray-400"}`}>
                                  {api.split(" ")[0]}
                                </span>
                                <span className="truncate">{api.split(" ").slice(1).join(" ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2 text-sm sm:text-base"><Layers className="w-4 h-4" /> Database Schema</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.backend.databaseSchema} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2 text-sm sm:text-base"><Zap className="w-4 h-4" /> Authentication</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5"><TypewriterText text={result.backend.authentication} speed={8} /></p>
                        </div>
                        <div className="space-y-2 sm:space-y-3 md:col-span-2">
                          <h4 className="font-medium text-purple-400 text-sm sm:text-base">Backend Architecture</h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-3 sm:p-4 border border-white/5">{result.backend.backendArchitecture}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── IDE Section ── */}
        <AnimatePresence>
          {showIDE && (
            <motion.section
              ref={ideRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-2 sm:px-6 mb-16 sm:mb-24"
              data-testid="section-ide"
            >
              <div className="text-center mb-6 sm:mb-10 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-3">
                  {ideGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Code2 className="w-3.5 h-3.5" />}
                  {ideGenerating ? "Building project files..." : "Project Ready"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Interactive IDE</h2>
                <p className="text-sm text-gray-400">View and export your generated project.</p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.15)] border border-white/10">
                {project ? (
                  <IDE
                    project={project}
                    terminalLogs={terminalLogs}
                    isGenerating={ideGenerating}
                    onClose={() => setShowIDE(false)}
                  />
                ) : (
                  <div className="min-h-[60vh] sm:min-h-[80vh] flex flex-col w-full bg-[#0d1117]">
                    <div className="h-11 bg-[#010409] border-b border-white/10 flex items-center px-4">
                      <div className="w-32 sm:w-48 h-3 bg-white/5 rounded animate-pulse" />
                    </div>
                    <div className="flex flex-1">
                      <div className="hidden sm:block w-[210px] bg-[#010409] border-r border-white/10 p-4">
                        <div className="space-y-3">
                          {[1, 0.75, 0.85].map((w, i) => (
                            <div key={i} className="h-3.5 bg-white/5 rounded animate-pulse" style={{ width: `${w * 100}%` }} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center relative gap-3">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
                        <p className="text-gray-400 font-mono text-xs sm:text-sm">Generating workspace...</p>
                        <div className="absolute bottom-0 left-0 w-full bg-[#0a0d14] border-t border-white/10 p-3 sm:p-4 max-h-[150px] sm:max-h-[200px] overflow-hidden">
                          {terminalLogs.map((log, i) => (
                            <div key={i} className="text-emerald-400 font-mono text-[11px] sm:text-[13px] flex">
                              <span className="text-gray-600 mr-3">❯</span>{log}
                            </div>
                          ))}
                          <div className="text-emerald-400 font-mono text-[11px] sm:text-[13px] flex">
                            <span className="text-gray-600 mr-3">❯</span><span className="animate-pulse">_</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Features ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Everything You Need</h2>
            <p className="text-sm sm:text-base text-gray-400">From concept to production, fully automated.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                data-testid={`card-feature-${i}`}
              >
                <Card className="bg-white/5 border-white/10 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all h-full">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
