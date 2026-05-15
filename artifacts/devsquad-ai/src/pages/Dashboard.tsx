import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Layers,
  Rocket,
  Settings,
  Bell,
  Bot,
  PenTool,
  Code2,
  Database,
  CheckCircle2,
  Clock,
  Activity,
  Sparkles,
  X,
  Menu,
} from "lucide-react";

const agents = [
  { name: "Scrum Master Senior", task: "Analyzing requirements", progress: 92, icon: Bot, color: "text-blue-400", status: "Active" },
  { name: "UI/UX Senior", task: "Designing wireframes", progress: 67, icon: PenTool, color: "text-purple-400", status: "Active" },
  { name: "Front-End Senior", task: "Generating components", progress: 45, icon: Code2, color: "text-cyan-400", status: "Active" },
  { name: "Back-End Senior", task: "Structuring APIs", progress: 31, icon: Database, color: "text-emerald-400", status: "Active" },
];

const timeline = [
  { time: "10:42 AM", agent: "Back-End Senior", action: "Created User schema in Prisma", icon: Database },
  { time: "10:35 AM", agent: "Front-End Senior", action: "Completed Navbar component", icon: Code2 },
  { time: "10:15 AM", agent: "UI/UX Senior", action: "Finalized color palette", icon: PenTool },
  { time: "09:00 AM", agent: "Scrum Master Senior", action: "Project initialized", icon: Bot },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FolderKanban, label: "Projects", active: false },
  { icon: Users, label: "AI Team", active: false },
  { icon: Layers, label: "Architecture", active: false },
  { icon: Rocket, label: "Deployments", active: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#0B0F19] text-white overflow-hidden selection:bg-primary selection:text-white">

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0d16] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-14 sm:h-16 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-sm">DevSquad AI</span>
          </Link>
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Topbar ── */}
        <header className="h-14 sm:h-16 border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur flex items-center justify-between px-4 sm:px-6 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="font-semibold text-sm sm:text-base truncate">FoodDelivery App</h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Building
              </span>
            </div>
            <span className="sm:hidden px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Building
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="text-gray-400 hover:text-white relative p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-white/10 cursor-pointer flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: Users, label: "Active Agents", value: "4", valueClass: "text-white" },
              { icon: Code2, label: "Components Built", value: "47", valueClass: "text-cyan-400" },
              { icon: CheckCircle2, label: "Completion", value: "78%", valueClass: "text-primary", bar: true, barWidth: 78 },
              { icon: Rocket, label: "Deploy Status", value: "Ready", valueClass: "text-emerald-400" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/5 border-white/10 p-3 sm:p-4 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight">{stat.label}</span>
                </div>
                {stat.bar ? (
                  <div className="flex items-end justify-between gap-2">
                    <div className={`text-xl sm:text-2xl font-bold ${stat.valueClass}`}>{stat.value}</div>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${stat.barWidth}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className={`text-xl sm:text-2xl font-bold ${stat.valueClass}`}>{stat.value}</div>
                )}
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-8">
            {/* AI Team Panel */}
            <div className="xl:col-span-2 space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Live Agent Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {agents.map((agent) => (
                  <Card key={agent.name} className="bg-white/5 border-white/10 p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0 ${agent.color}`}>
                          <agent.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-xs sm:text-sm leading-tight truncate">{agent.name}</h3>
                          <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                            {agent.status}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-gray-500 flex-shrink-0 ml-1">{agent.progress}%</span>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-300 truncate">{agent.task}...</p>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${agent.progress}%` }} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                Activity Log
              </h2>
              <Card className="bg-white/5 border-white/10 p-4 sm:p-5">
                <div className="space-y-4 sm:space-y-6">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-3 sm:gap-4 relative">
                      {i !== timeline.length - 1 && (
                        <div className="absolute left-[10px] sm:left-[11px] top-5 sm:top-6 bottom-[-16px] sm:bottom-[-24px] w-px bg-white/10" />
                      )}
                      <div className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0B0F19] border border-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-200 leading-snug">{item.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] sm:text-xs text-primary truncate">{item.agent}</span>
                          <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{item.time}</span>
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

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0d16]/95 backdrop-blur-md border-t border-white/5 flex items-center">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.label}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
              item.active ? "text-primary" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-medium leading-none">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex-1 flex flex-col items-center gap-1 py-3 px-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-medium leading-none">More</span>
        </button>
      </nav>
    </div>
  );
}
