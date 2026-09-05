import Image from "next/image";
import type { StackItem } from "@/data/stack";

export function StackIcon({ item }: { item: StackItem }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-3 flex justify-center">
        <div className="relative w-10 h-10">
          <Image
            src={`/icons/${item.slug}.svg`}
            alt={item.name}
            width={40}
            height={40}
            className="object-contain"
            style={{ filter: "saturate(1.05)" }}
          />
        </div>
      </div>
      <div className="text-sm font-medium text-foreground font-display">
        {item.name}
      </div>
      <div className="text-[11px] text-secondary mt-0.5 font-body">
        {item.category}
      </div>
    </div>
  );
}
