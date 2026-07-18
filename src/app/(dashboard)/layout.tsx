"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-mesh flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex flex-1 flex-col transition-all duration-250">
        <Topbar />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
