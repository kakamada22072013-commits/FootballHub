import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { BackToTop } from "@/components/ui/BackToTop";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { PageTransition } from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "FootballHub AI — Premium Football Platform",
    template: "%s | FootballHub AI",
  },
  description:
    "Live scores, teams, players, leagues, and AI-powered football insights. Your premium destination for world football.",
  keywords: ["football", "soccer", "live scores", "premier league", "champions league"],
  openGraph: {
    title: "FootballHub AI",
    description: "Premium football platform with live scores and AI assistant",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ToastContainer />
          <BackToTop />
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
