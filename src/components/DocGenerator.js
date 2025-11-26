"use client";
import { useState, useRef } from 'react';
import { FileText, Download, Copy, Check, PenTool } from 'lucide-react';

export default function DocGenerator() {
  const [formData, setFormData] = useState({
    pihak1Nama: '',
    pihak1Jabatan: '',
    pihak1Instansi: '',
    pihak2Nama: '',
    pihak2Jabatan: '',
    pihak2Instansi: '',
    judulKerjasama: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = () => {
    const text = document.getElementById('surat-preview').innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format Tanggal Indonesia
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-stone-200 overflow-hidden font-sans flex flex-col lg:flex-row">
      
      {/* KIRI: INPUT FORM */}
      <div className="lg:w-5/12 p-8 md:p-10 bg-stone-50 border-r border-stone-200 h-auto lg:h-[800px] overflow-y-auto custom-scrollbar">
         <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
               <PenTool size={14} className="text-[#2a3f9b]" />
               <span className="text-xs font-bold text-[#2a3f9b] uppercase tracking-wider">Template Gratis</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900">Buat Surat Perjanjian</h3>
            <p className="text-stone-500 text-sm mt-2">
              Isi data di bawah untuk membuat draf MoU (Nota Kesepahaman) sederhana secara instan.
            </p>
         </div>

         <div className="space-y-6">
            {/* Pihak 1 */}
            <div className="space-y-3">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Pihak Pertama</p>
               <input name="pihak1Nama" placeholder="Nama Lengkap" onChange={handleChange} className="input-field" />
               <input name="pihak1Jabatan" placeholder="Jabatan" onChange={handleChange} className="input-field" />
               <input name="pihak1Instansi" placeholder="Nama Perusahaan/Instansi" onChange={handleChange} className="input-field" />
            </div>

            {/* Pihak 2 */}
            <div className="space-y-3">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Pihak Kedua</p>
               <input name="pihak2Nama" placeholder="Nama Lengkap" onChange={handleChange} className="input-field" />
               <input name="pihak2Jabatan" placeholder="Jabatan" onChange={handleChange} className="input-field" />
               <input name="pihak2Instansi" placeholder="Nama Perusahaan/Instansi" onChange={handleChange} className="input-field" />
            </div>

            {/* Detail */}
            <div className="space-y-3">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Detail Kerjasama</p>
               <input name="judulKerjasama" placeholder="Tujuan (Misal: Pemasaran Produk)" onChange={handleChange} className="input-field" />
               <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="input-field" />
            </div>
         </div>
      </div>

      {/* KANAN: PREVIEW SURAT */}
      <div className="lg:w-7/12 p-8 md:p-12 bg-white relative flex flex-col">
         
         {/* Paper Effect */}
         <div className="flex-grow bg-white border border-stone-200 shadow-sm p-8 md:p-12 rounded-xl text-stone-800 text-sm leading-relaxed font-serif relative overflow-y-auto max-h-[600px]" id="surat-preview">
            <h2 className="text-center font-bold text-lg mb-6 uppercase underline decoration-2 underline-offset-4">
               Nota Kesepahaman (MoU)
            </h2>
            
            <p className="mb-4">
               Pada hari ini, <strong>{formatDate(formData.tanggal)}</strong>, kami yang bertanda tangan di bawah ini:
            </p>

            <div className="pl-4 mb-4 border-l-2 border-stone-200">
               <p>1. <strong>{formData.pihak1Nama || '[Nama Pihak 1]'}</strong>, bertindak sebagai {formData.pihak1Jabatan || '[Jabatan]'} dari {formData.pihak1Instansi || '[Perusahaan 1]'}, selanjutnya disebut <strong>PIHAK PERTAMA</strong>.</p>
               <br/>
               <p>2. <strong>{formData.pihak2Nama || '[Nama Pihak 2]'}</strong>, bertindak sebagai {formData.pihak2Jabatan || '[Jabatan]'} dari {formData.pihak2Instansi || '[Perusahaan 2]'}, selanjutnya disebut <strong>PIHAK KEDUA</strong>.</p>
            </div>

            <p className="mb-4">
               PIHAK PERTAMA dan PIHAK KEDUA sepakat untuk mengadakan kerjasama dalam bidang <strong>{formData.judulKerjasama || '[Tujuan Kerjasama]'}</strong> dengan ketentuan yang akan diatur lebih lanjut dalam Perjanjian Kerjasama (PKS) yang mengikat.
            </p>

            <p className="mb-8">
               Demikian Nota Kesepahaman ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-12 text-center">
               <div>
                  <p className="mb-16">PIHAK PERTAMA</p>
                  <p className="font-bold underline">{formData.pihak1Nama || '(....................)'}</p>
               </div>
               <div>
                  <p className="mb-16">PIHAK KEDUA</p>
                  <p className="font-bold underline">{formData.pihak2Nama || '(....................)'}</p>
               </div>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="mt-6 flex justify-end gap-3">
            <button 
               onClick={handleCopy}
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition active:scale-95"
            >
               {copied ? <Check size={18} className="text-green-600"/> : <Copy size={18}/>}
               {copied ? 'Tersalin' : 'Salin Teks'}
            </button>
            <a 
               href="https://wa.me/6281399710085?text=Halo Valpro, saya butuh bantuan untuk review kontrak kerjasama bisnis."
               target="_blank"
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2a3f9b] text-white font-bold hover:bg-[#1e2f75] transition shadow-lg shadow-blue-900/20 active:scale-95"
            >
               <FileText size={18}/> Review Legal (Berbayar)
            </a>
         </div>

      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #2a3f9b;
          box-shadow: 0 0 0 3px rgba(42, 63, 155, 0.1);
        }
      `}</style>
    </div>
  );
}