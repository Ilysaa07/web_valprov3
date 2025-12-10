"use client";
import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = async () => {
      setMounted(true);

      // Fungsi inisialisasi
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) return;

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: "en,ja,zh-CN,zh-TW,ko,id", // Bahasa target
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // Layout simpel
            autoDisplay: false, // Jangan otomatis popup
          },
          "google_translate_element"
        );
      };

      // Load script jika belum ada
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    init();
  }, []);

  // Jangan render di server (SSR) untuk hindari mismatch
  if (!mounted) return null;

  return (
    // Container dengan style khusus untuk menyembunyikan elemen aneh
    <div className="relative flex items-center">
      <div 
        id="google_translate_element" 
        className="notranslate" // Kelas ini mencegah widget menerjemahkan dirinya sendiri
        style={{ minWidth: '100px' }} // Beri lebar minimal agar tidak gepeng
      />
    </div>
  );
}