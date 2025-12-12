import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, 
  Phone, Mail, MapPin, Building, User, 
  Calendar, Edit, Trash2, CheckCircle, XCircle, Download, RefreshCw 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../lib/firebase';
import { 
  collection, addDoc, updateDoc, 
  deleteDoc, doc, getDocs, query, orderBy, where 
} from 'firebase/firestore';
import ClientDetail from './ClientDetail';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail'

  // ... (existing useEffect and functions)

  const handleFetchClients = async () => {
      // (Refresh logic)
      fetchClients();
  };

  const handleViewDetail = (client) => {
      setSelectedClient(client);
      setViewMode('detail');
  };

  const handleBackToList = () => {
      setSelectedClient(null);
      setViewMode('list');
      fetchClients(); // Refresh on back
  };



  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'corporate', // corporate | individual
    name: '',
    brandName: '',
    email: '',
    phone: '',
    address: '',
    picName: '',
    picPosition: '',
    picPhone: '',
    npwp: '',
    nib: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const clientList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientList);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Fallback/Demo Data if needed, or just show error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'corporate',
      name: '',
      brandName: '',
      email: '',
      phone: '',
      address: '',
      picName: '',
      picPosition: '',
      picPhone: '',
      npwp: '',
      nib: '',
      status: 'active',
      notes: ''
    });
    setEditingClient(null);
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        type: client.type || 'corporate',
        name: client.name || '',
        brandName: client.brandName || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        picName: client.pic?.name || '',
        picPosition: client.pic?.position || '',
        picPhone: client.pic?.phone || '',
        npwp: client.npwp || '',
        nib: client.nib || '',
        status: client.status || 'active',
        notes: client.notes || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientData = {
        ...formData,
        pic: {
          name: formData.picName,
          position: formData.picPosition,
          phone: formData.picPhone
        },
        updatedAt: new Date(),
      };
      
      // Remove flat pic fields from main object to keep clean
      delete clientData.picName;
      delete clientData.picPosition;
      delete clientData.picPhone;

      if (editingClient) {
        await updateDoc(doc(db, 'clients', editingClient.id), clientData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data klien diperbarui', timer: 1500 });
      } else {
        clientData.createdAt = new Date();
        await addDoc(collection(db, 'clients'), clientData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Klien baru ditambahkan', timer: 1500 });
      }

      setIsModalOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Klien?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        fetchClients();
        Swal.fire('Terhapus!', 'Data klien telah dihapus.', 'success');
      } catch (error) {
        Swal.fire('Gagal!', error.message, 'error');
      }
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClients = async () => {
      setIsSyncing(true);
      try {
          // 1. Fetch all invoices
          const invoiceQuery = query(collection(db, 'invoices'));
          const invoiceSnapshot = await getDocs(invoiceQuery);
          const invoices = invoiceSnapshot.docs.map(doc => doc.data());

          // 2. Extract unique client names
          const invoiceClientNames = [...new Set(invoices
              .filter(inv => inv.clientName && inv.clientName.trim() !== "")
              .map(inv => inv.clientName.trim())
          )];

          // 3. Filter out clients that already exist
          const existingClientNames = clients.map(c => c.name.toLowerCase().trim());
          const newClientsToCreate = invoiceClientNames.filter(name => 
              !existingClientNames.includes(name.toLowerCase())
          );

          if (newClientsToCreate.length === 0) {
              Swal.fire('Info', 'Semua klien dari invoice sudah ada di database.', 'info');
              setIsSyncing(false);
              return;
          }

          // 4. Create new clients from invoice data (best effort)
          let addedCount = 0;
          for (const clientName of newClientsToCreate) {
              // Find a representative invoice to get details
              const representativeInv = invoices.find(inv => inv.clientName.trim() === clientName);
              
              if (representativeInv) {
                  const newClientData = {
                      name: clientName,
                      email: representativeInv.clientEmail || "",
                      phone: representativeInv.clientPhone || "",
                      address: representativeInv.clientAddress || "",
                      type: 'corporate', // Default assumption
                      brandName: clientName, // Default to name
                      status: 'active',
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      notes: 'Auto-generated from Invoice Sync'
                  };

                  await addDoc(collection(db, 'clients'), newClientData);
                  addedCount++;
              }
          }

          Swal.fire({
              icon: 'success',
              title: 'Sync Selesai',
              text: `Berhasil menambahkan ${addedCount} klien baru dari data invoice.`,
          });
          
          fetchClients(); // Refresh list

      } catch (err) {
          console.error("Sync error:", err);
          Swal.fire('Error', 'Gagal melakukan sinkronisasi: ' + err.message, 'error');
      } finally {
          setIsSyncing(false);
      }
  };

  const handleExport = () => {
      const dataStr = JSON.stringify(clients, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `backup-clients-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
  };

  // Filter Logic
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchLower) ||
      client.brandName?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.pic?.name?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    newThisMonth: clients.filter(c => {
      if (!c.createdAt) return false;
      const date = c.createdAt.seconds ? new Date(c.createdAt.seconds * 1000) : new Date(c.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Klien', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50', icon: Users },
              { label: 'Klien Aktif', value: stats.active, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
              { label: 'Klien Baru (Bulan Ini)', value: stats.newThisMonth, color: 'text-purple-600', bg: 'bg-purple-50', icon: Calendar },
              { label: 'Tidak Aktif', value: stats.inactive, color: 'text-gray-600', bg: 'bg-gray-50', icon: XCircle },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header & Controls */}
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Direktori Klien</h2>
                <p className="text-gray-500 text-sm mt-1">Kelola data dan informasi seluruh klien Anda</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                 >
                    <Download className="w-4 h-4" /> Export Data
                 </button>
                 <button 
                    onClick={handleSyncClients}
                    disabled={isSyncing}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                 >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                    {isSyncing ? 'Syncing...' : 'Sync dari Invoice'}
                 </button>
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Cari klien, PIC, atau email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                 </div>
                 
                 <button 
                    onClick={() => handleOpenModal()} 
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Klien
                  </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-2 overflow-x-auto">
                {['all', 'active', 'inactive', 'lead'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                            statusFilter === status 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {status === 'all' ? 'Semua Status' : status}
                    </button>
                ))}
            </div>

            {/* Client Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Nama Klien / Perusahaan</th>
                    <th className="px-6 py-4">Kontak Utama (PIC)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Layanan</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                     <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data klien...</td></tr>
                  ) : filteredClients.length === 0 ? (
                     <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada data klien ditemukan.</td></tr>
                  ) : (
                    filteredClients.map(client => (
                      <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                             <div className={`mt-1 p-2 rounded-lg ${client.type === 'corporate' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                 {client.type === 'corporate' ? <Building size={16} /> : <User size={16} />}
                             </div>
                             <div>
                                 <div className="font-bold text-gray-900">{client.name}</div>
                                 <div className="text-gray-500 text-xs">{client.brandName}</div>
                                 <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                     <Mail size={10} /> {client.email}
                                 </div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            {client.pic?.name ? (
                                <div>
                                    <div className="font-medium text-gray-900">{client.pic.name}</div>
                                    <div className="text-xs text-gray-500">{client.pic.position}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{client.pic.phone}</div>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-xs">-</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                ${client.status === 'active' ? 'bg-green-100 text-green-700' : 
                                  client.status === 'inactive' ? 'bg-gray-100 text-gray-600' : 
                                  'bg-yellow-100 text-yellow-700'}`}>
                                {client.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                            {/* Placeholder for service integration */}
                            <span className="italic">Belum ada layanan</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleViewDetail(client)} 
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Lihat Detail"
                                >
                                    <Search size={16} />
                                </button>
                                <button onClick={() => handleOpenModal(client)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
           {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="text-xl font-bold text-gray-900">
                          {editingClient ? 'Edit Data Klien' : 'Tambah Klien Baru'}
                      </h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <XCircle size={24} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Entity Information */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b pb-2">Informasi Entitas</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Klien</label>
                                  <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  >
                                      <option value="corporate">Perusahaan (Corporate)</option>
                                      <option value="individual">Perorangan (Individual)</option>
                                  </select>
                              </div>
                               <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                  <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  >
                                      <option value="active">Aktif</option>
                                      <option value="inactive">Tidak Aktif</option>
                                      <option value="lead">Prospek (Lead)</option>
                                  </select>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Resmi (Sesuai Akta/KTP)</label>
                                  <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: PT. Valpro Inter Tech"
                                  />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Brand / Usaha</label>
                                  <input 
                                    type="text" 
                                    value={formData.brandName}
                                    onChange={e => setFormData({...formData, brandName: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: Valpro"
                                  />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Perusahaan</label>
                                  <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                  <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
                               <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                                  <textarea 
                                    rows="2"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  ></textarea>
                              </div>
                          </div>
                      </div>

                      {/* Legal Info */}
                      <div className="space-y-4">
                         <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b pb-2">Data Legalitas</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">NPWP</label>
                                  <input 
                                    type="text" 
                                    value={formData.npwp}
                                    onChange={e => setFormData({...formData, npwp: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                            </div>
                            <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">NIB</label>
                                  <input 
                                    type="text" 
                                    value={formData.nib}
                                    onChange={e => setFormData({...formData, nib: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                            </div>
                         </div>
                      </div>

                      {/* PIC Info */}
                      <div className="space-y-4">
                         <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b pb-2">Penanggung Jawab (PIC)</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap PIC</label>
                                  <input 
                                    type="text" 
                                    value={formData.picName}
                                    onChange={e => setFormData({...formData, picName: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                                  <input 
                                    type="text" 
                                    value={formData.picPosition}
                                    onChange={e => setFormData({...formData, picPosition: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                            </div>
                             <div className="col-span-2 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontak PIC (WA/HP)</label>
                                  <input 
                                    type="text" 
                                    value={formData.picPhone}
                                    onChange={e => setFormData({...formData, picPhone: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                  />
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                          >
                            Batal
                          </button>
                          <button 
                            type="submit" 
                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                          >
                            Simpan Data Klien
                          </button>
                      </div>
                  </form>
               </div>
            </div>
          )}
        </>
      ) : (
        <ClientDetail client={selectedClient} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ClientManagement;
