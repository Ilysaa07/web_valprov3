"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import LoginForm from "./LoginForm";
import AdminDashboard from "./AdminDashboard";
import RecaptchaProvider from "./RecaptchaProvider";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminClient() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/logometa.svg"
            alt="Valpro"
            width={48}
            height={48}
            className="mb-4"
          />
          <Loader2 size={32} className="animate-spin text-[#1e40af]" />
          <p className="mt-4 text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/logometa.svg"
            alt="Valpro"
            width={48}
            height={48}
            className="mb-4"
          />
          <Loader2 size={32} className="animate-spin text-[#1e40af]" />
          <p className="mt-4 text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <AdminDashboard userEmail={user.email} />
      </div>
    );
  }

  return (
    <div>
      <RecaptchaProvider>
        <LoginForm />
      </RecaptchaProvider>
    </div>
  );
}
