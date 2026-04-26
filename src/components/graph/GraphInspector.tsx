/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2, ChevronRight, Loader2, X } from "lucide-react";
import { NodeDetail } from "@/lib/types";

interface GraphInspectorProps {
  detail: NodeDetail | null;
  loading: boolean;
  onClose: () => void;
}

export default function GraphInspector({ detail, loading, onClose }: GraphInspectorProps) {
  return (
    <AnimatePresence>
      {(detail || loading) && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-6 top-6 bottom-6 w-96 bg-white/90 backdrop-blur-md border border-[#CCCCCC] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[110] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#EEEEEE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em]">Node Inspector</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-[#F5F5F5] rounded transition-colors text-[#999]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 text-[#333] animate-spin opacity-20" />
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#999]">Fetching Semantic Data...</p>
              </div>
            ) : detail ? (
              <div className="p-8 space-y-10">
                {/* Title & Description */}
                <section>
                  <h2 className="text-3xl font-bold tracking-tight text-[#111] mb-4">{detail.label}</h2>
                  <div className="px-3 py-1 bg-[#F5F5F5] border border-[#EEEEEE] inline-block mb-6">
                    <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">{detail.class}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#444] font-medium italic opacity-80">
                    "{detail.description}"
                  </p>
                </section>

                {/* Telemetry Grid */}
                <section>
                  <div className="flex items-center gap-2 mb-6 text-[#999]">
                    <Info className="w-3.5 h-3.5" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Telemetry Metrics</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {detail.telemetry.map(p => (
                      <div key={p.label} className="flex justify-between items-end pb-3 border-b border-[#EEEEEE]">
                        <span className="text-[11px] text-[#999] font-mono uppercase tracking-tighter">{p.label}</span>
                        <span className="text-[13px] font-bold text-[#111]">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Actions */}
                <section className="pt-4">
                  <div className="pt-6 border-t border-black/10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2 mb-4">
                      <Share2 className="w-3 h-3" /> Quick Actions
                    </span>
                    <button 
                      onClick={() => {
                        const query = encodeURIComponent(detail.label);
                        window.open(`https://archive.chaipat.cc?q=${query}`, '_blank');
                      }}
                      className="w-full bg-black text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between group hover:bg-[#111111] transition-all active:scale-[0.98]"
                    >
                      Execute Deep Search
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full mt-2 p-4 border border-[#CCCCCC] text-[#333] text-[10px] font-bold uppercase tracking-widest hover:bg-[#F5F5F5] transition-colors">
                      Export Node Graph
                    </button>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
