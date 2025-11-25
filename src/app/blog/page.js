"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogData } from '@/lib/blogData';
import { Calendar, User, ArrowRight, Search, Clock } from 'lucide-react';

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState("Semua");
  const categories = ["Semua", "Legalitas", "Konstruksi", "Standar", "Keuangan"];

  // Filter Logic
  const filteredPosts = activeCat === "Semua" 
    ? blogData 
    : blogData.filter(post => post.category === activeCat);

  // Featured Post (Ambil yang pertama)
  const featuredPost = filteredPosts[0]; 
  const otherPosts = filteredPosts.slice(1);

  const BRAND_HEX = "#2a3f9b";

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 font-sans">
      
      {/* 1. HEADER & SEARCH */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          Blog & <span style={{ color: BRAND_HEX }}>Berita Terkini</span>
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto mb-10 text-lg">
          Tips bisnis, update regulasi hukum, dan panduan sertifikasi untuk membantu usaha Anda tumbuh lebih cepat.
        </p>

        {/* Search Bar Visual */}
        <div className="max-w-md mx-auto relative group">
          <input 
            type="text" 
            placeholder="Cari topik artikel..." 
            className="w-full pl-12 pr-4 py-4 rounded-full border border-stone-200 focus:outline-none focus:border-[#2a3f9b] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* 2. CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCat === cat
                  ? 'bg-stone-900 text-white shadow-lg'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-[#2a3f9b] hover:text-[#2a3f9b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. FEATURED POST (Artikel Utama Besar) */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-stone-100 shadow-xl shadow-stone-200/40 grid lg:grid-cols-2 transition-transform duration-500 hover:-translate-y-1">
               {/* Image Side */}
               <div className="relative h-[300px] lg:h-[450px] overflow-hidden">
                 <Image 
                   src={featuredPost.image} 
                   alt={featuredPost.title} 
                   fill 
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#2a3f9b]">
                    {featuredPost.category}
                 </div>
               </div>
               
               {/* Content Side */}
               <div className="p-8 lg:p-12 flex flex-col justify-center">
                 <div className="flex items-center gap-4 text-xs text-stone-400 font-medium mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {featuredPost.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {featuredPost.readTime} Baca</span>
                 </div>
                 <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-[#2a3f9b] transition-colors">
                   {featuredPost.title}
                 </h2>
                 <p className="text-stone-500 text-lg leading-relaxed mb-8 line-clamp-3">
                   {featuredPost.excerpt}
                 </p>
                 <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-100">
                       <Image src={featuredPost.authorImage} alt={featuredPost.author} width={40} height={40} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-stone-900">{featuredPost.author}</p>
                       <p className="text-xs text-stone-400">{featuredPost.authorRole}</p>
                    </div>
                 </div>
               </div>
            </div>
          </Link>
        )}

        {/* 4. GRID ARTICLES (Sisa Artikel) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post, idx) => (
            <Link key={idx} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-2">
              
              {/* Card Image */}
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  {post.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow">
                 <div className="flex items-center gap-3 text-xs text-stone-400 font-medium mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                 </div>
                 <h3 className="text-xl font-bold text-stone-900 mb-3 leading-snug group-hover:text-[#2a3f9b] transition-colors">
                   {post.title}
                 </h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                   {post.excerpt}
                 </p>
                 
                 {/* Author Mini */}
                 <div className="flex items-center gap-3 pt-6 border-t border-stone-50 mt-auto">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                       <Image src={post.authorImage} alt={post.author} width={32} height={32} />
                    </div>
                    <p className="text-xs font-bold text-stone-600">{post.author}</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
             <p className="text-stone-400">Belum ada artikel di kategori ini.</p>
          </div>
        )}

      </div>
    </main>
  );
}