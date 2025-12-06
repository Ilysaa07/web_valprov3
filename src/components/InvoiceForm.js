import { useState, useEffect } from "react";
// Pastikan path import ini sesuai dengan struktur project Anda
import { auth, db } from "../lib/firebase"; 
import {
  User, Phone, Mail, MapPin, FileText, Calendar, 
  CreditCard, Plus, Trash2, X, ChevronRight,
  MessageSquare, Lock, Eye, Save, Loader2, DollarSign,
  Percent, Hash, Briefcase
} from "lucide-react";
import { formatNumber, parseNumber, validateTerminAmount } from "./InvoiceHelpers";
import { PAYMENT_TERMS, INVOICE_STATUSES } from "./InvoiceConstants";

// Komponen Input Label Reusable agar kode lebih rapi
const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

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
    <div className={`${showPreview ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6 transition-all duration-300 w-full font-sans`}>
      
      {/* SECTION 1: INFORMASI KLIEN */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informasi Klien
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Wajib Diisi</span>
        </div>
        
        <div className="p-6 space-y-5">
            <div>
                <Label required>Nama Perusahaan / Klien</Label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        placeholder="Contoh: PT. Sinar Mas Jaya"
                        value={formData.clientName}
                        onChange={e => handleInputChange("clientName", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div>
                    <Label>Nomor Telepon</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="0812..."
                            value={formData.clientPhone}
                            onChange={e => handleInputChange("clientPhone", e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Label>Alamat Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="klien@email.com"
                            value={formData.clientEmail}
                            onChange={e => handleInputChange("clientEmail", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label>Alamat Lengkap</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea 
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                        placeholder="Jl. Jendral Sudirman No..."
                        value={formData.clientAddress}
                        onChange={e => handleInputChange("clientAddress", e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: DETAIL INVOICE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Detail Dokumen
            </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-5">
                <div>
                    <Label>Nomor Invoice</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                             <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                             <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                                placeholder="INV/2024/..."
                                value={formData.invoiceNumber}
                                onChange={e => handleInputChange("invoiceNumber", e.target.value)}
                             />
                        </div>
                        <button
                          onClick={() => handleInputChange("invoiceNumber", generateInvoiceNumber())}
                          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                        >
                          Auto
                        </button>
                    </div>
                </div>
                <div>
                    <Label>Tanggal Terbit</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            value={formData.issueDate}
                            onChange={e => handleInputChange("issueDate", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-5">
                 <div>
                    <Label>Ketentuan Pembayaran (Termin)</Label>
                    <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                        value={formData.paymentTerms}
                        onChange={e => handleInputChange("paymentTerms", e.target.value)}
                    >
                        {PAYMENT_TERMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <Label>Jatuh Tempo</Label>
                         <input
                            type="date"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            value={formData.dueDate}
                            onChange={e => handleInputChange("dueDate", e.target.value)}
                         />
                    </div>
                    <div>
                        <Label>Status Dokumen</Label>
                        <select
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                            value={formData.status}
                            onChange={e => handleInputChange("status", e.target.value)}
                        >
                            {INVOICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 3: ITEM & LAYANAN (INTI) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Item & Layanan
            </h3>
            <button 
                onClick={addItem} 
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
            >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"/> 
                Tambah Item
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            {formData.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-gray-500 mb-2">Belum ada item ditambahkan</p>
                    <button onClick={addItem} className="text-blue-600 font-semibold hover:underline text-sm">Klik untuk menambah item pertama</button>
                </div>
            )}

            {formData.items.map((item, idx) => (
                <div key={item.id} className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group">
                     {/* Delete Button (Corner) */}
                     <button 
                        onClick={() => removeItem(item.id)} 
                        className="absolute -top-3 -right-3 bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 hover:border-red-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        title="Hapus Item"
                     >
                        <X className="w-4 h-4" />
                     </button>
                     
                     <div className="p-5">
                        <div className="grid grid-cols-12 gap-4 mb-4">
                           <div className="col-span-12 md:col-span-6">
                               <Label>Deskripsi Item</Label>
                               <input 
                                   type="text" 
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                                   placeholder="Nama Jasa / Produk"
                                   value={item.description}
                                   onChange={e => updateItem(item.id, "description", e.target.value)}
                               />
                           </div>
                           <div className="col-span-4 md:col-span-2">
                               <Label>Kuantitas</Label>
                               <input 
                                   type="text"
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                                   value={formatNumber(item.quantity)}
                                   onChange={e => updateItem(item.id, "quantity", parseNumber(e.target.value))}
                               />
                           </div>
                           <div className="col-span-8 md:col-span-4">
                               <Label>Harga Satuan</Label>
                               <div className="relative">
                                   <span className="absolute left-3 top-2 text-gray-500 text-sm font-medium">Rp</span>
                                   <input 
                                       type="text"
                                       className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right font-mono"
                                       value={formatNumber(item.unitPrice)}
                                       onChange={e => updateItem(item.id, "unitPrice", parseNumber(e.target.value))}
                                   />
                               </div>
                           </div>
                        </div>

                        {/* Sub Items Section */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                           <div className="space-y-3">
                              {item.subItems?.map((sub) => (
                                  <div key={sub.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 pl-2 border-l-2 border-blue-200">
                                       <div className="flex-grow min-w-[150px]">
                                          <input 
                                              type="text" 
                                              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                                              placeholder="Detail sub-item..."
                                              value={sub.description}
                                              onChange={e => updateSubItem(item.id, sub.id, "description", e.target.value)}
                                          />
                                       </div>
                                       <div className="w-16">
                                          <input 
                                              type="text" 
                                              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-white text-center"
                                              placeholder="Qty"
                                              value={formatNumber(sub.quantity)}
                                              onChange={e => updateSubItem(item.id, sub.id, "quantity", parseNumber(e.target.value))}
                                          />
                                       </div>
                                       <div className="w-32">
                                          <input 
                                              type="text" 
                                              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-white text-right"
                                              placeholder="Harga (Ops)"
                                              value={formatNumber(sub.unitPrice)}
                                              onChange={e => updateSubItem(item.id, sub.id, "unitPrice", parseNumber(e.target.value))}
                                          />
                                       </div>
                                       <button onClick={() => removeSubItem(item.id, sub.id)} className="text-gray-400 hover:text-red-500 p-1">
                                           <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                  </div>
                              ))}
                           </div>
                           <button onClick={() => addSubItem(item.id)} className="mt-3 flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                               <ChevronRight className="w-3 h-3 mr-1" /> Tambah Detail Sub-item
                           </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-3 text-right">
                             <span className="text-xs text-gray-500 mr-2">Total Item:</span>
                             <span className="font-bold text-gray-800">Rp {(item.quantity * item.unitPrice + (item.subItems?.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0) || 0)).toLocaleString("id-ID")}</span>
                        </div>
                     </div>
                </div>
            ))}
        </div>

        {/* CALCULATION FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-end gap-8">
                {/* Controls (Tax/Discount) */}
                <div className="w-full md:w-1/2 space-y-3">
                     <div className="flex items-center gap-3">
                         <label className="text-sm font-medium text-gray-600 w-24">Diskon</label>
                         <div className="flex flex-1">
                            <select
                                className="bg-white border border-gray-300 rounded-l-lg px-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.discountType}
                                onChange={e => handleInputChange("discountType", e.target.value)}
                            >
                                <option value="percentage">%</option>
                                <option value="fixed">Rp</option>
                            </select>
                            <input
                                type="text"
                                className="w-full border-y border-r border-gray-300 rounded-r-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-right"
                                value={formData.discountType === 'percentage' ? formData.discountValue : formatNumber(formData.discountValue)}
                                onChange={e => handleInputChange("discountValue", formData.discountType === 'percentage' ? parseFloat(e.target.value) || 0 : parseNumber(e.target.value))}
                            />
                         </div>
                     </div>
                     <div className="flex items-center gap-3">
                         <label className="text-sm font-medium text-gray-600 w-24">Pajak</label>
                         <div className="flex flex-1">
                            <select
                                className="bg-white border border-gray-300 rounded-l-lg px-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.taxType}
                                onChange={e => handleInputChange("taxType", e.target.value)}
                            >
                                <option value="percentage">%</option>
                                <option value="fixed">Rp</option>
                            </select>
                            <input
                                type="text"
                                className="w-full border-y border-r border-gray-300 rounded-r-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-right"
                                value={formData.taxType === 'percentage' ? formData.taxValue : formatNumber(formData.taxValue)}
                                onChange={e => handleInputChange("taxValue", formData.taxType === 'percentage' ? parseFloat(e.target.value) || 0 : parseNumber(e.target.value))}
                            />
                         </div>
                     </div>
                </div>

                {/* Totals Display */}
                <div className="w-full md:w-1/3 space-y-2 text-right">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>Rp {formData.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    {formData.discountValue > 0 && (
                        <div className="flex justify-between text-sm text-red-500">
                            <span>Diskon {formData.discountType === 'percentage' ? `(${formData.discountValue}%)` : ''}</span>
                            <span>- Rp {((formData.discountType === 'percentage' ? (formData.subtotal * formData.discountValue / 100) : formData.discountValue) || 0).toLocaleString("id-ID")}</span>
                        </div>
                    )}
                    {formData.taxValue > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Pajak {formData.taxType === 'percentage' ? `(${formData.taxValue}%)` : ''}</span>
                            <span>+ Rp {((formData.taxType === 'percentage' ? ((formData.subtotal - (formData.discountType === 'fixed' ? formData.discountValue : (formData.subtotal * formData.discountValue / 100))) * formData.taxValue / 100) : formData.taxValue) || 0).toLocaleString("id-ID")}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                        <span className="text-lg font-bold text-gray-800">Total Tagihan</span>
                        <span className="text-2xl font-bold text-blue-700">Rp {formData.total.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 4: PEMBAYARAN (TERMIN) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
             <h3 className="text-lg font-bold text-gray-800">Riwayat Pembayaran (Termin)</h3>
             <button
                onClick={addTermin}
                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition shadow-sm font-medium flex items-center gap-1"
             >
                <Plus className="w-3.5 h-3.5"/> Catat Bayar
             </button>
          </div>
          
          <div className="p-6">
              {formData.termins.length === 0 ? (
                <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-lg border border-dashed">
                    Belum ada pembayaran yang dicatat.
                </div>
              ) : (
                <div className="space-y-3">
                    {formData.termins.map((termin, idx) => (
                        <div key={termin.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 shadow-sm transition-all">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">#{idx+1}</span>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-green-500 w-full"
                                    value={termin.date}
                                    onChange={e => updateTermin(termin.id, "date", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-1 items-center gap-2 w-full">
                                <select
                                    className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-50"
                                    value={termin.amountType}
                                    onChange={e => updateTermin(termin.id, "amountType", e.target.value)}
                                >
                                    <option value="fixed">Rp</option>
                                    <option value="percentage">%</option>
                                </select>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 font-medium text-gray-700"
                                    placeholder="Jumlah"
                                    value={termin.amountType === 'percentage' ? termin.value : formatNumber(termin.value)}
                                    onChange={e => updateTermin(termin.id, "value", e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-100 min-w-[120px] text-right">
                                    Rp {formatNumber(termin.calculatedAmount || 0)}
                                </div>
                                <button
                                    onClick={() => removeTermin(termin.id)}
                                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              )}
              
              {/* Summary Payment */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                      Total Dibayar: <span className="text-green-600 font-bold ml-1">Rp {formatNumber(formData.totalTerminPaid)}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border ${formData.remainingAmount <= 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <span className="text-sm font-medium mr-2">Sisa Pembayaran:</span>
                      <span className="text-lg font-bold">Rp {formatNumber(formData.remainingAmount)}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* SECTION 5: CATATAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                   <MessageSquare className="w-4 h-4 text-blue-600"/> Catatan Publik
               </h4>
               <textarea 
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                   placeholder="Pesan untuk klien (tampil di invoice)..."
                   value={formData.notes}
                   onChange={e => handleInputChange("notes", e.target.value)}
               />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                   <Lock className="w-4 h-4 text-orange-500"/> Catatan Internal
               </h4>
               <textarea 
                   rows={3}
                   className="w-full px-3 py-2 border border-yellow-200 bg-yellow-50 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 resize-none placeholder-yellow-400 text-yellow-800"
                   placeholder="Catatan tim (tidak terlihat klien)..."
                   value={formData.internalNotes}
                   onChange={e => handleInputChange("internalNotes", e.target.value)}
               />
          </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="sticky bottom-6 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="text-sm text-gray-500 hidden sm:block">
               Pastikan data sudah benar sebelum menyimpan.
           </div>
           <div className="flex gap-3 w-full sm:w-auto">
               <button
                  onClick={openPreviewInNewWindow}
                  className="flex-1 sm:flex-none flex justify-center items-center px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
               >
                  <Eye className="w-5 h-5 mr-2" /> Preview
               </button>
               <button
                  onClick={saveInvoice}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex justify-center items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {saving ? <Loader2 className="animate-spin w-5 h-5 mr-2"/> : <Save className="w-5 h-5 mr-2"/>}
                  {editingInvoice ? "Update Invoice" : "Simpan Invoice"}
               </button>
           </div>
      </div>

    </div>
  );
};

export default InvoiceForm;