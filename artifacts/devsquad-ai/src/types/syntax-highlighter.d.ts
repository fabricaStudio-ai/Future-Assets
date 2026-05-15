declare module "react-syntax-highlighter/dist/esm/prism" {
  import { ComponentType } from "react";
  interface SyntaxHighlighterProps {
    language?: string;
    style?: Record<string, React.CSSProperties>;
    children: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    lineNumberStyle?: React.CSSProperties;
    customStyle?: React.CSSProperties;
    codeTagProps?: React.HTMLAttributes<HTMLElement>;
    className?: string;
    [key: string]: unknown;
  }
  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  const vscDarkPlus: Record<string, React.CSSProperties>;
  const dracula: Record<string, React.CSSProperties>;
  const oneDark: Record<string, React.CSSProperties>;
  const atomDark: Record<string, React.CSSProperties>;
  export { vscDarkPlus, dracula, oneDark, atomDark };
}
