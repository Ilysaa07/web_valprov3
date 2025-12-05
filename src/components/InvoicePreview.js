import { INVOICE_STATUSES } from "./InvoiceConstants";
import { formatNumber } from "./InvoiceHelpers";
import { Printer } from "lucide-react";

const InvoicePreview = ({ formData, handlePrint, setShowPreview }) => {
  // Format Date
  const fmtDate = (dateStr) => {
      if(!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const statusObj = INVOICE_STATUSES.find((s) => s.value === formData.status) || INVOICE_STATUSES[0];
  const statusColor = statusObj.statusColor; // e.g. #00b050

  return (
    <div className="lg:col-span-7 bg-gray-100 rounded-xl p-8 overflow-y-auto max-h-[1400px]">
         <div className="mb-4 flex justify-end gap-2">
             <button onClick={handlePrint} className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center hover:bg-gray-50">
                <Printer className="w-4 h-4 mr-2"/> Print / PDF
             </button>
             <button
                onClick={() => setShowPreview(false)}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center hover:bg-gray-50"
             >
                Tutup
             </button>
         </div>

         {/* LIVE PREVIEW CANVAS - MATCHING THE IMAGE EXACTLY */}
         <div className="bg-white shadow-2xl mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm', position: 'relative' }}>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.1] z-0">
                <img src="/logo.svg" className="w-[520px]" alt="logo" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-10">
                <div className="flex gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#002060] leading-none mb-1">{formData.businessName}</h1>
                        <p className="text-xs font-bold text-gray-600 mb-2">{formData.businessSubtitle}</p>
                        <p className="text-[10px] text-gray-500 max-w-[250px] leading-tight whitespace-pre-line">
                            {formData.businessAddress}
                        </p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end justify-start mt-1">
                    <h2 className="text-3xl font-bold text-[#002060] tracking-wider mb-2">INVOICE</h2>
                    <table className="text-xs" style={{ marginLeft: 'auto' }}>
                        <tbody>
                            <tr>
                                <td className="text-gray-500 pr-4 text-left" style={{width: '100px'}}>No. Invoice:</td>
                                <td className="font-bold text-[#002060] text-right">{formData.invoiceNumber || "DRAFT"}</td>
                            </tr>
                            <tr>
                                <td className="text-gray-500 pr-4 text-left">Tanggal:</td>
                                <td className="font-bold text-[#002060] text-right">
                                    {formData.issueDate ? new Date(formData.issueDate).toLocaleDateString("id-ID", {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-gray-500 pr-4 text-left">Jatuh Tempo:</td>
                                <td className="font-bold text-[#002060] text-right">
                                    {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString("id-ID", {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-gray-500 pr-4 text-left">Status:</td>
                                <td className={`font-bold uppercase text-right ${(INVOICE_STATUSES.find(s=>s.value===formData.status)||INVOICE_STATUSES[0]).color.split(' ')[1]}`}>
                                    {(INVOICE_STATUSES.find(s=>s.value===formData.status)||INVOICE_STATUSES[0]).label}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Billed To */}
            <div className="relative z-10 mb-8 mt-8">
                <h3 className="text-[#002060] font-bold text-sm mb-2">Ditagihkan Kepada:</h3>
                <div className="text-sm font-bold uppercase mb-1">{formData.clientName || "NAMA KLIEN"}</div>
                <div className="text-xs text-gray-600 space-y-0.5">
                    <div>{formData.clientAddress}</div>
                    {formData.clientPhone && <div>Telepon: {formData.clientPhone}</div>}
                    {formData.clientEmail && <div>Email: {formData.clientEmail}</div>}
                </div>
            </div>

            {/* Table */}
            <div className="relative z-10 mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#002060] text-white text-xs">
                            <th className="py-3 px-3 text-left w-1/2">Deskripsi</th>
                            <th className="py-3 px-3 text-center">Jumlah</th>
                            <th className="py-3 px-3 text-right">Harga Satuan</th>
                            <th className="py-3 px-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-700">
                        {formData.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 px-3 align-top">
                                    <div className="font-semibold text-gray-900 mb-1">{item.description}</div>
                                    {item.subItems?.map(sub => (
                                        <div key={sub.id} className="pl-3 text-[10px] text-gray-500 flex justify-between items-center mb-0.5">
                                            <span>
                                                <span className="mr-1">•</span>
                                                {sub.description} {sub.quantity > 1 ? `(${sub.quantity}x)` : ''}
                                            </span>
                                            {sub.unitPrice > 0 && (
                                                <span className="text-gray-400">Rp {(sub.unitPrice * sub.quantity).toLocaleString("id-ID")}</span>
                                            )}
                                        </div>
                                    ))}
                                </td>
                                <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                                <td className="py-3 px-3 text-right align-top">Rp {item.unitPrice.toLocaleString("id-ID")}</td>
                                <td className="py-3 px-3 text-right font-medium align-top">Rp {item.amount.toLocaleString("id-ID")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary & Footer Layout */}
            <div className="relative z-10">
                {/* Summary Box Right Aligned */}
                <div className="flex justify-end mb-12">
                    <div className="w-[45%] bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-gray-900">Rp {formData.subtotal.toLocaleString("id-ID")}</span>
                            </div>
                            {formData.taxAmount > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Pajak (0%):</span>
                                    <span className="font-semibold text-gray-900">Rp {formData.taxAmount.toLocaleString("id-ID")}</span>
                                </div>
                            )}
                            {formData.discountAmount > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Diskon:</span>
                                    <span className="font-semibold text-red-600">- Rp {formData.discountAmount.toLocaleString("id-ID")}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-bold text-[#002060] pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>Rp. {formData.total.toLocaleString("id-ID")}</span>
                            </div>

                            {/* Termin History directly in summary */}
                            {formData.termins.length > 0 && (
                                <div className="pt-2 mt-2 border-t border-dashed">
                                    {formData.termins.map((t, i) => (
                                        <div key={i} className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Pembayaran {i+1} ({new Date(t.date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})})</span>
                                            <span>Rp. {t.calculatedAmount.toLocaleString("id-ID")}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-xs font-bold text-[#002060] mt-2 pt-2 border-t">
                                        <span>Sisa Pembayaran</span>
                                        <span>Rp. {formData.remainingAmount.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* LUNAS overlay on preview - centered like watermark */}
                        {formData.status === "paid" && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-25deg)',
                            fontSize: '80px',
                            fontWeight: 900,
                            color: '#18a558',
                            opacity: 0.12,
                            letterSpacing: '8px',
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                            fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif"
                          }}>
                            LUNAS
                          </div>
                        )}
                    </div>
                </div>

                {formData.notes && (
                    <div className="mb-8 p-3 bg-gray-50 border-l-4 border-[#002060] rounded-r">
                        <div className="text-xs font-bold text-[#002060] mb-1">Catatan:</div>
                        <div className="text-xs text-gray-600 whitespace-pre-line">{formData.notes}</div>
                    </div>
                )}

                {/* Footer Info Boxes */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Bank Details */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center mb-3 border-l-4 border-[#002060] pl-2">
                            <span className="text-xs font-bold text-[#002060]">Detail Pembayaran</span>
                        </div>
                        <div className="text-[10px] space-y-2">
                            {formData.bankAccounts.map(acc => (
                                <div key={acc.id} className="flex items-center">
                                    <img src={`/images/banks/${acc.bank.toLowerCase()}.png`} alt={acc.bank} className="w-8 h-auto mr-2" />
                                    <span className="text-gray-600">{acc.number}</span>
                                </div>
                            ))}
                            <div className="mt-2 text-gray-500 italic">
                                a.n {formData.bankAccounts[0]?.holder}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center mb-3 border-l-4 border-[#002060] pl-2">
                            <span className="text-xs font-bold text-[#002060]">Kontak</span>
                        </div>
                        <div className="text-[10px] space-y-2 text-gray-600">
                            <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-2" /> {formData.businessPhone}
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-2" /> {formData.businessEmail}
                            </div>
                            <div className="flex items-center">
                                <Globe className="w-3 h-3 mr-2" /> {formData.businessWebsite}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-[8px] text-gray-400 text-center">
                    Waktu cetak: {new Date().toLocaleString('id-ID')} • Invoice ini dibuat secara otomatis oleh website ValproAdminPanel.
                </div>
            </div>

         </div>
    </div>
  );
};

export default InvoicePreview;