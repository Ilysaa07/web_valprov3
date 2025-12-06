"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from 'sweetalert2';
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

import InvoiceForm from "./InvoiceForm";
import InvoiceHistory from "./InvoiceHistory";
import { PAYMENT_TERMS, INVOICE_STATUSES, PAYMENT_METHODS } from "./InvoiceConstants";
import { formatNumber, parseNumber, validateTerminAmount } from "./InvoiceHelpers";

const InvoiceGenerator = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState("create");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "net-30",
    customTerms: "",

    // Client Information
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",

    // Business Information (Defaults to Valpro based on image)
    businessName: "PT. VALPRO INTER TECH",
    businessSubtitle: "Business Entity Partner",
    businessEmail: "mail@valprointertech.com",
    businessPhone: "081399710085",
    businessWebsite: "www.valprointertech.com",
    businessAddress: "JL. Raya Gading Tutuka No.175B, Soreang Kab.Bandung\nJawa Barat Indonesia",

    // Bank Details
    bankAccounts: [
      { id: 1, bank: "BRI", number: "2105 0100 0365 563", holder: "PT Valpro Inter Tech" },
      { id: 2, bank: "BCA", number: "4373249575", holder: "PT Valpro Inter Tech" }
    ],

    // Items
    items: [
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        subItems: [],
      },
    ],

    // Financial
    subtotal: 0,
    discountType: "percentage",
    discountValue: 0,
    discountAmount: 0,
    taxType: "percentage",
    taxValue: 0,
    taxAmount: 0,
    total: 0,

    // Termin Payment Tracking
    termins: [], // { id, date, amountType: 'fixed'|'percentage', value: 0, calculatedAmount: 0, method }
    totalTerminPaid: 0,
    remainingAmount: 0,

    // Status & Notes
    status: "draft",
    notes: "",
    internalNotes: "",

    // Metadata
    createdAt: null,
    updatedAt: null,
    userId: null,
  });

  // --- Effects ---

  useEffect(() => {
    if (auth.currentUser) {
      loadInvoices();
    }
  }, []);

  // Calculate totals using useMemo to prevent infinite loop
  const calculatedTotals = useMemo(() => {
    // 1) Hitung subtotal items
    const subtotal = (formData.items || []).reduce((sum, item) => {
      const mainAmount = (item.quantity || 0) * (item.unitPrice || 0);
      const subItemsAmount = (item.subItems || []).reduce((subSum, subItem) => {
        return subSum + ((subItem.unitPrice || 0) * (subItem.quantity || 1));
      }, 0);
      return sum + mainAmount + subItemsAmount;
    }, 0);

    // 2) Hitung Diskon
    let discountAmount = 0;
    if (formData.discountType === "percentage") {
      discountAmount = (subtotal * (formData.discountValue || 0)) / 100;
    } else {
      discountAmount = formData.discountValue || 0;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // 3) Hitung Pajak
    let taxAmount = 0;
    if (formData.taxType === "percentage") {
      taxAmount = (afterDiscount * (formData.taxValue || 0)) / 100;
    } else {
      taxAmount = formData.taxValue || 0;
    }
    const total = Math.max(0, afterDiscount + taxAmount);

    // 4) Hitung Termin — Update the main termins array with calculatedAmount
    const updatedTermins = (formData.termins || []).map((t) => {
      let calc = 0;
      if (t.amountType === "percentage") {
        calc = (Number(t.value || 0) / 100) * total;
      } else {
        calc = Number(t.value || 0);
      }
      return { ...t, calculatedAmount: Math.round(calc) };
    });

    const totalTerminPaid = updatedTermins.reduce((s, t) => s + (t.calculatedAmount || 0), 0);
    const remainingAmount = Math.max(0, total - totalTerminPaid);

    // 5) Auto Status
    let newStatus = formData.status;
    if (formData.status !== "cancelled") {
      if (remainingAmount <= 0 && total > 0) newStatus = "paid";
      else if (totalTerminPaid > 0) newStatus = "partial";
      else if (formData.dueDate && new Date(formData.dueDate) < new Date()) newStatus = "overdue";
    }

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
      termins: updatedTermins,
      totalTerminPaid,
      remainingAmount,
      status: newStatus,
      // item.amount & subItem.amount diupdate
      items: (formData.items || []).map((item) => {
        const subItemsVal = (item.subItems || []).reduce((s, si) => s + ((si.quantity||1)*(si.unitPrice||0)), 0);
        return {
          ...item,
          amount: ((item.quantity || 0) * (item.unitPrice || 0)) + subItemsVal,
          subItems: (item.subItems || []).map((subItem) => ({
            ...subItem,
            amount: (subItem.quantity || 1) * (subItem.unitPrice || 0)
          }))
        };
      }),
    };
  }, [JSON.stringify(formData.items), formData.discountType, formData.discountValue, formData.taxType, formData.taxValue, JSON.stringify(formData.termins), formData.status, formData.dueDate]);

  // Auto-update dueDate
  useEffect(() => {
    if (
      formData.paymentTerms &&
      formData.paymentTerms !== "custom" &&
      formData.issueDate &&
      !formData.dueDate
    ) {
      const term = PAYMENT_TERMS.find((t) => t.value === formData.paymentTerms);
      if (term && term.days !== null) {
        const issue = new Date(formData.issueDate);
        const due = new Date(issue);
        due.setDate(due.getDate() + term.days);
        setFormData((prev) => ({
          ...prev,
          dueDate: due.toISOString().split("T")[0],
        }));
      }
    }
  }, [formData.paymentTerms, formData.issueDate]);

  // --- Logic Functions ---

  const loadInvoices = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "invoices"),
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const loadedInvoices = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedInvoices.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000)
            : null,
        });
      });

      loadedInvoices.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
      });

      setInvoices(loadedInvoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memuat data invoice: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      });
    }
    setLoading(false);
  };

  const generateInvoiceNumber = () => {
    // Format: INV-YYYYMMDD-NNNN
    const selectedDate = formData.issueDate ? new Date(formData.issueDate) : new Date();
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const datePrefix = `${year}${month}${day}`;

    // Find highest number for this date
    let highestNum = 0;
    invoices.forEach((inv) => {
      if (!inv.invoiceNumber) return;
      const match = inv.invoiceNumber.match(/^INV-\d{8}-(\d{4})$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > highestNum) highestNum = num;
      }
    });

    return `INV-${datePrefix}-${String(highestNum + 1).padStart(4, "0")}`;
  };

  // Now use a separate function to update formData with calculated values
  const updateFormDataWithCalculatedValues = (prevFormData) => {
    // 1) Hitung subtotal items
    const subtotal = (prevFormData.items || []).reduce((sum, item) => {
      const mainAmount = (item.quantity || 0) * (item.unitPrice || 0);
      const subItemsAmount = (item.subItems || []).reduce((subSum, subItem) => {
        return subSum + ((subItem.unitPrice || 0) * (subItem.quantity || 1));
      }, 0);
      return sum + mainAmount + subItemsAmount;
    }, 0);

    // 2) Hitung Diskon
    let discountAmount = 0;
    if (prevFormData.discountType === "percentage") {
      discountAmount = (subtotal * (prevFormData.discountValue || 0)) / 100;
    } else {
      discountAmount = prevFormData.discountValue || 0;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // 3) Hitung Pajak
    let taxAmount = 0;
    if (prevFormData.taxType === "percentage") {
      taxAmount = (afterDiscount * (prevFormData.taxValue || 0)) / 100;
    } else {
      taxAmount = prevFormData.taxValue || 0;
    }
    const total = Math.max(0, afterDiscount + taxAmount);

    // 4) Hitung Termin — Update the main termins array with calculatedAmount
    const updatedTermins = (prevFormData.termins || []).map((t) => {
      let calc = 0;
      if (t.amountType === "percentage") {
        calc = (Number(t.value || 0) / 100) * total;
      } else {
        calc = Number(t.value || 0);
      }
      return { ...t, calculatedAmount: Math.round(calc) };
    });

    const totalTerminPaid = updatedTermins.reduce((s, t) => s + (t.calculatedAmount || 0), 0);
    const remainingAmount = Math.max(0, total - totalTerminPaid);

    // 5) Auto Status
    let newStatus = prevFormData.status;
    if (prevFormData.status !== "cancelled") {
      if (remainingAmount <= 0 && total > 0) newStatus = "paid";
      else if (totalTerminPaid > 0) newStatus = "partial";
      else if (prevFormData.dueDate && new Date(prevFormData.dueDate) < new Date()) newStatus = "overdue";
    }

    return {
      ...prevFormData,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      termins: updatedTermins, // Use updated termins instead of having separate terminsCalculated
      totalTerminPaid,
      remainingAmount,
      status: newStatus,

      // item.amount & subItem.amount diupdate
      items: (prevFormData.items || []).map((item) => {
        const subItemsVal = (item.subItems || []).reduce((s, si) => s + ((si.quantity||1)*(si.unitPrice||0)), 0);
        return {
          ...item,
          amount: ((item.quantity || 0) * (item.unitPrice || 0)) + subItemsVal,
          subItems: (item.subItems || []).map((subItem) => ({
            ...subItem,
            amount: (subItem.quantity || 1) * (subItem.unitPrice || 0)
          }))
        };
      }),
    };
  };

  // --- PDF Generation ---

  const generatePDFBlob = async () => {
    // Gunakan data dengan perhitungan terbaru
    const dataToUse = {
      ...formData,
      ...calculatedTotals
    };

    const statusObj = INVOICE_STATUSES.find((s) => s.value === dataToUse.status) || INVOICE_STATUSES[0];
    const statusLabel = statusObj.label.toUpperCase();
    const statusColor = statusObj.statusColor; // e.g. #00b050

    // Format Currency
    const fmtMoney = (amount) =>
        amount.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // Format Date
    const fmtDate = (dateStr) => {
        if(!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    // Build Items Rows
    const itemsHtml = dataToUse.items
      .filter((item) => item.description)
      .map((item) => {
        const subItemsHtml = (item.subItems || [])
          .filter((sub) => sub.description)
          .map((sub) => `
            <div style="padding-left: 12px; margin-top: 4px; font-size: 10px; color: #4b5563; display: flex; justify-content: space-between; align-items: center;">
              <span>• ${sub.description} ${sub.quantity > 1 ? `(${sub.quantity}x)` : ''}</span>
              ${sub.unitPrice > 0 ? `<span style="color: #9ca3af;">Rp ${(sub.unitPrice * sub.quantity).toLocaleString("id-ID")}</span>` : ''}
            </div>
          `).join("");

        return `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 12px; vertical-align: top;">
              <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.description}</div>
              ${subItemsHtml}
            </td>
            <td style="padding: 12px 12px; text-align: center; vertical-align: top;">${item.quantity || 0}</td>
            <td style="padding: 12px 12px; text-align: right; vertical-align: top;">Rp ${fmtMoney(item.unitPrice || 0)}</td>
            <td style="padding: 12px 12px; text-align: right; font-weight: 500; vertical-align: top;">Rp ${fmtMoney(item.amount || 0)}</td>
          </tr>
        `;
      }).join("");

    // Build Termin Rows for Summary
const terminRows = dataToUse.termins.map((termin, idx) => {
  const calc = termin.calculatedAmount || 0;

  return `
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 10px; color: #6b7280;">
      <span>Pembayaran ${idx + 1} (${fmtDate(termin.date)})${termin.amountType === 'percentage' ? ` - ${termin.value}%` : ''}</span>
      <span style="font-weight: 600; color: #059669;">Rp. ${fmtMoney(calc)}</span>
    </div>
  `;
}).join("");


    return `
      <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Invoice ${dataToUse.invoiceNumber}</title>
  <style>
    @page { size: A4; margin: 0; }
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 12px; 
      color: #374151; 
      margin: 0; 
      padding: 0; 
      background: #fff; 
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact;
    }
    .container { 
      width: 210mm; 
      min-height: 297mm; 
      padding: 15mm 20mm; 
      margin: 0 auto; 
      box-sizing: border-box; 
      position: relative; 
    }

    /* Watermark */
    .watermark-container { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      z-index: 0; 
      pointer-events: none; 
      opacity: 0.1; 
    }
    .watermark-container img { 
      width: 520px; 
      display: block; 
    }

    /* LUNAS Overlay - Sama seperti watermark */
    .lunas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      pointer-events: none;
    }
    .lunas-overlay span {
      font-size: 150px;
      font-weight: 900;
      color: #18a558;
      opacity: 0.15;
      letter-spacing: 20px;
      text-transform: uppercase;
      font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
      transform: rotate(-25deg);
      white-space: nowrap;
    }

    /* Header */
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 32px; 
      position: relative; 
      z-index: 10; 
    }
    .header-left { 
      display: flex; 
      flex-direction: column; 
      justify-content: flex-start; 
    }
    .header-right { 
      display: flex; 
      flex-direction: column; 
      align-items: flex-end; 
      justify-content: flex-start; 
    }
    .company-name { 
      font-size: 26px; 
      font-weight: bold; 
      color: #002060; 
      line-height: 26px;
      margin: 0 0 6px 0;
    }
    .company-sub { 
      font-size: 12px; 
      font-weight: bold; 
      color: #4b5563; 
      line-height: 1.4;
      margin: 0 0 6px 0;
    }
    .company-address { 
      font-size: 10px; 
      color: #4b5563; 
      max-width: 280px; 
      line-height: 1.5;
      margin: 0; 
    }
    .invoice-title { 
      font-size: 29px; 
      font-weight: bold; 
      color: #002060; 
      letter-spacing: 0.05em; 
      line-height: 26px;
      margin: 0 0 15px 0;
    }
    .meta-table { 
      font-size: 12px; 
      border-collapse: collapse; 
      margin: 0;
    }
    .meta-table td { 
    padding: 2px 0;  /* Dikurangi dari 4px ke 2px */
    vertical-align: top;
    line-height: 1.4;  /* Dikurangi dari 1.4 ke 1.3 */
    }
    .meta-label { 
      color: #6b7280; 
      padding-right: 16px; 
      text-align: left; 
      width: 100px;
      white-space: nowrap;
    }
    .meta-value { 
      font-weight: bold; 
      text-align: right; 
      color: #002060; 
    }
    .status-text { 
      color: ${statusColor}; 
      font-weight: bold; 
      text-transform: uppercase; 
    }

    /* Recipient */
    .recipient-section { 
      margin-bottom: 32px; 
      margin-top: 32px; 
      position: relative; 
      z-index: 10; 
    }
    .recipient-label { 
      color: #002060; 
      font-weight: bold; 
      font-size: 14px; 
      margin-bottom: 8px; 
    }
    .recipient-name { 
      font-size: 14px; 
      font-weight: bold; 
      text-transform: uppercase; 
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .recipient-detail { 
      font-size: 12px; 
      color: #4b5563; 
      margin-top: 4px;
      line-height: 1.4;
    }

    /* Items Table */
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 32px; 
      position: relative; 
      z-index: 10; 
    }
    .items-table th { 
      background-color: #002060; 
      color: white; 
      padding: 12px; 
      font-size: 12px; 
      text-align: left; 
      font-weight: bold; 
    }
    .items-table th:nth-child(2) { 
      text-align: center; 
    }
    .items-table th:nth-child(3), 
    .items-table th:nth-child(4) { 
      text-align: right; 
    }
    .items-table td { 
      border-bottom: 1px solid #e5e7eb; 
      padding: 12px; 
      font-size: 12px; 
      vertical-align: top;
      line-height: 1.4;
    }
    .items-table td:nth-child(2) { 
      text-align: center; 
    }
    .items-table td:nth-child(3), 
    .items-table td:nth-child(4) { 
      text-align: right; 
    }

    /* Summary */
    .summary-container { 
      display: flex; 
      justify-content: flex-end; 
      margin-bottom: 32px; 
      position: relative; 
      z-index: 10; 
    }
    .summary-box { 
      width: 45%; 
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #d1d5db; 
      border-radius: 8px; 
      padding: 16px; 
      position: relative; 
      backdrop-filter: blur(2px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .summary-row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 6px; 
      font-size: 12px; 
      color: #4b5563;
      line-height: 1.4;
    }
    .summary-value { 
      font-weight: 600; 
      color: #111827; 
    }
    .divider { 
      border-bottom: 1px solid #d1d5db; 
      margin: 10px 0; 
    }
    .total-row { 
      font-size: 14px; 
      font-weight: bold; 
      color: #002060; 
      margin-top: 10px; 
    }
    .remaining-row { 
      display: flex; 
      justify-content: space-between; 
      font-size: 12px; 
      font-weight: bold; 
      color: #002060; 
      margin-top: 10px; 
      padding-top: 10px; 
      border-top: 2px solid #002060; 
    }

    /* Notes */
    .notes-section { 
      margin-bottom: 32px; 
      padding: 14px; 
      background: rgba(249, 250, 251, 0.8); 
      border-left: 4px solid #002060; 
      border-radius: 0 4px 4px 0; 
      position: relative; 
      z-index: 10; 
    }
    .notes-title { 
      font-size: 12px; 
      font-weight: bold; 
      color: #002060; 
      margin-bottom: 6px; 
    }
    .notes-content { 
      font-size: 12px; 
      color: #4b5563; 
      white-space: pre-line;
      line-height: 1.5;
    }

    /* Footer */
    .footer-container { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 20px; 
      position: relative; 
      z-index: 10;
      margin-bottom: 24px;
    }
    .footer-box { 
      border: 1px solid #d1d5db; 
      border-radius: 8px; 
      padding: 16px; 
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(2px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .footer-title { 
      display: flex; 
      align-items: center; 
      border-left: 4px solid #002060; 
      padding-left: 8px; 
      font-size: 12px; 
      font-weight: bold; 
      color: #002060; 
      margin-bottom: 12px;
      line-height: 1.4;
    }
    .footer-content { 
      font-size: 10px; 
      color: #4b5563; 
      line-height: 1.6; 
    }
    .bank-item { 
      display: flex; 
      align-items: center; 
      margin-bottom: 10px; 
    }
    .bank-logo { 
      width: 32px; 
      height: auto; 
      margin-right: 10px;
      flex-shrink: 0;
    }
    .contact-item { 
      display: flex; 
      align-items: center; 
      margin-bottom: 10px; 
    }
    .contact-icon { 
      width: 12px; 
      height: 12px; 
      margin-right: 8px; 
      color: #4b5563;
      flex-shrink: 0;
    }

    /* Print Meta */
    .print-meta { 
      margin-top: 24px; 
      font-size: 8px; 
      color: #9ca3af; 
      text-align: center; 
      position: relative; 
      z-index: 10;
      line-height: 1.4;
    }

    @media print {
      body { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      .container {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Watermark -->
    <div class="watermark-container">
      <img src="/logo.svg" alt="Logo" />
    </div>

    <!-- LUNAS Overlay - Sejajar dengan watermark -->
    ${dataToUse.status === "paid" ? `
    <div class="lunas-overlay">
      <span>LUNAS</span>
    </div>` : ''}

    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1 class="company-name">${dataToUse.businessName}</h1>
        <p class="company-sub">${dataToUse.businessSubtitle || ""}</p>
        <p class="company-address">${dataToUse.businessAddress.replace(/\n/g, '<br/>')}</p>
      </div>
      <div class="header-right">
        <h2 class="invoice-title">INVOICE</h2>
        <table class="meta-table">
          <tr>
            <td class="meta-label">No. Invoice:</td>
            <td class="meta-value">${dataToUse.invoiceNumber || "DRAFT"}</td>
          </tr>
          <tr>
            <td class="meta-label">Tanggal:</td>
            <td class="meta-value">${fmtDate(dataToUse.issueDate)}</td>
          </tr>
          <tr>
            <td class="meta-label">Jatuh Tempo:</td>
            <td class="meta-value">${fmtDate(dataToUse.dueDate)}</td>
          </tr>
          <tr>
            <td class="meta-label">Status:</td>
            <td class="meta-value status-text">${statusLabel}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Recipient -->
    <div class="recipient-section">
      <h3 class="recipient-label">Ditagihkan Kepada:</h3>
      <div class="recipient-name">${dataToUse.clientName || "NAMA KLIEN"}</div>
      <div class="recipient-detail">${dataToUse.clientAddress || ""}</div>
      ${dataToUse.clientPhone ? `<div class="recipient-detail">Telepon: ${dataToUse.clientPhone}</div>` : ""}
      ${dataToUse.clientEmail ? `<div class="recipient-detail">Email: ${dataToUse.clientEmail}</div>` : ""}
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Deskripsi</th>
          <th style="width: 10%;">Jumlah</th>
          <th style="width: 20%;">Harga Satuan</th>
          <th style="width: 20%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="summary-container">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span class="summary-value">Rp ${fmtMoney(dataToUse.subtotal)}</span>
        </div>
        ${dataToUse.taxAmount > 0 ? `
        <div class="summary-row">
          <span>Pajak (${dataToUse.taxType === 'percentage' ? dataToUse.taxValue+'%' : 'Flat'}):</span>
          <span class="summary-value">Rp ${fmtMoney(dataToUse.taxAmount)}</span>
        </div>` : ''}
        ${dataToUse.discountAmount > 0 ? `
        <div class="summary-row">
          <span>Diskon:</span>
          <span class="summary-value" style="color: #dc2626;">- Rp ${fmtMoney(dataToUse.discountAmount)}</span>
        </div>` : ''}
        <div class="summary-row total-row">
          <span>Total</span>
          <span>Rp ${fmtMoney(dataToUse.total)}</span>
        </div>
        <div class="divider"></div>
        ${terminRows}
        <div class="remaining-row">
          <span>Sisa Pembayaran</span>
          <span>Rp ${fmtMoney(dataToUse.remainingAmount)}</span>
        </div>
      </div>
    </div>

    ${dataToUse.notes ? `
    <div class="notes-section">
      <div class="notes-title">Catatan:</div>
      <div class="notes-content">${dataToUse.notes}</div>
    </div>` : ''}

    <!-- Footer Boxes -->
    <div class="footer-container">
      <div class="footer-box">
        <div class="footer-title">Detail Pembayaran</div>
        <div class="footer-content">
          ${dataToUse.bankAccounts.map(acc => `
            <div class="bank-item">
              <img src="/images/banks/${acc.bank.toLowerCase()}.png" alt="${acc.bank}" class="bank-logo" />
              <span>${acc.number}</span>
            </div>
          `).join('')}
          <div style="margin-top: 10px; font-style: italic; color: #6b7280;">
            a.n ${dataToUse.bankAccounts[0]?.holder || dataToUse.businessName}
          </div>
        </div>
      </div>

      <div class="footer-box">
        <div class="footer-title">Kontak</div>
        <div class="footer-content">
          <div class="contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
            ${dataToUse.businessPhone}
          </div>
          <div class="contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
            ${dataToUse.businessEmail}
          </div>
          <div class="contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            ${dataToUse.businessWebsite}
          </div>
        </div>
      </div>
    </div>

    <div class="print-meta">
      Waktu cetak: ${new Date().toLocaleString('id-ID')} • Invoice ini dibuat secara otomatis oleh website Valpro - InvoiceSystem.
    </div>
  </div>
</body>
</html>
    `;
  };

  const handlePrint = async () => {
      try {
          const htmlContent = await generatePDFBlob();
          const printWindow = window.open('', '', 'width=800,height=800');
          if (printWindow) {
              printWindow.document.write(htmlContent);
              printWindow.document.close();
              printWindow.focus();
              printWindow.print();
              printWindow.close();
          }
      } catch (e) {
          console.error("Print failed", e);
          alert("Gagal memproses print preview.");
      }
  };

  const openPreviewInNewWindow = async () => {
      try {
          // Use calculated data like in the PDF generation
          const dataForPreview = {
            ...formData,
            ...calculatedTotals
          };

          const htmlContent = await generatePDFBlob();

          // Format date for filename (YYYYMMDD)
          const issueDate = dataForPreview.issueDate || new Date().toISOString().split('T')[0];
          const dateFormatted = issueDate.replace(/-/g, '');

          // Format client name for filename (replace special characters)
          const clientNameFormatted = (dataForPreview.clientName || 'CUSTOMER').replace(/[^a-zA-Z0-9]/g, '_');

          // Format invoice number for filename
          const invoiceNumberFormatted = (dataForPreview.invoiceNumber || 'DRAFT').replace(/[^a-zA-Z0-9]/g, '_');

          // Create the formatted filename
          const fileName = `INVOICE_${clientNameFormatted}_${dateFormatted}_${invoiceNumberFormatted}`;

          // Modify the HTML to make it a complete preview page with proper title
          const previewHTML = htmlContent
              .replace(/<title>.*?<\/title>/, `<title>${fileName}</title>`)
              .replace('<head>', `<head><style>@media print { .no-print { display: none !important; } } .print-filename { position: absolute; top: 5px; left: 10px; font-size: 12px; color: #666; z-index: 1000; } @media print { .print-filename { display: none !important; } }</style>`)
              .replace('<body>', '<body style="background-color: #f3f4f6;">')
              .replace('</body>',
              `<script>
                // Add print and close buttons and filename display
                document.body.insertAdjacentHTML('afterbegin',
                  '<div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">' +
                  '<button onclick="window.print();" style="padding: 10px 20px; background: #1d4ed8; color: white; border: none; border-radius: 5px; margin-right: 10px; cursor: pointer;">Cetak/Print</button>' +
                  '<button onclick="window.close();" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">Tutup</button>' +
                  '</div>' +
                  '<div class="print-filename">Nama File: ${fileName}</div>'
                );
              </script>
              </body>`);

          const previewWindow = window.open('', '_blank', 'width=800,height=800');
          if (previewWindow) {
              previewWindow.document.write(previewHTML);
              previewWindow.document.close();
              previewWindow.focus();
          }
      } catch (e) {
          console.error("Preview failed", e);
          alert("Gagal membuka preview.");
      }
  };

  // --- Form Handlers ---

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        subItems: [],
      }],
    }));
  };

  const updateItem = (id, field, value) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id) => {
    if(formData.items.length === 1) return;
    setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  // Sub Items
  const addSubItem = (itemId) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? {
            ...item,
            subItems: [...(item.subItems || []), { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]
        } : item)
    }));
  };

  const updateSubItem = (itemId, subId, field, value) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? {
            ...item,
            subItems: item.subItems.map((s) => s.id === subId ? { ...s, [field]: value } : s)
        } : item)
    }));
  };

  const removeSubItem = (itemId, subId) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? {
            ...item,
            subItems: item.subItems.filter((s) => s.id !== subId)
        } : item)
    }));
  };

  // Termins
