import { FadeIn, StaggerContainer, StaggerItem } from "./motion/FadeIn";

const timeline = [
  {
    period: "2025 - 2026",
    title: "S1 Sistem Informasi",
    place: "STMIK PPKIA Pradnya Paramita, Malang",
    note: "IPK 3.69",
  },
  {
    period: "2022 - 2025",
    title: "D3 Teknologi Informasi",
    place: "Universitas Brawijaya, Malang",
    note: "IPK 3.85",
  },
  {
    period: "Okt 2024 - Mar 2025",
    title: "Staff IT BPS Kota Malang",
    place: "Magang / kerja",
    note: "IT support kantor, membangun sistem manajemen magang untuk digitalisasi administrasi internal",
  },
  {
    period: "2019 - 2022",
    title: "SMK Rekayasa Perangkat Lunak",
    place: "SMK Negeri 8 Malang",
    note: "Nilai 87.21",
  },
  {
    period: "Jul 2020 - Nov 2020",
    title: "Digital Marketing CV Indonesia Online",
    place: "Pertama kali kerja",
    note: "Facebook Ads + landing page WordPress untuk promosi produk UMKM",
  },
];

const certs = [
  { name: "Junior Web Developer", org: "BNSP / LSP Teknologi Digital", valid: "2025 - 2028" },
  { name: "Microsoft Office Desktop Application", org: "Trust Training Partners & Microsoft", valid: "2024 - 2027" },
  { name: "TOEFL ITP", org: "ETS / Universitas Brawijaya", valid: "2024 - 2026" },
];

const training = [
  "PCAP: Programming Essentials in Python, OpenEDG Python Institute / Cisco (2022)",
  "Fundamental Frontend Engineer with Vue.js, Alterra Academy (2022)",
  "Fundamental Mobile Developer with Flutter, Alterra Academy (2022)",
];

function IconDot() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5" aria-hidden>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IconCap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A47.04 47.04 0 0112 20.488a47.04 47.04 0 018.23-4.048 60.436 60.436 0 00-.491-6.347l-7.739-4.48a.75.75 0 00-.751 0l-7.019 4.061z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.668l7.74 4.48m-7.74-4.48v12.92" />
    </svg>
  );
}

function IconBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9A2.25 2.25 0 015.25 16.5v-9a2.25 2.25 0 012.25-2.25h9A2.25 2.25 0 0118.75 7.5v9a2.25 2.25 0 01-2.25 2.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l2.5 2.5 5-5" />
    </svg>
  );
}

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-2">Tentang Saya</div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
            Dari lab SMK sampai server produksi.
          </h2>
          <p className="mt-3 text-secondary font-body max-w-2xl">
            Jurusan RPL sejak SMK, lanjut D3 Teknologi Informasi di Universitas Brawijaya, sekarang S1 Sistem Informasi di STMIK PPKIA. Pernah jadi Staff IT di BPS Kota Malang. Sekarang fokus membangun sistem informasi, dari analisis kebutuhan sampai deployed dan jalan di produksi.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <StaggerContainer className="relative pl-6 border-l border-outline-variant/60 space-y-8">
              {timeline.map((t) => (
                <StaggerItem key={t.title} className="relative">
                  <span className="absolute -left-[31px] top-1 text-primary">
                    <IconDot />
                  </span>
                  <div className="text-[11px] uppercase tracking-widest text-secondary font-mono">{t.period}</div>
                  <h3 className="mt-1 text-base font-medium text-foreground">{t.title}</h3>
                  <div className="text-sm text-secondary">{t.place}</div>
                  <p className="mt-1 text-sm text-secondary/90 leading-relaxed">{t.note}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Sidebar: facts + certs + training */}
          <div className="lg:col-span-5 space-y-5">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 p-5">
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-0.5"><IconPin /></span>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-widest text-secondary">Basis</div>
                      Malang, Jawa Timur. Tersedia untuk kerja remote / hybrid
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-0.5"><IconCap /></span>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-widest text-secondary">Pendidikan terakhir</div>
                      S1 Sistem Informasi, STMIK PPKIA (IPK 3.69). Sebelumnya D3 Teknologi Informasi UB (IPK 3.85)
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-primary"><IconBadge /></span>
                  <h3 className="text-[11px] uppercase tracking-widest text-secondary font-mono">Sertifikasi</h3>
                </div>
                <ul className="space-y-3">
                  {certs.map((c) => (
                    <li key={c.name} className="text-sm">
                      <div className="text-foreground font-medium">{c.name}</div>
                      <div className="text-secondary text-xs">{c.org} · berlaku {c.valid}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 p-5">
                <h3 className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-3">Pelatihan</h3>
                <ul className="space-y-2 text-xs text-secondary leading-relaxed list-disc list-inside">
                  {training.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
