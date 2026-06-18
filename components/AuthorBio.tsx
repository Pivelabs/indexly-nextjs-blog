import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Author } from '../lib/types';

interface AuthorBioProps {
  author: Author;
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="border-t border-b border-gray-200 py-8">
      <div className="flex items-start space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={author.avatar.url} 
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="mb-2">
            <h3 className="text-xl font-bold text-gray-900">{author.name}</h3>
            <p className="text-blue-600 font-medium">{author.title}</p>
          </div>
          {author.bio && (
            <p className="text-gray-700 mb-3">{author.bio}</p>
          )}
          <Link 
            href={`/author/${author.slug}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all posts by {author.name} →
          </Link>
        </div>
      </div>
    </div>
  );
}