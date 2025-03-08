export default function AboutPage() {
  return (
    <div className="relative py-20 bg-black min-h-[80vh]">
      {/* Shadow effect elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">ShadowSite</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Learn more about this shadow-themed website
          </p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">The Story</h2>
          <p className="text-gray-300 mb-4">
            ShadowSite was created with the goal of providing a modern, sleek website template with beautiful shadow effects and smooth animations. I wanted to create a template that would be easy to customize and use for various projects.
          </p>
          <p className="text-gray-300 mb-4">
            As a solo developer, I focused on creating a template that not only looks great but also performs well. I used Next.js and TypeScript to ensure the website is fast, responsive, and type-safe.
          </p>
          <p className="text-gray-300">
            I hope you enjoy using ShadowSite as much as I enjoyed creating it!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">My Mission</h3>
            <p className="text-gray-300">
              My mission is to provide high-quality website templates that are not only visually appealing but also performant and easy to use. I believe that good design should be accessible to everyone.
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">My Vision</h3>
            <p className="text-gray-300">
              I envision a web where beautiful, performant websites are the norm. I strive to contribute to this vision by creating templates that help developers build better websites faster.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">The Developer</h2>
          <div className="max-w-md mx-auto">
            {/* Single Developer */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg">
              <div className="w-24 h-24 rounded-full bg-purple-500/20 mx-auto mb-4 flex items-center justify-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Justin Barlow</h4>
              <p className="text-purple-400 mb-3">Full-Stack Developer</p>
              <p className="text-gray-300 text-sm">
                Justin handles all aspects of development, from design to implementation. Experienced with Next.js, TypeScript, and modern web technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 