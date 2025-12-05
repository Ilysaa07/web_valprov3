import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Printer,
  CreditCard,
  User,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Save,
  MessageSquare,
  Edit,
  Search,
  Download,
  Share2
} from "lucide-react";
import { formatNumber, parseNumber, validateTerminAmount } from "./InvoiceHelpers";
import { PAYMENT_TERMS, INVOICE_STATUSES, PAYMENT_METHODS } from "./InvoiceConstants";

const InvoiceForm = ({
  formData,
  setFormData,
  showPreview,
  setShowPreview,
  saving,
  saveInvoice,
  editingInvoice,
  openPreviewInNewWindow,
  addTermin,
  updateTermin,
  removeTermin,
  calculateTotals,
  handleInputChange,
  addItem,
  updateItem,
  removeItem,
  addSubItem,
  updateSubItem,
  removeSubItem,
  generateInvoiceNumber
}) => {
  return (
    <div className={`${showPreview ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6 transition-all duration-300 w-full`}>
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-900" />
                  Informasi Klien
              </h3>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Wajib</div>
          </div>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan / Klien</label>
                  <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="PT. ABCDE"
                      value={formData.clientName}
                      onChange={e => handleInputChange("clientName", e.target.value)}
                  />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                      <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="081..."
                          value={formData.clientPhone}
                          onChange={e => handleInputChange("clientPhone", e.target.value)}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                          type="email"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="email@client.com"
                          value={formData.clientEmail}
                          onChange={e => handleInputChange("clientEmail", e.target.value)}
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                  <textarea 
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Jakarta..."
                      value={formData.clientAddress}
                      onChange={e => handleInputChange("clientAddress", e.target.value)}
                  />
              </div>
          </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-900" />
                  Detail Invoice
              </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Invoice</label>
                     <div className="flex flex-col sm:flex-row gap-2">
                         <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Auto Generated"
                            value={formData.invoiceNumber}
                            onChange={e => handleInputChange("invoiceNumber", e.target.value)}
                         />
                         <button
                            onClick={() => handleInputChange("invoiceNumber", generateInvoiceNumber())}
                            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-bold sm:w-auto w-full transition-colors"
                         >
                            Auto
                         </button>
                     </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit</label>
                     <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.issueDate}
                        onChange={e => handleInputChange("issueDate", e.target.value)}
                     />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Ketentuan Pembayaran</label>
                     <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.paymentTerms}
                        onChange={e => handleInputChange("paymentTerms", e.target.value)}
                     >
                         {PAYMENT_TERMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                     </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
                     <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.dueDate}
                        onChange={e => handleInputChange("dueDate", e.target.value)}
                     />
                </div>
              </div>
          </div>
          <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status Manual</label>
               <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={e => handleInputChange("status", e.target.value)}
               >
                   {INVOICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
               </select>
          </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-900" />
                  Item & Layanan
              </h3>
              <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1"/> Tambah Item
              </button>
          </div>
          
          <div className="space-y-6">
              {formData.items.map((item, idx) => (
                  <div key={item.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
                       <div className="absolute top-2 right-2">
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                              <XCircle className="w-5 h-5" />
                          </button>
                       </div>
                       
                       <div className="grid grid-cols-12 gap-3 mb-3">
                          <div className="col-span-12 md:col-span-6">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Item</label>
                              <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Contoh: Paket Sertifikasi ISO..."
                                  value={item.description}
                                  onChange={e => updateItem(item.id, "description", e.target.value)}
                              />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                              <input 
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-lg"
                                  value={formatNumber(item.quantity)}
                                  onChange={e => updateItem(item.id, "quantity", parseNumber(e.target.value))}
                              />
                          </div>
                          <div className="col-span-6 md:col-span-4">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Harga Satuan</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                  <input 
                                      type="text"
                                      className="w-full pl-8 pr-3 py-2 border rounded-lg"
                                      value={formatNumber(item.unitPrice)}
                                      onChange={e => updateItem(item.id, "unitPrice", parseNumber(e.target.value))}
                                  />
                              </div>
                          </div>
                       </div>

                       {/* Sub Items */}
                       <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                          {item.subItems?.map((sub) => (
                              <div key={sub.id} className="grid grid-cols-12 gap-2 items-center">
                                   <div className="col-span-1 flex justify-center">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                   </div>
                                   <div className="col-span-5">
                                      <input 
                                          type="text" 
                                          className="w-full px-2 py-1 text-sm border rounded bg-white"
                                          placeholder="Sub item..."
                                          value={sub.description}
                                          onChange={e => updateSubItem(item.id, sub.id, "description", e.target.value)}
                                      />
                                   </div>
                                   <div className="col-span-2">
                                      <input 
                                          type="text" 
                                          className="w-full px-2 py-1 text-sm border rounded bg-white"
                                          placeholder="Qty"
                                          value={formatNumber(sub.quantity)}
                                          onChange={e => updateSubItem(item.id, sub.id, "quantity", parseNumber(e.target.value))}
                                      />
                                   </div>
                                   <div className="col-span-3">
                                      <input 
                                          type="text" 
                                          className="w-full px-2 py-1 text-sm border rounded bg-white"
                                          placeholder="Harga (Opsional)"
                                          value={formatNumber(sub.unitPrice)}
                                          onChange={e => updateSubItem(item.id, sub.id, "unitPrice", parseNumber(e.target.value))}
                                      />
                                   </div>
                                   <div className="col-span-1">
                                       <button onClick={() => removeSubItem(item.id, sub.id)} className="text-red-400 hover:text-red-600">
                                           <Trash2 className="w-3 h-3" />
                                       </button>
                                   </div>
                              </div>
                          ))}
                          <button onClick={() => addSubItem(item.id)} className="text-xs text-blue-600 font-medium hover:underline mt-2 flex items-center">
                              <Plus className="w-3 h-3 mr-1" /> Tambah Sub-detail
                          </button>
                       </div>
                  </div>
              ))}
          </div>

          <div className="mt-8 border-t pt-6 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
              <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rp {formData.subtotal.toLocaleString("id-ID")}</span>
              </div>
              
              {/* Tax & Discount Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div>
                       <label className="text-xs text-gray-500 block mb-1">Diskon</label>
                       <div className="flex flex-col sm:flex-row">
                           <select
                              className="border rounded-l px-2 text-sm bg-white sm:rounded-l sm:rounded-t sm:rounded-b-0 w-full sm:w-auto"
                              value={formData.discountType}
                              onChange={e => handleInputChange("discountType", e.target.value)}
                           >
                               <option value="percentage">%</option>
                               <option value="fixed">Rp</option>
                           </select>
                           <input
                              type="text"
                              className="border-t border-b border-r rounded-r w-full px-2 text-sm sm:border-t sm:border-l-0 sm:border-b sm:border-r"
                              value={formData.discountType === 'percentage' ? formData.discountValue : formatNumber(formData.discountValue)}
                              onChange={e => handleInputChange("discountValue", formData.discountType === 'percentage' ? parseFloat(e.target.value) || 0 : parseNumber(e.target.value))}
                           />
                       </div>
                  </div>
                  <div>
                       <label className="text-xs text-gray-500 block mb-1">Pajak</label>
                       <div className="flex flex-col sm:flex-row">
                           <select
                              className="border rounded-l px-2 text-sm bg-white sm:rounded-l sm:rounded-t sm:rounded-b-0 w-full sm:w-auto"
                              value={formData.taxType}
                              onChange={e => handleInputChange("taxType", e.target.value)}
                           >
                               <option value="percentage">%</option>
                               <option value="fixed">Rp</option>
                           </select>
                           <input
                              type="text"
                              className="border-t border-b border-r rounded-r w-full px-2 text-sm sm:border-t sm:border-l-0 sm:border-b sm:border-r"
                              value={formData.taxType === 'percentage' ? formData.taxValue : formatNumber(formData.taxValue)}
                              onChange={e => handleInputChange("taxValue", formData.taxType === 'percentage' ? parseFloat(e.target.value) || 0 : parseNumber(e.target.value))}
                           />
                       </div>
                  </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-blue-900 border-t border-gray-200 pt-4">
                  <span>Total Tagihan</span>
                  <span>Rp {formData.total.toLocaleString("id-ID")}</span>
              </div>
          </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-900" />
                  Catatan & Internal
              </h3>
          </div>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Publik)</label>
                  <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Terima kasih atas kerja samanya..."
                      value={formData.notes}
                      onChange={e => handleInputChange("notes", e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Akan muncul di invoice PDF</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Internal (Pribadi)</label>
                  <textarea 
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-yellow-50 border-yellow-200"
                      placeholder="Catatan untuk tim..."
                      value={formData.internalNotes}
                      onChange={e => handleInputChange("internalNotes", e.target.value)}
                  />
                   <p className="text-xs text-gray-400 mt-1">Hanya terlihat oleh Anda</p>
              </div>
          </div>
       </div>

<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-lg font-semibold text-gray-900">Riwayat Pembayaran (Termin)</h3>
   <button
  onClick={addTermin}
  className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition font-medium relative z-10 cursor-pointer"
>
  + Catat Bayar
</button>
  </div>

  {formData.termins.length === 0 ? (
    <p className="text-sm text-gray-400 italic text-center py-8">Belum ada pembayaran dicatat</p>
  ) : (
    <div className="space-y-3">
      {formData.termins.map((termin, idx) => (
        <div key={termin.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition">
          <div className="text-sm font-bold text-gray-500 w-8 sm:w-auto">#{idx+1}</div>

          {/* Tanggal */}
          <input
            type="date"
            className="border rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
            value={termin.date}
            onChange={e => updateTermin(termin.id, "date", e.target.value)}
          />

          {/* Type Selector */}
          <select
            className="border rounded px-2 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={termin.amountType}
            onChange={e => updateTermin(termin.id, "amountType", e.target.value)}
          >
            <option value="fixed">Rp</option>
            <option value="percentage">%</option>
          </select>

          {/* Input Value */}
          <input
            type="text"
            className="border rounded px-3 py-1.5 text-sm flex-1 w-full sm:w-32 focus:ring-2 focus:ring-blue-500"
            placeholder={termin.amountType === 'percentage' ? '0-100' : 'Jumlah'}
            value={termin.amountType === 'percentage' ? termin.value : formatNumber(termin.value)}
            onChange={e => updateTermin(termin.id, "value", e.target.value)}
          />

          {/* Calculated Amount Display */}
          <div className="text-xs text-gray-600 font-medium min-w-[120px] text-right bg-blue-50 px-3 py-1.5 rounded w-full sm:w-auto">
            = Rp {formatNumber(termin.calculatedAmount || 0)}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => removeTermin(termin.id)}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Summary */}
      <div className="space-y-2 pt-3 border-t mt-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-600">Total Dibayar:</span>
          <span className="text-green-600 font-bold">Rp {formatNumber(formData.totalTerminPaid)}</span>
        </div>
        <div className="flex justify-between items-center text-base font-bold">
          <span className="text-gray-900">Sisa Pembayaran:</span>
          <span className={formData.remainingAmount <= 0 ? "text-green-600" : "text-red-600"}>
            Rp {formatNumber(formData.remainingAmount)}
          </span>
        </div>
      </div>
    </div>
  )}
</div>

       <div className="flex flex-col sm:flex-row gap-3 pt-4">
           <button
              onClick={openPreviewInNewWindow}
              className="w-full sm:w-auto bg-white border border-blue-200 text-blue-700 py-3 px-4 rounded-xl font-medium hover:bg-blue-50 transition-colors flex justify-center items-center"
           >
              <Eye className="w-4 h-4 mr-2" />
              Lihat Preview
           </button>
           <button
              onClick={saveInvoice}
              disabled={saving}
              className="w-full sm:w-auto bg-blue-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex justify-center items-center disabled:opacity-70"
           >
              {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
              {editingInvoice ? "Update Invoice" : "Simpan Invoice"}
           </button>
       </div>
    </div>
  );
};

export default InvoiceForm;