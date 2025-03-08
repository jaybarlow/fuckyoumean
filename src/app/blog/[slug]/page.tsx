import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Mock blog data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    content: `
      <p>Next.js is a powerful React framework that makes building web applications simple and efficient. In this article, we'll explore the key features that make Next.js stand out.</p>
      
      <h2>Server-Side Rendering</h2>
      <p>One of the biggest advantages of Next.js is its built-in support for server-side rendering (SSR). This means your pages are rendered on the server before being sent to the client, resulting in faster page loads and better SEO.</p>
      
      <h2>File-Based Routing</h2>
      <p>Next.js uses a file-based routing system, which means you don't need to configure routes manually. Simply create a file in the pages directory, and it becomes available as a route.</p>
      
      <h2>API Routes</h2>
      <p>With Next.js, you can create API endpoints easily by adding files to the api directory. This allows you to build full-stack applications without needing a separate backend server.</p>
      
      <h2>Static Site Generation</h2>
      <p>Next.js also supports static site generation (SSG), which pre-renders pages at build time. This results in extremely fast page loads and can be deployed to a CDN for optimal performance.</p>
      
      <h2>Conclusion</h2>
      <p>Next.js provides a great developer experience with features like hot module replacement, automatic code splitting, and TypeScript support. Whether you're building a small personal project or a large-scale application, Next.js has the tools you need to succeed.</p>
    `,
    date: 'March 15, 2023',
    author: 'Jane Doe',
    slug: 'getting-started-with-nextjs',
    category: 'Development',
  },
  {
    id: 2,
    title: 'The Power of TypeScript',
    content: `
      <p>TypeScript has revolutionized JavaScript development by adding static types to the language. Let's explore why TypeScript has become so popular among developers.</p>
      
      <h2>Type Safety</h2>
      <p>The primary benefit of TypeScript is type safety. By defining types for your variables, functions, and objects, you can catch errors at compile time rather than runtime.</p>
      
      <h2>Better IDE Support</h2>
      <p>TypeScript provides excellent IDE support, including autocompletion, type checking, and refactoring tools. This makes development faster and more efficient.</p>
      
      <h2>Enhanced Readability</h2>
      <p>Types serve as documentation, making your code more readable and easier to understand. This is especially valuable when working on large codebases or with multiple developers.</p>
      
      <h2>Gradual Adoption</h2>
      <p>One of TypeScript's strengths is that you can adopt it gradually. You can start by adding TypeScript to a small part of your project and expand over time.</p>
      
      <h2>Conclusion</h2>
      <p>TypeScript has become an essential tool for modern JavaScript development. Its type system helps prevent bugs, improves code quality, and enhances the developer experience.</p>
    `,
    date: 'April 2, 2023',
    author: 'John Smith',
    slug: 'power-of-typescript',
    category: 'Programming',
  },
  {
    id: 3,
    title: 'Designing for Dark Mode',
    content: `
      <p>Dark mode has become increasingly popular in recent years. In this article, we'll discuss best practices for implementing dark mode in your web applications.</p>
      
      <h2>Why Dark Mode Matters</h2>
      <p>Dark mode reduces eye strain in low-light conditions, saves battery life on OLED screens, and provides an alternative aesthetic that many users prefer.</p>
      
      <h2>Color Considerations</h2>
      <p>When designing for dark mode, avoid pure black backgrounds. Instead, use dark grays to prevent contrast issues and reduce eye strain. Similarly, avoid pure white text on dark backgrounds.</p>
      
      <h2>Maintaining Hierarchy</h2>
      <p>Ensure your visual hierarchy remains clear in dark mode. Use subtle variations in color and brightness to distinguish between different elements.</p>
      
      <h2>Implementation Strategies</h2>
      <p>Use CSS variables or a theming system to switch between light and dark modes. This allows for a clean separation of concerns and makes it easier to maintain your styles.</p>
      
      <h2>Conclusion</h2>
      <p>Implementing dark mode is more than just inverting colors. By following these best practices, you can create a dark mode experience that's both aesthetically pleasing and functional.</p>
    `,
    date: 'May 10, 2023',
    author: 'Alex Johnson',
    slug: 'designing-for-dark-mode',
    category: 'Design',
  },
  {
    id: 4,
    title: 'Authentication Strategies for Modern Apps',
    content: `
      <p>Authentication is a critical component of any web application. Let's explore different authentication strategies and their pros and cons.</p>
      
      <h2>JWT Authentication</h2>
      <p>JSON Web Tokens (JWT) are a popular choice for authentication. They're stateless, can contain user data, and work well with microservices architectures.</p>
      
      <h2>OAuth 2.0</h2>
      <p>OAuth 2.0 is an authorization framework that allows users to grant limited access to their resources on one site to another site without sharing their credentials.</p>
      
      <h2>Session-Based Authentication</h2>
      <p>Traditional session-based authentication uses cookies to maintain user sessions. This approach is simple to implement but can have scalability challenges.</p>
      
      <h2>Passwordless Authentication</h2>
      <p>Passwordless authentication methods, such as magic links and one-time codes, eliminate the need for passwords, improving security and user experience.</p>
      
      <h2>Conclusion</h2>
      <p>Choosing the right authentication strategy depends on your application's requirements, security needs, and user experience goals. Often, a combination of approaches works best.</p>
    `,
    date: 'June 18, 2023',
    author: 'Sam Wilson',
    slug: 'authentication-strategies',
    category: 'Security',
  },
];

type Params = Promise<{ slug: string }>;

type Props = {
  params: Params;
  searchParams?: Record<string, string | string[]>;
};

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  // Await the entire params object first
  const params = await props.params;
  const { slug } = params;
  
  const post = blogPosts.find((post) => post.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - ShadowSite',
    };
  }
  
  return {
    title: `${post.title} - ShadowSite Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  // Await the entire params object first
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const post = blogPosts.find((post) => post.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>
        
        <article className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300">
                {post.category}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-sm text-gray-400">{post.date}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-400">
              <span>By {post.author}</span>
            </div>
          </header>
          
          <div 
            className="prose prose-invert prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h3 className="text-xl font-bold mb-4">Share this post</h3>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 