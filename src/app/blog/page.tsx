import Link from 'next/link';
import { Metadata } from 'next';
import BlogSearch from '@/components/BlogSearch';

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
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Power of TypeScript',
    excerpt: 'Discover how TypeScript can improve your development workflow and catch errors early.',
    date: 'April 2, 2023',
    author: 'John Smith',
    slug: 'power-of-typescript',
    category: 'Programming',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Designing for Dark Mode',
    excerpt: 'Best practices for creating beautiful dark mode interfaces that users love.',
    date: 'May 10, 2023',
    author: 'Alex Johnson',
    slug: 'designing-for-dark-mode',
    category: 'Design',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Authentication Strategies for Modern Apps',
    excerpt: 'Explore different authentication approaches for your web applications.',
    date: 'June 18, 2023',
    author: 'Sam Wilson',
    slug: 'authentication-strategies',
    category: 'Security',
    readTime: '8 min read',
  },
  {
    id: 5,
    title: 'Optimizing React Performance',
    excerpt: 'Learn techniques to make your React applications faster and more efficient.',
    date: 'July 22, 2023',
    author: 'Jane Doe',
    slug: 'optimizing-react-performance',
    category: 'Development',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Introduction to Tailwind CSS',
    excerpt: 'Get started with the utility-first CSS framework that\'s changing how we style web applications.',
    date: 'August 5, 2023',
    author: 'Alex Johnson',
    slug: 'introduction-to-tailwind',
    category: 'Design',
    readTime: '5 min read',
  },
];

// Get unique categories for filter
const categories = Array.from(new Set(blogPosts.map(post => post.category)));

export default function BlogPage({ 
  searchParams 
}: { 
  searchParams: { search?: string; category?: string; page?: string } 
}) {
  // Filter posts based on search params
  const filteredPosts = blogPosts.filter(post => {
    // Filter by search term
    const searchTerm = searchParams.search?.toLowerCase() || '';
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm) || 
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm);
    
    // Filter by category
    const category = searchParams.category || '';
    const matchesCategory = category === '' || post.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  // Pagination
  const postsPerPage = 6;
  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  return (
    <div className="relative py-20 bg-black min-h-screen">
      {/* Shadow effect elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Our Blog</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Insights, tutorials, and updates from our team
          </p>
          
          {/* Search and Filter */}
          <BlogSearch categories={categories} />
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl text-gray-400 mb-4">No posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg h-full transition-all duration-300 hover:bg-gray-800/50 hover:border-purple-500/30 hover:shadow-purple-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                    <span className="text-gray-400 text-sm">{post.date}</span>
                    <span className="text-gray-400 text-sm">By {post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredPosts.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <Link 
                href={`/blog?search=${searchParams.search || ''}&category=${searchParams.category || ''}&page=${Math.max(1, currentPage - 1)}`}
                className={`px-3 py-1 bg-gray-900/70 border border-gray-700 rounded-md text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Previous
              </Link>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Link
                  key={page}
                  href={`/blog?search=${searchParams.search || ''}&category=${searchParams.category || ''}&page=${page}`}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    page === currentPage 
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30' 
                      : 'bg-gray-900/70 border border-gray-700 text-gray-400 hover:text-white hover:border-purple-500/50'
                  }`}
                >
                  {page}
                </Link>
              ))}
              
              <Link 
                href={`/blog?search=${searchParams.search || ''}&category=${searchParams.category || ''}&page=${Math.min(totalPages, currentPage + 1)}`}
                className={`px-3 py-1 bg-gray-900/70 border border-gray-700 rounded-md text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 