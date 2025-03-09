import React from 'react';
import { CopyButton } from './CopyButton';

interface MessageContentProps {
  content: string;
  theme: 'light' | 'dark';
}

export function MessageContent({ content, theme }: MessageContentProps) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          if (!match) return part;

          const [, language, code] = match;
          
          return (
            <pre key={index} className="relative mt-2 mb-2 overflow-x-auto group">
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <CopyButton content={code.trim()} theme={theme} />
                {language && (
                  <div className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">
                    {language}
                  </div>
                )}
              </div>
              <code className={`block p-4 rounded-lg bg-gray-800 text-gray-100 font-mono text-sm whitespace-pre overflow-x-auto`}>
                {code.trim()}
              </code>
            </pre>
          );
        }

        const formattedText = part
          .split('\n')
          .map((line, i) => {
            if (line.startsWith('###')) {
              return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
            }
            if (line.startsWith('##')) {
              return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
            }
            if (line.startsWith('#')) {
              return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('#', '').trim()}</h1>;
            }

            if (line.match(/^\d+\./)) {
              return <div key={i} className="ml-4">{line}</div>;
            }
            if (line.match(/^-/)) {
              return <div key={i} className="ml-4">{line}</div>;
            }

            if (line.includes('`')) {
              const parts = line.split(/(`[^`]+`)/g);
              return (
                <div key={i}>
                  {parts.map((part, j) => {
                    if (part.startsWith('`') && part.endsWith('`')) {
                      return (
                        <code key={j} className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-sm">
                          {part.slice(1, -1)}
                        </code>
                      );
                    }
                    return part;
                  })}
                </div>
              );
            }

            return line || <br key={i} />;
          });

        return <div key={index}>{formattedText}</div>;
      })}
    </>
  );
}