import { useState, useEffect, useRef } from 'react';
import { Search, File, Folder, Star, StarOff, Download, Trash2, Filter, Grid, List, Plus, Edit2, X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const DocumentRepository = ({ userId, searchTerm = '' }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Upload & Edit State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('other');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({ id: '', fileName: '', category: '', tags: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'all', name: 'Semua Dokumen' },
    { id: 'invoice', name: 'Invoice' },
    { id: 'contract', name: 'Kontrak' },
    { id: 'legal', name: 'Legalitas' },
    { id: 'finance', name: 'Keuangan' },
    { id: 'other', name: 'Lainnya' }
  ];

  // Derived counts
  const getCategoryCount = (catId) => {
      if (catId === 'all') return documents.length;
      return documents.filter(d => d.category === catId).length;
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId, categoryFilter]);

  useEffect(() => {
    if (searchTerm !== undefined) setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const fetchDocuments = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const url = categoryFilter !== 'all' 
        ? `/api/documents?userId=${userId}&category=${categoryFilter}`
        : `/api/documents?userId=${userId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal memuat dokumen');
      
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
      e.preventDefault();
      if (!uploadFile) return;

      setIsUploading(true);
      try {
          // 1. Upload to Vercel Blob (Pseudo-implementation as per AdminDashboard pattern)
          // In a real app this would upload to blob storage and return a URL
          const formData = new FormData();
          formData.append('file', uploadFile);
          formData.append('access', 'public');

          // Using the existing endpoint pattern from AdminDashboard
          const uploadRes = await fetch('/api/upload-blob', {
              method: 'POST',
              body: formData
          });
          
          if (!uploadRes.ok) throw new Error("Gagal upload file");
          const { url } = await uploadRes.json();

          // 2. Save Metadata
          const metadata = {
              userId,
              fileName: uploadFile.name,
              fileUrl: url,
              fileSize: uploadFile.size,
              fileType: uploadFile.type,
              category: uploadCategory,
              tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean)
          };

          const saveRes = await fetch('/api/documents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(metadata)
          });

          if (!saveRes.ok) throw new Error("Gagal menyimpan metadata");

          Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Dokumen berhasil diupload',
              timer: 1500
          });

          setIsUploadModalOpen(false);
          setUploadFile(null);
          setUploadTags('');
          fetchDocuments();

      } catch (err) {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
      } finally {
          setIsUploading(false);
      }
  };

  const handleEdit = (doc) => {
      setEditData({
          id: doc.id,
          fileName: doc.fileName,
          category: doc.category,
          tags: doc.tags ? doc.tags.join(', ') : ''
      });
      setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          const updates = {
              fileName: editData.fileName,
              category: editData.category,
              tags: editData.tags.split(',').map(t => t.trim()).filter(Boolean)
          };

          const res = await fetch(`/api/documents/${editData.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, updates })
          });

          if (!res.ok) throw new Error("Gagal update dokumen");

          Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Dokumen diperbarui',
              timer: 1000
          });

          setIsEditModalOpen(false);
          fetchDocuments();
      } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
      } finally {
          setIsSaving(false);
      }
  };

  const handleDelete = async (id) => {
      try {
          const res = await fetch(`/api/documents/${id}?userId=${userId}`, { method: 'DELETE' });
          if (res.ok) {
              setDocuments(prev => prev.filter(d => d.id !== id));
              setIsDeleteConfirmOpen(false);
              setSelectedDocument(null);
              Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Dokumen dihapus', timer: 1000 });
          }
      } catch (err) {
          console.error(err);
      }
  };

  const toggleFavorite = async (id) => {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;
      try {
          // Optimistic update
          setDocuments(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
          
          await fetch(`/api/documents/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, updates: { isFavorite: !doc.isFavorite } })
          });
      } catch (err) {
          // Revert on error
          fetchDocuments();
      }
  };

  // Helper
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
      if(!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric'
      });
  };

  // Backup function
  const handleBackup = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup-documents-metadata-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
  };

  const effectiveSearchTerm = searchTerm || localSearchTerm;
  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(effectiveSearchTerm.toLowerCase())))
  );

  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Repositori Dokumen</h2>
            <p className="text-gray-500 text-sm">Kelola semua file dan dokumen Anda di satu tempat</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={handleBackup}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
                <Download size={18} />
                <span>Backup Metadata</span>
            </button>
            <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Upload size={18} />
                <span>Upload File</span>
            </button>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                <Grid size={18} />
                </button>
                <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                <List size={18} />
                </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama file atau tag..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Filter size={16} className="text-gray-400 mr-2" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.id === 'all' ? cat.name : cat.name}
              <span className={`ml-2 text-xs opacity-80 py-0.5 px-1.5 rounded-full ${categoryFilter === cat.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {getCategoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <File className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Belum ada dokumen</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Upload dokumen baru atau dokumen dari invoice akan muncul di sini secara otomatis.
          </p>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-6 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
          >
            Upload Dokumen Sekarang
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${
                    doc.category === 'invoice' ? 'bg-green-100 text-green-600' :
                    doc.category === 'contract' ? 'bg-purple-100 text-purple-600' :
                    doc.category === 'legal' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                }`}>
                    <File size={24} />
                </div>
                <button onClick={() => toggleFavorite(doc.id)} className="text-gray-300 hover:text-yellow-400 transition-colors">
                   <Star size={18} className={doc.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1 truncate" title={doc.fileName}>{doc.fileName}</h3>
              <p className="text-xs text-gray-500 mb-4">{formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}</p>
              
              <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                  {doc.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{doc.category}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(doc)} className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-lg" title="Edit">
                          <Edit2 size={16} />
                      </button>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 rounded-lg" title="Download">
                          <Download size={16} />
                      </a>
                      <button onClick={() => { setSelectedDocument(doc); setIsDeleteConfirmOpen(true); }} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg" title="Hapus">
                          <Trash2 size={16} />
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 w-10"></th>
                        <th className="px-6 py-4">Nama File</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Ukuran</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredDocuments.map(doc => (
                        <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                             <td className="px-6 py-4">
                                <button onClick={() => toggleFavorite(doc.id)} className="text-gray-300 hover:text-yellow-400">
                                    <Star size={16} className={doc.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                                </button>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <File size={18} className="text-gray-400" />
                                     <span className="font-medium text-gray-900">{doc.fileName}</span>
                                     {doc.tags?.length > 0 && (
                                         <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                             {doc.tags[0]} {doc.tags.length > 1 && `+${doc.tags.length-1}`}
                                         </span>
                                     )}
                                 </div>
                             </td>
                             <td className="px-6 py-4 capitalize text-gray-600">{doc.category}</td>
                             <td className="px-6 py-4 text-gray-500 font-mono text-xs">{formatFileSize(doc.fileSize)}</td>
                             <td className="px-6 py-4 text-gray-500">{formatDate(doc.uploadedAt)}</td>
                             <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(doc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Download">
                                        <Download size={16} />
                                    </a>
                                    <button onClick={() => { setSelectedDocument(doc); setIsDeleteConfirmOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                                        <Trash2 size={16} />
                                    </button>
                                 </div>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upload Dokumen Baru</h3>
                    <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={(e) => setUploadFile(e.target.files[0])} 
                            className="hidden" 
                        />
                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <Upload size={24} />
                        </div>
                        {uploadFile ? (
                            <div>
                                <p className="font-bold text-gray-900">{uploadFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(uploadFile.size)}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium text-gray-900">Klik untuk pilih file</p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                                {categories.filter(c => c.id !== 'all').map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Opsional)</label>
                            <input 
                                type="text" 
                                placeholder="Penting, Review, dll" 
                                value={uploadTags}
                                onChange={e => setUploadTags(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-600 mr-2">Batal</button>
                        <button 
                            type="submit" 
                            disabled={!uploadFile || isUploading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            {isUploading ? 'Mengupload...' : 'Upload File'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Edit Dokumen</h3>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama File</label>
                        <input 
                            type="text" 
                            value={editData.fileName}
                            onChange={e => setEditData({...editData, fileName: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select 
                                value={editData.category}
                                onChange={e => setEditData({...editData, category: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            >
                                {categories.filter(c => c.id !== 'all').map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Pisahkan koma)</label>
                            <input 
                                type="text" 
                                value={editData.tags}
                                onChange={e => setEditData({...editData, tags: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                            />
                        </div>
                    </div>

                     <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 mr-2">Batal</button>
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Delete Confirmation (Reused) */}
      {isDeleteConfirmOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 mx-auto">
                 <Trash2 size={24} />
             </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Hapus Dokumen?</h3>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Apakah Anda yakin ingin menghapus <b>{selectedDocument.fileName}</b>? 
              <br/>Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setIsDeleteConfirmOpen(false); setSelectedDocument(null); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(selectedDocument.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md shadow-red-200"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;