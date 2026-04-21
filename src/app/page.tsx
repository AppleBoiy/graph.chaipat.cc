/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScanEye, Search } from 'lucide-react';
import GraphCanvas from '@/components/graph/GraphCanvas';
import GraphToolbox, { InteractionMode } from '@/components/graph/GraphToolbox';
import { Suspense } from 'react';
import { getAllNodeIds, getNodeLabel } from '@/lib/graph-mock-api';

function GraphLabContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<InteractionMode>('explore');
  const [maximizedIndex, setMaximizedIndex] = useState<number | null>(0);
  const [showRulers, setShowRulers] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [registrySearch, setRegistrySearch] = useState('');
  const [bottomPanelTab, setBottomPanelTab] = useState<'gallery' | 'sql' | 'terminal'>('gallery');
  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  
  const roots = useMemo(() => searchParams.get('roots')?.split(',').filter(Boolean) || ['ads'], [searchParams]);

  const allNodeIds = useMemo(() => getAllNodeIds(), []);
  const filteredNodes = useMemo(() => {
    const q = registrySearch.toLowerCase();
    return allNodeIds.filter(id => id.toLowerCase().includes(q) || getNodeLabel(id).toLowerCase().includes(q));
  }, [allNodeIds, registrySearch]);

  const handleSelectRoot = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('roots', id);
    router.push(`?${params.toString()}`);
    setIsRegistryOpen(false);
    setMaximizedIndex(0);
  };

  // Unified Layout Orchestrator: Single Perspective vs. Grid Perspective
  const isMaximized = maximizedIndex !== null && roots.length > 1;

  return (
    <div className="relative w-full h-[calc(100vh-56px)] bg-white overflow-hidden flex flex-col pl-[52px]">
      
      {/* Settings Overlay ... */}
      {isSettingsOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white/95 border border-black/10 rounded-2xl shadow-2xl z-[3000] p-6 animate-in fade-in zoom-in duration-200">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Workbench Config</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-black">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
           </div>
           
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                 <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight group-hover:text-black">Technical Rulers</span>
                 <input 
                   type="checkbox" 
                   checked={showRulers} 
                   onChange={(e) => setShowRulers(e.target.checked)}
                   className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                 />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                 <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight group-hover:text-black">Interactive Legend</span>
                 <input 
                   type="checkbox" 
                   checked={showLegend} 
                   onChange={(e) => setShowLegend(e.target.checked)}
                   className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                 />
              </label>
           </div>
        </div>
      )}

      {/* Technical Node Registry (Temporary Investigative Tool) */}
      {isRegistryOpen && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl z-[4000] flex flex-col p-20 animate-in fade-in duration-500">
           <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
              <div className="flex justify-between items-end mb-12">
                 <div>
                    <h2 className="text-[32px] font-black text-black tracking-tighter leading-none mb-2">Technical Registry</h2>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Global Node Index (Pre-Launch Diagnostic Tool)</p>
                 </div>
                 <button onClick={() => setIsRegistryOpen(false)} className="text-gray-300 hover:text-black transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">[ Close ]</span>
                 </button>
              </div>

              <div className="relative mb-8">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                 <input 
                   autoFocus
                   type="text"
                   placeholder="SEARCH GLOBAL NODE ARCHITECTURE..."
                   value={registrySearch}
                   onChange={(e) => setRegistrySearch(e.target.value)}
                   className="w-full bg-gray-50 border-b-2 border-black/10 py-5 pl-14 pr-6 text-lg font-black tracking-tight placeholder:text-gray-200 focus:outline-none focus:border-black transition-all"
                 />
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {filteredNodes.map(id => (
                      <button
                        key={id}
                        onClick={() => handleSelectRoot(id)}
                        className="flex flex-col items-start p-4 hover:bg-black group transition-all rounded-lg border border-transparent hover:border-black"
                      >
                         <span className="text-[14px] font-black text-black group-hover:text-white transition-colors tracking-tight">{getNodeLabel(id)}</span>
                         <span className="text-[9px] font-mono text-gray-400 group-hover:text-gray-500 transition-colors uppercase mt-1">{id}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className={`flex-1 relative w-full p-1 overflow-hidden transition-all duration-500 ${isMaximized ? 'flex flex-col gap-1' : ''}`}>
        
        {/* Main Stage (Focused Perspective) */}
        {isMaximized && (
          <div className="flex-1 relative border border-black/20 bg-white rounded-lg overflow-hidden shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
              <div className="absolute top-3 right-3 z-[60] bg-black/80 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-white border border-white/20 pointer-events-none shadow-lg">
                Focus: {roots[maximizedIndex!]}
              </div>
              <GraphCanvas 
                key={`canvas-${roots[maximizedIndex!]}`}
                forcedRootId={roots[maximizedIndex!]} 
                globalMode={mode} 
                gridSize={1} 
                onToggleFull={() => setMaximizedIndex(null)}
                isFull={true}
                showRulers={showRulers}
                showLegend={showLegend}
                resetCounter={resetCounter}
              />
          </div>
        )}

        {/* Multi-Perspective Grid */}
        <div className={`transition-all duration-500 ${
          isMaximized 
            ? 'h-0 opacity-0 pointer-events-none' 
            : `w-full h-full grid gap-1 ${
                roots.length === 1 ? 'grid-cols-1' : 
                roots.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2 grid-rows-2'
              }`
        }`}>
          {!isMaximized && roots.map((rootId, index) => (
              <div 
                key={`canvas-${rootId}`}
                className="relative border rounded-lg overflow-hidden border-black/20 bg-white shadow-inner"
              >
                <div className="absolute top-3 right-3 z-[60] bg-black/5 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono font-black uppercase tracking-widest text-[#000000] border border-black/20 pointer-events-none">
                  0{index + 1}: {rootId}
                </div>
                
                <GraphCanvas 
                  forcedRootId={rootId} 
                  globalMode={mode} 
                  gridSize={roots.length} 
                  onToggleFull={() => setMaximizedIndex(index)}
                  isFull={false}
                  showRulers={showRulers}
                  showLegend={showLegend}
                  resetCounter={resetCounter}
                />
              </div>
          ))}
        </div>
      </div>

      {/* VS CODE STYLE BOTTOM PANEL */}
      <div className={`
        flex flex-col bg-white border-t border-black/30 transition-all duration-300 ease-in-out z-50
        ${isBottomPanelVisible ? 'h-[240px]' : 'h-[36px]'}
      `}>
        {/* Panel Header */}
        <div className="h-[36px] flex items-center px-4 bg-white justify-between select-none border-b border-black/30">
           <div className="flex items-center h-full">
              {[
                { id: 'gallery',  label: 'GALLERY' },
                { id: 'sql',      label: 'SQL QUERY' },
                { id: 'terminal', label: 'TERMINAL' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => { setBottomPanelTab(tab.id as any); setIsBottomPanelVisible(true); }}
                  className={`
                    text-[9px] font-black tracking-widest h-full flex items-center px-6 transition-all relative
                    ${bottomPanelTab === tab.id && isBottomPanelVisible 
                      ? 'text-black' 
                      : 'text-black/40 hover:text-black'}
                  `}
                >
                  {tab.label}
                  {bottomPanelTab === tab.id && isBottomPanelVisible && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
                  )}
                </button>
              ))}
           </div>
           
           {/* ... Controls ... */}
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsBottomPanelVisible(!isBottomPanelVisible)}
                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
              >
                {isBottomPanelVisible ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
                )}
              </button>
              <button 
                onClick={() => setMaximizedIndex(null)}
                className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors text-gray-400"
              >
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
           </div>
        </div>

        {/* Panel Content */}
        <div className={`flex-1 overflow-hidden flex ${isBottomPanelVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          
          {/* DYNAMIC INSTRUMENT CONTENT */}
          <div className="flex-1 overflow-hidden relative bg-white">
            {bottomPanelTab === 'gallery' && (
              <div className="flex gap-3 overflow-x-auto p-3 h-full custom-scrollbar bg-gray-50/50">
                {roots.map((rid, i) => (
                  <div 
                    key={`thumb-${rid}-${i}`}
                    onClick={() => { setMaximizedIndex(i); setIsBottomPanelVisible(true); }}
                    className={`
                      flex-shrink-0 w-[240px] h-full rounded-xl border transition-all cursor-pointer overflow-hidden relative group bg-white
                      ${maximizedIndex === i ? 'border-black shadow-xl' : 'border-black/20 hover:border-black/40'}
                    `}
                  >
                    <div className="absolute inset-0 z-0">
                       <GraphCanvas 
                         forcedRootId={rid} 
                         globalMode="view" 
                         isPreview={true}
                       />
                    </div>
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors z-10" />
                    <div className="absolute top-2 left-2 bg-black px-2 py-0.5 rounded text-[8px] font-black text-white shadow-sm uppercase tracking-widest z-20">Perspective 0{i+1}</div>
                    <div className="absolute bottom-2 left-2 right-2 text-[8px] font-mono text-gray-400 truncate bg-white/90 backdrop-blur-sm px-1 rounded z-20">{rid}</div>
                  </div>
                ))}
              </div>
            )}

            {(bottomPanelTab === 'sql' || bottomPanelTab === 'terminal') && (
              <div className="w-full h-full flex items-center justify-center p-8 bg-[#F4F4F4]">
                 <div className="flex flex-col items-center text-center">
                    <h2 className="text-sm font-black text-black tracking-[0.2em] uppercase mb-6">Verification Required</h2>
                    <button className="px-10 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#C2B280] transition-all active:scale-95 shadow-xl shadow-black/10">
                       Request Access
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Sidebar Instrumentation */}
      <GraphToolbox 
        mode={mode} 
        setMode={setMode} 
        onToggleGallery={() => setMaximizedIndex(maximizedIndex === null ? 0 : null)}
        isGalleryActive={isMaximized}
        onResetView={() => setResetCounter(c => c + 1)}
        onToggleRegistry={() => setIsRegistryOpen(!isRegistryOpen)}
        isRegistryOpen={isRegistryOpen}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        isSettingsOpen={isSettingsOpen}
      />
    </div>
  );
}

export default function GraphLab() {
  return (
    <Suspense fallback={
      <div className="flex-1 h-full bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Initializing Workbench...</p>
        </div>
      </div>
    }>
      <GraphLabContent />
    </Suspense>
  );
}
