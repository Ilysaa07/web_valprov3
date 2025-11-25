import { blogData } from '@/lib/blogData';
import { servicesData } from '@/lib/servicesData';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, MessageCircle, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };
  
  return {
    title: `${post.title} - Blog Valpro`,
    description: post.excerpt,
  };
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);

  if (!post) return notFound();

  // Mencari layanan terkait untuk ditampilkan di Sidebar CTA
  const relatedService = servicesData.find(s => s.slug === post.relatedService);
  const BRAND_HEX = "#2a3f9b";

  return (
    <main className="min-h-screen bg-white font-sans">
      
      {/* 1. HERO HEADER (Full Width Image) */}
      <div className="relative w-full h-[400px] lg:h-[500px]">
         <Image src={post.image} alt={post.title} fill className="object-cover brightness-50" priority />
         <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 to-transparent"></div>
         
         <div className="absolute bottom-0 w-full pb-12 lg:pb-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                 {post.category}
               </div>
               <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                 {post.title}
               </h1>
               <div className="flex flex-wrap items-center justify-center gap-6 text-stone-300 text-sm font-medium">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                        <Image src={post.authorImage} alt={post.author} width={32} height={32} />
                     </div>
                     <span>{post.author}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-stone-500"></span>
                  <span className="flex items-center gap-2"><Calendar size={16}/> {post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-500"></span>
                  <span className="flex items-center gap-2"><Clock size={16}/> {post.readTime} Baca</span>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12">
         
         {/* 2. ARTICLE CONTENT (Left) */}
         <div className="lg:col-span-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#2a3f9b] mb-8 font-medium">
               <ArrowLeft size={16}/> Kembali ke Blog
            </Link>

            {/* Render Content Blocks */}
            <article className="prose prose-lg prose-stone max-w-none">
               {/* Simulasi rendering content dari data */}
               {post.content.map((block, idx) => {
                  if (block.type === 'h2') return <h2 key={idx} className="text-2xl font-bold text-stone-900 mt-10 mb-4">{block.text}</h2>;
                  if (block.type === 'ul') return (
                    <ul key={idx} className="list-disc pl-5 space-y-2 mb-6 text-stone-600">
                      {block.items.map((li, i) => <li key={i}>{li}</li>)}
                    </ul>
                  );
                  return <p key={idx} className="text-stone-600 leading-relaxed mb-6">{block.text}</p>;
               })}
            </article>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
               <p className="font-bold text-stone-900">Bagikan artikel ini:</p>
               <div className="flex gap-3">
                  <button className="p-3 rounded-full bg-stone-100 hover:bg-[#2a3f9b] hover:text-white transition-colors"><Share2 size={18}/></button>
               </div>
            </div>
         </div>

         {/* 3. SIDEBAR CTA (Right - Sticky) */}
         <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8">
               
               {/* Contextual CTA: Jika ada layanan terkait */}
               {relatedService && (
                 <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white relative overflow-hidden text-center group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#2a3f9b] rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Solusi Valpro</p>
                    <h3 className="text-xl font-bold mb-4">Butuh bantuan soal {post.category}?</h3>
                    <p className="text-stone-300 text-sm mb-8 leading-relaxed">
                      Jangan pusing sendiri. Tim Valpro siap membantu pengurusan {relatedService.title} Anda sekarang juga.
                    </p>
                    
                    <Link 
                      href={`/layanan/${relatedService.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-4 bg-white text-[#0f172a] rounded-xl font-bold hover:bg-blue-50 transition"
                    >
                      Lihat Layanan <ArrowRight size={16}/>
                    </Link>
                 </div>
               )}

               {/* Newsletter / Contact Simple */}
               <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-2">Konsultasi Gratis</h4>
                  <p className="text-stone-500 text-sm mb-6">Punya pertanyaan spesifik tentang hukum bisnis?</p>
                  <Link 
                     href="https://wa.me/6289518530306"
                     className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-stone-200 text-stone-700 rounded-xl font-bold hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition"
                  >
                     <MessageCircle size={18}/> Hubungi Kami
                  </Link>
               </div>

            </div>
         </div>

      </div>
    </main>
  );
}