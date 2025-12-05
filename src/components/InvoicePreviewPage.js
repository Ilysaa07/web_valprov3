import { INVOICE_STATUSES } from "./InvoiceConstants";
import { formatNumber } from "./InvoiceHelpers";

const InvoicePreviewPage = ({ formData, handlePrint }) => {
  // Format Date
  const fmtDate = (dateStr) => {
      if(!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const statusObj = INVOICE_STATUSES.find((s) => s.value === formData.status) || INVOICE_STATUSES[0];
  const statusColor = statusObj.statusColor; // e.g. #00b050

  return (
    <html>
      <head>
        <title>Invoice Preview - {formData.invoiceNumber || "Draft"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f3f4f6;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #1d4ed8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
          }
          .close-button {
            position: fixed;
            top: 20px;
            right: 120px;
            padding: 10px 20px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
          }
        `}</style>
      </head>
      <body>
        <button className="print-button" onClick={handlePrint}>Cetak/Print</button>
        <button className="close-button" onClick={() => window.close()}>Tutup</button>
        
        <div className="container">
          {/* LIVE PREVIEW CANVAS - MATCHING THE IMAGE EXACTLY */}
          <div style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm', position: 'relative' }}>
             
             {/* Watermark */}
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.1, zIndex: 0 }}>
                 <img src="/logo.svg" style={{ width: '520px', display: 'block' }} alt="logo" />
             </div>

             {/* Header */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
                 <div style={{ display: 'flex', gap: '16px' }}>
                     <div>
                         <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#002060', lineHeight: 1, marginBottom: '4px' }}>{formData.businessName}</h1>
                         <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>{formData.businessSubtitle}</p>
                         <p style={{ fontSize: '10px', color: '#4b5563', maxWidth: '250px', lineHeight: '1.25', whiteSpace: 'pre-line' }}>
                             {formData.businessAddress}
                         </p>
                     </div>
                 </div>
                 <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: '4px' }}>
                     <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#002060', letterSpacing: '0.05em', marginBottom: '8px' }}>INVOICE</h2>
                     <table style={{ fontSize: '12px', borderCollapse: 'collapse', marginLeft: 'auto' }}>
                         <tbody>
                             <tr>
                                 <td style={{ color: '#6b7280', paddingRight: '16px', textAlign: 'left', width: '100px' }}>No. Invoice:</td>
                                 <td style={{ fontWeight: 'bold', textAlign: 'right', color: '#002060' }}>{formData.invoiceNumber || "DRAFT"}</td>
                             </tr>
                             <tr>
                                 <td style={{ color: '#6b7280', paddingRight: '16px', textAlign: 'left' }}>Tanggal:</td>
                                 <td style={{ fontWeight: 'bold', textAlign: 'right', color: '#002060' }}>
                                     {formData.issueDate ? new Date(formData.issueDate).toLocaleDateString("id-ID", {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                                 </td>
                             </tr>
                             <tr>
                                 <td style={{ color: '#6b7280', paddingRight: '16px', textAlign: 'left' }}>Jatuh Tempo:</td>
                                 <td style={{ fontWeight: 'bold', textAlign: 'right', color: '#002060' }}>
                                     {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString("id-ID", {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                                 </td>
                             </tr>
                             <tr>
                                 <td style={{ color: '#6b7280', paddingRight: '16px', textAlign: 'left' }}>Status:</td>
                                 <td style={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right', color: '${statusColor}' }}>
                                     {(INVOICE_STATUSES.find(s=>s.value===formData.status)||INVOICE_STATUSES[0]).label}
                                 </td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
             </div>

             {/* Billed To */}
             <div style={{ marginBottom: '32px', marginTop: '32px', position: 'relative', zIndex: 10 }}>
                 <h3 style={{ color: '#002060', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Ditagihkan Kepada:</h3>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>{formData.clientName || "NAMA KLIEN"}</div>
                 <div style={{ fontSize: '12px', color: '#4b5563' }}>
                     <div>{formData.clientAddress}</div>
                     {formData.clientPhone && <div>Telepon: {formData.clientPhone}</div>}
                     {formData.clientEmail && <div>Email: {formData.clientEmail}</div>}
                 </div>
             </div>

             {/* Table */}
             <div style={{ marginBottom: '32px', position: 'relative', zIndex: 10 }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead>
                         <tr style={{ backgroundColor: '#002060', color: 'white', fontSize: '12px' }}>
                             <th style={{ padding: '12px', textAlign: 'left', width: '50%' }}>Deskripsi</th>
                             <th style={{ padding: '12px', textAlign: 'center' }}>Jumlah</th>
                             <th style={{ padding: '12px', textAlign: 'right' }}>Harga Satuan</th>
                             <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                         </tr>
                     </thead>
                     <tbody style={{ fontSize: '12px', color: '#4b5563' }}>
                         {formData.items.map((item) => (
                             <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                 <td style={{ padding: '12px', verticalAlign: 'top' }}>
                                     <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{item.description}</div>
                                     {item.subItems?.map(sub => (
                                         <div key={sub.id} style={{ paddingLeft: '12px', marginTop: '4px', fontSize: '10px', color: '#4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                             <span>
                                                 <span style={{ marginRight: '4px' }}>•</span>
                                                 {sub.description} {sub.quantity > 1 ? `(${sub.quantity}x)` : ''}
                                             </span>
                                             {sub.unitPrice > 0 && (
                                                 <span style={{ color: '#9ca3af' }}>Rp {(sub.unitPrice * sub.quantity).toLocaleString("id-ID")}</span>
                                             )}
                                         </div>
                                     ))}
                                 </td>
                                 <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity}</td>
                                 <td style={{ padding: '12px', textAlign: 'right', verticalAlign: 'top' }}>Rp {item.unitPrice.toLocaleString("id-ID")}</td>
                                 <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', verticalAlign: 'top' }}>Rp {item.amount.toLocaleString("id-ID")}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>

             {/* Summary & Footer Layout */}
             <div style={{ position: 'relative', zIndex: 10 }}>
                 {/* Summary Box Right Aligned */}
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
                     <div style={{ width: '45%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                         <div style={{ fontSize: '12px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#4b5563' }}>
                                 <span>Subtotal:</span>
                                 <span style={{ fontWeight: '600', color: '#111827' }}>Rp {formData.subtotal.toLocaleString("id-ID")}</span>
                             </div>
                             {formData.taxAmount > 0 && (
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#4b5563' }}>
                                     <span>Pajak (0%):</span>
                                     <span style={{ fontWeight: '600', color: '#111827' }}>Rp {formData.taxAmount.toLocaleString("id-ID")}</span>
                                 </div>
                             )}
                             {formData.discountAmount > 0 && (
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#4b5563' }}>
                                     <span>Diskon:</span>
                                     <span style={{ fontWeight: '600', color: '#dc2626' }}>- Rp {formData.discountAmount.toLocaleString("id-ID")}</span>
                                 </div>
                             )}
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#002060', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                                 <span>Total</span>
                                 <span>Rp. {formData.total.toLocaleString("id-ID")}</span>
                             </div>
                             
                             {/* Termin History directly in summary */}
                             {formData.termins.length > 0 && (
                                 <div style={{ paddingTop: '8px', marginTop: '8px', borderTop: '1px dashed #e5e7eb' }}>
                                     {formData.termins.map((t, i) => (
                                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#4b5563', marginBottom: '4px' }}>
                                             <span>Pembayaran {i+1} ({new Date(t.date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})})</span>
                                             <span>Rp. {t.calculatedAmount.toLocaleString("id-ID")}</span>
                                         </div>
                                     ))}
                                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#002060', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                                         <span>Sisa Pembayaran</span>
                                         <span>Rp. {formData.remainingAmount.toLocaleString("id-ID")}</span>
                                     </div>
                                 </div>
                             )}
                         </div>

                         {/* LUNAS overlay on preview (Style 2 - green bold large) */}
                         {formData.status === "paid" && (
                           <div style={{
                             position: 'absolute',
                             top: '50%',
                             left: '50%',
                             transform: 'translate(-50%, -50%) rotate(-12deg)',
                             fontSize: '64px',
                             fontWeight: 900,
                             color: '#18a558',
                             opacity: 0.18,
                             letterSpacing: '6px',
                             pointerEvents: 'none'
                           }}>
                             LUNAS
                           </div>
                         )}
                     </div>
                 </div>

                 {formData.notes && (
                     <div style={{ marginBottom: '32px', padding: '12px', backgroundColor: '#f9fafb', borderLeft: '4px solid #002060', borderRadius: '0 4px 4px 0', position: 'relative', zIndex: 10 }}>
                         <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#002060', marginBottom: '4px' }}>Catatan:</div>
                         <div style={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line' }}>{formData.notes}</div>
                     </div>
                 )}

                 {/* Footer Info Boxes */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', position: 'relative', zIndex: 10 }}>
                     {/* Bank Details */}
                     <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                         <div style={{ display: 'flex', alignItems: 'center', borderLeft: '4px solid #002060', paddingLeft: '8px', marginBottom: '12px' }}>
                             <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#002060' }}>Detail Pembayaran</span>
                         </div>
                         <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.5' }}>
                             {formData.bankAccounts.map(acc => (
                                 <div key={acc.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                     <img src={`/images/banks/${acc.bank.toLowerCase()}.png`} alt={acc.bank} style={{ width: '32px', height: 'auto', marginRight: '8px' }} />
                                     <span>{acc.number}</span>
                                 </div>
                             ))}
                             <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#6b7280' }}>
                                 a.n {formData.bankAccounts[0]?.holder}
                             </div>
                         </div>
                     </div>

                     {/* Contact Info */}
                     <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                         <div style={{ display: 'flex', alignItems: 'center', borderLeft: '4px solid #002060', paddingLeft: '8px', marginBottom: '12px' }}>
                             <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#002060' }}>Kontak</span>
                         </div>
                         <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.5' }}>
                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4b5563' }}><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg> {formData.businessPhone}
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4b5563' }}><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg> {formData.businessEmail}
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4b5563' }}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg> {formData.businessWebsite}
                             </div>
                         </div>
                     </div>
                 </div>

                 <div style={{ marginTop: '32px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '8px', color: '#9ca3af', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                     Waktu cetak: {new Date().toLocaleString('id-ID')} • Invoice ini dibuat secara otomatis oleh website ValproAdminPanel.
                 </div>
             </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default InvoicePreviewPage;