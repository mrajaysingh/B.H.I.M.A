declare module 'react-syntax-highlighter' {
  import { ComponentType, CSSProperties } from 'react';

  interface SyntaxHighlighterProps {
    style?: { [key: string]: CSSProperties } | CSSProperties;
    language?: string;
    PreTag?: string;
    children?: string;
    customStyle?: CSSProperties;
    codeTagProps?: { style?: CSSProperties };
    useInlineStyles?: boolean;
    showLineNumbers?: boolean;
    startingLineNumber?: number;
    lineNumberStyle?: CSSProperties;
    wrapLines?: boolean;
    lineProps?: (lineNumber: number) => { style?: CSSProperties };
    renderer?: (props: { rows: any[]; stylesheet: any; useInlineStyles: boolean }) => React.ReactNode;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export { SyntaxHighlighter };
  export const Prism: typeof SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  import { CSSProperties } from 'react';
  export const vscDarkPlus: { [key: string]: CSSProperties };
}

declare module 'remark-gfm' {
  const plugin: any;
  export default plugin;
} 