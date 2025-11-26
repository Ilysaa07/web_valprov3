import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '@/lib/blog'; 
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';

export default async function BlogPage() {
  const allPosts = await getSortedPostsData();
  
  const featuredPost = allPosts[0]; 
  const otherPosts = allPosts.slice(1);
  const BRAND_HEX = "#2a3f9b";

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";
  const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=default";

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm">
              <BookOpen size={16} className="text-[#2a3f9b]" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Pusat Wawasan</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
             Berita & Artikel <span style={{ color: BRAND_HEX }}>Terbaru</span>
           </h1>
           <p className="text-stone-500 text-lg font-light">
             Update regulasi hukum, tips bisnis praktis, dan panduan sertifikasi untuk pertumbuhan perusahaan Anda.
           </p>
        </div>

        {/* --- FEATURED POST (HERO CARD) --- */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20 relative">
            <div className="bg-white rounded-[2.5rem] border border-stone-200 p-3 shadow-2xl shadow-stone-200/50 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1">
               <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Image Side (7 Cols) */}
                  <div className="lg:col-span-7 relative h-[300px] lg:h-[450px] rounded-[2rem] overflow-hidden">
                     <Image 
                       src={featuredPost.image || FALLBACK_IMAGE} 
                       alt={featuredPost.title} 
                       fill 
                       className="object-cover transition-transform duration-1000 group-hover:scale-105"
                       priority
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                     <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-[#2a3f9b] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                          {featuredPost.category} Feature
                        </span>
                     </div>
                  </div>

                  {/* Text Side (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center p-4 lg:p-8 lg:pr-12">
                     <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {featuredPost.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span>5 Menit Baca</span>
                     </div>
                     
                     <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight group-hover:text-[#2a3f9b] transition-colors">
                       {featuredPost.title}
                     </h2>
                     
                     <p className="text-stone-500 leading-relaxed mb-8 line-clamp-3">
                       {featuredPost.excerpt}
                     </p>

                     <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full border-2 border-stone-100 overflow-hidden relative">
                              <Image 
                                src={featuredPost.authorImage || FALLBACK_AVATAR} 
                                alt={featuredPost.author} 
                                fill 
                                className="object-cover"
                              />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-stone-900">{featuredPost.author}</p>
                              <p className="text-xs text-stone-400">{featuredPost.authorRole}</p>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#2a3f9b] group-hover:text-white transition-all">
                           <ArrowRight size={20} />
                        </div>
                     </div>
                  </div>

               </div>
            </div>
          </Link>
        )}

        {/* --- GRID ARTICLES (MASONRY STYLE) --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post, idx) => (
            <Link key={idx} href={`/blog/${post.slug}`} className="group flex flex-col h-full">
               <div className="bg-white rounded-[2rem] border border-stone-200 p-3 shadow-lg shadow-stone-200/40 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                  
                  {/* Image */}
                  <div className="relative h-60 rounded-[1.5rem] overflow-hidden mb-4">
                     <Image 
                       src={post.image || FALLBACK_IMAGE} 
                       alt={post.title} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                       sizes="(max-width: 768px) 100vw, 33vw"
                     />
                     <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-stone-800 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          {post.category}
                        </span>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="px-3 pb-3 flex flex-col flex-grow">
                     <div className="flex items-center gap-2 text-xs font-medium text-stone-400 mb-3">
                        <Calendar size={14} /> {post.date}
                     </div>
                     
                     <h3 className="text-xl font-bold text-stone-900 mb-3 leading-snug group-hover:text-[#2a3f9b] transition-colors line-clamp-2">
                       {post.title}
                     </h3>
                     
                     <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                       {post.excerpt}
                     </p>

                     <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden relative">
                              <Image 
                                src={post.authorImage || FALLBACK_AVATAR} 
                                alt={post.author} 
                                fill 
                                className="object-cover"
                              />
                           </div>
                           <span className="text-xs font-bold text-stone-600">{post.author}</span>
                        </div>
                        <span className="text-xs font-bold text-[#2a3f9b] group-hover:underline">Baca Artikel</span>
                     </div>
                  </div>
               </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}