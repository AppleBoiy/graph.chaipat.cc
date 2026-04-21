'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Search, Layers, Share2, Info, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function GraphLab() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "INITIALIZING_SEMANTIC_ENGINE...",
    "LOADING_KNOWLEDGE_GRAPH...",
    "FRONTIER_OPTIMIZED.",
    "SYSTEM_READY."
  ]);

  const nodes = [
    { id: 'ads', label: 'Autonomous Driving', x: '35%', y: '30%', type: 'domain' },
    { id: 'kg', label: 'Knowledge Graph', x: '60%', y: '45%', type: 'core' },
    { id: 'ontology', label: 'Ontology Eng.', x: '30%', y: '65%', type: 'domain' },
    { id: 'llm', label: 'Agent Infra', x: '75%', y: '25%', type: 'tech' },
    { id: 'safety', label: 'Safety Testing', x: '55%', y: '75%', type: 'domain' },
  ];

  const [commandInput, setCommandInput] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    setConsoleOutput(prev => [...prev.slice(-6), `$ ${commandInput}`, `> EXECUTING_QUERY...`, `> SUCCESS: Result set cached.`]);
    setCommandInput("");
  };

  const handleNodeClick = (id: string) => {
    setSelectedNode(id);
    const nodeLabel = nodes.find(n => n.id === id)?.label;
    setConsoleOutput(prev => [...prev.slice(-6), `MATCH (n:${id}) RETURN n.properties;`, `> DATA_FETCHED: ${nodeLabel}`]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Dynamic Technical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%),linear-gradient(to_right,hsl(var(--muted)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.2)_1px,transparent_1px)] [background-size:100%_100%,40px_40px,40px_40px] pointer-events-none" />

      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--muted-foreground))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="4 6">
          <line x1="35%" y1="30%" x2="60%" y2="45%" />
          <line x1="60%" y1="45%" x2="30%" y2="65%" />
          <line x1="60%" y1="45%" x2="75%" y2="25%" />
          <line x1="60%" y1="45%" x2="55%" y2="75%" />
        </g>
      </svg>

      {/* Interactive Research Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleNodeClick(node.id)}
          style={{ left: node.x, top: node.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`relative p-5 rounded-full bg-background/40 backdrop-blur-md border transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)]
              ${selectedNode === node.id ? 'border-primary ring-8 ring-primary/5 scale-110' : 'border-border/50 hover:border-primary/40'}`}>
              <Share2 className={`w-6 h-6 ${selectedNode === node.id ? 'text-primary' : 'text-muted-foreground/60'}`} />
              
              {/* Pulse Indicator */}
              {selectedNode === node.id && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-lg border border-border/40 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all duration-300
              ${selectedNode === node.id ? 'bg-primary text-primary-foreground translate-y-1' : 'bg-background/80 backdrop-blur-sm text-muted-foreground group-hover:text-foreground'}`}>
              {node.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Glass Sidebar Toolbar */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2 rounded-2xl bg-background/40 backdrop-blur-xl border border-border/40 shadow-2xl z-50">
        {[
          { icon: <Search />, label: 'Search' },
          { icon: <Layers />, label: 'Layers' },
          { divider: true },
          { icon: <Terminal />, label: 'Console' },
        ].map((item, i) => item.divider ? (
          <div key={i} className="h-px bg-border/20 mx-2" />
        ) : (
          <button key={i} className="p-3 rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all group relative">
            <div className="w-5 h-5">{item.icon}</div>
            <div className="absolute left-full ml-4 px-2 py-1 rounded bg-zinc-800 text-white text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      {/* Property Inspector Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="absolute right-8 top-8 bottom-8 w-88 bg-background/60 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden"
          >
            <div className="p-8 pb-6 border-b border-border/20">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Node Analysis</span>
                <button onClick={() => setSelectedNode(null)} className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground">×</button>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">{nodes.find(n => n.id === selectedNode)?.label}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">ID: {selectedNode}_SEM_0x1</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-muted-foreground/60">
                  <Info className="w-3.5 h-3.5" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Telemetry Specs</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { l: 'Node Class', v: nodes.find(n => n.id === selectedNode)?.type },
                    { l: 'Semantic Weight', v: '0.942' },
                    { l: 'Adjacency count', v: '18 Nodes' },
                    { l: 'Global Rank', v: '#12' },
                  ].map(p => (
                    <div key={p.l} className="flex justify-between items-end pb-2 border-b border-border/10">
                      <span className="text-[11px] text-muted-foreground/50">{p.l}</span>
                      <span className="text-[12px] font-mono font-bold">{p.v}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-muted-foreground/60">
                  <Share2 className="w-3.5 h-3.5" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Top Neighbors</h3>
                </div>
                <div className="space-y-2">
                  {['Graph Validation', 'Scenario Generation', 'Safety Engine'].map(n => (
                    <button key={n} className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-[11px] font-bold group">
                      {n}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-8 bg-muted/10 border-t border-border/20">
              <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                Execute Subgraph Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Technical Console */}
      <div className="absolute bottom-8 left-8 right-8 flex gap-6 z-50">
        <div className="flex-1 bg-zinc-950/80 backdrop-blur-2xl rounded-2xl border border-white/5 p-5 font-mono text-[11px] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-3 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
              <Terminal className="w-4 h-4" />
              Terminal.Sys_Output [Live]
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-1.5 h-20 overflow-y-auto scrollbar-hide">
            {consoleOutput.map((line, i) => (
              <div key={i} className={`${line.startsWith('>') ? 'text-emerald-400' : 'text-zinc-500'} tracking-tight`}>
                <span className="opacity-30 mr-2">[{10 + i}:00:0{i}]</span>
                {line.startsWith('MATCH') || line.startsWith('$') ? <span className="text-zinc-300">{line}</span> : line}
              </div>
            ))}
            <form onSubmit={handleCommand} className="flex items-center gap-2 text-zinc-300">
              <span className="opacity-30">[{10 + consoleOutput.length}:00:00]</span>
              <span>$</span>
              <input 
                type="text" 
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-zinc-300 font-mono text-[11px] p-0 focus:ring-0"
                autoFocus
                placeholder="Enter query..."
              />
            </form>
          </div>
        </div>

        <div className="w-72 bg-background/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">System Status</div>
            <div className="space-y-3">
              {[
                { l: 'Node Health', v: 'Optimal', c: 'text-emerald-500' },
                { l: 'Semantic Latency', v: '12ms', c: 'text-zinc-500' },
                { l: 'GPU Clusters', v: '04 Active', c: 'text-zinc-500' },
              ].map(stat => (
                <div key={stat.l} className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-muted-foreground/40">{stat.l}</span>
                  <span className={`font-bold ${stat.c}`}>{stat.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-border/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Protocol</span>
              <span className="text-[10px] font-bold uppercase text-primary">SPARQL 1.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
