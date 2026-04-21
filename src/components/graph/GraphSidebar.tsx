'use client';

import { Search, Layers, Terminal } from "lucide-react";

export default function GraphSidebar() {
  const tools = [
    { icon: <Search />, label: 'Search' },
    { icon: <Layers />, label: 'Layers' },
    { divider: true },
    { icon: <Terminal />, label: 'Console' },
  ];

  return (
    <div className="absolute left-8 top-24 flex flex-col gap-3 p-2 rounded-2xl bg-background border border-border shadow-2xl z-50">
      {tools.map((item, i) => item.divider ? (
        <div key={i} className="h-px bg-border/20 mx-2" />
      ) : (
        <button 
          key={i} 
          className="p-3 rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all group relative"
        >
          <div className="w-5 h-5">{item.icon}</div>
          <div className="absolute left-full ml-4 px-2 py-1 rounded bg-secondary border border-border text-foreground text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {item.label}
          </div>
        </button>
      ))}
    </div>
  );
}
