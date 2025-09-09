import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuietHours - Smart Focus Time Management",
  description: "Schedule focused work sessions with intelligent notifications. Boost productivity with conflict-free time blocks and automated reminders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
          <Navigation />
          {children}
        </body>
    </html>
  );
}