const addTermin = () => {
  setFormData(prev => ({
    ...prev,
    termins: [
      ...prev.termins,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        amountType: "fixed",
        value: 0
      }
    ]
  }));
};


const updateTermin = (id, field, value) => {
  setFormData(prev => {
    // Calculate current subtotal, discount, tax to determine the total invoice amount
    const subtotal = (prev.items || []).reduce((sum, item) => {
      const mainAmount = (item.quantity || 0) * (item.unitPrice || 0);
      const subItemsAmount = (item.subItems || []).reduce((subSum, subItem) => {
        return subSum + ((subItem.unitPrice || 0) * (subItem.quantity || 1));
      }, 0);
      return sum + mainAmount + subItemsAmount;
    }, 0);

    // Calculate discount amount
    let discountAmount = 0;
    if (prev.discountType === "percentage") {
      discountAmount = (subtotal * (prev.discountValue || 0)) / 100;
    } else {
      discountAmount = prev.discountValue || 0;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // Calculate tax amount
    let taxAmount = 0;
    if (prev.taxType === "percentage") {
      taxAmount = (afterDiscount * (prev.taxValue || 0)) / 100;
    } else {
      taxAmount = prev.taxValue || 0;
    }
    const totalInvoice = Math.max(0, afterDiscount + taxAmount);

    // Update the specific termin and check validation
    const updatedTermins = prev.termins.map(t => {
      if (t.id !== id) return t;

      if (field === "amountType") {
        return { ...t, amountType: value };
      }

      if (field === "value") {
        const newValue = t.amountType === "percentage"
          ? Number(value)
          : parseNumber(value);
        return { ...t, value: newValue };
      }

      return { ...t, [field]: value };
    });

    // Calculate the total of all termins after update
    let totalTerminValue = 0;
    for (const termin of updatedTermins) {
      if (termin.amountType === "percentage") {
        totalTerminValue += (Number(termin.value || 0) / 100) * totalInvoice;
      } else {
        totalTerminValue += Number(termin.value || 0);
      }
    }

    // If the total termin value exceeds the invoice total, show a warning
    if (totalTerminValue > totalInvoice && totalInvoice > 0) {
      Swal.fire({
        title: 'Peringatan!',
        text: `Total pembayaran termin (${formatNumber(Math.round(totalTerminValue))}) melebihi total invoice (${formatNumber(totalInvoice)}). Silakan periksa kembali jumlah termin.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      });
    }

    const updated = {
      ...prev,
      termins: updatedTermins
    };

    return updated;
  });
};


  const removeTermin = (id) => {
    setFormData(prev => ({ ...prev, termins: prev.termins.filter((t) => t.id !== id) }));
  };

  // CRUD Actions

  const deleteInvoice = async (invoiceId) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: "Apakah Anda yakin ingin menghapus invoice ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "invoices", invoiceId));
        await loadInvoices();
        Swal.fire({
          title: 'Dihapus!',
          text: 'Invoice berhasil dihapus.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10b981'
        });
      } catch (error) {
        console.error("Error deleting invoice:", error);
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus invoice: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

const editInvoice = (invoice) => {
  setEditingInvoice(invoice);

  // Helper function to clean undefined values from an object (for form compatibility)
  const cleanObject = (obj) => {
    const cleaned = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          cleaned[key] = cleanObject(obj[key]);
        } else {
          cleaned[key] = obj[key];
        }
      } else {
        // Set default values for known fields that might be undefined
        switch(key) {
          case 'clientName':
          case 'clientEmail':
          case 'clientPhone':
          case 'clientAddress':
          case 'invoiceNumber':
          case 'notes':
          case 'internalNotes':
            cleaned[key] = '';
            break;
          case 'paymentTerms':
            cleaned[key] = 'net-30';
            break;
          case 'status':
            cleaned[key] = 'draft';
            break;
          default:
            cleaned[key] = obj[key]; // Keep as undefined if not known
        }
      }
    }
    return cleaned;
  };

  setFormData({
    ...formData,
    ...cleanObject(invoice),

    // Handle Backward Compatibility untuk termins
    termins: (invoice.termins || invoice.payments || []).map(t => ({
      id: t.id || Date.now() + Math.random(),
      date: t.date || new Date().toISOString().split("T")[0],
      amountType: t.amountType || 'fixed',
      value: Number(t.value || t.amount || 0),
      method: t.method || "",
      calculatedAmount: 0 // Will be calculated
    })),
  });

  setActiveTab("create");
};

  const resetForm = () => {
    setEditingInvoice(null);
    setFormData({
        invoiceNumber: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        paymentTerms: "net-30",
        customTerms: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        businessName: "PT. VALPRO INTER TECH",
        businessSubtitle: "Business Entity Partner",
        businessEmail: "mail@valprointertech.com",
        businessPhone: "081399710085",
        businessWebsite: "www.valprointertech.com",
        businessAddress: "JL. Raya Gading Tutuka No.175B, Soreang Kab.Bandung\nJawa Barat Indonesia",
        bankAccounts: [
            { id: 1, bank: "BRI", number: "2105 0100 0365 563", holder: "PT Valpro Inter Tech" },
            { id: 2, bank: "BCA", number: "4373249575", holder: "PT Valpro Inter Tech" }
        ],
        items: [{
            id: Date.now(),
            description: "",
            quantity: 1,
            unitPrice: 0,
            amount: 0,
            subItems: [],
        }],
        subtotal: 0,
        discountType: "percentage",
        discountValue: 0,
        discountAmount: 0,
        taxType: "percentage",
        taxValue: 0,
        taxAmount: 0,
        total: 0,
        termins: [],
        totalTerminPaid: 0,
        remainingAmount: 0,
        status: "draft",
        notes: "",
        internalNotes: "",
        createdAt: null,
        updatedAt: null,
        userId: null,
    });
  };

  const saveInvoice = async () => {
    if (!auth.currentUser) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Silakan login terlebih dahulu.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    if (!formData.clientName) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Nama klien wajib diisi.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Recalculate values to ensure they are accurate before saving
    // This is similar to the updateFormDataWithCalculatedValues function but only for calculation
    const subtotal = (formData.items || []).reduce((sum, item) => {
      const mainAmount = (item.quantity || 0) * (item.unitPrice || 0);
      const subItemsAmount = (item.subItems || []).reduce((subSum, subItem) => {
        return subSum + ((subItem.unitPrice || 0) * (subItem.quantity || 1));
      }, 0);
      return sum + mainAmount + subItemsAmount;
    }, 0);

    // Calculate discount amount
    let discountAmount = 0;
    if (formData.discountType === "percentage") {
      discountAmount = (subtotal * (formData.discountValue || 0)) / 100;
    } else {
      discountAmount = formData.discountValue || 0;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // Calculate tax amount
    let taxAmount = 0;
    if (formData.taxType === "percentage") {
      taxAmount = (afterDiscount * (formData.taxValue || 0)) / 100;
    } else {
      taxAmount = formData.taxValue || 0;
    }
    const totalInvoice = Math.max(0, afterDiscount + taxAmount);

    // Calculate updated termins with calculatedAmount
    const updatedTerminsForSave = (formData.termins || []).map((t) => {
      let calc = 0;
      if (t.amountType === "percentage") {
        calc = (Number(t.value || 0) / 100) * totalInvoice;
      } else {
        calc = Number(t.value || 0);
      }
      return { ...t, calculatedAmount: Math.round(calc) };
    });

    // Calculate total termin paid and remaining amount
    const totalTerminPaidForSave = updatedTerminsForSave.reduce((s, t) => s + (t.calculatedAmount || 0), 0);
    const remainingAmountForSave = Math.max(0, totalInvoice - totalTerminPaidForSave);

    // Auto-determine status based on calculated values
    let newStatusForSave = formData.status;
    if (formData.status !== "cancelled") {
      if (remainingAmountForSave <= 0 && totalInvoice > 0) newStatusForSave = "paid";
      else if (totalTerminPaidForSave > 0) newStatusForSave = "partial";
      else if (formData.dueDate && new Date(formData.dueDate) < new Date()) newStatusForSave = "overdue";
    }

    // Check if termins exceed the total invoice amount
    let totalTerminValue = 0;
    for (const termin of updatedTerminsForSave) {
      if (termin.amountType === "percentage") {
        totalTerminValue += (Number(termin.value || 0) / 100) * totalInvoice;
      } else {
        totalTerminValue += Number(termin.value || 0);
      }
    }

    if (totalTerminValue > totalInvoice && totalInvoice > 0) {
      const result = await Swal.fire({
        title: 'Peringatan!',
        text: `Total pembayaran termin (${formatNumber(Math.round(totalTerminValue))}) melebihi total invoice (${formatNumber(totalInvoice)}). Apakah Anda yakin ingin menyimpan invoice?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Ya, Simpan!',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setSaving(true);
    try {
        const invNum = formData.invoiceNumber || generateInvoiceNumber();

        // Explicitly construct the payload to avoid undefined values
        const payload = {
            // Basic info
            invoiceNumber: invNum,
            issueDate: formData.issueDate || new Date().toISOString().split("T")[0],
            dueDate: formData.dueDate || "",
            paymentTerms: formData.paymentTerms || "net-30",
            customTerms: formData.customTerms || "",

            // Client info
            clientName: formData.clientName || "",
            clientEmail: formData.clientEmail || "",
            clientPhone: formData.clientPhone || "",
            clientAddress: formData.clientAddress || "",

            // Business info
            businessName: formData.businessName || "PT. VALPRO INTER TECH",
            businessSubtitle: formData.businessSubtitle || "Business Entity Partner",
            businessEmail: formData.businessEmail || "mail@valprointertech.com",
            businessPhone: formData.businessPhone || "081399710085",
            businessWebsite: formData.businessWebsite || "www.valprointertech.com",
            businessAddress: formData.businessAddress || "JL. Raya Gading Tutuka No.175B, Soreang Kab.Bandung\nJawa Barat Indonesia",

            // Bank Accounts
            bankAccounts: Array.isArray(formData.bankAccounts) ? formData.bankAccounts : [
                { id: 1, bank: "BRI", number: "2105 0100 0365 563", holder: "PT Valpro Inter Tech" },
                { id: 2, bank: "BCA", number: "4373249575", holder: "PT Valpro Inter Tech" }
            ],

            // Items - explicitly construct without undefined values
            items: Array.isArray(formData.items)
                ? formData.items.map(item => ({
                    id: item.id || Date.now(),
                    description: item.description || "",
                    quantity: typeof item.quantity === 'number' ? item.quantity : 1,
                    unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
                    amount: typeof item.amount === 'number' ? item.amount : 0,
                    subItems: Array.isArray(item.subItems)
                        ? item.subItems.map(subItem => ({
                            id: subItem.id || Date.now(),
                            description: subItem.description || "",
                            quantity: typeof subItem.quantity === 'number' ? subItem.quantity : 1,
                            unitPrice: typeof subItem.unitPrice === 'number' ? subItem.unitPrice : 0,
                            amount: typeof subItem.amount === 'number' ? subItem.amount : 0
                        }))
                        : []
                  }))
                : [{
                    id: Date.now(),
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    amount: 0,
                    subItems: [],
                }],

            // Financial - use recalculated values to ensure accuracy
            subtotal: subtotal,
            discountType: formData.discountType || "percentage",
            discountValue: typeof formData.discountValue === 'number' ? formData.discountValue : 0,
            discountAmount: discountAmount,
            taxType: formData.taxType || "percentage",
            taxValue: typeof formData.taxValue === 'number' ? formData.taxValue : 0,
            taxAmount: taxAmount,
            total: totalInvoice,

            // Termin - explicitly construct with recalculated amounts
            termins: Array.isArray(updatedTerminsForSave)
                ? updatedTerminsForSave.map(termin => ({
                    id: termin.id || Date.now(),
                    date: termin.date || new Date().toISOString().split("T")[0],
                    amountType: termin.amountType || "fixed",
                    value: typeof termin.value === 'number' ? termin.value : 0,
                    calculatedAmount: typeof termin.calculatedAmount === 'number' ? termin.calculatedAmount : 0,
                    method: termin.method || ""
                }))
                : [],
            totalTerminPaid: totalTerminPaidForSave,
            remainingAmount: remainingAmountForSave,

            // Status & Notes - use recalculated status
            status: newStatusForSave,
            notes: formData.notes || "",
            internalNotes: formData.internalNotes || "",

            // Metadata
            createdAt: editingInvoice ? (formData.createdAt instanceof Date ? formData.createdAt : new Date()) : new Date(),
            updatedAt: new Date(),
            userId: auth.currentUser.uid
        };

        if (editingInvoice) {
            await updateDoc(doc(db, "invoices", editingInvoice.id), payload);
        } else {
            await addDoc(collection(db, "invoices"), payload);
        }

        await loadInvoices();
        setActiveTab("history");
        Swal.fire({
          title: 'Sukses!',
          text: 'Invoice berhasil disimpan.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10b981'
        });
    } catch (e) {
        console.error(e);
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menyimpan: ' + e.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6'
        });
    }
    setSaving(false);
  };

  // --- Render ---

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoice System</h1>
          <p className="text-gray-500 mt-1">PT. VALPRO INTER TECH Management</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => { resetForm(); setActiveTab("create"); }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "create" ? "bg-blue-900 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "history" ? "bg-blue-900 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
          >
            Riwayat
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <InvoiceForm
            formData={{
              ...formData,
              ...calculatedTotals
            }}
            setFormData={setFormData}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            saving={saving}
            saveInvoice={saveInvoice}
            editingInvoice={editingInvoice}
            openPreviewInNewWindow={openPreviewInNewWindow}
            addTermin={addTermin}
            updateTermin={updateTermin}
            removeTermin={removeTermin}
            handleInputChange={handleInputChange}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            addSubItem={addSubItem}
            updateSubItem={updateSubItem}
            removeSubItem={removeSubItem}
            generateInvoiceNumber={generateInvoiceNumber}
          />
        </div>
      )}

      {activeTab === "history" && (
        <InvoiceHistory
          invoices={invoices}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          editInvoice={editInvoice}
          deleteInvoice={deleteInvoice}
        />
      )}
    </div>
  );
};

export default InvoiceGenerator;