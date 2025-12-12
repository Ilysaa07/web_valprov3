import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Briefcase, MessageSquare, 
  User, CheckCircle, Clock, AlertCircle, Building,
  Mail, Phone, MapPin, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import { auth, db } from '../lib/firebase';
import { 
    collection, addDoc, updateDoc, deleteDoc, 
    query, where, orderBy, getDocs, doc 
} from 'firebase/firestore';

// Sub-components (Placeholders for now)
const ClientOverview = ({ client }) => (
  <div className="space-y-6">
    {/* Info Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Informasi Utama</h4>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="text-sm text-gray-500">Nama Resmi</div>
                        <div className="font-semibold text-gray-900">{client.name}</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="text-sm text-gray-500">Brand / Usaha</div>
                        <div className="font-semibold text-gray-900">{client.brandName || '-'}</div>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="w-5 flex justify-center text-gray-400 mt-1 font-bold text-xs">ID</div>
                    <div>
                        <div className="text-sm text-gray-500">Tipe Klien</div>
                        <div className="font-semibold text-gray-900 capitalize">{client.type === 'corporate' ? 'Perusahaan' : 'Perorangan'}</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Kontak & Alamat</h4>
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-semibold text-gray-900">{client.email || '-'}</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="text-sm text-gray-500">Telepon</div>
                        <div className="font-semibold text-gray-900">{client.phone || '-'}</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="text-sm text-gray-500">Alamat</div>
                        <div className="font-semibold text-gray-900">{client.address || '-'}</div>
                    </div>
                </div>
            </div>
        </div>
        
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Legalitas</h4>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">NPWP</span>
                    <span className="font-mono font-medium">{client.npwp || '-'}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">NIB</span>
                    <span className="font-mono font-medium">{client.nib || '-'}</span>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">PIC (Penanggung Jawab)</h4>
             <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {client.pic?.name ? client.pic.name.charAt(0) : '?'}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{client.pic?.name || '-'}</div>
                        <div className="text-xs text-gray-500">{client.pic?.position || 'Jabatan tidak tersedia'}</div>
                    </div>
                 </div>
                 <div className="pt-2">
                     <div className="text-xs text-gray-500 mb-1">Kontak PIC</div>
                     <div className="font-medium text-gray-900">{client.pic?.phone || '-'}</div>
                 </div>
            </div>
        </div>
    </div>
  </div>
);

const ClientDocuments = ({ client }) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
 
    
    const fetchDocs = async () => {
        if (!auth.currentUser) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/documents?userId=${auth.currentUser.uid}&clientId=${client.id}`);
            const data = await res.json();
            setDocs(data.documents || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, [client.id]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        try {
            // 1. Upload Blob
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/upload-blob', { method: 'POST', body: formData });
            
            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url } = await uploadRes.json();

            // 2. Save Metadata
            const metadata = {
                userId: auth.currentUser?.uid,
                clientId: client.id,
                fileName: file.name,
                fileUrl: url,
                fileSize: file.size,
                fileType: file.type,
                category: 'legal', // Default to legal for client docs
                tags: ['client_doc', client.name]
            };

            await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metadata)
            });

            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Dokumen diunggah', timer: 1000 });
            fetchDocs();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (docId) => {
        const result = await Swal.fire({
             title: 'Hapus Dokumen?',
             text: "File ini akan dihapus dari daftar.",
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#d33',
             cancelButtonText: 'Batal',
             confirmButtonText: 'Hapus'
        });

        if (result.isConfirmed) {
            // Note: Currently API doesn't fully support DELETE from Blob, but we can delete from Firestore
            // We need a DELETE endpoint. For now, let's just assume we can delete from Firestore via client or add DELETE to API.
            // Since I haven't implemented DELETE in API yet, I'll skip actual delete or implement it now?
            
            // Actually, DocumentRepository has no DELETE feature in the snippets I saw? 
            // Wait, I recall seeing 'Trash2' icon in the import of DocumentRepository, let me check if it has delete logic.
            // I'll skip implementing DELETE for now to keep it simple, or just hide it.
            // But user asked for "Upload/download dokumen". Delete is implied good CRM practice.
            // I'll leave a placeholder for Delete or implement it if I have time.
            // Let's implement a simple wrapper for delete if API supports it, otherwise just UI.
            
            // Checking DocumentRepository again... it has `isDeleteConfirmOpen`.
            // But I didn't see the `handleDelete` implementation in the snippet.
            // I will assume for now I should only do Upload/List.
            Swal.fire('Info', 'Fitur hapus belum tersedia di API.', 'info');
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Dokumen Digital</h3>
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={handleFileUpload} 
                    />
                    <button 
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                    >
                        {uploading ? 'Mengupload...' : <><FileText className="w-4 h-4" /> Upload Dokumen</>}
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Nama File</th>
                            <th className="px-6 py-3">Tipe</th>
                            <th className="px-6 py-3">Tanggal Upload</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat dokumen...</td></tr>
                        ) : docs.length === 0 ? (
                             <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Belum ada dokumen yang diunggah.</td></tr>
                        ) : (
                            docs.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                                            {doc.fileName}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 uppercase text-xs text-gray-500">{doc.fileType?.split('/')[1] || 'FILE'}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a 
                                            href={doc.fileUrl} 
                                            download 
                                            target="_blank"
                                            className="inline-flex p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Download"
                                        >
                                            <ArrowLeft className="w-4 h-4 rotate-[-90deg]" /> {/* Down arrow hack or import Download */}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ClientServices = ({ client }) => {
    const [services, setServices] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Add Service Form
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('active');



    const fetchClientServices = async () => {
        setLoading(true);
        try {
            // Fetch subcollection 'services' under client document
            const q = query(collection(db, 'clients', client.id, 'services'), orderBy('startDate', 'desc'));
            const snapshot = await getDocs(q);
            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableServices = async () => {
        try {
            const q = query(collection(db, 'services'), orderBy('title', 'asc'));
            const snapshot = await getDocs(q);
            setAvailableServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchClientServices();
        fetchAvailableServices();
    }, [client.id]);

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const serviceDef = availableServices.find(s => s.id === selectedServiceId);
            if (!serviceDef) return;

            await addDoc(collection(db, 'clients', client.id, 'services'), {
                serviceId: serviceDef.id,
                serviceName: serviceDef.title,
                status: status,
                startDate: startDate,
                progress: 0,
                price: serviceDef.price || 0,
                updatedAt: new Date()
            });

            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Layanan ditambahkan ke klien', timer: 1500 });
            setIsAddModalOpen(false);
            fetchClientServices();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Layanan Aktif</h3>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                    <Briefcase className="w-4 h-4" /> Tambah Layanan
                </button>
            </div>

            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Nama Layanan</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Mulai</th>
                            <th className="px-6 py-3">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat layanan...</td></tr>
                        ) : services.length === 0 ? (
                             <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Klien ini belum mengambil layanan apapun.</td></tr>
                        ) : (
                            services.map(svc => (
                                <tr key={svc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{svc.serviceName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${svc.status === 'active' ? 'bg-green-100 text-green-700' : 
                                              svc.status === 'done' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {svc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{svc.startDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${svc.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 block">{svc.progress}%</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Service Modal */}
             {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                   <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                       <h3 className="text-lg font-bold mb-4">Tambah Layanan ke Klien</h3>
                       <form onSubmit={handleAddService} className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Pilih Layanan</label>
                               <select 
                                    required 
                                    className="w-full border rounded-lg p-2"
                                    value={selectedServiceId}
                                    onChange={e => setSelectedServiceId(e.target.value)}
                                >
                                   <option value="">-- Pilih Layanan --</option>
                                   {availableServices.map(s => (
                                       <option key={s.id} value={s.id}>{s.title}</option>
                                   ))}
                               </select>
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                               <input 
                                    type="date" 
                                    required
                                    className="w-full border rounded-lg p-2"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                               />
                           </div>
                           <div className="flex justify-end gap-2 pt-4">
                               <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-600">Batal</button>
                               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">Simpan</button>
                           </div>
                       </form>
                   </div>
                </div>
            )}
        </div>
    );
};

const ClientNotes = ({ client }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    


    const fetchNotes = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'clients', client.id, 'notes'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [client.id]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            await addDoc(collection(db, 'clients', client.id, 'notes'), {
                content: newNote,
                author: auth.currentUser?.email || 'Unknown',
                createdAt: new Date()
            });
            setNewNote('');
            fetchNotes();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Catatan & Aktivitas Internal</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto max-h-[500px] space-y-6">
                 {loading ? (
                     <div className="text-center text-gray-500 py-8">Memuat catatan...</div>
                 ) : notes.length === 0 ? (
                     <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-xl">
                         <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                         <p>Belum ada catatan untuk klien ini.</p>
                     </div>
                 ) : (
                     notes.map(note => (
                         <div key={note.id} className="flex gap-4">
                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                 {note.author?.charAt(0).toUpperCase()}
                             </div>
                             <div className="flex-1 space-y-1">
                                 <div className="flex items-center justify-between">
                                     <span className="text-sm font-bold text-gray-900">{note.author}</span>
                                     <span className="text-xs text-gray-500">
                                         {note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000).toLocaleString('id-ID') : new Date(note.createdAt).toLocaleString('id-ID')}
                                     </span>
                                 </div>
                                 <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-tr-xl rounded-b-xl">
                                     {note.content}
                                 </p>
                             </div>
                         </div>
                     ))
                 )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <form onSubmit={handleAddNote} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Tulis catatan internal..." 
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!newNote.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        Kirim Note
                    </button>
                </form>
            </div>
        </div>
    );
};

const ClientFinancials = ({ client }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const invoicesMap = new Map();

            // 1. Fetch by Client ID (The robust way)
            if (client.id) {
                const qId = query(collection(db, 'invoices'), where('clientId', '==', client.id));
                const snapshotId = await getDocs(qId);
                snapshotId.docs.forEach(doc => {
                    invoicesMap.set(doc.id, { id: doc.id, ...doc.data() });
                });
            }

            // 2. Fetch by Client Name (The soft-link/legacy way)
            if (client.name) {
                // Note: Firestore is case-sensitive. This works for exact matches only.
                // ideally we store a normalized lowercase name for searching, but for now exact match is a good fallback.
                const qName = query(collection(db, 'invoices'), where('clientName', '==', client.name));
                const snapshotName = await getDocs(qName);
                snapshotName.docs.forEach(doc => {
                    // Only add if not already present (ID based)
                    if (!invoicesMap.has(doc.id)) {
                        invoicesMap.set(doc.id, { id: doc.id, ...doc.data() });
                    }
                });
            }

            // Convert to array and sort
            const data = Array.from(invoicesMap.values());
            data.sort((a, b) => new Date(b.issueDate || 0) - new Date(a.issueDate || 0));
            
            setInvoices(data);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            Swal.fire({
                 icon: 'error', 
                 title: 'Gagal Memuat Invoice', 
                 text: 'Terjadi kesalahan saat mengambil data invoice.',
                 toast: true,
                 position: 'top-end',
                 showConfirmButton: false,
                 timer: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [client.id]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Riwayat Keuangan & Invoice</h3>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-bold text-gray-900">{invoices.length}</span> Transaksi
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">No. Invoice</th>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Total Tagihan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat data keuangan...</td></tr>
                        ) : invoices.length === 0 ? (
                             <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Belum ada invoice tercatat untuk klien ini.</td></tr>
                        ) : (
                            invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{inv.invoiceNumber}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                              inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                                              inv.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">
                                        Rp {inv.total?.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ClientReminders = ({ client }) => {
    const [reminders, setReminders] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);


    const fetchReminders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'clients', client.id, 'reminders'), orderBy('dueDate', 'asc'));
            const snapshot = await getDocs(q);
            setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, [client.id]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'clients', client.id, 'reminders'), {
                title,
                dueDate: date,
                status: 'pending',
                createdAt: new Date()
            });
            setTitle('');
            setDate('');
            fetchReminders();
            Swal.fire({ icon: 'success', title: 'Pengingat Ditambahkan', timer: 1000 });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'clients', client.id, 'reminders', id), {
                status: currentStatus === 'pending' ? 'done' : 'pending'
            });
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReminder = async (id) => {
        if (!window.confirm('Hapus pengingat ini?')) return;
        try {
            await deleteDoc(doc(db, 'clients', client.id, 'reminders', id));
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Pengingat & Jadwal
                </h3>
            </div>

            <div className="p-4 border-b border-gray-100 bg-white">
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input 
                        type="text" 
                        required
                        placeholder="Judul (misal: Perpanjang Pajak)" 
                        className="flex-1 px-4 py-2 border rounded-lg text-sm"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input 
                        type="date" 
                        required
                        className="px-4 py-2 border rounded-lg text-sm"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                        + Tambah
                    </button>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">Memuat...</div>
                ) : reminders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                        Belum ada pengingat aktif.
                    </div>
                ) : (
                    reminders.map(rem => {
                        const isOverdue = new Date(rem.dueDate) < new Date() && rem.status === 'pending';
                        const isDone = rem.status === 'done';
                        return (
                            <div key={rem.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                                ${isDone ? 'bg-gray-50 border-gray-100 opacity-60' : isOverdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <button 
                                    onClick={() => toggleStatus(rem.id, rem.status)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                        ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'}`}
                                >
                                    {isDone && <CheckCircle className="w-4 h-4" />}
                                </button>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{rem.title}</h4>
                                    <div className={`text-xs flex items-center gap-1 mt-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                        <Clock className="w-3 h-3" />
                                        {new Date(rem.dueDate).toLocaleDateString('id-ID')}
                                        {isOverdue && " (Terlewat)"}
                                    </div>
                                </div>
                                <button onClick={() => deleteReminder(rem.id)} className="text-gray-400 hover:text-red-500 p-2">
                                    <AlertCircle className="w-4 h-4" /> {/* Trash icon placeholder or reuse */}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const ClientDetail = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!client) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 px-6 py-6">
        <button 
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors text-sm font-medium"
        >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold
                    ${client.type === 'corporate' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-purple-600 text-white shadow-purple-200'} shadow-lg`}>
                    {client.type === 'corporate' ? <Building size={32} /> : <User size={32} />}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <span className="font-medium">{client.brandName || client.name}</span>
                        <span>•</span>
                        <span className="capitalize">{client.type === 'corporate' ? 'Perusahaan' : 'Perorangan'}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 rounded-full text-sm font-bold border capitalize 
                    ${client.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                      client.status === 'inactive' ? 'bg-gray-50 text-gray-600 border-gray-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    {client.status}
                </span>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    Edit Profil
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mt-8 border-b border-gray-100">
            {[
                { id: 'overview', label: 'Ringkasan', icon: User },
                { id: 'services', label: 'Layanan & Progres', icon: Briefcase },
                { id: 'documents', label: 'Dokumen', icon: FileText },
                { id: 'financials', label: 'Keuangan', icon: Download },
                { id: 'reminders', label: 'Jadwal', icon: Clock },
                { id: 'notes', label: 'Catatan & Aktivitas', icon: MessageSquare },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 
                        ${activeTab === tab.id 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
          {activeTab === 'overview' && <ClientOverview client={client} />}
          {activeTab === 'services' && <ClientServices client={client} />}
          {activeTab === 'documents' && <ClientDocuments client={client} />}
          {activeTab === 'financials' && <ClientFinancials client={client} />}
          {activeTab === 'reminders' && <ClientReminders client={client} />}
          {activeTab === 'notes' && <ClientNotes client={client} />}
      </div>
    </div>
  );
};

export default ClientDetail;
