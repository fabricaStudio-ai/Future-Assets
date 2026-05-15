import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Bot, 
  PenTool, 
  Code2, 
  Database, 
  Layers, 
  Zap, 
  Rocket, 
  ChevronRight,
  Sparkles
} from "lucide-react";

const agents = [
  { name: "Scrum Master Senior", task: "Analyzing requirements", progress: 92, icon: Bot, color: "text-blue-400" },
  { name: "UI/UX Senior", task: "Designing wireframes", progress: 67, icon: PenTool, color: "text-purple-400" },
  { name: "Front-End Senior", task: "Generating components", progress: 45, icon: Code2, color: "text-cyan-400" },
  { name: "Back-End Senior", task: "Structuring APIs", progress: 31, icon: Database, color: "text-emerald-400" }
];

const features = [
  { title: "AI Scrum Master", description: "Breaks down your idea into actionable epics, sprints, and tasks.", icon: Bot },
  { title: "Senior UI/UX Designer", description: "Crafts a premium design system and high-fidelity wireframes.", icon: PenTool },
  { title: "Senior Front-End Engineer", description: "Builds pixel-perfect React components with smooth animations.", icon: Code2 },
  { title: "Senior Back-End Engineer", description: "Architects scalable databases and secure, fast APIs.", icon: Database },
  { title: "Automated Architecture", description: "Chooses the optimal stack for your specific requirements.", icon: Layers },
  { title: "Deploy Ready Projects", description: "Generates Vercel, Docker, and CI/CD configurations automatically.", icon: Rocket }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
      
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
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
                Create App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-32">
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
            Describe your idea and let senior AI specialists architect, design and develop your application automatically.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all border border-primary/50">
                Create App <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all">
              Watch Demo
            </Button>
          </motion.div>
        </section>

        {/* Input Section */}
        <section className="max-w-4xl mx-auto mb-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <Card className="relative bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> Project Brief
            </h2>
            <Textarea 
              placeholder="Example: Create a food delivery app with admin dashboard and real-time order tracking..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 text-lg resize-none mb-6"
            />
            <div className="flex justify-end">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-secondary/50">
                <Sparkles className="mr-2 w-4 h-4" /> Generate Application
              </Button>
            </div>
          </Card>
        </section>

        {/* Agents Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
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
              >
                <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all hover:border-white/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${agent.color}`}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 h-5">{agent.task}...</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-1 bg-white/10" indicatorColor={`bg-${agent.color.split('-')[1]}-500`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
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
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Output Demo Tabs */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Production-Ready Output</h2>
            <p className="text-gray-400">What you get when the squad finishes.</p>
          </div>
          <Card className="bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 overflow-hidden">
            <Tabs defaultValue="architecture" className="w-full">
              <TabsList className="w-full flex justify-start p-0 h-auto bg-transparent border-b border-white/10 rounded-none overflow-x-auto overflow-y-hidden hide-scrollbar">
                {["Architecture", "UI/UX", "Front-End", "Back-End", "Deployment"].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab.toLowerCase()}
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white rounded-none py-4 px-6 text-gray-400"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="p-6 md:p-8 min-h-[300px]">
                <TabsContent value="architecture" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-primary flex items-center gap-2"><Layers className="w-4 h-4"/> Stack</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> Next.js (React)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Node.js</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> PostgreSQL</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Redis</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-secondary flex items-center gap-2"><Rocket className="w-4 h-4"/> Hosting</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> Vercel (Frontend)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Railway (Backend)</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-emerald-400 flex items-center gap-2"><Zap className="w-4 h-4"/> APIs</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> RESTful Endpoints</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> WebSockets</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ui/ux" className="mt-0 text-gray-400">
                  <div className="flex flex-col gap-4">
                    <p>Design System Tokens Generated.</p>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded bg-[#0B0F19] border border-white/20"></div>
                      <div className="w-10 h-10 rounded bg-[#7C3AED]"></div>
                      <div className="w-10 h-10 rounded bg-[#06B6D4]"></div>
                      <div className="w-10 h-10 rounded bg-white"></div>
                    </div>
                    <p className="mt-4 text-sm font-mono bg-white/5 p-4 rounded text-gray-300">
                      // tailwind.config.ts<br/>
                      colors: {'{'}<br/>
                      &nbsp;&nbsp;background: 'hsl(var(--background))',<br/>
                      &nbsp;&nbsp;primary: '#7C3AED',<br/>
                      {'}'}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="front-end" className="mt-0 text-gray-400">
                  <div className="space-y-2 font-mono text-sm bg-white/5 p-4 rounded text-gray-300">
                    <div className="text-emerald-400">// Components generated</div>
                    <div>├── src/components/layout/Navbar.tsx <span className="text-gray-500">✓ Done</span></div>
                    <div>├── src/components/ui/Button.tsx <span className="text-gray-500">✓ Done</span></div>
                    <div>├── src/components/ui/Card.tsx <span className="text-gray-500">✓ Done</span></div>
                    <div>├── src/pages/Dashboard.tsx <span className="text-emerald-400 animate-pulse">⟳ Building...</span></div>
                  </div>
                </TabsContent>
                <TabsContent value="back-end" className="mt-0 text-gray-400">
                  <div className="space-y-2 font-mono text-sm bg-white/5 p-4 rounded text-gray-300">
                    <div className="text-emerald-400">// Schema generated</div>
                    <div className="text-purple-400">model User {'{'}</div>
                    <div>&nbsp;&nbsp;id        String   @id @default(cuid())</div>
                    <div>&nbsp;&nbsp;email     String   @unique</div>
                    <div>&nbsp;&nbsp;name      String?</div>
                    <div>&nbsp;&nbsp;createdAt DateTime @default(now())</div>
                    <div className="text-purple-400">{'}'}</div>
                  </div>
                </TabsContent>
                <TabsContent value="deployment" className="mt-0 text-gray-400">
                  <div className="space-y-2 font-mono text-sm bg-white/5 p-4 rounded text-gray-300">
                    <div className="text-emerald-400">// Dockerfile generated</div>
                    <div className="text-blue-400">FROM node:18-alpine AS builder</div>
                    <div>WORKDIR /app</div>
                    <div>COPY package*.json ./</div>
                    <div>RUN npm ci</div>
                    <div>COPY . .</div>
                    <div>RUN npm run build</div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </section>
      </main>
    </div>
  );
}
