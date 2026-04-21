/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, Plus, X } from 'lucide-react';
import { searchNodes, KGNode } from '@/lib/graph-mock-api';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KGNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRoots = searchParams.get('roots')?.split(',').filter(Boolean) || ['ads'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchNodes(query);
        setResults(res);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (node: KGNode) => {
    let newRoots = [...currentRoots];
    if (newRoots.includes(node.id)) {
      setIsOpen(false);
      setQuery('');
      return;
    }
    
    // Max 4 graphs
    if (newRoots.length >= 4) {
      newRoots = [node.id, ...newRoots.slice(0, 3)];
    } else {
      newRoots.push(node.id);
    }

    setIsOpen(false);
    setQuery('');
    router.push(`/?roots=${newRoots.join(',')}`);
  };

  const removeRoot = (id: string) => {
    const newRoots = currentRoots.filter(r => r !== id);
    router.push(`/?roots=${newRoots.join(',') || 'ads'}`);
  };

  return (
    <div ref={containerRef} className="flex-1 max-w-2xl mx-8 relative hidden sm:block">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#111] animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5 text-[#999] group-focus-within:text-[#111] transition-colors" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search & Compare Nodes (Max 4)..."
            className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#CCCCCC] focus:bg-white text-[11px] font-mono py-2 pl-9 pr-4 rounded-lg outline-none transition-all placeholder:text-[#BBB]"
          />
        </div>

        {/* Current Roots Tags */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[300px]">
          {currentRoots.map(id => (
            <div key={id} className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-[#DDD] px-2 py-1 rounded-md">
              <span className="text-[10px] font-bold text-[#111] uppercase tracking-tighter">{id}</span>
              {currentRoots.length > 1 && (
                <button onClick={() => removeRoot(id)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[#CCCCCC] shadow-2xl rounded-xl overflow-hidden z-[200]">
          <div className="p-2 border-b border-[#EEEEEE]">
            <span className="text-[9px] font-bold text-[#999] uppercase tracking-widest px-2">Compare Research Perspective</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {results.map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelect(node)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F5F5F5] transition-colors text-left group"
              >
                <div>
                  <div className="text-[11px] font-bold text-[#111]">{node.label}</div>
                  <div className="text-[9px] font-mono text-[#999] uppercase tracking-tighter">{node.class}</div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 text-[9px] font-mono text-[#666]">
                  {currentRoots.includes(node.id) ? 'ALREADY ACTIVE' : <>ADD TO COMPARISON <Plus className="w-3 h-3" /></>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
