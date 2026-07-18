import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA Nexus AI — Smart Stadium Operations Platform",
  description:
    "AI-powered operating system for FIFA World Cup 2026 Smart Stadiums. Real-time crowd intelligence, multilingual fan assistance, incident response, and operational decision support powered by Gemini AI.",
  keywords: [
    "FIFA",
    "World Cup 2026",
    "AI",
    "Smart Stadium",
    "Crowd Management",
    "Generative AI",
  ],
  authors: [{ name: "FIFA Nexus AI Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {/* Skip navigation link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
