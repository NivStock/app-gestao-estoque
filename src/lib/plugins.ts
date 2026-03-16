// src/lib/plugins.ts

export interface Plugin {
  id: string;
  name: string;
  repo: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  npmPackage?: string;
  stars?: number;
  installed: boolean;
  website?: string;
}

export const plugins: Plugin[] = [
  {
    id: 'yamadashy-repomix',
    name: 'Repomix',
    repo: 'yamadashy/repomix',
    author: 'yamadashy',
    description:
      'Pack your entire repository into a single AI-friendly file. Repomix bundles your codebase into formats optimized for feeding into Large Language Models (LLMs) such as Claude, ChatGPT, and Gemini.',
    category: 'Developer Tools',
    tags: ['ai', 'llm', 'code-analysis', 'developer-tools'],
    npmPackage: 'repomix',
    stars: 13000,
    installed: false,
    website: 'https://repomix.com',
  },
];
