import {
  FileText,
  Mail,
  CheckCircle,
  DollarSign,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  Eye,
  CreditCard,
  User,
  Phone,
  Mail as MailIcon,
  Globe,
  Save,
  MessageSquare,
  Edit,
  Search,
  Printer
} from "lucide-react";

// --- Constants & Types ---

export const PAYMENT_TERMS = [
  { value: "net-30", label: "Net 30 Hari", days: 30 },
  { value: "net-15", label: "Net 15 Hari", days: 15 },
  { value: "net-7", label: "Net 7 Hari", days: 7 },
  { value: "due-on-receipt", label: "Jatuh Tempo Saat Diterima", days: 0 },
  { value: "custom", label: "Custom", days: null },
];

export const INVOICE_STATUSES = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-gray-100 text-gray-800",
    statusColor: "#6b7280",
    icon: FileText,
  },
  {
    value: "sent",
    label: "Terkirim",
    color: "bg-blue-100 text-blue-800",
    statusColor: "#2563eb",
    icon: Mail,
  },
  {
    value: "paid",
    label: "LUNAS",
    color: "bg-green-100 text-green-800",
    statusColor: "#00b050", // Valpro Green
    icon: CheckCircle,
  },
  {
    value: "partial",
    label: "Dibayar Sebagian",
    color: "bg-orange-100 text-orange-800",
    statusColor: "#f97316",
    icon: DollarSign,
  },
  {
    value: "overdue",
    label: "Terlambat",
    color: "bg-red-100 text-red-800",
    statusColor: "#dc2626",
    icon: AlertCircle,
  },
  {
    value: "cancelled",
    label: "Dibatalkan",
    color: "bg-gray-100 text-gray-800",
    statusColor: "#6b7280",
    icon: XCircle,
  },
];

export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Transfer Bank" },
  { value: "cash", label: "Tunai" },
  { value: "credit_card", label: "Kartu Kredit" },
  { value: "e_wallet", label: "E-Wallet" },
  { value: "check", label: "Cek" },
  { value: "other", label: "Lainnya" },
];