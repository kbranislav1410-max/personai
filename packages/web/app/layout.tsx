import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonAI API",
  description: "API for PersonAI HR CV Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
