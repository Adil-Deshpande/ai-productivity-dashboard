import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goal Engine — AI-Powered Productivity Dashboard",
  description:
    "Break down your biggest ambitions into actionable tasks with AI. Track progress, stay organized, and achieve more with Goal Engine.",
  openGraph: {
    title: "Goal Engine — AI-Powered Productivity Dashboard",
    description: "AI-powered goal and task management for high performers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
