import { useState, useEffect, useMemo, useRef } from "react";
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
  Trash2,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";

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

function getFileIcon(filename: string) {
  if (filename.endsWith(".tsx") || filename.endsWith(".ts") || filename.endsWith(".jsx") || filename.endsWith(".js")) {
    return <FileCode className="w-4 h-4 text-cyan-400" />;
  }
  if (filename.endsWith(".json")) {
    return <Braces className="w-4 h-4 text-yellow-400" />;
  }
  if (filename.endsWith(".css")) {
    return <Paintbrush className="w-4 h-4 text-blue-400" />;
  }
  if (filename.endsWith(".md")) {
    return <FileText className="w-4 h-4 text-white" />;
  }
  if (filename.endsWith(".env") || filename.endsWith(".env.local")) {
    return <ShieldAlert className="w-4 h-4 text-orange-400" />;
  }
  return <File className="w-4 h-4 text-gray-400" />;
}

function getLanguage(filename: string) {
  if (filename.endsWith(".tsx") || filename.endsWith(".ts")) return "typescript";
  if (filename.endsWith(".jsx") || filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".md")) return "markdown";
  return "typescript";
}

function buildFileTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = [];
  
  files.forEach((file) => {
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
      
      if (!isFile) {
        currentLevel = existingNode.children!;
      }
    });
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children) sortNodes(node.children);
    });
  };
  
  sortNodes(root);
  return root;
}

export function IDE({ project, terminalLogs, isGenerating, onClose }: IDEProps) {
  const [openFiles, setOpenFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "components", "pages", "app"]));
  const [terminalHeight, setTerminalHeight] = useState(200);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fileTree = useMemo(() => buildFileTree(project.files), [project.files]);

  useEffect(() => {
    if (project.files.length > 0 && openFiles.length === 0) {
      const firstFile = project.files.find(f => f.path.includes("page.tsx") || f.path.includes("index.tsx") || f.path.includes("App.tsx") || f.path.endsWith(".tsx")) || project.files[0];
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
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const openFile = (file: ProjectFile) => {
    if (!openFiles.find((f) => f.path === file.path)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter((f) => f.path !== filePath);
    setOpenFiles(newOpenFiles);
    if (activeFile?.path === filePath) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const renderTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const isActive = activeFile?.path === node.path;

      if (node.type === "folder") {
        return (
          <div key={node.path}>
            <div
              className="flex items-center py-1 px-2 cursor-pointer hover:bg-white/5 text-gray-300 select-none"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => toggleFolder(node.path)}
              data-testid={`folder-${node.name}`}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
              {isExpanded ? <FolderOpen className="w-4 h-4 mr-1.5 text-blue-400" /> : <Folder className="w-4 h-4 mr-1.5 text-blue-400" />}
              <span className="text-sm">{node.name}</span>
            </div>
            {isExpanded && node.children && renderTree(node.children, level + 1)}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`flex items-center py-1 px-2 cursor-pointer select-none transition-colors border-l-2 ${
            isActive ? "bg-white/10 text-white border-primary" : "hover:bg-white/5 text-gray-400 border-transparent"
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => openFile({ path: node.path, content: node.content || "" })}
          data-testid={`file-${node.name}`}
        >
          <div className="w-3.5 h-3.5 mr-1 opacity-0" />
          <div className="mr-1.5">{getFileIcon(node.name)}</div>
          <span className="text-sm truncate">{node.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[80vh] bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl z-50">
      {/* Titlebar */}
      <div className="h-12 bg-[#010409] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Folder className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm tracking-wide text-white">{project.projectName}</span>
          <div className="hidden md:flex items-center gap-1.5 ml-4">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{project.stack.frontend}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{project.stack.styling}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{project.stack.database}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-400 hover:text-white" onClick={() => window.open('https://stackblitz.com', '_blank')} data-testid="btn-stackblitz">
            <ExternalLink className="w-3 h-3 mr-1.5" /> StackBlitz
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-400 hover:text-white" onClick={() => {}} data-testid="btn-export">
            <Download className="w-3 h-3 mr-1.5" /> Export ZIP
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-400 hover:text-white" onClick={() => {}} data-testid="btn-github">
            <SiGithub className="w-3 h-3 mr-1.5" /> GitHub
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20" onClick={onClose} data-testid="btn-close-ide">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] bg-[#010409] border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="px-4 py-2 flex items-center justify-between text-xs font-mono text-gray-400 tracking-wider">
            EXPLORER
          </div>
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {renderTree(fileTree)}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Tabs */}
          {openFiles.length > 0 && (
            <div className="flex h-10 bg-[#010409] border-b border-white/10 overflow-x-auto flex-shrink-0 custom-scrollbar">
              {openFiles.map((file) => {
                const isActive = activeFile?.path === file.path;
                const filename = file.path.split("/").pop() || file.path;
                return (
                  <div
                    key={file.path}
                    className={`flex items-center h-full px-4 border-r border-white/5 cursor-pointer min-w-fit transition-colors ${
                      isActive ? "bg-[#0d1117] text-white border-t-2 border-t-primary" : "bg-[#010409] text-gray-400 hover:bg-[#0d1117]/50 border-t-2 border-t-transparent"
                    }`}
                    onClick={() => setActiveFile(file)}
                    data-testid={`tab-${filename}`}
                  >
                    <div className="mr-2 opacity-80">{getFileIcon(filename)}</div>
                    <span className="text-sm mr-3">{filename}</span>
                    <button
                      className={`p-0.5 rounded-sm hover:bg-white/10 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                      onClick={(e) => closeFile(e, file.path)}
                      data-testid={`btn-close-tab-${filename}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-auto bg-[#0d1117] relative custom-scrollbar">
            {activeFile ? (
              <SyntaxHighlighter
                language={getLanguage(activeFile.path)}
                style={vscDarkPlus as any}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "transparent",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
                lineNumberStyle={{
                  minWidth: "3em",
                  paddingRight: "1em",
                  color: "#6e7681",
                  textAlign: "right",
                  userSelect: "none"
                }}
              >
                {activeFile.content}
              </SyntaxHighlighter>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <FileCode className="w-8 h-8 text-gray-600" />
                </div>
                <p>Select a file to view its contents</p>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div 
            className="flex flex-col bg-[#0a0d14] border-t border-white/10 flex-shrink-0 relative"
            style={{ height: terminalHeight }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-1 cursor-row-resize hover:bg-primary/50 z-10"
              onMouseDown={(e) => {
                const startY = e.clientY;
                const startHeight = terminalHeight;
                const onMouseMove = (moveEvent: MouseEvent) => {
                  const newHeight = startHeight - (moveEvent.clientY - startY);
                  if (newHeight > 50 && newHeight < 600) {
                    setTerminalHeight(newHeight);
                  }
                };
                const onMouseUp = () => {
                  document.removeEventListener("mousemove", onMouseMove);
                  document.removeEventListener("mouseup", onMouseUp);
                };
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
              }}
            />
            <div className="h-9 flex items-center justify-between px-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <TerminalIcon className="w-3.5 h-3.5" /> TERMINAL
              </div>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-500 hover:text-white" onClick={() => setTerminalHeight(200)}>
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[13px] leading-relaxed custom-scrollbar">
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-emerald-400 flex break-all">
                  <span className="text-gray-600 mr-3 select-none">❯</span>
                  <span>{log}</span>
                </div>
              ))}
              {isGenerating && (
                <div className="text-emerald-400 flex">
                  <span className="text-gray-600 mr-3 select-none">❯</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid transparent;
          background-clip: padding-box;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          border: 3px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
