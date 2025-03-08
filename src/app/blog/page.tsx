import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - ShadowSite',
  description: 'Read our latest articles and updates',
};

// Mock blog data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    excerpt: 'Learn how to build modern web applications with Next.js and React.',
    date: 'March 15, 2023',
    author: 'Jane Doe',
    slug: 'getting-started-with-nextjs',
    category: 'Development',
  },
  {
    id: 2,
    title: 'The Power of TypeScript',
    excerpt: 'Discover how TypeScript can improve your development workflow and catch errors early.',
    date: 'April 2, 2023',
    author: 'John Smith',
    slug: 'power-of-typescript',
    category: 'Programming',
  },
  {
    id: 3,
    title: 'Designing for Dark Mode',
    excerpt: 'Best practices for creating beautiful dark mode interfaces that users love.',
    date: 'May 10, 2023',
    author: 'Alex Johnson',
    slug: 'designing-for-dark-mode',
    category: 'Design',
  },
  {
    id: 4,
    title: 'Authentication Strategies for Modern Apps',
    excerpt: 'Explore different authentication approaches for your web applications.',
    date: 'June 18, 2023',
    author: 'Sam Wilson',
    slug: 'authentication-strategies',
    category: 'Security',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-4">
            Our Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and updates from our team. Explore the latest in web development, design, and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300">
                    {post.category}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{post.date}</span>
                </div>
                
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold mb-3 text-white hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {post.author}</span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Want to stay updated with our latest posts?</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 