import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { getSortedPostsData } from '@/lib/blog';

// OPTIMASI 1: Pindahkan Konstanta keluar Component
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";

export default async function HomeBlogSection() {
  const allPosts = await getSortedPostsData();
  const latestPosts = allPosts.slice(0, 3);

  if (latestPosts.length === 0) return null;

  // Destructuring
  const [featuredPost, ...sidePosts] = latestPosts;

  return (
    <section 
      className="py-24 bg-stone-50/50 relative overflow-hidden border-t border-stone-200"
      // OPTIMASI 2: content-visibility (Lazy Rendering Native Browser)
      // Browser tidak akan me-render pixel section ini sampai user scroll mendekatinya.
      style={{ contentVisibility: 'auto' }}
    >
      
      {/* Background Decor (Subtle Grid) - Pointer events none agar tidak menghalangi klik */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
             <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-gradient-to-r from-[#1e40af] to-[#3b82f6]"></span>
                <span className="text-[#1e40af] font-bold tracking-widest text-xs uppercase">
                  Wawasan Terkini
                </span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
               Kabar Bisnis & <br/>
               <span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
                 Regulasi Terbaru.
               </span>
             </h2>
          </div>
          
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-stone-600 font-bold text-sm hover:border-blue-200 hover:text-[#1e40af] transition-all shadow-sm hover:shadow-lg hover:shadow-blue-900/5 active:scale-95"
            aria-label="Lihat semua artikel blog"
          >
            Lihat Semua Artikel 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- UNIQUE LAYOUT --- */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
           
           {/* LEFT: FEATURED POST (BIG) */}
           <Link 
             href={`/blog/${featuredPost.slug}`}
             className="group relative h-full min-h-[400px] lg:min-h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1 block"
           >
              <Image 
                src={featuredPost.image || FALLBACK_IMAGE} 
                alt={featuredPost.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                // OPTIMASI 3: Priority & Sizes
                // "sizes" memberi tahu browser: "Di mobile gambar ini lebar penuh, di desktop setengah layar"
                // Ini mencegah browser download gambar 4K untuk container kecil.
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 flex gap-2">
                 <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                   {featuredPost.category}
                 </span>
              </div>

              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                 <div className="flex items-center gap-4 text-white/80 text-xs font-medium mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {featuredPost.date}</span>
                    <span className="flex items-center gap-1.5"><User size={14}/> {featuredPost.author}</span>
                 </div>
                 <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-blue-100 transition-colors">
                    {featuredPost.title}
                 </h3>
                 <p className="text-stone-300 text-sm md:text-base line-clamp-2 max-w-xl mb-6">
                    {featuredPost.excerpt}
                 </p>
                 <span className="inline-flex items-center gap-2 text-white font-bold text-sm border-b border-white/30 pb-1 hover:border-white transition-colors">
                   Baca Selengkapnya <ArrowRight size={16}/>
                 </span>
              </div>
           </Link>

           {/* RIGHT: SIDE POSTS (STACKED) */}
           <div className="flex flex-col gap-6 lg:gap-8">
              {sidePosts.map((post) => (
                 <Link 
                   // Gunakan ID atau Slug sebagai Key, jangan index (idx) jika memungkinkan
                   key={post.slug} 
                   href={`/blog/${post.slug}`}
                   className="group flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-[2rem] border border-stone-100 hover:border-blue-100 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 flex-1 items-center"
                 >
                    {/* Thumbnail Kecil */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-full rounded-2xl overflow-hidden shrink-0">
                       <Image 
                         src={post.image || FALLBACK_IMAGE} 
                         alt={post.title} 
                         fill 
                         className="object-cover transition-transform duration-500 group-hover:scale-110"
                         // OPTIMASI 4: Sizes untuk Thumbnail
                         // Di mobile 100vw, di desktop fix sekitar 200px. Hemat bandwidth signifikan.
                         sizes="(max-width: 640px) 100vw, 200px"
                       />
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col h-full justify-center w-full">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                             {post.category}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                          <span className="text-[10px] text-stone-400 flex items-center gap-1">
                             <Clock size={10}/> {post.date}
                          </span>
                       </div>
                       <h3 className="text-lg font-bold text-stone-900 mb-3 leading-snug group-hover:text-[#1e40af] transition-colors line-clamp-2">
                          {post.title}
                       </h3>
                       <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                       </p>
                       <div className="flex justify-end mt-auto">
                           <span className="text-stone-400 group-hover:text-[#1e40af] transition-colors">
                              <ArrowRight size={20} />
                           </span>
                       </div>
                    </div>
                 </Link>
              ))}
           </div>

        </div>

      </div>
    </section>
  );
}