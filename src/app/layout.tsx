import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { Activity } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Graph Laboratory | Chaipat Jainan",
  description: "Live Knowledge Graph Exploration & Semantic Research Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border/50">
              <Activity className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight uppercase">Graph Laboratory</h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">System v0.1.0-alpha</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 mr-4">
              <span>Nodes: 42,831</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>Edges: 156,022</span>
            </div>
            <ThemeToggle />
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
