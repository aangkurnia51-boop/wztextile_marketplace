/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Mail,
  Send,
  X,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  Clock
} from "lucide-react";

interface FloatingContactWidgetProps {
  activeProfile: any;
  selectedProduct: any;
  triggerToast: (msg: string) => void;
}

export default function FloatingContactWidget({
  activeProfile,
  selectedProduct,
  triggerToast
}: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");

  // Form states for Email
  const [emailName, setEmailName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [emailPhone, setEmailPhone] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Form states for WhatsApp
  const [waTopic, setWaTopic] = useState("Kemitraan Reseller / Agen");
  const [waMessage, setWaMessage] = useState("");

  // Sync profile details if active profile changes
  useEffect(() => {
    if (activeProfile) {
      setEmailName(activeProfile.name || "");
      setEmailAddr(activeProfile.email || "");
      setEmailPhone(activeProfile.phone || "");
    } else {
      setEmailName("");
      setEmailAddr("");
      setEmailPhone("");
    }
  }, [activeProfile]);

  // Sync active product details into WhatsApp message or Email Subject/Message
  useEffect(() => {
    if (selectedProduct) {
      setEmailSubject(`Tanya Produk: ${selectedProduct.name}`);
      setEmailMessage(
        `Halo Admin WZ Textile, saya tertarik dengan produk:\n\n- Nama: ${selectedProduct.name}\n- SKU: ${selectedProduct.sku}\n- Harga: Rp ${selectedProduct.price.toLocaleString("id-ID")}\n\nMohon informasi ketersediaan stok dan cara pembelian grosir. Terima kasih!`
      );
      setWaTopic("Tanya Produk Khusus");
      setWaMessage(
        `Halo WZ Textile, saya tertarik dengan produk ${selectedProduct.name} (SKU: ${selectedProduct.sku}). Apakah stok ready?`
      );
    } else {
      // Default WhatsApp templates
      setWaMessage("Halo Admin WZ Textile, saya ingin menanyakan perihal produk sutra tenun & kemitraan reseller.");
    }
  }, [selectedProduct]);

  // Handle send email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailName.trim() || !emailMessage.trim()) {
      triggerToast("Nama pengirim dan isi pesan tidak boleh kosong!");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: emailName,
          senderEmail: emailAddr,
          phone: emailPhone,
          subject: emailSubject || "Hubungi Admin",
          message: emailMessage,
          productDetails: selectedProduct
            ? {
                id: selectedProduct.id,
                name: selectedProduct.name,
                sku: selectedProduct.sku,
                price: selectedProduct.price
              }
            : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSendSuccess(true);
        triggerToast("📧 " + data.message);
        // Clear message input but keep metadata
        setEmailMessage("");
        setTimeout(() => {
          setSendSuccess(false);
        }, 5000);
      } else {
        const err = await res.json();
        triggerToast("Gagal mengirim email: " + (err.error || "Kesalahan server"));
      }
    } catch (err) {
      console.error(err);
      triggerToast("Terjadi kesalahan koneksi saat mengirim email.");
    } finally {
      setIsSending(false);
    }
  };

  // Launch WhatsApp Chat directly
  const handleWhatsAppRedirect = () => {
    const defaultNumber = "6285320200882"; // H. Aang Kurnia
    const prefixText = `[${waTopic.toUpperCase()}]\n`;
    const formattedMessage = encodeURIComponent(`${prefixText}${waMessage}`);
    const waUrl = `https://api.whatsapp.com/send?phone=${defaultNumber}&text=${formattedMessage}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    triggerToast("Mengarahkan ke WhatsApp resmi CS WZ Textile...");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans" id="floating-contact-widget">
      {/* Floating Popover Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 text-white p-4 pb-5 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-900/40 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-lg text-emerald-950 border border-emerald-400 shadow-md">
                WZ
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-emerald-300">Hubungi WZ Textile</h3>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Owner: H. Aang Kurnia (Fast Response)
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs">
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`flex-1 py-3 text-center font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "whatsapp"
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Kilat
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-3 text-center font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "email"
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              Kirim Email Admin
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 md:p-5 overflow-y-auto max-h-[50vh] space-y-4">
            
            {/* WHATSAPP TAB PANEL */}
            {activeTab === "whatsapp" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Gunakan jalur chat instan ini untuk respon cepat perihal pesanan, kustom tenun, nego harga grosir, atau perbaikan AC / elektronik langsung ke owner.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Pilih Topik Chat:</label>
                  <select
                    value={waTopic}
                    onChange={(e) => setWaTopic(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 text-slate-800 px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  >
                    <option value="Kemitraan Reseller / Agen">Kemitraan Reseller / Agen</option>
                    <option value="Tanya Produk Khusus">Tanya Produk & Ketersediaan Stok</option>
                    <option value="Negosiasi Harga Grosir">Negosiasi Harga Grosir / Bulk</option>
                    <option value="Jasa Servis AC Caringin">Jasa Servis AC Caringin Garut</option>
                    <option value="Program Daur Ulang & Barter">Program Daur Ulang & Barter</option>
                    <option value="Keluhan / Saran Langsung">Keluhan / Saran Langsung</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Tulis Pesan Anda:</label>
                  <textarea
                    rows={4}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Tulis detail barang yang ingin Anda beli, atau ajukan pertanyaan spesifik..."
                    className="w-full text-xs p-3 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                {selectedProduct && (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between gap-2 text-[10px] font-semibold">
                    <span className="truncate">Melampirkan info: **{selectedProduct.name}**</span>
                    <button
                      onClick={() => setWaMessage("Halo Admin WZ Textile, saya ingin bertanya...")}
                      className="text-emerald-900 underline hover:no-underline font-extrabold flex-shrink-0"
                    >
                      Reset
                    </button>
                  </div>
                )}

                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white text-emerald-600" />
                  Kirim via WhatsApp
                </button>

                <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" /> Jam Kerja: 08.00 - 21.00 WIB
                </div>
              </div>
            )}

            {/* EMAIL TAB PANEL */}
            {activeTab === "email" && (
              <form onSubmit={handleSendEmail} className="space-y-3.5 animate-in fade-in duration-150">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Kirim surel formal kepada manajemen **WZ TEXTILE BY AHM ONLINE GROUP**. Formulir ini akan diteruskan ke kotak masuk utama <span className="font-mono text-emerald-700 font-bold">wztextile51@gmail.com</span>.
                </p>

                {sendSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center space-y-2 py-6 animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-black text-emerald-950 text-xs">Pesan Terkirim Sukses!</h4>
                    <p className="text-[10px] text-emerald-700 leading-relaxed">
                      Laporan email Anda berhasil dikirim ke Admin. Owner H. Aang Kurnia atau asisten admin akan segera memproses informasi ini.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Nama Anda:</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Yusuf"
                            value={emailName}
                            onChange={(e) => setEmailName(e.target.value)}
                            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase font-mono">No. WhatsApp/HP:</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="0812xxxxx"
                            value={emailPhone}
                            onChange={(e) => setEmailPhone(e.target.value)}
                            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Alamat Email Anda:</label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={emailAddr}
                          onChange={(e) => setEmailAddr(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Subjek Surel:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Pengajuan Kerja Sama Keagenan"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase font-mono">Isi Laporan / Pesan:</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tulis pesan lengkap Anda untuk dipelajari oleh manajemen..."
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>Mengirim Laporan...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Kirim Email Sekarang
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            )}

          </div>

          {/* Footer of popover */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[9px] font-semibold text-slate-400 px-4">
            <span>Sistem Terintegrasi WZ</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Sparkles className="w-3 h-3 text-amber-500" /> Secure Email & WhatsApp API
            </span>
          </div>
        </div>
      )}

      {/* Floating Main Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all relative border-4 border-white group cursor-pointer"
        title="Hubungi Layanan WZ Textile"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-all" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 transition-all" />
            <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-black text-emerald-950 items-center justify-center border border-white">
                !
              </span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
