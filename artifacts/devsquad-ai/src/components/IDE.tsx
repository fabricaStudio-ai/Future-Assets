import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Folder,
  FolderOpen,
  FileCode,
  Braces,
  Paintbrush,
  FileText,
  ShieldAlert,
  File,
  X,
  Terminal as TerminalIcon,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Minimize2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code2,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import sdk from "@stackblitz/sdk";

export interface ProjectStack {
  frontend: string;
  styling: string;
  language: string;
  database: string;
  auth: string;
  deployment: string;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ProjectOutput {
  projectName: string;
  stack: ProjectStack;
  folders: string[];
  files: ProjectFile[];
}

export interface IDEProps {
  project: ProjectOutput;
  terminalLogs: string[];
  isGenerating: boolean;
  onClose: () => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  content?: string;
}

type ViewMode = "code" | "preview";
type DeviceMode = "desktop" | "tablet" | "mobile";
type ExportState = "idle" | "exporting" | "done";
type GithubState = "idle" | "preparing" | "ready";

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["tsx", "ts", "jsx", "js"].includes(ext ?? ""))
    return <FileCode className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
  if (ext === "json")
    return <Braces className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
  if (ext === "css")
    return <Paintbrush className="w-4 h-4 text-blue-400 flex-shrink-0" />;
  if (ext === "md")
    return <FileText className="w-4 h-4 text-white flex-shrink-0" />;
  if (filename.startsWith(".env"))
    return <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0" />;
  if (ext === "html")
    return <Eye className="w-4 h-4 text-purple-400 flex-shrink-0" />;
  return <File className="w-4 h-4 text-gray-400 flex-shrink-0" />;
}

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "tsx" || ext === "ts") return "typescript";
  if (ext === "jsx" || ext === "js") return "javascript";
  if (ext === "json") return "json";
  if (ext === "css") return "css";
  if (ext === "md") return "markdown";
  if (ext === "html") return "html";
  return "typescript";
}

function buildFileTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = [];
  const visibleFiles = files.filter((f) => f.path !== "preview.html");

  visibleFiles.forEach((file) => {
    const parts = file.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath === "" ? part : `${currentPath}/${part}`;
      const isFile = index === parts.length - 1;
      let existingNode = currentLevel.find((n) => n.name === part);
      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          ...(isFile ? { content: file.content } : { children: [] }),
        };
        currentLevel.push(existingNode);
      }
      if (!isFile) currentLevel = existingNode.children!;
    });
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => { if (n.children) sortNodes(n.children); });
  };
  sortNodes(root);
  return root;
}

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function IDE({ project, terminalLogs, isGenerating, onClose }: IDEProps) {
  const [openFiles, setOpenFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["app", "components", "lib", "hooks", "types"])
  );
  const [terminalHeight, setTerminalHeight] = useState(150);
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [githubState, setGithubState] = useState<GithubState>("idle");
  const [previewKey, setPreviewKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const resizeDragRef = useRef(false);

  const fileTree = useMemo(() => buildFileTree(project.files), [project.files]);
  const previewHtml = useMemo(
    () => project.files.find((f) => f.path === "preview.html")?.content ?? "",
    [project.files]
  );

  useEffect(() => {
    if (project.files.length > 0 && openFiles.length === 0) {
      const priority = ["app/page.tsx", "components/Hero.tsx", "app/layout.tsx"];
      const firstFile =
        priority.map((p) => project.files.find((f) => f.path === p)).find(Boolean) ??
        project.files.find((f) => f.path !== "preview.html") ??
        project.files[0];
      if (firstFile) {
        setOpenFiles([firstFile]);
        setActiveFile(firstFile);
      }
    }
  }, [project.files, openFiles.length]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const openFile = (file: ProjectFile) => {
    setViewMode("code");
    if (!openFiles.find((f) => f.path === file.path)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation();
    setOpenFiles((prev) => {
      const next = prev.filter((f) => f.path !== filePath);
      if (activeFile?.path === filePath) {
        setActiveFile(next.length > 0 ? next[next.length - 1] : null);
      }
      return next;
    });
  };

  const handleExportZip = useCallback(async () => {
    if (exportState !== "idle") return;
    setExportState("exporting");
    try {
      const zip = new JSZip();
      const root = zip.folder(project.projectName)!;
      project.files
        .filter((f) => f.path !== "preview.html")
        .forEach((file) => {
          const parts = file.path.split("/");
          let folder = root;
          for (let i = 0; i < parts.length - 1; i++) {
            folder = folder.folder(parts[i])!;
          }
          folder.file(parts[parts.length - 1], file.content);
        });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportState("done");
      setTimeout(() => setExportState("idle"), 3000);
    } catch {
      setExportState("idle");
    }
  }, [exportState, project]);

  const handleOpenStackBlitz = useCallback(() => {
    const files: Record<string, string> = {};
    project.files
      .filter((f) => f.path !== "preview.html")
      .forEach((f) => { files[f.path] = f.content; });

    sdk.openProject(
      {
        title: project.projectName,
        description: `Generated by DevSquad AI — ${project.stack.frontend} + ${project.stack.styling} + ${project.stack.database}`,
        template: "node",
        files,
        settings: { compile: { trigger: "auto", clearConsole: false } },
      },
      { newWindow: true, openFile: "app/page.tsx" }
    );
  }, [project]);

  const handleGithub = useCallback(() => {
    if (githubState !== "idle") return;
    setGithubState("preparing");
    setTimeout(() => setGithubState("ready"), 2500);
    setTimeout(() => setGithubState("idle"), 6000);
  }, [githubState]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeDragRef.current = true;
    const startY = e.clientY;
    const startH = terminalHeight;
    const onMove = (ev: MouseEvent) => {
      if (!resizeDragRef.current) return;
      const newH = startH - (ev.clientY - startY);
      setTerminalHeight(Math.max(60, Math.min(500, newH)));
    };
    const onUp = () => {
      resizeDragRef.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const renderTree = (nodes: TreeNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const isActive = activeFile?.path === node.path;

      if (node.type === "folder") {
        return (
          <div key={node.path}>
            <div
              className="flex items-center py-[5px] cursor-pointer hover:bg-white/5 text-gray-300 select-none group"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => toggleFolder(node.path)}
              data-testid={`folder-${node.name}`}
            >
              {isExpanded
                ? <ChevronDown className="w-3.5 h-3.5 mr-1 text-gray-500 flex-shrink-0" />
                : <ChevronRight className="w-3.5 h-3.5 mr-1 text-gray-500 flex-shrink-0" />}
              {isExpanded
                ? <FolderOpen className="w-4 h-4 mr-1.5 text-blue-400 flex-shrink-0" />
                : <Folder className="w-4 h-4 mr-1.5 text-blue-400 flex-shrink-0" />}
              <span className="text-[13px] truncate">{node.name}</span>
            </div>
            {isExpanded && node.children && renderTree(node.children, level + 1)}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`flex items-center py-[5px] cursor-pointer select-none transition-colors border-l-2 ${
            isActive
              ? "bg-[#1c2333] text-white border-primary"
              : "hover:bg-white/5 text-gray-400 border-transparent hover:text-gray-200"
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => openFile({ path: node.path, content: node.content ?? "" })}
          data-testid={`file-${node.name}`}
        >
          <span className="w-3.5 h-3.5 mr-1 opacity-0 flex-shrink-0" />
          <span className="mr-1.5">{getFileIcon(node.name)}</span>
          <span className="text-[13px] truncate">{node.name}</span>
        </div>
      );
    });
  };

  const stackBadges = [
    project.stack.frontend,
    project.stack.styling,
    project.stack.language,
    project.stack.database,
  ];

  return (
    <div
      className="flex flex-col w-full bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] z-50"
      style={{ minHeight: "75vh" }}
      data-testid="ide-container"
    >
      {/* ── Titlebar ── */}
      <div className="h-11 bg-[#010409] border-b border-white/[0.06] flex items-center justify-between px-2 sm:px-4 flex-shrink-0 gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            className="sm:hidden p-1.5 rounded text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle explorer"
          >
            <Folder className="w-4 h-4 text-primary" />
          </button>

          <div className="hidden sm:flex gap-1.5 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10 mx-1 flex-shrink-0" />
          <Folder className="hidden sm:block w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-semibold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">{project.projectName}</span>
          <div className="hidden lg:flex items-center gap-1 ml-1 flex-wrap">
            {stackBadges.map((badge) => (
              <span key={badge} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/[0.06] whitespace-nowrap">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {/* StackBlitz — icon only on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-1.5 sm:px-2.5 text-xs text-gray-400 hover:text-white hover:bg-[#7C3AED]/20 border border-transparent transition-all"
            onClick={handleOpenStackBlitz}
            data-testid="btn-stackblitz"
            title="Open in StackBlitz"
          >
            <ExternalLink className="w-3 h-3 sm:mr-1.5" />
            <span className="hidden sm:inline">StackBlitz</span>
          </Button>

          {/* Export ZIP — icon only on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-1.5 sm:px-2.5 text-xs border border-transparent transition-all ${
              exportState === "done"
                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : "text-gray-400 hover:text-white hover:bg-[#06B6D4]/10 hover:border-[#06B6D4]/30"
            }`}
            onClick={handleExportZip}
            disabled={exportState === "exporting"}
            data-testid="btn-export-zip"
            title="Export ZIP"
          >
            {exportState === "exporting" ? (
              <Loader2 className="w-3 h-3 sm:mr-1.5 animate-spin" />
            ) : exportState === "done" ? (
              <CheckCircle2 className="w-3 h-3 sm:mr-1.5" />
            ) : (
              <Download className="w-3 h-3 sm:mr-1.5" />
            )}
            <span className="hidden sm:inline">
              {exportState === "exporting" ? "Packing..." : exportState === "done" ? "Downloaded!" : "Export ZIP"}
            </span>
          </Button>

          {/* GitHub — icon only on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-1.5 sm:px-2.5 text-xs border border-transparent transition-all ${
              githubState === "ready"
                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : githubState === "preparing"
                ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={handleGithub}
            data-testid="btn-github"
            title="Prepare for GitHub"
          >
            {githubState === "preparing" ? (
              <Loader2 className="w-3 h-3 sm:mr-1.5 animate-spin" />
            ) : githubState === "ready" ? (
              <CheckCircle2 className="w-3 h-3 sm:mr-1.5" />
            ) : (
              <SiGithub className="w-3 h-3 sm:mr-1.5" />
            )}
            <span className="hidden sm:inline">
              {githubState === "preparing" ? "Preparing..." : githubState === "ready" ? "Ready!" : "GitHub"}
            </span>
          </Button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={onClose}
            data-testid="btn-close-ide"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">

        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="sm:hidden absolute inset-0 z-20 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── File Explorer ── */}
        <div className={`
          absolute sm:relative inset-y-0 left-0 z-30
          w-[200px] sm:w-[210px] bg-[#010409] border-r border-white/[0.06] flex flex-col flex-shrink-0
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}>
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-gray-500 tracking-[0.15em] uppercase select-none border-b border-white/[0.04] flex items-center justify-between">
            <span>Explorer</span>
            <button className="sm:hidden text-gray-600 hover:text-gray-400 p-0.5" onClick={() => setSidebarOpen(false)}>
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-1 ide-scrollbar">
            {renderTree(fileTree)}
          </div>
          <div className="p-3 border-t border-white/[0.06] space-y-1">
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>Files</span>
              <span className="text-gray-400">{project.files.filter(f => f.path !== "preview.html").length}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>Folders</span>
              <span className="text-gray-400">{project.folders.length}</span>
            </div>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── View Mode Bar ── */}
          <div className="flex items-center h-9 bg-[#010409] border-b border-white/[0.06] px-2 gap-1 flex-shrink-0">
            {/* Code / Preview toggle */}
            <div className="flex items-center bg-white/5 rounded-md p-0.5 mr-2">
              <button
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                  viewMode === "code" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() => setViewMode("code")}
                data-testid="btn-view-code"
              >
                <Code2 className="w-3 h-3" /> Code
              </button>
              <button
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                  viewMode === "preview" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() => setViewMode("preview")}
                data-testid="btn-view-preview"
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            </div>

            {/* Code mode: open file tabs */}
            {viewMode === "code" && (
              <div className="flex flex-1 overflow-x-auto items-center ide-scrollbar-x">
                {openFiles.map((file) => {
                  const isActive = activeFile?.path === file.path;
                  const name = file.path.split("/").pop() ?? file.path;
                  return (
                    <div
                      key={file.path}
                      className={`flex items-center h-full px-3 border-r border-white/[0.05] cursor-pointer min-w-fit transition-all group ${
                        isActive
                          ? "bg-[#0d1117] text-white shadow-[inset_0_2px_0_0_hsl(var(--primary))]"
                          : "bg-transparent text-gray-500 hover:bg-[#0d1117]/50 hover:text-gray-300"
                      }`}
                      style={{ height: "36px" }}
                      onClick={() => setActiveFile(file)}
                      data-testid={`tab-${name}`}
                    >
                      <span className="mr-1.5 opacity-80">{getFileIcon(name)}</span>
                      <span className="text-[12px] mr-2 whitespace-nowrap">{name}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-white/10 transition-opacity flex-shrink-0"
                        onClick={(e) => closeFile(e, file.path)}
                        data-testid={`close-tab-${name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Preview mode: device switcher */}
            {viewMode === "preview" && (
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[10px] text-gray-500 mr-1">Device</span>
                {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((d) => {
                  const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
                  return (
                    <button
                      key={d}
                      className={`p-1.5 rounded transition-colors ${
                        deviceMode === d ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                      onClick={() => setDeviceMode(d)}
                      data-testid={`device-${d}`}
                      title={d.charAt(0).toUpperCase() + d.slice(1)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
                <button
                  className="p-1.5 rounded text-gray-500 hover:text-gray-300 hover:bg-white/5 ml-1 transition-colors"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  title="Reload preview"
                  data-testid="btn-reload-preview"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ── Code Editor ── */}
          {viewMode === "code" && (
            <div className="flex-1 overflow-auto bg-[#0d1117] relative ide-scrollbar">
              {activeFile ? (
                <SyntaxHighlighter
                  language={getLanguage(activeFile.path)}
                  style={vscDarkPlus as Record<string, React.CSSProperties>}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: "1.25rem 1.5rem",
                    background: "transparent",
                    fontSize: "12.5px",
                    lineHeight: "1.65",
                    fontFamily: '"Geist Mono", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, Consolas, monospace',
                    minHeight: "100%",
                  }}
                  lineNumberStyle={{
                    minWidth: "2.8em",
                    paddingRight: "1em",
                    color: "#3d4453",
                    textAlign: "right",
                    userSelect: "none",
                    fontSize: "11px",
                  }}
                >
                  {activeFile.content}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 flex-col gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                    <Code2 className="w-7 h-7 text-gray-700" />
                  </div>
                  <p className="text-sm">Select a file from the explorer</p>
                </div>
              )}
            </div>
          )}

          {/* ── Preview Panel ── */}
          {viewMode === "preview" && (
            <div className="flex-1 overflow-hidden bg-[#0a0c10] flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${deviceMode}-${previewKey}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden rounded-lg border border-white/10 shadow-2xl bg-white"
                  style={{
                    width: DEVICE_WIDTHS[deviceMode],
                    maxWidth: "100%",
                    height: "calc(100% - 2rem)",
                  }}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1c1c1e] border-b border-white/10 flex-shrink-0">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <div className="flex-1 bg-[#2c2c2e] rounded-md mx-2 px-3 py-1 text-[11px] text-gray-500 font-mono truncate">
                      localhost:3000 — {project.projectName}
                    </div>
                    <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {deviceMode === "desktop" ? "1280px" : deviceMode === "tablet" ? "768px" : "390px"}
                    </span>
                  </div>

                  {previewHtml ? (
                    <iframe
                      key={`iframe-${previewKey}`}
                      srcDoc={previewHtml}
                      sandbox="allow-scripts allow-same-origin"
                      className="flex-1 w-full border-0"
                      title={`${project.projectName} preview`}
                      data-testid="preview-iframe"
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-[#0d1117] text-gray-500 flex-col gap-3">
                      <Eye className="w-8 h-8 text-gray-700" />
                      <p className="text-sm">Preview not available for this project</p>
                      <p className="text-xs text-gray-600">Try switching to Code view</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ── Terminal ── */}
          <div
            className="flex flex-col bg-[#0a0c10] border-t border-white/[0.06] flex-shrink-0"
            style={{ height: terminalHeight }}
          >
            {/* Resize handle */}
            <div
              className="absolute-none h-1 cursor-row-resize w-full hover:bg-primary/40 transition-colors flex-shrink-0 group"
              onMouseDown={handleResizeMouseDown}
              style={{ cursor: "row-resize" }}
            />
            <div className="h-8 flex items-center justify-between px-4 border-b border-white/[0.05] flex-shrink-0 select-none">
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                <TerminalIcon className="w-3 h-3" />
                <span className="tracking-wider uppercase">Terminal</span>
                {isGenerating && (
                  <span className="text-emerald-400 text-[10px] animate-pulse ml-2">● Running</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="text-[10px] text-gray-600 hover:text-gray-400 px-2 py-0.5 rounded hover:bg-white/5 transition-colors font-mono"
                  onClick={() => setTerminalHeight(180)}
                  title="Reset height"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 px-4 py-2 overflow-y-auto font-mono text-[12.5px] leading-[1.7] ide-scrollbar">
              {terminalLogs.map((log, i) => {
                const isCmd = log.startsWith("$") || log.startsWith("npm") || log.startsWith("pnpm") || log.startsWith("npx");
                const isSuccess = log.includes("✓") || log.toLowerCase().includes("success") || log.toLowerCase().includes("ready") || log.toLowerCase().includes("done") || log.toLowerCase().includes("generated");
                const isInfo = log.startsWith("→") || log.startsWith("•") || log.startsWith("[");
                return (
                  <div key={i} className="flex items-start gap-2 break-all">
                    <span className="text-gray-700 select-none mt-0.5 flex-shrink-0">
                      {isCmd ? "❯" : isSuccess ? "✓" : isInfo ? "→" : " "}
                    </span>
                    <span className={
                      isSuccess ? "text-emerald-400" :
                      isCmd ? "text-white" :
                      isInfo ? "text-blue-400" :
                      "text-gray-400"
                    }>
                      {log}
                    </span>
                  </div>
                );
              })}
              {isGenerating && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="text-gray-700 select-none">❯</span>
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ide-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .ide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ide-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 9999px; border: 2px solid transparent; background-clip: padding-box; }
        .ide-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); border: 2px solid transparent; background-clip: padding-box; }
        .ide-scrollbar-x::-webkit-scrollbar { height: 0px; }
      `}</style>
    </div>
  );
}
