import type { Metadata } from "next";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Tasks | Task Manager",
};

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}