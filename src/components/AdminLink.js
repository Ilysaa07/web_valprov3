'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLink() {
  const [showAdminLink, setShowAdminLink] = useState(false);

  // Only show admin link when pressing a secret key combination (for example, Ctrl+Shift+A)
  if (typeof window !== 'undefined') {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLink(true);
      }
    };

    // Add event listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
  }

  if (!showAdminLink) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link 
        href="/admin" 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
      >
        Admin Dashboard
      </Link>
    </div>
  );
}