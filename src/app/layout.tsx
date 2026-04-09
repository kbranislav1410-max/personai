import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonAI – Generátor pracovných inzerátov",
  description:
    "AI nástroj pre personalistov na generovanie pracovných inzerátov pre Profesia.sk, Kariera.sk, LinkedIn, sociálne siete a kariérnu stránku firmy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
