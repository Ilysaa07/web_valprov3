import { getPostData, getSortedPostsData } from '@/lib/blog';
import { servicesData } from '@/lib/servicesData';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Share2, MessageCircle, 
  ArrowRight, Clock, CheckCircle2, Bookmark 
} from 'lucide-react';

// IMPORT RENDERER CONTENTFUL
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

import BlogInteractions from '@/components/BlogInteractions';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };
  return {
    title: `${post.title} - Blog Valpro`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) return notFound();

  const relatedService = servicesData.find(s => s.slug === post.relatedService);
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";
  const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=default";

  // --- KONFIGURASI RENDERER CONTENTFUL (AGAR CANTIK) ---
  const renderOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6 leading-relaxed text-stone-600">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold text-stone-900 mt-12 mb-6">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold text-stone-900 mt-10 mb-4 border-b border-stone-100 pb-2">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-bold text-stone-800 mt-8 mb-3">{children}</h3>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-5 space-y-2 mb-6 text-stone-600">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-5 space-y-2 mb-6 text-stone-600">{children}</ol>,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-[#2a3f9b] pl-6 italic text-stone-600 my-8 bg-stone-50 py-4 pr-4 rounded-r-xl relative">
          <span className="absolute top-2 left-2 text-4xl text-[#2a3f9b] opacity-20">"</span>
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="border-stone-200 my-10" />,
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-bold text-stone-800">{text}</strong>,
      [MARKS.CODE]: (text) => <code className="bg-stone-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">{text}</code>,
    },
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* 1. HERO HEADER (Full Width & Immersive) */}
      <div className="relative w-full h-[450px] lg:h-[550px]">
         <Image 
            src={post.image || FALLBACK_IMAGE} 
            alt={post.title} 
            fill 
            className="object-cover brightness-[0.4]"
            priority 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent"></div>
         
         <div className="absolute bottom-0 w-full pb-16 lg:pb-24 px-6">
            <div className="max-w-4xl mx-auto text-center relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg">
                 {post.category}
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
                 {post.title}
               </h1>
               
               {/* Author & Meta Info */}
               <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-2 pl-2 pr-6 text-white text-sm font-medium">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 relative">
                        <Image 
                            src={post.authorImage || FALLBACK_AVATAR} 
                            alt={post.author || "Admin"} 
                            fill 
                            className="object-cover"
                        />
                     </div>
                     <div className="text-left">
                        <p className="text-xs text-stone-300 font-normal">Ditulis oleh</p>
                        <p className="leading-none">{post.author}</p>
                     </div>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                     <Calendar size={16} className="text-stone-300"/> 
                     <span>{post.date}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-12 gap-12 -mt-12 relative z-20">
         
         {/* 2. CONTENT AREA (Paper Style) */}
         <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-stone-100">
                
                <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-[#2a3f9b] mb-10 transition-colors group">
                   <div className="p-1 rounded-full bg-stone-100 group-hover:bg-[#2a3f9b] group-hover:text-white transition-colors">
                      <ArrowLeft size={14}/> 
                   </div>
                   Kembali ke Blog
                </Link>

                {/* ARTIKEL BODY (CONTENTFUL RENDERER) */}
                <article className="prose prose-lg prose-stone max-w-none">
                   {post.content ? (
                     documentToReactComponents(post.content, renderOptions)
                   ) : (
                     <div className="p-12 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 text-center">
                       <p className="text-stone-400 font-medium">Konten sedang disiapkan...</p>
                     </div>
                   )}
                </article>

                {/* SHARE & TAGS */}
                <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <BlogInteractions title={post.title} slug={post.slug} />
                   <p className="text-xs text-stone-400 italic">Terakhir diupdate: {post.date}</p>
                </div>
            </div>
         </div>

         {/* 3. SIDEBAR (Sticky & Contextual) */}
         <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8">
               
               {/* Author Card Mini */}
               <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-200 relative flex-shrink-0">
                     <Image src={post.authorImage || FALLBACK_AVATAR} alt={post.author} fill className="object-cover" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-stone-400 uppercase">Penulis</p>
                     <p className="font-bold text-stone-900">{post.author}</p>
                     <p className="text-xs text-stone-500">{post.authorRole}</p>
                  </div>
               </div>

               {/* Contextual Service CTA */}
               {relatedService && (
                 <div className="bg-[#2a3f9b] rounded-[2.5rem] p-8 text-white relative overflow-hidden text-center group shadow-2xl shadow-blue-900/30">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10">
                       <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6">
                          <CheckCircle2 size={28} className="text-blue-200" />
                       </div>
                       
                       <h3 className="text-xl font-bold mb-3 leading-tight">
                         Kesulitan mengurus {relatedService.title}?
                       </h3>
                       <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-90">
                         Serahkan pada ahlinya. Kami pastikan dokumen legalitas Anda terbit cepat dan sah.
                       </p>
                       
                       <Link 
                         href={`/layanan/${relatedService.slug}`}
                         className="inline-flex items-center justify-center gap-2 w-full py-4 bg-white text-[#2a3f9b] rounded-xl font-bold hover:bg-blue-50 transition transform hover:-translate-y-1 shadow-lg"
                       >
                         Lihat Solusi <ArrowRight size={16}/>
                       </Link>
                    </div>
                 </div>
               )}

               {/* Newsletter / Contact */}
               <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-200 text-center">
                  <h4 className="font-bold text-stone-900 mb-2">Masih Bingung?</h4>
                  <p className="text-stone-500 text-sm mb-6">Konsultasikan masalah hukum bisnis Anda gratis via WhatsApp.</p>
                  <Link 
                     href="https://wa.me/6281399710085"
                     className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-stone-200 text-stone-700 rounded-xl font-bold hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition shadow-sm"
                  >
                     <MessageCircle size={18}/> Hubungi Admin
                  </Link>
               </div>

            </div>
         </div>

      </div>
    </main>
  );
}