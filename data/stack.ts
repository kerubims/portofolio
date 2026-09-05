export type StackItem = {
  name: string;
  slug: string;       // simpleicons slug
  category: string;   // "PHP / Backend" / "Container" / dll
  color: string;      // brand color hex
};

// Mapping brand → simpleicons slug + brand color
export const stackItems: StackItem[] = [
  { name: "Laravel", slug: "laravel", category: "PHP / Backend", color: "#FF2D20" },
  { name: "Next.js", slug: "nextdotjs", category: "React / SSR", color: "#000000" },
  { name: "AI / LLM", slug: "googlegemini", category: "Novita / Gemini", color: "#8E75B2" },
  { name: "Docker", slug: "docker", category: "Container", color: "#2496ED" },
  { name: "MySQL", slug: "mysql", category: "Database", color: "#4479A1" },
  { name: "REST API", slug: "postman", category: "Integration", color: "#FF6C37" },
  { name: "CodeIgniter", slug: "codeigniter", category: "PHP / Legacy", color: "#EE4623" },
  { name: "Linux", slug: "linux", category: "Server OS", color: "#000000" },
];
