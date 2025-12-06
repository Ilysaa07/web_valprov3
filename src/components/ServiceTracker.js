"use client";
import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Package, AlertCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ServiceTracker() {
  const [invoice, setInvoice] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(false);
    setResult(null);
    setLoading(true);

    // Clear previous subscription if exists
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }

    try {
      // First check if user is authenticated
      if (!auth.currentUser) {
        setError(true);
        return;
      }

      // Search for invoice by invoice number (not document ID)
      // For public invoice tracking, search across all invoices
      // In a real application, you might implement additional security measures
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const invoiceQuery = query(
        collection(db, "invoices"),
        where("invoiceNumber", "==", invoice.trim())
      );

      const querySnapshot = await getDocs(invoiceQuery);

      if (!querySnapshot.empty) {
        const invoiceDoc = querySnapshot.docs[0]; // Get the first matching invoice
        const invoiceData = { id: invoiceDoc.id, ...invoiceDoc.data() }; // Include the actual document ID

        // Convert invoice data to tracking format
        const trackingResult = convertInvoiceToTracking(invoiceData);
        setResult(trackingResult);

        // Set up real-time listener for invoice updates using the actual document ID
        const { onSnapshot } = await import('firebase/firestore');
        const invoiceRef = doc(db, "invoices", invoiceDoc.id); // Use the actual doc ID
        const newUnsubscribe = onSnapshot(invoiceRef, (doc) => {
          if (doc.exists()) {
            const updatedInvoiceData = { id: doc.id, ...doc.data() };
            // Convert updated invoice data to tracking format
            const updatedTrackingResult = convertInvoiceToTracking(updatedInvoiceData);
            setResult(updatedTrackingResult);
          }
        });

        setUnsubscribe(newUnsubscribe);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup subscription on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  // Function to convert invoice status to tracking data
  const convertInvoiceToTracking = (invoice) => {
    // Determine progress based on invoice status
    let progressSteps = [];
    let currentStatus = "Menunggu Pembayaran";

    if (invoice.status === "draft") {
      currentStatus = "Draft";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Menunggu Pembayaran", date: "Menunggu", done: false },
        { step: "Proses Administrasi", date: "Menunggu", done: false },
        { step: "Pengerjaan Dokumen", date: "Menunggu", done: false },
        { step: "Serah Terima", date: "Menunggu", done: false }
      ];
    } else if (invoice.status === "sent") {
      currentStatus = "Dikirim";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Invoice Dikirim", date: formatDate(invoice.createdAt), done: true },
        { step: "Menunggu Pembayaran", date: "Sedang Proses", done: false },
        { step: "Proses Administrasi", date: "Menunggu", done: false },
        { step: "Pengerjaan Dokumen", date: "Menunggu", done: false },
        { step: "Serah Terima", date: "Menunggu", done: false }
      ];
    } else if (invoice.status === "paid") {
      currentStatus = "Lunas - Proses Administrasi";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Invoice Dikirim", date: formatDate(invoice.createdAt), done: true },
        { step: "Pembayaran Diterima", date: formatDate(new Date()), done: true },
        { step: "Proses Administrasi", date: formatDate(new Date()), done: true },
        { step: "Pengerjaan Dokumen", date: "Sedang Proses", done: false },
        { step: "Serah Terima", date: "Menunggu", done: false }
      ];
    } else if (invoice.status === "partial") {
      currentStatus = "Dibayar Sebagian - Proses";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Invoice Dikirim", date: formatDate(invoice.createdAt), done: true },
        { step: "Pembayaran Sebagian", date: formatDate(new Date()), done: true },
        { step: "Menunggu Pelunasan", date: "Sedang Proses", done: false },
        { step: "Proses Administrasi", date: "Menunggu", done: false },
        { step: "Pengerjaan Dokumen", date: "Menunggu", done: false }
      ];
    } else if (invoice.status === "overdue") {
      currentStatus = "Terlambat Pembayaran";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Invoice Dikirim", date: formatDate(invoice.createdAt), done: true },
        { step: "Jatuh Tempo Pembayaran", date: formatDate(invoice.dueDate ? new Date(invoice.dueDate) : new Date()), done: true },
        { step: "Menunggu Pembayaran", date: "Terlambat", done: false },
        { step: "Proses Administrasi", date: "Menunggu", done: false },
        { step: "Pengerjaan Dokumen", date: "Menunggu", done: false }
      ];
    } else if (invoice.status === "cancelled") {
      currentStatus = "Dibatalkan";
      progressSteps = [
        { step: "Pembuatan Draft Invoice", date: formatDate(invoice.createdAt), done: true },
        { step: "Invoice Dibatalkan", date: formatDate(new Date()), done: true },
        { step: "Proses Dibatalkan", date: formatDate(new Date()), done: true },
        { step: "Proses Administrasi", date: "-", done: false },
        { step: "Pengerjaan Dokumen", date: "-", done: false },
        { step: "Serah Terima", date: "-", done: false }
      ];
    }

    return {
      id: invoice.invoiceNumber,
      clientName: invoice.clientName,
      service: invoice.serviceName ||
               (invoice.items && invoice.items.length > 0
                ? invoice.items.map(item => item.description).join(', ')
                : "Layanan Pendirian Badan Usaha"), // Ambil semua item utama dari data invoice
      status: currentStatus,
      lastUpdate: formatDate(new Date()),
      history: progressSteps,
      files: invoice.files || [] // Include attached files
    };
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Tanggal tidak valid";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">

      {/* SEARCH BOX */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200 text-center relative z-10">
         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2a3f9b]">
            <Package size={32} />
         </div>
         <h2 className="text-2xl font-bold text-stone-900 mb-3">Lacak Status Layanan</h2>
         <p className="text-stone-500 mb-8">Masukkan Nomor Invoice Anda (Contoh: INV-2024001) untuk melihat progres pengerjaan dokumen.</p>

         <form onSubmit={handleTrack} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
               type="text"
               placeholder="Nomor Invoice..."
               value={invoice}
               onChange={(e) => setInvoice(e.target.value)}
               className="flex-grow px-6 py-3 rounded-full border-2 border-stone-200 focus:border-[#2a3f9b] outline-none text-stone-800 font-bold uppercase text-center sm:text-left transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-full font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memuat...' : 'Lacak'}
            </button>
         </form>

         {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 text-sm font-medium animate-fade-in-up">
               <AlertCircle size={18} /> Data tidak ditemukan. Mohon cek kembali nomor invoice Anda.
            </div>
         )}
      </div>

      {/* RESULT SECTION */}
      {result && (
         <div className="mt-8 bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-lg animate-fade-in-up">

            {/* Header Result */}
            <div className="bg-stone-50 p-6 md:p-8 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Nama Klien</p>
                  <h3 className="text-xl font-bold text-stone-900">{result.clientName}</h3>
                  <p className="text-sm text-stone-500 mt-1">{result.service}</p>
               </div>
               <div className="text-left md:text-right">
                   <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Status Terkini</p>
                   <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-[#2a3f9b] rounded-full text-sm font-bold">
                      <Clock size={14} className="animate-pulse" /> {result.status}
                   </span>
               </div>
            </div>

            {/* Timeline */}
            <div className="p-8 md:p-10">
               <div className="relative space-y-0">
                  {/* Garis Vertikal */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-stone-200"></div>

                  {result.history.map((step, idx) => (
                     <div key={idx} className="relative flex gap-6 pb-8 last:pb-0 group">
                        {/* Dot Indikator */}
                        <div className={`relative z-10 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm ${step.done ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                           {step.done ? <CheckCircle size={20} /> : <span className="w-3 h-3 bg-stone-400 rounded-full"></span>}
                        </div>

                        {/* Text Content */}
                        <div className={`flex-grow pt-1 ${step.done ? 'opacity-100' : 'opacity-50'}`}>
                           <h4 className="font-bold text-stone-900 text-lg">{step.step}</h4>
                           <p className="text-sm text-stone-500 font-mono mt-1">{step.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* File Attachments Section */}
            {result.files && result.files.length > 0 && (
              <div className="bg-stone-50 p-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-[#2a3f9b]" /> Dokumen Terlampir
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.files.map((file, index) => {
                    // Check if this is a pending setup file (no URL)
                    // Check if this is a failed or pending file
                    const isProblemFile = file.status === 'upload_failed' || file.status === 'pending_storage_setup' || file.error;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          isProblemFile
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-white border-stone-200 hover:bg-stone-100'
                        } transition-colors`}
                      >
                        <div className="bg-blue-100 p-2 rounded">
                          <span className="text-blue-600 font-bold text-xs">
                            {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">{file.name}</p>
                          <p className="text-xs text-stone-500">
                            {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Ukuran tidak diketahui'}
                          </p>
                        </div>
                        {isProblemFile ? (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full" title={file.error}>
                            {file.status === 'upload_failed' ? 'Gagal' : 'Pending'}
                          </span>
                        ) : (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
                {(result.files.some(file => file.status === 'pending_storage_setup' || file.status === 'upload_failed') || result.files.some(file => file.error)) && (
                  <p className="text-xs text-yellow-600 mt-2 italic">
                    * Beberapa dokumen mengalami masalah. Silakan hubungi admin untuk info lebih lanjut.
                  </p>
                )}
              </div>
            )}

            {/* Footer Result */}
            <div className="bg-stone-50 p-4 text-center border-t border-stone-100">
               <p className="text-xs text-stone-400">Terakhir diperbarui: <strong>{result.lastUpdate}</strong></p>
            </div>
         </div>
      )}

    </div>
  );
}