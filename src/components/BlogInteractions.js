"use client";
import { useState, useEffect } from 'react';
import { Bookmark, Share2, Check, Link as LinkIcon } from 'lucide-react';

export default function BlogInteractions({ title, slug }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // 1. Cek status "Simpan" saat halaman dimuat
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('valpro_bookmarks') || '[]');
    if (savedPosts.includes(slug)) {
      setIsSaved(true);
    }
  }, [slug]);

  // 2. Logika Tombol Simpan (Bookmark)
  const handleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem('valpro_bookmarks') || '[]');
    
    if (isSaved) {
      // Hapus dari bookmark
      const newPosts = savedPosts.filter(s => s !== slug);
      localStorage.setItem('valpro_bookmarks', JSON.stringify(newPosts));
      setIsSaved(false);
    } else {
      // Tambah ke bookmark
      savedPosts.push(slug);
      localStorage.setItem('valpro_bookmarks', JSON.stringify(savedPosts));
      setIsSaved(true);
    }
  };

  // 3. Logika Tombol Bagikan (Share / Copy)
  const handleShare = async () => {
    const url = window.location.href; // Ambil URL saat ini

    // Cek apakah browser mendukung fitur Share Native (biasanya di HP)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Baca artikel menarik ini: ${title}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy Link ke Clipboard (untuk Desktop)
      navigator.clipboard.writeText(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000); // Reset status setelah 2 detik
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Tombol Simpan */}
      <button 
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
          isSaved 
            ? 'bg-[#2a3f9b] text-white shadow-lg shadow-blue-900/20' 
            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
        }`}
      >
        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> 
        {isSaved ? 'Disimpan' : 'Simpan'}
      </button>

      {/* Tombol Bagikan */}
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-600 font-medium text-sm transition-all duration-300 active:scale-95"
      >
        {isShared ? <Check size={16} className="text-green-600"/> : <Share2 size={16} />}
        {isShared ? 'Link Disalin!' : 'Bagikan'}
      </button>
    </div>
  );
}