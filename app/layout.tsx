import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

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
    <html lang="sk">
      <body className="appShell">
        <Sidebar />
        <TopBar />
        <main className="appContent">{children}</main>
      </body>
    </html>
  );
}
