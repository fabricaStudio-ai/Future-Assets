import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Layers, 
  Rocket, 
  Settings,
  Search,
  Bell,
  Bot,
  PenTool,
  Code2,
  Database,
  CheckCircle2,
  Clock,
  Activity
} from "lucide-react";

const agents = [
  { name: "Scrum Master Senior", task: "Analyzing requirements", progress: 92, icon: Bot, color: "text-blue-400", status: "Active" },
  { name: "UI/UX Senior", task: "Designing wireframes", progress: 67, icon: PenTool, color: "text-purple-400", status: "Active" },
  { name: "Front-End Senior", task: "Generating components", progress: 45, icon: Code2, color: "text-cyan-400", status: "Active" },
  { name: "Back-End Senior", task: "Structuring APIs", progress: 31, icon: Database, color: "text-emerald-400", status: "Active" }
];

const timeline = [
  { time: "10:42 AM", agent: "Back-End Senior", action: "Created User schema in Prisma", icon: Database },
  { time: "10:35 AM", agent: "Front-End Senior", action: "Completed Navbar component", icon: Code2 },
  { time: "10:15 AM", agent: "UI/UX Senior", action: "Finalized color palette", icon: PenTool },
  { time: "09:00 AM", agent: "Scrum Master Senior", action: "Project initialized", icon: Bot },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-white overflow-hidden selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0B0F19]/90 backdrop-blur flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <span className="font-bold tracking-tight">DevSquad AI</span>
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary border border-primary/20 cursor-pointer">
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <FolderKanban className="w-4 h-4" />
            <span className="font-medium text-sm">Projects</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <Users className="w-4 h-4" />
            <span className="font-medium text-sm">AI Team</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <Layers className="w-4 h-4" />
            <span className="font-medium text-sm">Architecture</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <Rocket className="w-4 h-4" />
            <span className="font-medium text-sm">Deployments</span>
          </div>
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">FoodDelivery App</h1>
            <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Building
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input 
                placeholder="Search resources..." 
                className="pl-9 bg-white/5 border-white/10 h-9 text-sm focus-visible:ring-primary/50"
              />
            </div>
            <button className="text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 right-0 w-2 h-2 rounded-full bg-primary"></span>
            </button>
            <Avatar className="w-8 h-8 border border-white/10 cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Active Agents</span>
              </div>
              <div className="text-2xl font-bold">4</div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Components Built</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">47</div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Completion</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-primary">78%</div>
                <Progress value={78} className="w-24 h-1.5 bg-white/10 mb-2" indicatorColor="bg-primary" />
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Deploy Status</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">Ready</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* AI Team Panel */}
            <div className="xl:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Agent Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <Card key={agent.name} className="bg-white/5 border-white/10 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded bg-white/5 flex items-center justify-center ${agent.color}`}>
                          <agent.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{agent.name}</h3>
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {agent.status}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-500">{agent.progress}%</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">{agent.task}...</p>
                      <Progress value={agent.progress} className="h-1 bg-white/10" indicatorColor={`bg-${agent.color.split('-')[1]}-500`} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Activity Log
              </h2>
              <Card className="bg-white/5 border-white/10 p-5">
                <div className="space-y-6">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== timeline.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-white/10" />
                      )}
                      <div className="relative z-10 w-6 h-6 rounded-full bg-[#0B0F19] border border-white/20 flex items-center justify-center mt-0.5">
                        <item.icon className="w-3 h-3 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-200">{item.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-primary">{item.agent}</span>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
