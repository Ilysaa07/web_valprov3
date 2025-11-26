import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { getSortedPostsData } from '@/lib/blog';

export default async function HomeBlogSection() {
  // Ambil data dari CMS
  const allPosts = await getSortedPostsData();
  // Ambil 3 artikel terbaru saja
  const latestPosts = allPosts.slice(0, 3);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";

  // Jika belum ada artikel, jangan tampilkan section ini
  if (latestPosts.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm mb-4">
               <Newspaper size={14} className="text-[#2a3f9b]" />
               <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Wawasan & Berita</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
              Update Regulasi & Tips Bisnis
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-stone-600 font-semibold hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition-all shadow-sm hover:shadow-md"
          >
            Lihat Semua Artikel 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Artikel */}
        <div className="grid md:grid-cols-3 gap-8">
          {latestPosts.map((post, idx) => (
            <Link 
              key={idx} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-2 relative"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image 
                  src={post.image || FALLBACK_IMAGE} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-800 border border-white/50 shadow-sm">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative">
                {/* Date Badge floating over image border */}
                <div className="absolute -top-5 right-8 bg-[#2a3f9b] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                   <Calendar size={12} /> {post.date}
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-3 leading-snug group-hover:text-[#2a3f9b] transition-colors line-clamp-2 mt-2">
                  {post.title}
                </h3>
                
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                  {post.excerpt}
                </p>

                <div className="pt-6 border-t border-stone-50 mt-auto flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden relative border border-stone-200">
                         <Image src={post.authorImage || "https://i.pravatar.cc/150?u=admin"} alt="Author" fill className="object-cover" />
                      </div>
                      <p className="text-xs font-bold text-stone-500">{post.author}</p>
                   </div>
                   <span className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#2a3f9b] group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}