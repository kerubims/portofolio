export type Project = {
  slug: string;
  title: string;
  category: string,       // Enterprise / Civic Tech / dll
  status: string,         // SHIPPED / PILOT / LIVE / dll
  statusTone: "blue" | "green" | "amber" | "purple";
  description: string;
  techTags: string[];
  path: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "sim-kerma",
    title: "SIM-KERMA",
    category: "Enterprise",
    status: "SHIPPED",
    statusTone: "green",
    description:
      "Sistem informasi manajemen kerjasama lintas kementerian: rantai persetujuan, versioning dokumen, e-signature multi-pihak, audit trail.",
    techTags: ["Laravel 11", "MySQL", "WebSocket"],
    path: "C:\\laragon\\www\\sim-kerma",
    liveUrl: "https://kerjasama.ksm.web.id",
  },
  {
    slug: "poltek-sendawar",
    title: "Company Profile Poltek Sendawar",
    category: "Company Profile",
    status: "LIVE",
    statusTone: "green",
    description:
      "Company profile resmi Politeknik Sendawar: profil, jurusan & akreditasi, berita & acara, kalender akademik, fasilitas, dan lowongan. Live di Hostinger sejak awal 2026.",
    techTags: ["Laravel 12", "Blade", "Tailwind CSS"],
    path: "https://github.com/kerubims/company-profile-poltek-sendawar",
    liveUrl: "https://github.com/kerubims/company-profile-poltek-sendawar",
  },
  {
    slug: "simades",
    title: "SIMades",
    category: "Civic Tech",
    status: "PILOT",
    statusTone: "amber",
    description:
      "Sistem informasi desa: pelayanan warga, data kependudukan, transparansi anggaran, dan tanda tangan surat digital dengan verifikasi QR.",
    techTags: ["Laravel", "GSheets API", "WA Gateway"],
    path: "C:\\laragon\\www\\simades",
  },
  {
    slug: "vespabox",
    title: "VespaBox",
    category: "Realtime",
    status: "BETA",
    statusTone: "amber",
    description:
      "Marketplace spare part Vespa dengan bidding realtime. Laravel Reverb WebSocket, broadcasting channel, diuji untuk ribuan pengguna bersamaan.",
    techTags: ["Laravel 11", "Reverb", "WebSocket"],
    path: "C:\\laragon\\www\\vespabox",
  },
  {
    slug: "cvku",
    title: "CVKu",
    category: "AI",
    status: "LIVE",
    statusTone: "purple",
    description:
      "Pembuat CV berbasis AI: pemeriksa skor ATS dengan analisis gap kata kunci, editor CV terpandu, pustaka CV, dan asisten AI streaming. Multi-model (Novita AI, Gemini).",
    techTags: ["Next.js", "AI SDK", "Docker"],
    path: "https://github.com/kerubims/cvku",
    liveUrl: "https://cvku.ksm.web.id",
  },
  {
    slug: "sebatas-kopi",
    title: "SebatasKopi",
    category: "POS / SMB",
    status: "DEPLOYED",
    statusTone: "green",
    description:
      "POS kedai kopi: menu, pelacakan pesanan, laporan harian, program member, dan alert stok. Dibangun untuk kecepatan layanan di kasir.",
    techTags: ["Laravel 11", "Alpine.js", "MySQL"],
    path: "C:\\laragon\\www\\sebatas-kopi",
  },
];
