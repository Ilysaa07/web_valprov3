"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import Image from "next/image";
import Swal from 'sweetalert2';
import {
  Receipt,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Users,
  Bell,
  Search,
  Settings,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  File,
  Plus,
  Trash2,
  Euro,
  Image as ImageIcon,
  Palette,
  BookOpen
} from "lucide-react";
import InvoiceGenerator from "./InvoiceGenerator";
import StatusStagesManager from "./StatusStagesManager";
import DocumentRepository from "./DocumentRepository";
import { servicesData } from '../lib/servicesData';

// Vercel Blob imports (we'll handle this in the next step)

// Service Management Component
const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Legalitas',
    shortDesc: '',
    desc: '',
    definition: '',
    benefits: [],
    features: [],
    price: '',
    priceNote: '',
    priceDescription: '',
    priceEnabled: false,
    icon: 'FileText',
    image: '',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trustFactors: []
  });

  // Fetch initial services
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { collection, getDocs, query, setDoc, doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      const servicesCollection = collection(db, 'services');
      const servicesSnapshot = await getDocs(query(servicesCollection));
      
      let servicesList = [];
      
      if (servicesSnapshot.empty) {
        // Initialize if empty
        for (const service of servicesData) {
           await setDoc(doc(db, 'services', service.slug), service, { merge: true });
        }
        const updatedSnapshot = await getDocs(query(servicesCollection));
        servicesList = updatedSnapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() }));
      } else {
        servicesList = servicesSnapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() }));
      }

      setServices(servicesList);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(servicesData); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setIsAdding(true);
    setIsEditing(true);
    setFormData({
      title: '',
      slug: '',
      category: 'Legalitas',
      shortDesc: '',
      desc: '',
      definition: '',
      benefits: [''],
      features: [],
      price: '',
      priceNote: '',
      priceDescription: '',
      priceEnabled: false,
      icon: 'FileText',
      image: '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trustFactors: []
    });
    setActiveTab('general');
  };

  const handleServiceSelect = async (service) => {
    setLoading(true);
    setIsAdding(false);
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      // Load service data
      const serviceRef = doc(db, 'services', service.slug);
      const serviceSnap = await getDoc(serviceRef);
      let data = serviceSnap.exists() ? serviceSnap.data() : service;

      // Pricing Migration Check
      if (!data.price && !data.priceEnabled) {
          try {
             const settingsRef = doc(db, "settings", "service_pricing");
             const settingsSnap = await getDoc(settingsRef);
             if (settingsSnap.exists()) {
                 const pricingData = settingsSnap.data()[service.slug];
                 if (pricingData) {
                     data.price = pricingData.price || '';
                     data.priceNote = pricingData.priceNote || '';
                     data.priceDescription = pricingData.priceDescription || '';
                     data.priceEnabled = pricingData.enabled || false;
                 }
             }
          } catch (e) {
              console.log("Migration check failed", e);
          }
      }

      setSelectedService({ ...service, ...data });
      setFormData({
        title: data.title || '',
        slug: service.slug,
        category: data.category || 'Legalitas',
        shortDesc: data.shortDesc || '',
        desc: data.desc || '',
        definition: data.definition || '',
        benefits: data.benefits || [],
        features: data.features || [],
        price: data.price || '',
        priceNote: data.priceNote || '',
        priceDescription: data.priceDescription || '',
        priceEnabled: data.priceEnabled || false,
        icon: data.icon || 'FileText',
        image: data.image || '',
        color: data.color || 'text-blue-600',
        bgColor: data.bgColor || 'bg-blue-50',
        trustFactors: data.trustFactors || []
      });
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setActiveTab('general');
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => {
        const newData = { ...prev, [field]: value };
        if (field === 'title' && isAdding) {
            newData.slug = generateSlug(value);
        }
        return newData;
    });
  };

  const handleArrayChange = (arrayName, index, field, value) => {
      setFormData(prev => {
          const newArray = [...prev[arrayName]];
          if (typeof newArray[index] === 'object') {
              newArray[index] = { ...newArray[index], [field]: value };
          } else {
              newArray[index] = value;
          }
          return { ...prev, [arrayName]: newArray };
      });
  };

  const handleAddArrayItem = (arrayName, emptyItem) => {
      setFormData(prev => ({
          ...prev,
          [arrayName]: [...prev[arrayName], emptyItem]
      }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
      setFormData(prev => ({
          ...prev,
          [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title) {
        alert("Judul dan Slug wajib diisi");
        return;
    }

    try {
      setLoading(true);
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      const serviceRef = doc(db, 'services', formData.slug);
      
      // Filter out empty benefits/features
      const cleanData = {
          ...formData,
          benefits: formData.benefits.filter(b => b && b.trim() !== ''),
          features: formData.features.filter(f => f.title && f.title.trim() !== '')
      };

      await setDoc(serviceRef, cleanData, { merge: true });

      alert('Layanan berhasil disimpan!');
      
      // Refresh list
      loadServices();
      setIsEditing(false);
      setIsAdding(false);
      setSelectedService({ slug: formData.slug, ...cleanData });

    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
      if (!confirm("Yakin ingin menghapus layanan ini?")) return;

      try {
          const { doc, deleteDoc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          
          await deleteDoc(doc(db, 'services', selectedService.slug));
          
          alert("Layanan dihapus");
          loadServices();
          setSelectedService(null);
          setIsEditing(false);
      } catch (error) {
          alert("Gagal menghapus: " + error.message);
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Pengelolaan Layanan</h2>
            <button 
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Layanan
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service List */}
          <div className="lg:col-span-1 border-r pr-4">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {services.map((service) => (
                <button
                  key={service.slug}
                  onClick={() => handleServiceSelect(service)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedService?.slug === service.slug
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate">{service.title}</div>
                  <div className="flex justify-between mt-1">
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{service.category}</span>
                     {service.priceEnabled && <span className="text-xs text-green-600 font-medium">Rp</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Service Editor */}
          <div className="lg:col-span-2 pl-2">
            {selectedService || isAdding ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                      <h3 className="text-xl font-bold text-gray-900">
                          {isAdding ? 'Tambah Layanan Baru' : formData.title}
                      </h3>
                      <p className="text-sm text-gray-500">{formData.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Batal</button>
                            <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1"/> Simpan
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center">
                                <Settings className="w-4 h-4 mr-1"/> Edit
                            </button>
                            <button onClick={handleDelete} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 ml-2">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                    {['general', 'pricing', 'details', 'visual'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                                activeTab === tab 
                                ? 'border-b-2 border-blue-600 text-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="py-4">
                    {activeTab === 'general' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Layanan</label>
                                    <input 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select 
                                        value={formData.category} 
                                        onChange={(e) => handleFormChange('category', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    >
                                        <option value="Legalitas">Legalitas</option>
                                        <option value="Konstruksi">Konstruksi</option>
                                        <option value="Kelistrikan">Kelistrikan</option>
                                        <option value="Standar">Standar</option>
                                        <option value="Keuangan">Keuangan</option>
                                        <option value="Lingkungan">Lingkungan</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                <input 
                                    type="text" 
                                    value={formData.slug} 
                                    onChange={(e) => handleFormChange('slug', e.target.value)}
                                    disabled={!isEditing || !isAdding} // Slug should only be editable when adding new
                                    className="w-full p-2 border rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                                <input 
                                    type="text" 
                                    value={formData.shortDesc} 
                                    onChange={(e) => handleFormChange('shortDesc', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap (Marketing)</label>
                                <textarea 
                                    value={formData.desc} 
                                    onChange={(e) => handleFormChange('desc', e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Definisi (Untuk Halaman Detail)</label>
                                <textarea 
                                    value={formData.definition} 
                                    onChange={(e) => handleFormChange('definition', e.target.value)}
                                    disabled={!isEditing}
                                    rows={6}
                                    className="w-full p-2 border rounded-lg text-sm font-mono bg-gray-50"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-4">
                             <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                <input
                                  type="checkbox"
                                  checked={formData.priceEnabled}
                                  onChange={(e) => handleFormChange('priceEnabled', e.target.checked)}
                                  disabled={!isEditing}
                                  className="h-5 w-5 text-blue-600 rounded"
                                />
                                <label className="ml-2 block text-sm font-medium text-gray-900">
                                  Tampilkan Harga untuk Layanan Ini?
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Angka)</label>
                                    <input 
                                        type="text" 
                                        value={formData.price} 
                                        onChange={(e) => handleFormChange('price', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Contoh: 7500000"
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Harga</label>
                                    <input 
                                        type="text" 
                                        value={formData.priceNote} 
                                        onChange={(e) => handleFormChange('priceNote', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Contoh: per dokumen"
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Paket Harga</label>
                                <input 
                                    type="text" 
                                    value={formData.priceDescription} 
                                    onChange={(e) => handleFormChange('priceDescription', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Contoh: Sudah termasuk biaya notaris"
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Benefits */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Manfaat (Benefits)</label>
                                    {isEditing && <button onClick={() => handleAddArrayItem('benefits', '')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">+ Tambah</button>}
                                </div>
                                <div className="space-y-2">
                                    {formData.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={benefit} 
                                                onChange={(e) => handleArrayChange('benefits', idx, null, e.target.value)}
                                                disabled={!isEditing}
                                                className="flex-1 p-2 border rounded-lg text-sm"
                                            />
                                            {isEditing && <button onClick={() => handleRemoveArrayItem('benefits', idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Alur Kerja</label>
                                    {isEditing && <button onClick={() => handleAddArrayItem('features', {title: '', desc: ''})} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">+ Tambah</button>}
                                </div>
                                <div className="space-y-3">
                                    {formData.features.map((feature, idx) => (
                                        <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500">Alur #{idx + 1}</span>
                                                {isEditing && <button onClick={() => handleRemoveArrayItem('features', idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3"/></button>}
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Judul Alur"
                                                value={feature.title} 
                                                onChange={(e) => handleArrayChange('features', idx, 'title', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full p-2 border rounded mb-2 text-sm"
                                            />
                                            <textarea 
                                                placeholder="Deskripsi Alur"
                                                value={feature.desc} 
                                                onChange={(e) => handleArrayChange('features', idx, 'desc', e.target.value)}
                                                disabled={!isEditing}
                                                rows={2}
                                                className="w-full p-2 border rounded text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'visual' && (
                         <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide Name)</label>
                                    <input 
                                        type="text" 
                                        value={formData.icon} 
                                        onChange={(e) => handleFormChange('icon', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Ex: FileText, Briefcase, Zap</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Text (Tailwind)</label>
                                    <input 
                                        type="text" 
                                        value={formData.color} 
                                        onChange={(e) => handleFormChange('color', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background (Tailwind)</label>
                                    <input 
                                        type="text" 
                                        value={formData.bgColor} 
                                        onChange={(e) => handleFormChange('bgColor', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    value={formData.image} 
                                    onChange={(e) => handleFormChange('image', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                                {formData.image && (
                                    <div className="mt-2 text-center p-2 border rounded bg-gray-50">
                                        <img src={formData.image} alt="Preview" className="h-32 mx-auto object-cover rounded"/>
                                        <p className="text-xs text-gray-500 mt-1">Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-lg border-2 border-dashed">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                <p>Pilih layanan untuk mengedit atau buat baru</p>
                <button 
                    onClick={handleAddNew}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm inline-flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Layanan Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ userEmail }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // State variables for real-time dashboard data
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // State variables for filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fix hydration mismatch by setting time only on client mount
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to format currency in Indonesian Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to format large numbers (e.g., 15000000 to 15Jt)
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'Jt';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  // Function to format currency with abbreviated format
  const formatCurrencyAbbr = (amount) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1).replace(/\.0$/, '')}Jt`;
    }
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `Rp ${amount}`;
  };

  // Function to generate month options
  const getMonthOptions = () => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months.map((month, index) => (
      <option key={index} value={index}>{month}</option>
    ));
  };

  // Function to generate year options (current year and 5 years back)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i);
    }
    return years.map((year) => (
      <option key={year} value={year}>{year}</option>
    ));
  };

  // State variables for WhatsApp settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    mainNumber: '',
    secondaryNumber: '',
    messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch and set up real-time data for dashboard
  useEffect(() => {
    if (!auth.currentUser) return;

    // Get the start and end of the selected month/year
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Set up real-time listeners for invoice data
    const invoicesQuery = query(
      collection(db, "invoices"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(invoicesQuery, (snapshot) => {
      const invoiceData = [];
      let totalThisMonth = 0;
      let totalPaidAmount = 0;
      let totalPendingAmount = 0;

      snapshot.forEach((doc) => {
        const invoice = { id: doc.id, ...doc.data() };
        // Add to all invoices
        invoiceData.push(invoice);

        // Check if invoice was created in the selected month/year
        const createdAt = invoice.createdAt?.toDate ? invoice.createdAt.toDate() : new Date();
        const invoiceInSelectedPeriod = createdAt >= startOfMonth && createdAt <= endOfMonth;

        if (invoiceInSelectedPeriod) {
          totalThisMonth++;
        }

        // Calculate payment amounts based on status for invoices in selected period
        if (invoiceInSelectedPeriod) {
          if (invoice.status === "paid") {
            totalPaidAmount += invoice.total || 0;
          } else if (invoice.status === "partial") {
            totalPaidAmount += invoice.totalTerminPaid || 0;
            totalPendingAmount += invoice.remainingAmount || 0;
          } else if (invoice.status === "draft" || invoice.status === "sent" || invoice.status === "overdue") {
            totalPendingAmount += invoice.total || 0;
          }
        }
      });

      // Calculate recent activities (last 3 invoices) - all time, not filtered by month/year
      const allInvoicesSorted = [...invoiceData].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      }).slice(0, 3);

      setInvoices(invoiceData);
      setTotalInvoices(totalThisMonth);
      setTotalPaid(totalPaidAmount);
      setTotalPending(totalPendingAmount);
      setRecentActivities(allInvoicesSorted);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [selectedMonth, selectedYear, auth.currentUser]);

  // Update selected invoice when invoices change to reflect file updates
  useEffect(() => {
    if (selectedInvoiceForFiles && invoices.length > 0) {
      // Find the updated invoice and update the state
      const updatedInvoice = invoices.find(inv => inv.id === selectedInvoiceForFiles.id);
      if (updatedInvoice) {
        setSelectedInvoiceForFiles(updatedInvoice);
      }
    }
  }, [invoices]); // This runs whenever the invoices array changes

  // Filter invoices based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter(invoice => {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        (invoice.clientName && invoice.clientName.toLowerCase().includes(searchLower)) ||
        (invoice.email && invoice.email.toLowerCase().includes(searchLower)) ||
        (invoice.total && invoice.total.toString().includes(searchLower)) ||
        (invoice.status && invoice.status.toLowerCase().includes(searchLower))
      );
    });

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  // Fetch WhatsApp settings
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchSettings = async () => {
      setLoadingSettings(true);
      try {
        const settingsRef = doc(db, "settings", "whatsapp_settings");
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          setWhatsappSettings(settingsDoc.data());
        } else {
          // Initialize with default values if no settings exist
          setWhatsappSettings({
            mainNumber: '6281399710085',
            secondaryNumber: '6289518530306',
            messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
          });
        }
      } catch (error) {
        console.error("Error fetching WhatsApp settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [auth.currentUser]);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      await signOut(auth);
    }
  };

  // Function to save WhatsApp settings
  const saveWhatsappSettings = async () => {
    if (!auth.currentUser) return;

    setSavingSettings(true);
    try {
      const settingsRef = doc(db, "settings", "whatsapp_settings");
      await setDoc(settingsRef, whatsappSettings);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pengaturan WhatsApp berhasil disimpan!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2a3f9b'
      });
    } catch (error) {
      console.error("Error saving WhatsApp settings:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan pengaturan WhatsApp: ' + error.message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // Function to handle WhatsApp settings change
  const handleSettingsChange = (field, value) => {
    setWhatsappSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // Fetch banner settings
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchBannerSettings = async () => {
      setLoadingBanner(true);
      try {
        const response = await fetch('/api/banner');
        if (response.ok) {
          const data = await response.json();
          setBannerSettings(data);
          if (data.imageUrl) {
            setBannerPreview(data.imageUrl);
          }
        } else {
          // Initialize with default values if no settings exist
          setBannerSettings({
            imageUrl: '',
            title: 'Banner Advertisement',
            active: true
          });
        }
      } catch (error) {
        console.error("Error fetching banner settings:", error);
      } finally {
        setLoadingBanner(false);
      }
    };

    fetchBannerSettings();
  }, [auth.currentUser]);

  // Function to save banner settings
  const saveBannerSettings = async () => {
    if (!auth.currentUser) return;

    setSavingBanner(true);
    try {
      // If there's a new image file, upload it first
      let imageUrl = bannerSettings.imageUrl;

      if (bannerImageFile) {
        // Upload image to Vercel Blob
        const formData = new FormData();
        formData.append('file', bannerImageFile);
        formData.append('access', 'public');

        const uploadResponse = await fetch('/api/upload-blob', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload banner image failed');
        }

        const result = await uploadResponse.json();
        imageUrl = result.url;
      }

      // Save banner settings to Firestore
      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          title: bannerSettings.title,
          active: bannerSettings.active
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save banner settings');
      }

      // Update local state
      setBannerSettings(prev => ({
        ...prev,
        imageUrl
      }));
      setBannerPreview(imageUrl);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pengaturan banner berhasil disimpan!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2a3f9b'
      });
      setBannerImageFile(null);
    } catch (error) {
      console.error("Error saving banner settings:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan pengaturan banner: ' + error.message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setSavingBanner(false);
    }
  };

  // Function to handle banner settings change
  const handleBannerSettingsChange = (field, value) => {
    setBannerSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle banner image selection
  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImageFile(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };

  // Trigger file input click for banner image
  const triggerBannerImageUpload = () => {
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.click();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- Components ---

  const SidebarItem = ({ id, label, icon: Icon, soon = false, externalUrl = null }) => (
    <button
      onClick={() => {
        if (externalUrl) {
          window.open(externalUrl, '_blank');
          return;
        }
        if (!soon) {
          setActiveMenu(id);
          setSidebarOpen(false);
        }
      }}
      className={`w-full flex items-center justify-between px-4 py-3.5 mb-1 rounded-xl transition-all duration-200 group ${
        activeMenu === id && !soon
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
      } ${soon ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-3 ${activeMenu === id && !soon ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {soon && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border">Soon</span>}
      {externalUrl && <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />}
    </button>
  );

  const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        <span className="text-green-600 font-medium">{trend}</span>
        <span className="text-gray-400 ml-1">bulan ini</span>
      </div>
    </div>
  );

  // --- Views ---

  const renderDashboard = () => {
    // Filter recent activities based on search term
    const recentActivitiesToShow = searchTerm
      ? recentActivities.filter(activity => {
          const searchLower = searchTerm.toLowerCase();
          return (
            activity.invoiceNumber.toLowerCase().includes(searchLower) ||
            (activity.clientName && activity.clientName.toLowerCase().includes(searchLower)) ||
            (activity.total && activity.total.toString().includes(searchLower))
          );
        })
      : recentActivities;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl text-white p-8 shadow-xl shadow-blue-900/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Halo, Administrator! 👋
              </h1>
              <p className="text-blue-100 text-lg opacity-90 max-w-lg">
                Kelola tagihan, pantau pembayaran, dan atur klien Anda dalam satu tempat yang terintegrasi.
              </p>
              <div className="flex items-center mt-6 text-sm font-medium text-blue-200 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex gap-2">
                 <select
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                   className="bg-white text-gray-800 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   {getMonthOptions()}
                 </select>
                 <select
                   value={selectedYear}
                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                   className="bg-white text-gray-800 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   {getYearOptions()}
                 </select>
               </div>
               <button
                onClick={() => setActiveMenu("invoice")}
                className="bg-white text-blue-800 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center group"
              >
                <Receipt className="w-5 h-5 mr-2" />
                Buat Invoice Baru
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Stats Overview (Real-time Data) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label="Total Invoice Bulan Ini"
            value={totalInvoices}
            icon={Receipt}
            color="bg-blue-500"
            trend="+8%"
          />
          <StatCard
            label="Pembayaran Diterima"
            value={formatCurrencyAbbr(totalPaid)}
            icon={CheckCircle2}
            color="bg-green-500"
            trend="+12%"
          />
          <StatCard
            label="Menunggu Pembayaran"
            value={formatCurrencyAbbr(totalPending)}
            icon={Clock}
            color="bg-orange-400"
            trend="-2%"
          />
        </div>

        {/* Quick Access / Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-800">Aktivitas Terakhir</h3>
               <button className="text-sm text-blue-600 font-medium hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
               {recentActivitiesToShow.map((invoice, index) => {
                 // Calculate time ago
                 const createdAt = invoice.createdAt?.toDate ? invoice.createdAt.toDate() : new Date();
                 const now = new Date();
                 const diffTime = Math.abs(now - createdAt);
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                 let timeAgo = "";
                 if (diffDays === 1) {
                   timeAgo = "1 hari lalu";
                 } else if (diffDays < 7) {
                   timeAgo = `${diffDays} hari lalu`;
                 } else if (diffDays < 30) {
                   const weeks = Math.floor(diffDays / 7);
                   timeAgo = `${weeks} minggu lalu`;
                 } else {
                   const months = Math.floor(diffDays / 30);
                   timeAgo = `${months} bulan lalu`;
                 }

                 return (
                   <div key={invoice.id} className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                     <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                        {invoice.invoiceNumber.substring(0, 3)}
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{invoice.invoiceNumber} Dibuat</p>
                        <p className="text-xs text-gray-500">{invoice.clientName} • {formatCurrency(invoice.total)}</p>
                     </div>
                     <span className="text-xs text-gray-400">{timeAgo}</span>
                   </div>
                 );
               })}
               {recentActivitiesToShow.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Tidak ditemukan aktivitas terakhir yang sesuai pencarian' : 'Belum ada aktivitas terakhir'}
                  </div>
               )}
            </div>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
             <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="bg-yellow-400 w-2 h-2 rounded-full mr-2"></span>
                Tips Pro
             </h3>
             <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                   <p className="text-sm text-gray-200 leading-relaxed">
                     &quot;Selalu kirimkan invoice <b>3 hari sebelum</b> jatuh tempo termin pembayaran untuk mempercepat proses administrasi klien.&quot;
                   </p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                   <p className="text-sm text-gray-200 leading-relaxed">
                     &quot;Gunakan fitur <b>Sub-item</b> untuk merinci biaya agar klien lebih mudah memahami tagihan.&quot;
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Settings View
  const renderSettings = () => {
    // Predefined agent numbers
    const agentNumbers = [
      { number: '6281399710085', name: 'Angga Puziana' },
      { number: '6289518530306', name: 'Ilyasa Meydiansyah' },
      { number: '6282258115474', name: 'Shindy' },
      { number: '62895635367495', name: 'Cindy' }
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan WhatsApp</h1>
          <p className="text-gray-600 mt-1">Atur nomor WhatsApp yang digunakan di seluruh website</p>
        </div>

        {loadingSettings ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat pengaturan...</span>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="space-y-8">
              {/* Predefined Agent Numbers Section */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-3">Pilih Nomor Agent</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agentNumbers.map((agent, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        whatsappSettings.mainNumber === agent.number
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSettingsChange('mainNumber', agent.number)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.number}</div>
                        </div>
                        <input
                          type="radio"
                          checked={whatsappSettings.mainNumber === agent.number}
                          onChange={() => handleSettingsChange('mainNumber', agent.number)}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp Utama
                </label>
                <input
                  type="text"
                  value={whatsappSettings.mainNumber}
                  onChange={(e) => handleSettingsChange('mainNumber', e.target.value)}
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 6281234567890 (tanpa tanda + atau spasi)
                </p>
              </div>

              {/* Secondary Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp Cadangan
                </label>
                <input
                  type="text"
                  value={whatsappSettings.secondaryNumber}
                  onChange={(e) => handleSettingsChange('secondaryNumber', e.target.value)}
                  placeholder="Contoh: 6289512345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 6289512345678 (tanpa tanda + atau spasi)
                </p>
              </div>

              {/* Message Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Pesan WhatsApp
                </label>
                <textarea
                  value={whatsappSettings.messageTemplate}
                  onChange={(e) => handleSettingsChange('messageTemplate', e.target.value)}
                  rows={4}
                  placeholder="Masukkan template pesan default..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pesan default yang akan terkirim saat pengguna menekan tombol WhatsApp
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={saveWhatsappSettings}
                  disabled={savingSettings}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {savingSettings ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Pengaturan WhatsApp'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner Settings Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pengaturan Banner Iklan</h2>
              <p className="text-gray-600 mt-1">Atur banner iklan yang muncul di halaman utama website</p>
            </div>

            {loadingBanner ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Memuat pengaturan banner...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Banner Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Banner
                  </label>
                  <div
                    onClick={triggerBannerImageUpload}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                  >
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      onChange={handleBannerImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {bannerPreview ? (
                      <div className="relative">
                        <img
                          src={bannerPreview}
                          alt="Banner Preview"
                          className="max-h-60 w-full max-w-full rounded-lg object-contain"
                        />
                        <div className="mt-3 text-sm text-gray-600">
                          Klik untuk mengganti gambar banner
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-900">Klik untuk upload gambar banner</div>
                        <div className="text-xs text-gray-500">PNG, JPG hingga 5MB</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Banner
                  </label>
                  <input
                    type="text"
                    value={bannerSettings.title}
                    onChange={(e) => handleBannerSettingsChange('title', e.target.value)}
                    placeholder="Masukkan judul banner..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Banner Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bannerStatus"
                    checked={bannerSettings.active}
                    onChange={(e) => handleBannerSettingsChange('active', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="bannerStatus" className="ml-2 block text-sm text-gray-900">
                    Aktifkan banner iklan
                  </label>
                </div>

                {/* Banner Actions */}
                <div className="flex justify-between">
                  <div>
                    {bannerSettings.imageUrl && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus banner iklan ini?')) {
                            // Set the local state to cleared values
                            setBannerSettings(prev => ({
                              ...prev,
                              imageUrl: '',
                              active: false
                            }));
                            setBannerPreview('');
                            setBannerImageFile(null);

                            // Save directly with empty values (no file upload)
                            setSavingBanner(true);
                            try {
                              // Save banner settings with empty imageUrl to Firestore
                              const response = await fetch('/api/banner', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  imageUrl: '',
                                  title: 'Banner Advertisement', // Keep the title or set as needed
                                  active: false
                                })
                              });

                              if (response.ok) {
                                Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: 'Banner berhasil dihapus!',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#2a3f9b'
                              });
                              } else {
                                throw new Error('Failed to delete banner settings');
                              }
                            } catch (error) {
                              console.error("Error deleting banner:", error);
                              Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: 'Gagal menghapus banner: ' + error.message,
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#dc2626'
                              });
                              // Restore the previous state in case of error
                              setBannerPreview(bannerSettings.imageUrl);
                            } finally {
                              setSavingBanner(false);
                            }
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Hapus Banner
                      </button>
                    )}
                  </div>
                  <button
                    onClick={saveBannerSettings}
                    disabled={savingBanner}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {savingBanner ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Pengaturan Banner'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    );
  };

  // State for banner settings
  const [bannerSettings, setBannerSettings] = useState({
    imageUrl: '',
    title: 'Banner Advertisement',
    active: true
  });
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  // State for file uploads
  const [selectedInvoiceForFiles, setSelectedInvoiceForFiles] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [fileUploadProgress, setFileUploadProgress] = useState({});

  // Refs
  const fileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);

  // Function to handle file upload click
  const handleFileUploadClick = async () => {
    if (!selectedInvoiceForFiles || !fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Silakan pilih file terlebih dahulu',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    const files = Array.from(fileInputRef.current.files);
    await handleFileUpload(files, selectedInvoiceForFiles);
  };

  // Function to handle file upload using Vercel Blob
  const handleFileUpload = async (files, invoice) => {
    if (!files.length) return;

    // Create a copy of uploadingFiles state to update
    const newUploadingFiles = { ...uploadingFiles };
    files.forEach(file => {
      newUploadingFiles[`${invoice.id}-${file.name}`] = true;
    });
    setUploadingFiles(newUploadingFiles);

    try {
      const uploadPromises = [];

      for (const file of files) {
        // Add to uploading state
        const fileKey = `${invoice.id}-${file.name}`;
        setUploadingFiles(prev => ({
          ...prev,
          [fileKey]: true
        }));

        // Create a promise for each file upload via Vercel Blob
        const filePromise = new Promise(async (resolve, reject) => {
          try {
            console.log('Starting upload to Vercel Blob for:', file.name);

            // Step 1: Upload file to Vercel Blob
            const formData = new FormData();
            formData.append('file', file);
            formData.append('access', 'public'); // Make files publicly accessible

            // Note: In a real implementation, you would need to configure your Vercel Blob endpoint
            // For now, we'll simulate the process with a placeholder for the actual upload
            const response = await fetch('/api/upload-blob', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            const blobUrl = result.url; // This would be the Vercel Blob URL

            console.log('File uploaded to Vercel Blob:', blobUrl);

            // Step 2: Record URL to Firestore
            const { doc, getDoc, updateDoc } = await import('firebase/firestore');
            const invoiceRef = doc(db, "invoices", invoice.id);

            // First get the current invoice data to update the files array
            const invoiceSnap = await getDoc(invoiceRef);
            if (invoiceSnap.exists()) {
              const invoiceData = invoiceSnap.data();
              const currentFiles = invoiceData.files || [];

              const newFileData = {
                name: file.name,
                url: blobUrl,
                uploadedAt: new Date(),
                size: file.size,
                type: file.type,
                storage: 'vercel-blob' // Mark that this file is stored in Vercel Blob
              };

              await updateDoc(invoiceRef, {
                files: [...currentFiles, newFileData]
              });

              // Update the local state to reflect the new file immediately
              setSelectedInvoiceForFiles(prev => ({
                ...prev,
                files: [...(prev.files || []), newFileData]
              }));

              // Also save the file to the document repository
              try {
                await fetch('/api/documents', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: auth.currentUser.uid,
                    fileName: file.name,
                    fileUrl: blobUrl,
                    fileSize: file.size || 0,
                    fileType: file.type || 'application/octet-stream',
                    category: 'legal',
                    relatedInvoice: invoice.invoiceNumber,
                    tags: ['document', 'legal', invoice.status]
                  })
                });
              } catch (repoError) {
                console.error('Error saving to document repository:', repoError);
                // Don't fail the entire operation if repository save fails
              }
            }

            console.log('Invoice updated with file:', file.name);

            // Remove from uploading state
            setUploadingFiles(prev => {
              const newUploading = { ...prev };
              delete newUploading[fileKey];
              return newUploading;
            });

            setFileUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileKey];
              return newProgress;
            });

            resolve();
          } catch (error) {
            console.error("Error uploading file to Vercel Blob:", error);

            // On error, still record the failure in Firestore and update local state
            try {
              const { doc, getDoc, updateDoc } = await import('firebase/firestore');
              const invoiceRef = doc(db, "invoices", invoice.id);

              // First get the current invoice data to update the files array
              const invoiceSnap = await getDoc(invoiceRef);
              if (invoiceSnap.exists()) {
                const invoiceData = invoiceSnap.data();
                const currentFiles = invoiceData.files || [];

                const failedFileData = {
                  name: file.name,
                  error: error.message,
                  uploadedAt: new Date(),
                  size: file.size,
                  type: file.type,
                  status: 'upload_failed'
                };

                await updateDoc(invoiceRef, {
                  files: [...currentFiles, failedFileData]
                });

                // Update the local state to reflect the failed file immediately
                setSelectedInvoiceForFiles(prev => ({
                  ...prev,
                  files: [...(prev.files || []), failedFileData]
                }));

                // Also save the failed file to the document repository as a record
                try {
                  await fetch('/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: auth.currentUser.uid,
                      fileName: file.name,
                      fileUrl: '', // No URL for failed uploads
                      fileSize: file.size || 0,
                      fileType: file.type || 'application/octet-stream',
                      category: 'failed_upload',
                      relatedInvoice: invoice.invoiceNumber,
                      tags: ['failed', 'document', 'error']
                    })
                  });
                } catch (repoError) {
                  console.error('Error saving failed upload to document repository:', repoError);
                  // Don't fail the operation if repository save fails
                }
              }
            } catch (updateError) {
              console.error("Error updating invoice with failed file record:", updateError);
            }

            // Remove from uploading state
            setUploadingFiles(prev => {
              const newUploading = { ...prev };
              delete newUploading[fileKey];
              return newUploading;
            });

            setFileUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileKey];
              return newProgress;
            });

            reject(error);
          }
        });

        uploadPromises.push(filePromise);
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Berhasil upload ${files.length} file ke Vercel Blob!`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#2a3f9b'
      });
      setSelectedInvoiceForFiles(null);
    } catch (error) {
      console.error("Error handling file upload to Vercel Blob: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: `Error upload: ${error.message}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  }

  // Function to delete a file from an invoice
  const handleDeleteFile = async (invoiceId, file, fileIndex) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus dokumen "${file.name}"?`)) {
      return;
    }

    try {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore');
      const invoiceRef = doc(db, "invoices", invoiceId);
      const invoiceSnap = await getDoc(invoiceRef);

      if (invoiceSnap.exists()) {
        const invoiceData = invoiceSnap.data();
        if (invoiceData.files && Array.isArray(invoiceData.files)) {
          // Create a new array without the file to be deleted
          const updatedFiles = invoiceData.files.filter((_, index) => index !== fileIndex);

          await updateDoc(invoiceRef, {
            files: updatedFiles
          });

          // Update the local state to reflect the deletion immediately
          setSelectedInvoiceForFiles(prev => ({
            ...prev,
            files: updatedFiles
          }));

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Dokumen berhasil dihapus!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2a3f9b'
          });
        }
      }
    } catch (error) {
      console.error("Error deleting file: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: `Error menghapus dokumen: ${error.message}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  // Render Tracking Dashboard
  const renderTracking = () => {
    // Calculate invoice statistics for tracking analytics based on filtered results
    const invoicesToShow = searchTerm ? filteredInvoices : invoices;
    const totalInvoices = invoicesToShow.length;
    const draftInvoices = invoicesToShow.filter(inv => inv.status === 'draft').length;
    const sentInvoices = invoicesToShow.filter(inv => inv.status === 'sent').length;
    const paidInvoices = invoicesToShow.filter(inv => inv.status === 'paid').length;
    const partialInvoices = invoicesToShow.filter(inv => inv.status === 'partial').length;
    const overdueInvoices = invoicesToShow.filter(inv => inv.status === 'overdue').length;
    const cancelledInvoices = invoicesToShow.filter(inv => inv.status === 'cancelled').length;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Status dan Proses</h1>
          <p className="text-gray-600 mt-1">Pantau progres layanan, status pembayaran, dan konfigurasi tahapan proses secara real-time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label="Total Invoice"
            value={totalInvoices}
            icon={Receipt}
            color="bg-blue-500"
            trend=""
          />
          <StatCard
            label="Lunas"
            value={paidInvoices}
            icon={CheckCircle2}
            color="bg-green-500"
            trend=""
          />
          <StatCard
            label="Menunggu Pembayaran"
            value={sentInvoices + partialInvoices + overdueInvoices}
            icon={Clock}
            color="bg-orange-400"
            trend=""
          />
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribusi Status Invoice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-800">{draftInvoices}</div>
              <div className="text-sm text-blue-600">Draft</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-800">{sentInvoices}</div>
              <div className="text-sm text-yellow-600">Dikirim</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-800">{paidInvoices}</div>
              <div className="text-sm text-green-600">Lunas</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-800">{partialInvoices}</div>
              <div className="text-sm text-orange-600">Dibayar Sebagian</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-800">{overdueInvoices}</div>
              <div className="text-sm text-red-600">Terlambat</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-gray-800">{cancelledInvoices}</div>
              <div className="text-sm text-gray-600">Dibatalkan</div>
            </div>
          </div>
        </div>

        {/* Invoice List with Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Invoice Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">No. Invoice</th>
                  <th className="px-4 py-3">Klien</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoicesToShow.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-3 font-bold text-blue-900">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3">{invoice.clientName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {invoice.createdAt?.toDate ? invoice.createdAt.toDate().toLocaleDateString('id-ID') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">Rp {invoice.total?.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'partial' ? 'bg-orange-100 text-orange-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Lunas' :
                         invoice.status === 'partial' ? 'Dibayar Sebagian' :
                         invoice.status === 'overdue' ? 'Terlambat' :
                         invoice.status === 'cancelled' ? 'Dibatalkan' :
                         invoice.status === 'sent' ? 'Dikirim' :
                         'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {invoice.status === 'paid' && (
                        <button
                          onClick={() => setSelectedInvoiceForFiles(invoice)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Upload Dokumen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoicesToShow.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {!searchTerm ? 'Belum ada invoice' : 'Tidak ditemukan invoice yang sesuai pencarian'}
              </div>
            )}
          </div>
        </div>

        {/* File Upload Modal for Completed Invoices */}
        {selectedInvoiceForFiles && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Manajemen Dokumen - {selectedInvoiceForFiles.invoiceNumber}</h3>
                  <button
                    onClick={() => setSelectedInvoiceForFiles(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Existing Files Section */}
                {selectedInvoiceForFiles.files && selectedInvoiceForFiles.files.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Dokumen Tersimpan</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                      {selectedInvoiceForFiles.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-1.5 rounded">
                              <span className="text-blue-600 font-bold text-xs">
                                {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Ukuran tidak diketahui'}
                                {' • '}
                                {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Lihat dokumen"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                            <button
                              onClick={() => handleDeleteFile(selectedInvoiceForFiles.id, file, index)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Hapus dokumen"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Files Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Berkas Baru</label>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="mt-2 space-y-1">
                    {Object.entries(fileUploadProgress).map(([key, progress]) => {
                      const fileName = key.split('-').slice(1).join('-'); // Get filename from key
                      const isUploading = uploadingFiles[key];
                      if (isUploading) {
                        return (
                          <div key={key} className="mb-1">
                            <div className="flex justify-between text-sm">
                              <span>{fileName}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForFiles(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={uploadingFiles && Object.keys(uploadingFiles).some(key => uploadingFiles[key])}
                  >
                    {uploadingFiles && Object.keys(uploadingFiles).some(key => uploadingFiles[key]) ? 'Mengunggah...' : 'Upload File Baru'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Stages Management */}
        <StatusStagesManager />

        {/* Status Tracking Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Keterangan Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-blue-800 mb-1">Draft</div>
              <div className="text-sm text-gray-600">Invoice dalam tahap pembuatan</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 mb-1">Dikirim (Sent)</div>
              <div className="text-sm text-gray-600">Invoice telah dikirim ke klien</div>
            </div>
            <div>
              <div className="font-medium text-green-800 mb-1">Lunas (Paid)</div>
              <div className="text-sm text-gray-600">Pembayaran telah diterima sepenuhnya</div>
            </div>
            <div>
              <div className="font-medium text-orange-800 mb-1">Dibayar Sebagian (Partial)</div>
              <div className="text-sm text-gray-600">Sebagian pembayaran telah diterima</div>
            </div>
            <div>
              <div className="font-medium text-red-800 mb-1">Terlambat (Overdue)</div>
              <div className="text-sm text-gray-600">Jatuh tempo pembayaran telah lewat</div>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1">Dibatalkan (Cancelled)</div>
              <div className="text-sm text-gray-600">Invoice telah dibatalkan</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-blue-100">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:fixed lg:inset-y-0`}
      >
        <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-100">
                <Image src="/logometa.svg" alt="Valpro" width={36} height={36} className="mr-3" />
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Valpro</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
                <SidebarItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                <SidebarItem id="invoice" label="Invoice Generator" icon={Receipt} />

                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">Manajemen</p>
                <SidebarItem id="clients" label="Data Klien" icon={Users} soon />
                <SidebarItem id="tracking" label="Status Tracking" icon={Package} />
                <SidebarItem id="service-management" label="Pengelolaan Layanan" icon={LayoutDashboard} />
                <SidebarItem 
                  id="blog" 
                  label="Blog" 
                  icon={BookOpen} 
                  externalUrl="https://app.contentful.com/spaces/056qzjyxswib/views/entries" 
                />
                <SidebarItem id="documents" label="Repositori Dokumen" icon={File} />
                <SidebarItem id="settings" label="Pengaturan" icon={Settings} />
            </nav>

            {/* User Profile (Bottom) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                        {userEmail?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{userEmail}</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                </button>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">

        {/* Top Mobile Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 lg:hidden">
           <div className="px-4 h-16 flex items-center justify-between">
              <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <span className="ml-3 font-bold text-lg text-gray-900">
                    {activeMenu === 'dashboard' ? 'Dashboard' :
                    activeMenu === 'service-management' ? 'Pengelolaan Layanan' :
                    'Invoice Generator'}
                  </span>
              </div>
              <Image src="/logometa.svg" alt="Logo" width={28} height={28} />
           </div>
        </header>

        {/* Desktop Header Context (Optional but nice) */}
        <header className="hidden lg:flex px-8 h-20 items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20">
            <div>
               <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {activeMenu === 'service-management' ? 'Pengelolaan Layanan' : activeMenu.replace('-', ' ')}
               </h2>
               <p className="text-sm text-gray-500">
                 {activeMenu === 'dashboard' ? 'Ringkasan aktivitas bisnis Anda.' :
                  activeMenu === 'service-management' ? 'Atur deskripsi dan manfaat layanan.' :
                  'Buat dan kelola dokumen tagihan.'}
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari invoice, klien, atau dokumen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
               </div>
               <button className="p-2 relative bg-white border border-gray-200 rounded-full text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {activeMenu === "dashboard" && renderDashboard()}
             {activeMenu === "invoice" && <InvoiceGenerator />}
             {activeMenu === "tracking" && renderTracking()}
             {activeMenu === "service-management" && <ServiceManagement />}
             {activeMenu === "documents" && <DocumentRepository userId={auth.currentUser?.uid} searchTerm={searchTerm} />}
             {activeMenu === "settings" && renderSettings()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;