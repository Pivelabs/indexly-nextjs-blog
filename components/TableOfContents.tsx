import React from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
}

export default function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  if (headings.length === 0) return null;
  
  return (
    <div className="bg-gray-50 p-5 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block transition-colors text-sm ${
              heading.level === 2 
                ? '' 
                : heading.level === 3 
                  ? 'ml-4' 
                  : 'ml-8'
            } ${
              activeId === heading.id
                ? 'text-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
