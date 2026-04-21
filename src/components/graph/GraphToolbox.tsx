import { MousePointer2, Zap, Info, ScanEye, Focus, Settings2, Database, MoreHorizontal } from "lucide-react";

export type InteractionMode = 'view' | 'explore' | 'inspect';

interface GraphToolboxProps {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  onToggleGallery?: () => void;
  isGalleryActive?: boolean;
  onResetView?: () => void;
  onToggleRegistry?: () => void;
  isRegistryOpen?: boolean;
  onToggleSettings?: () => void;
  isSettingsOpen?: boolean;
}

const TOOLS = [
  { id: 'view',    icon: MousePointer2, label: 'View',    desc: 'Structure Navigation' },
  { id: 'explore', icon: Zap,           label: 'Explore', desc: 'Node Expansion' },
  { id: 'inspect', icon: Info,          label: 'Inspect', desc: 'Metadata Analysis' },
] as const;

export default function GraphToolbox({ mode, setMode, onToggleGallery, isGalleryActive, onResetView, onToggleRegistry, isRegistryOpen, onToggleSettings, isSettingsOpen }: GraphToolboxProps) {
  return (
    <div className="fixed left-0 top-14 bottom-0 w-[52px] bg-white border-r border-[#E5E7EB] flex flex-col items-center py-4 z-40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Primary Tools */}
      <div className="flex flex-col gap-1 w-full mt-2">
        {TOOLS.map((tool) => {
          const isActive = mode === tool.id;
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              onClick={() => setMode(tool.id as InteractionMode)}
              className={`
                group relative flex items-center justify-center w-full h-[44px] transition-colors duration-200
                ${isActive ? 'text-[#111111]' : 'text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50'}
              `}
            >
              <div className={`absolute left-0 w-[3px] h-4 bg-[#111111] rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-y-0'}`} />
              
              <Icon 
                className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
                strokeWidth={isActive ? 2 : 1.5} 
              />
              
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 z-[3000]">
                <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-start min-w-[100px]">
                  <span className="leading-tight">{tool.label}</span>
                  <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5">{tool.desc}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1 w-full pb-2">
         <div className="mx-3 h-[1px] bg-gray-100 mb-2" />
         
         {/* Reset View Button */}
         <button 
           onClick={onResetView}
           className="group relative flex items-center justify-center w-full h-[44px] text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50 transition-all"
         >
            <Focus className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 z-[3000]">
                <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-start min-w-[100px]">
                  <span className="leading-tight">Reset View</span>
                  <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5">Recenter Laboratory</span>
                </div>
            </div>
         </button>

         {/* Gallery View Button */}
         <button 
           onClick={onToggleGallery}
           className={`
             group relative flex items-center justify-center w-full h-[44px] transition-all duration-200
             ${isGalleryActive 
               ? 'text-black bg-gray-50' 
               : 'text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50'
             }
           `}
         >
            <div className={`absolute left-0 w-[3px] h-4 bg-black rounded-r-full transition-all duration-300 ${isGalleryActive ? 'opacity-100' : 'opacity-0 scale-y-0'}`} />
            <ScanEye className={`w-[18px] h-[18px] transition-transform ${isGalleryActive ? 'scale-110' : 'group-hover:scale-105'}`} strokeWidth={1.5} />
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 z-[3000]">
                <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-start min-w-[100px]">
                  <span className="leading-tight">Gallery View</span>
                  <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5">Toggle Grid Layout</span>
                </div>
            </div>
         </button>

         {/* Node Registry Button */}
         <button 
           onClick={onToggleRegistry}
           className={`
             group relative flex items-center justify-center w-full h-[44px] transition-all duration-200
             ${isRegistryOpen ? 'text-black bg-gray-50' : 'text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50'}
           `}
         >
            <div className={`absolute left-0 w-[3px] h-4 bg-black rounded-r-full transition-all duration-300 ${isRegistryOpen ? 'opacity-100' : 'opacity-0 scale-y-0'}`} />
            <Database className={`w-[18px] h-[18px] transition-transform ${isRegistryOpen ? 'scale-110' : 'group-hover:scale-105'}`} strokeWidth={1.5} />
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 z-[3000]">
                <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-start min-w-[100px]">
                  <span className="leading-tight">Node Registry</span>
                  <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5">Technical Index</span>
                </div>
            </div>
         </button>

         {/* Settings Button */}
         <button 
           onClick={onToggleSettings}
           className={`
             group relative flex items-center justify-center w-full h-[44px] transition-all duration-200
             ${isSettingsOpen ? 'text-[#111111] bg-gray-50' : 'text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50'}
           `}
         >
            <Settings2 className={`w-[18px] h-[18px] transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : 'group-hover:rotate-45'}`} strokeWidth={1.5} />
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 z-[3000]">
                <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-start min-w-[100px]">
                  <span className="leading-tight">Workbench Config</span>
                  <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5">Adjust Instrument</span>
                </div>
            </div>
         </button>
         
         <button className="group relative flex items-center justify-center w-full h-[44px] text-[#9CA3AF] hover:text-[#111111] hover:bg-gray-50 transition-all">
            <MoreHorizontal className="w-[18px] h-[18px]" strokeWidth={1.5} />
         </button>
      </div>
    </div>
  );
}
