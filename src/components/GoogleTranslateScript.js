"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateScript() {
  
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: "en,ja,zh-CN,zh-TW,ko,id",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="absolute top-0 left-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload" 
      />
    </>
  );
}