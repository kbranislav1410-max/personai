import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Personalistika AI",
  description: "AI-powered HR tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="appShell">
        <Sidebar />
        <main className="appContent">{children}</main>
      </body>
    </html>
  );
}
