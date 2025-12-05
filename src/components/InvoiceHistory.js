import { Search, Edit, Trash2 } from "lucide-react";
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

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Riwayat Invoice</h2>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"/>
                    <input 
                        type="text" 
                        placeholder="Cari..." 
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Semua Status</option>
                    {INVOICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>
        </div>

        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">No. Invoice</th>
                            <th className="px-4 py-3">Klien</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredInvoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-blue-900">{inv.invoiceNumber}</td>
                                <td className="px-4 py-3">{inv.clientName}</td>
                                <td className="px-4 py-3 text-gray-500">{new Date(inv.createdAt).toLocaleDateString("id-ID")}</td>
                                <td className="px-4 py-3 font-medium">Rp {inv.total.toLocaleString("id-ID")}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${(INVOICE_STATUSES.find(s=>s.value===inv.status)||INVOICE_STATUSES[0]).color}`}>
                                        {(INVOICE_STATUSES.find(s=>s.value===inv.status)||INVOICE_STATUSES[0]).label}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button 
                                            onClick={() => editInvoice(inv)}
                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            onClick={() => deleteInvoice(inv.id)}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default InvoiceHistory;