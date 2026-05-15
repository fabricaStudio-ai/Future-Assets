import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

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
  { key: "scrumMaster", name: "Scrum Master Senior", task: "Analyzing requirements", icon: Bot, color: "text-blue-400" },
  { key: "uiux", name: "UI/UX Senior", task: "Designing wireframes", icon: PenTool, color: "text-purple-400" },
  { key: "frontend", name: "Front-End Senior", task: "Generating components", icon: Code2, color: "text-cyan-400" },
  { key: "backend", name: "Back-End Senior", task: "Structuring APIs", icon: Database, color: "text-emerald-400" },
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
  const outputRef = useRef<HTMLDivElement>(null);

  const animateAgents = () => {
    const targets = [92, 67, 45, 31];
    agents.forEach((_, i) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a, j) => (j === i ? { ...a, status: "working", progress: 0 } : a))
        );
        let p = 0;
        const tick = setInterval(() => {
          p += Math.random() * 8 + 3;
          if (p >= targets[i]) {
            p = targets[i];
            clearInterval(tick);
            setAgents((prev) =>
              prev.map((a, j) => (j === i ? { ...a, status: "done", progress: p } : a))
            );
          } else {
            setAgents((prev) =>
              prev.map((a, j) => (j === i ? { ...a, progress: Math.round(p) } : a))
            );
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setAgents(BASE_AGENTS.map((a) => ({ ...a, status: "idle", progress: 0 })));
    } finally {
      setLoading(false);
    }
  };

  const agentColors: Record<string, string> = {
    "text-blue-400": "bg-blue-500",
    "text-purple-400": "bg-purple-500",
    "text-cyan-400": "bg-cyan-500",
    "text-emerald-400": "bg-emerald-500",
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative selection:bg-primary selection:text-white">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B0F19]/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">DevSquad AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
                Create App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 container mx-auto px-6 relative z-10">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500"
          >
            Your AI Software <br className="hidden md:block" /> Development Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Describe your idea and let senior AI specialists architect, design and develop your
            application automatically.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById("input-section")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto text-base h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all border border-primary/50"
              data-testid="button-hero-create"
            >
              Create App <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base h-14 px-8 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all"
                data-testid="button-hero-demo"
              >
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Input Section */}
        <section id="input-section" className="max-w-4xl mx-auto mb-24 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <Card className="relative bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> Describe Your App Idea
            </h2>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Create a food delivery app with admin dashboard and real-time order tracking."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 text-lg resize-none mb-6"
              data-testid="input-app-idea"
              disabled={loading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3" data-testid="error-generate">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                className="bg-secondary hover:bg-secondary/90 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                data-testid="button-generate"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" /> Generate Application
                  </>
                )}
              </Button>
            </div>
          </Card>
        </section>

        {/* Agents Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Your Squad</h2>
            <p className="text-gray-400">Autonomous agents working in parallel to build your vision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`card-agent-${agent.key}`}
              >
                <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all hover:border-white/20 group relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    {agent.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="relative flex h-3 w-3">
                        {agent.status === "working" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-3 w-3 ${
                            agent.status === "working"
                              ? "bg-emerald-500"
                              : "bg-gray-600"
                          }`}
                        />
                      </span>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${agent.color}`}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 h-5">
                    {agent.status === "done" ? "Complete" : agent.status === "working" ? `${agent.task}...` : "Standby"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${agentColors[agent.color] ?? "bg-primary"}`}
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

        {/* AI-Generated Output */}
        <AnimatePresence>
          {result && (
            <motion.section
              ref={outputRef}
              key="output"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
              data-testid="section-output"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
                  <CheckCircle2 className="w-4 h-4" /> Generation complete
                </div>
                <h2 className="text-3xl font-bold mb-4">Your Application Blueprint</h2>
                <p className="text-gray-400">AI-generated plan tailored to your specific idea.</p>
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
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white rounded-none py-4 px-6 text-gray-400 flex-shrink-0"
                        data-testid={`tab-${tab.value}`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="p-6 md:p-8">
                    {/* Architecture / Scrum Tab */}
                    <TabsContent value="scrum" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Project Scope
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.projectScope} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2">
                            <Bot className="w-4 h-4" /> System Architecture
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.architecture} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2">
                            <Rocket className="w-4 h-4" /> Stack Recommendation
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.scrumMaster.stackRecommendation} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-purple-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Roadmap
                          </h4>
                          <div className="space-y-2">
                            {result.scrumMaster.roadmap.map((item, i) => (
                              <div
                                key={i}
                                className="text-sm text-gray-300 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5 flex items-start gap-2"
                                data-testid={`roadmap-item-${i}`}
                              >
                                <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* UI/UX Tab */}
                    <TabsContent value="uiux" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <PenTool className="w-4 h-4" /> Design System
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.uiux.designSystem} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2">
                            <Zap className="w-4 h-4" /> UX Strategy
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.uiux.uxStrategy} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Page Structure
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {result.uiux.pageStructure.map((page, i) => (
                              <div
                                key={i}
                                className="text-sm text-gray-300 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5 flex items-start gap-2"
                                data-testid={`uiux-page-${i}`}
                              >
                                <span className="text-secondary font-mono text-xs mt-0.5 flex-shrink-0">PG</span>
                                {page}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <h4 className="font-medium text-purple-400">Responsive Behavior</h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            {result.uiux.responsiveBehavior}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Front-End Tab */}
                    <TabsContent value="frontend" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-cyan-400 flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> Component Architecture
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.frontend.componentArchitecture} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <Layers className="w-4 h-4" /> React Structure
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.frontend.reactStructure} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2">
                            <Rocket className="w-4 h-4" /> Pages
                          </h4>
                          <div className="space-y-2">
                            {result.frontend.pages.map((page, i) => (
                              <div
                                key={i}
                                className="font-mono text-xs text-gray-300 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5"
                                data-testid={`frontend-page-${i}`}
                              >
                                {page}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-emerald-400">State Management</h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            {result.frontend.stateManagement}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Back-End Tab */}
                    <TabsContent value="backend" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 md:col-span-2">
                          <h4 className="font-medium text-emerald-400 flex items-center gap-2">
                            <Database className="w-4 h-4" /> API Routes
                          </h4>
                          <div className="space-y-2">
                            {result.backend.apis.map((api, i) => (
                              <div
                                key={i}
                                className="font-mono text-xs text-gray-300 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5 flex items-center gap-3"
                                data-testid={`backend-api-${i}`}
                              >
                                <span className={`text-xs font-bold flex-shrink-0 ${
                                  api.startsWith("POST") ? "text-emerald-400" :
                                  api.startsWith("GET") ? "text-blue-400" :
                                  api.startsWith("PUT") || api.startsWith("PATCH") ? "text-yellow-400" :
                                  api.startsWith("DELETE") ? "text-red-400" : "text-gray-400"
                                }`}>
                                  {api.split(" ")[0]}
                                </span>
                                <span>{api.split(" ").slice(1).join(" ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Database Schema
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.backend.databaseSchema} />
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-secondary flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Authentication
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            <TypewriterText text={result.backend.authentication} speed={8} />
                          </p>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <h4 className="font-medium text-purple-400">Backend Architecture</h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-lg p-4 border border-white/5">
                            {result.backend.backendArchitecture}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400">From concept to production, fully automated.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-testid={`card-feature-${i}`}
              >
                <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all h-full">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
