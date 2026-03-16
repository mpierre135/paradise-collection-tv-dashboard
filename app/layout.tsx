import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Paradise Collection TV Dashboard",
  description: "TV-friendly guest dashboard for Paradise Collection rental units."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
