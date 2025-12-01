"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function KbliCard({ item }) {
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-[#2a3f9b] transition-all duration-300 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-24">
                    <Link href={`/kbli/${item.kode}`} className="text-lg font-bold text-[#2a3f9b] hover:underline">
                        {item.kode}
                    </Link>
                </div>
                <div className="flex-grow">
                    <Link href={`/kbli/${item.kode}`}>
                        <h3 className="font-bold text-stone-800 mb-2 hover:text-[#2a3f9b]">{item.judul}</h3>
                    </Link>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        {item.uraian}
                    </p>
                </div>
                <div className="flex-shrink-0 mt-3 sm:mt-0">
                    <button 
                        onClick={() => handleCopy(item.kode)}
                        className="w-full sm:w-auto py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-stone-200 text-stone-500 hover:border-[#2a3f9b] hover:text-[#2a3f9b] hover:bg-white transition-all"
                    >
                        {copiedCode === item.kode ? (
                            <><Check size={14} className="text-green-500"/> Tersalin</>
                        ) : (
                            <><Copy size={14}/> Salin</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
