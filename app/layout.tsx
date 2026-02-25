import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personalistika AI – Job Description Generator",
  description: "AI-powered job description generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
