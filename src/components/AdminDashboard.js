"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Image from "next/image";
import {
  Receipt,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Bell,
  Search,
} from "lucide-react";
import InvoiceGenerator from "./InvoiceGenerator";

const AdminDashboard = ({ userEmail }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await signOut(auth);
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

  // Simple dashboard content
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Selamat Datang! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Siap mengelola invoice Anda hari ini?
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <button
              onClick={() => setActiveMenu("invoice")}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              Buat Invoice Baru
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => setActiveMenu("invoice")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-500 text-sm font-medium">Aktif</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Invoice Generator
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Buat, kelola, dan bagikan invoice dengan mudah
          </p>
          <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Mulai Sekarang →
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border opacity-75">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <span className="text-orange-500 text-sm font-medium">Segera</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Data Pelanggan
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Kelola database pelanggan dan riwayat transaksi
          </p>
          <div className="text-gray-400 text-sm">Dalam Pengembangan</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border opacity-75">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-gray-500" />
            </div>
            <span className="text-orange-500 text-sm font-medium">Segera</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Pengingat
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Notifikasi untuk invoice jatuh tempo dan pembayaran
          </p>
          <div className="text-gray-400 text-sm">Dalam Pengembangan</div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tips Menggunakan Invoice Generator
        </h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600">
              Gunakan format nomor invoice otomatis untuk menghindari duplikasi
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600">
              Tambahkan sub-item untuk detail yang lebih spesifik
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600">
              Gunakan fitur bagikan untuk mengirim invoice langsung ke klien
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3 lg:ml-0 ml-2">
                <Image
                  src="/logometa.svg"
                  alt="Valpro"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold text-gray-900">Valpro</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                title="Keluar"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <Image src="/logometa.svg" alt="Valpro" width={32} height={32} />
            <span className="text-xl font-bold text-gray-900">Valpro</span>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <button
            onClick={() => {
              setActiveMenu("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
              activeMenu === "dashboard"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </button>

          <button
            onClick={() => {
              setActiveMenu("invoice");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
              activeMenu === "invoice"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Receipt className="h-5 w-5 mr-3" />
            Invoice Generator
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {userEmail?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMenu === "dashboard" && renderDashboard()}
        {activeMenu === "invoice" && <InvoiceGenerator />}
      </main>
    </div>
  );
};

export default AdminDashboard;
