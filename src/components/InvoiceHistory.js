import { Search, Edit, Trash2, Filter, FileText, Calendar, MoreVertical, AlertCircle, ChevronRight } from "lucide-react";
import { INVOICE_STATUSES } from "./InvoiceConstants";

const InvoiceHistory = ({ 
  invoices, 
  loading, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  editInvoice, 
  deleteInvoice 
}) => {
  
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper untuk mendapatkan label & warna status dengan aman
  const getStatusConfig = (statusValue) => {
    return INVOICE_STATUSES.find(s => s.value === statusValue) || INVOICE_STATUSES[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
        {/* HEADER & FILTERS */}
        <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Riwayat Invoice</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Total {filteredInvoices.length} dokumen ditemukan
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Cari nama / no. invoice..." 
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                        <select 
                            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            {INVOICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-gray-50/50">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span className="text-sm">Memuat data...</span>
                </div>
            ) : filteredInvoices.length === 0 ? (
                // EMPTY STATE
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Tidak ada invoice ditemukan</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        {searchQuery || statusFilter !== 'all' 
                            ? "Coba ubah kata kunci pencarian atau filter status Anda." 
                            : "Belum ada invoice yang dibuat. Silakan buat invoice baru."}
                    </p>
                </div>
            ) : (
                <>
                    {/* DESKTOP VIEW (TABLE) - Hidden on Mobile */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 w-[180px]">No. Invoice</th>
                                    <th className="px-6 py-4">Klien</th>
                                    <th className="px-6 py-4 w-[150px]">Tanggal</th>
                                    <th className="px-6 py-4 text-right w-[180px]">Total Tagihan</th>
                                    <th className="px-6 py-4 text-center w-[140px]">Status</th>
                                    <th className="px-6 py-4 text-center w-[100px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredInvoices.map((inv) => {
                                    const statusConfig = getStatusConfig(inv.status);
                                    return (
                                        <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-blue-900 font-mono">{inv.invoiceNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{inv.clientName}</div>
                                                <div className="text-xs text-gray-400">{inv.clientEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400"/>
                                                    {new Date(inv.issueDate).toLocaleDateString("id-ID", {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                Rp {inv.total.toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'border-')}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => editInvoice(inv)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Edit Invoice"
                                                    >
                                                        <Edit className="w-4 h-4"/>
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteInvoice(inv.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Hapus Invoice"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE VIEW (CARDS) - Visible only on Mobile */}
                    <div className="md:hidden p-4 space-y-4">
                        {filteredInvoices.map((inv) => {
                             const statusConfig = getStatusConfig(inv.status);
                             return (
                                <div key={inv.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {inv.invoiceNumber}
                                            </span>
                                            <h4 className="font-bold text-gray-800 mt-1">{inv.clientName}</h4>
                                        </div>
                                        <button 
                                            onClick={() => editInvoice(inv)}
                                            className="text-gray-400 hover:text-blue-600 p-1"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Calendar className="w-3.5 h-3.5"/>
                                        {new Date(inv.issueDate).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                                            {statusConfig.label}
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            Rp {inv.total.toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button 
                                            onClick={() => editInvoice(inv)}
                                            className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteInvoice(inv.id)}
                                            className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default InvoiceHistory;