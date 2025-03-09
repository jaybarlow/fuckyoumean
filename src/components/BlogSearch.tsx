"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BlogSearchProps {
  categories: string[];
}

export default function BlogSearch({ categories }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  // Update URL when search or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    const newUrl = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Use replace to avoid adding to history stack for every keystroke
    router.replace(newUrl, { scroll: false });
  }, [searchTerm, selectedCategory, router]);
  
  // Debounce search input to avoid too many URL updates
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search articles..." 
          defaultValue={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-80 px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
} 