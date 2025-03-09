import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  content: string;
  theme: 'light' | 'dark';
}

export function CopyButton({ content, theme }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-colors ${
        theme === 'dark'
          ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
      }`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}