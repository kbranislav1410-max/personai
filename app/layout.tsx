import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Personalistika AI",
  description: "AI nástroj pre personalistiku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-50 dark:bg-gray-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
