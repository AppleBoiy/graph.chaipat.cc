import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Activity } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Graph Laboratory | Chaipat Jainan",
  description: "Interactive Knowledge Graph Exploration & Semantic Research Engine",
  openGraph: {
    title: "Graph Laboratory | Chaipat Jainan",
    description: "Interactive Knowledge Graph Exploration",
  },
};

import { getGraphStats } from "@/lib/graph-mock-api";
import SearchBar from "@/components/graph/SearchBar";
import { Suspense } from "react";
import { sendHeartbeat } from "@/lib/heartbeat";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Ensure pulse is sent before render
  await sendHeartbeat();
  
  const stats = await getGraphStats().catch(() => ({ nodeCount: 0, edgeCount: 0 }));

  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased bg-[#FAFAFA]`}>
        {/* ── Navigation Bar ─────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 h-14 z-[999] flex items-center justify-between px-6"
          style={{
            borderBottom: "1px solid #DDDDDD",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="p-1.5 rounded"
              style={{ border: "1px solid #333333" }}
            >
              <Activity className="w-4 h-4" style={{ color: "#000000" }} />
            </div>
            <div>
              <h1 className="text-[13px] font-black tracking-tight uppercase" style={{ color: "#000000" }}>
                Graph Laboratory
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: "#000000" }}>
                Knowledge Graph · Research Interface
              </p>
            </div>
          </div>

          <Suspense fallback={<div className="flex-1 max-w-2xl mx-8 h-9 bg-[#F5F5F5] rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono tracking-wide" style={{ color: "#000000" }}>
            <span>NODES <span className="font-black" style={{ color: "#000000" }}>{stats.nodeCount.toLocaleString()}</span></span>
            <span
              className="inline-block w-px h-3"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
            <span>EDGES <span className="font-black" style={{ color: "#000000" }}>{stats.edgeCount.toLocaleString()}</span></span>
          </div>
        </nav>

        <main className="pt-14 h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

