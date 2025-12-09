import { useState, useEffect } from 'react';
import { Search, File, Folder, Star, StarOff, Download, Trash2, Filter, Grid, List } from 'lucide-react';

const DocumentRepository = ({ userId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Document categories
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Semua Dokumen', count: 0 },
    { id: 'invoice', name: 'Invoice', count: 0 },
    { id: 'contract', name: 'Kontrak', count: 0 },
    { id: 'legal', name: 'Legalitas', count: 0 },
    { id: 'finance', name: 'Keuangan', count: 0 },
    { id: 'other', name: 'Lainnya', count: 0 }
  ]);

  // Load documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/documents?userId=${userId}${categoryFilter !== 'all' ? `&category=${categoryFilter}` : ''}`);

        if (!response.ok) {
          throw new Error('Gagal memuat dokumen');
        }

        const data = await response.json();
        setDocuments(data.documents);

        // Update category counts
        updateCategoryCounts(data.documents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDocuments();
    }
  }, [userId, categoryFilter]);

  // Update category counts
  const updateCategoryCounts = (docs) => {
    const updatedCategories = [
      { id: 'all', name: 'Semua Dokumen', count: docs.length },
      { id: 'invoice', name: 'Invoice', count: docs.filter(doc => doc.category === 'invoice').length },
      { id: 'contract', name: 'Kontrak', count: docs.filter(doc => doc.category === 'contract').length },
      { id: 'legal', name: 'Legalitas', count: docs.filter(doc => doc.category === 'legal').length },
      { id: 'finance', name: 'Keuangan', count: docs.filter(doc => doc.category === 'finance').length },
      { id: 'other', name: 'Lainnya', count: docs.filter(doc => doc.category === 'other').length }
    ];
    setCategories(updatedCategories);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Toggle favorite status
  const toggleFavorite = async (documentId) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          userId,
          updates: { isFavorite: !document.isFavorite }
        })
      });

      if (response.ok) {
        setDocuments(prev => {
          const updatedDocs = prev.map(doc =>
            doc.id === documentId ? { ...doc, isFavorite: !doc.isFavorite } : doc
          );
          updateCategoryCounts(updatedDocs);
          return updatedDocs;
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Delete a document
  const handleDelete = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}?userId=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDocuments(prev => {
          const updatedDocs = prev.filter(doc => doc.id !== documentId);
          updateCategoryCounts(updatedDocs);
          return updatedDocs;
        });
        setIsDeleteConfirmOpen(false);
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Repositori Dokumen</h2>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                categoryFilter === category.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              {category.id !== 'all' && ` (${category.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Document Count */}
      <div className="text-sm text-gray-600">
        {filteredDocuments.length} dokumen ditemukan
      </div>

      {/* Document List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada dokumen</h3>
          <p className="mt-1 text-sm text-gray-500">
            Dokumen dari invoice dan tracking akan muncul di sini secara otomatis.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map(document => (
            <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{document.fileName}</h3>
                  <p className="text-xs text-gray-500 capitalize">{document.category}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(document.id)}
                  className="text-gray-400 hover:text-yellow-500 ml-2"
                >
                  {document.isFavorite ? <Star size={16} className="fill-yellow-400 text-yellow-400" /> : <Star size={16} />}
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>{formatFileSize(document.fileSize)}</p>
                <p>{formatDate(document.uploadedAt)}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {document.tags && document.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {document.tags && document.tags.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      +{document.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => {
                      setSelectedDocument(document);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {filteredDocuments.map(document => (
            <div key={document.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <File className="text-blue-500 flex-shrink-0" size={24} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{document.fileName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full capitalize">
                      {document.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</span>
                    <span className="text-xs text-gray-500">{formatDate(document.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFavorite(document.id)}
                  className="text-gray-400 hover:text-yellow-500"
                >
                  {document.isFavorite ? <Star size={18} className="fill-yellow-400 text-yellow-400" /> : <Star size={18} />}
                </button>

                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Download size={18} />
                </a>

                <button
                  onClick={() => {
                    setSelectedDocument(document);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Dokumen</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus dokumen "{selectedDocument.fileName}"?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(selectedDocument.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;