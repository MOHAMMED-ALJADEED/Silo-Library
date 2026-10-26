import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollToTop";
import ScrollProgress from "../ui/ScrollProgress";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}