# 🚀 Ubim's Developer Portfolio (portofolio-next)

Website portofolio interaktif dan modern yang dibangun dengan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, dan **Three.js / React Three Fiber**. Halaman ini menampilkan showcase proyek-proyek enterprise, civic tech, ERP, realtime marketplace, dan AI application yang dikembangkan oleh Ubim.

---

## 🛠️ Tech Stack & Tech Spec

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Standalone Build Output)
- **UI Library & Rendering**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & 3D**: [Framer Motion](https://www.framer.com/motion/), [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), & [@react-three/drei](https://drei.docs.pmnd.rs/)
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) *(Port `9020`)*

---

## 🌟 Fitur Utama

1. **Hero 3D Background**: Tampilan visual 3D interaktif menggunakan Three.js canvas & Fiber pada bagian Hero.
2. **Featured Projects Showcase**: Kartu showcase proyek dunia nyata dengan kategori dan *status badge* (*SHIPPED*, *PRODUCTION*, *PILOT*, *LIVE*):
   - **SIM-KERMA** — *Cross-ministry partnership system* (Laravel 11, WebSocket, MySQL).
   - **Company Profile Poltek Sendawar** — *Official higher-education company profile* (Laravel 12, Blade, Tailwind CSS, live on Hostinger).
   - **SIMades** — *Village information civic tech system* dengan fitur TTD Digital & QR Verify.
   - **VespaBox** — *Realtime parts marketplace* dengan Laravel Reverb WebSocket.
   - **CVKu** — *AI-powered ATS resume builder* (Next.js, AI SDK, live at cvku.ksm.web.id).
   - **SebatasKopi** — *Coffee shop POS system*.
3. **Interactive Tech Stack Marquee**: Komponen marquee interaktif yang menampilkan daftar keahlian teknis (Laravel, Next.js, Docker, MySQL, Linux, AI/LLM, REST API).
4. **Live Metrics & Stats**: Ringkasan pencapaian proyek dan aktivitas sistem.
5. **Contact & Social Interaction**: Form kontak dan tautan jaringan sosial developer.
6. **Containerized Production Ready**: Siap dijalankan di server staging/produksi menggunakan Docker Compose.

---

## 📂 Struktur Direktori

```text
portofolio/
├── app/                  # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/           # Komponen UI modular
│   ├── 3d/               # Komponen Three.js / React Three Fiber (Hero3DBackground)
│   ├── motion/           # Wrapper animasi Framer Motion (FadeIn, dsb.)
│   ├── Contact.tsx       # Section Form Kontak
│   ├── Hero.tsx          # Section Hero utama
│   ├── Navbar.tsx        # Top Navigation bar
│   ├── Projects.tsx      # Section Showcase Proyek
│   ├── Stack.tsx         # Section Tech Stack Marquee
│   └── Stats.tsx         # Section Metrik Stats
├── data/                 # Data statis & tipe TypeScript
│   ├── projects.ts       # Data daftar proyek & tech tags
│   └── stack.ts          # Data item keahlian teknis & brand color
├── public/               # Asset statis & SVG icons
├── Dockerfile            # Multi-stage Docker build (Standalone mode)
├── docker-compose.yml    # Konfigurasi container service (Port 9020:3000)
├── next.config.ts        # Konfigurasi Next.js 16
└── package.json          # Dependency & script project
```

---

## ⚡ Cara Instalasi & Penggunaan

### 1. Jalankan di Mode Development (Lokal)

**Prasyarat**: Node.js v20+ dan `npm` / `pnpm` / `yarn`.

```bash
# 1. Clone repository ini
git clone https://github.com/kerubims/portofolio.git
cd portofolio

# 2. Install dependency
npm install

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu.

---

### 2. Jalankan dengan Docker (Rekomendasi Production)

**Prasyarat**: Docker Engine dan Docker Compose telah terinstall.

```bash
# Build dan jalankan container di background
docker compose up -d --build
```

Website portofolio akan berjalan di [http://localhost:9020](http://localhost:9020).

Untuk menghentikan container:
```bash
docker compose down
```

---

## 📝 Commands ringkas

- `npm run dev` — Menjalankan dev server Next.js.
- `npm run build` — Melakukan kompilasi & build standalone production.
- `npm run start` — Menjalankan server production Next.js setelah build.
- `npm run lint` — Memeriksa linter ESLint.

---

## 📄 Lisensi

Proyek ini menggunakan lisensi [MIT License](LICENSE).
