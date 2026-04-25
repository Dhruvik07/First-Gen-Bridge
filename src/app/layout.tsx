import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/layout/ThemeProvider";
import SkipLink from "@/components/accessibility/SkipLink";
import SideNav from "@/components/layout/SideNav";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FirstBridge",
  description: "A platform for first-generation college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <ThemeProvider>
          <SkipLink />
          <div className="flex flex-1 min-h-full">
            <SideNav />
            <main id="main-content" className="flex-1 flex flex-col">
              <TopBar />
              {children}
            </main>
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
