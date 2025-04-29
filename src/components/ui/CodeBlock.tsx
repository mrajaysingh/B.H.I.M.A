import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] my-4 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-sm text-gray-400 font-mono ml-2">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors group"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
          )}
        </button>
      </div>
      <div className="relative">
        <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1a1a1a]">
          <code className="text-sm text-gray-300 font-mono leading-relaxed">
            {code}
          </code>
        </pre>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a1a1a] pointer-events-none" />
      </div>
    </div>
  );
}

export default CodeBlock; 