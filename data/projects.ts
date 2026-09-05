export type Project = {
  slug: string;
  title: string;
  category: string;       // Enterprise / Civic Tech / dll
  status: string;         // SHIPPED / PILOT / LIVE / dll
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
      "Cross-ministry partnership system. Approval chains, file versioning, audit trail. 14 ministries, 4 provinces.",
    techTags: ["Laravel 11", "MySQL", "WebSocket"],
    path: "C:\\laragon\\www\\sim-kerma",
  },
  {
    slug: "bioluxe",
    title: "BioLuxe ERP",
    category: "ERP",
    status: "PRODUCTION",
    statusTone: "green",
    description:
      "Manufacturing ERP for skincare line. Batch tracking, BOM, QC, sales pipeline. 200+ SKU, 40 active users daily.",
    techTags: ["Laravel 10", "MySQL", "Redis"],
    path: "C:\\laragon\\www\\bioluxe",
  },
  {
    slug: "simades",
    title: "SIMades",
    category: "Civic Tech",
    status: "PILOT",
    statusTone: "amber",
    description:
      "Village information system. Citizen services, ID cards, budget transparency, digital letter signing with QR verify.",
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
      "Vespa parts marketplace with realtime bidding. Laravel Reverb WebSocket, channel broadcasting, 2k+ concurrent users tested.",
    techTags: ["Laravel 11", "Reverb", "WebSocket"],
    path: "C:\\laragon\\www\\vespabox",
  },
  {
    slug: "uchat",
    title: "Chat AI (uchat)",
    category: "AI",
    status: "LIVE",
    statusTone: "purple",
    description:
      "Multi-persona AI chat with streaming responses. Novita AI, Gemini, and self-hosted models. Sidebar sessions, persona switching, conversation history.",
    techTags: ["Next.js 16", "Prisma", "AI SDK"],
    path: "F:\\Project Development\\chat",
  },
  {
    slug: "sebatas-kopi",
    title: "SebatasKopi",
    category: "POS / SMB",
    status: "DEPLOYED",
    statusTone: "green",
    description:
      "Coffee shop POS. Menu, order tracking, daily reports, member program, stock alerts. Built for actual counter speed at the cafe.",
    techTags: ["Laravel 11", "Alpine.js", "MySQL"],
    path: "C:\\laragon\\www\\sebatas-kopi",
  },
];
