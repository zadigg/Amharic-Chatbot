export const isCodeRequest = (message: string): boolean => {
  const codeKeywords = [
    'code',
    'program',
    'script',
    'function',
    'class',
    'implementation',
    'example',
    'write',
    'create',
    'generate',
    'implement',
    'solve',
  ];

  const lowercaseMessage = message.toLowerCase();
  return codeKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

export const formatResponse = (response: string): string => {
  // If response already contains code blocks, return as is
  if (response.includes('```')) {
    return response;
  }

  // Look for potential code patterns
  const lines = response.split('\n');
  let inCode = false;
  let codeLanguage = '';
  let formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';

    // Detect code block start
    if (!inCode && (
      // Common code indicators
      line.trim().match(/^(class|public|private|function|def|import|package|const|let|var)/) ||
      // Indented blocks
      (line.trim() && nextLine.trim().startsWith('  ')) ||
      // Common file extensions
      line.trim().match(/\.(java|py|js|ts|cpp|cs|php)$/)
    )) {
      inCode = true;
      // Detect language
      if (line.includes('class') || line.includes('public')) codeLanguage = 'java';
      else if (line.includes('def ')) codeLanguage = 'python';
      else if (line.includes('function') || line.includes('const')) codeLanguage = 'javascript';
      else codeLanguage = 'code';
      
      formattedLines.push(`\`\`\`${codeLanguage}`);
    }

    formattedLines.push(line);

    // Detect code block end
    if (inCode && (
      // Empty line followed by non-indented text
      (line.trim() === '' && nextLine.trim() && !nextLine.startsWith('  ')) ||
      // End of file markers
      line.includes('```') ||
      // No more lines
      i === lines.length - 1
    )) {
      inCode = false;
      formattedLines.push('```\n');
    }
  }

  return formattedLines.join('\n');
};