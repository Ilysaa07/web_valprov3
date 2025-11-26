"use client";
import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Mencegah script double
    if (document.getElementById("google-translate-script")) return;

    // 1. Siapkan fungsi inisialisasi
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "id", // Bahasa asli website
          includedLanguages: "en,ja,zh-CN,zh-TW,ko,id", // Bahasa target
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // 2. Inject Script Google
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    // Wadah tersembunyi untuk inisialisasi Google
    <div id="google_translate_element" style={{ display: 'none' }} />
  );
}