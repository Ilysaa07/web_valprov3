"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter(path => path);

  if (pathNames.length === 0) return null; // Jangan tampil di Home

  return (
    <nav aria-label="breadcrumb" className="py-4 text-xs font-medium text-stone-500">
      <ol className="flex items-center gap-2">
        <li className="hover:text-[#2a3f9b] transition-colors">
          <Link href="/" className="flex items-center gap-1"><Home size={14}/> Home</Link>
        </li>
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const label = link.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format Nama
          const isLast = index === pathNames.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight size={12} className="text-stone-300" />
              {isLast ? (
                <span className="text-[#2a3f9b] font-bold truncate max-w-[150px] md:max-w-none">{label}</span>
              ) : (
                <Link href={href} className="hover:text-[#2a3f9b] transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}