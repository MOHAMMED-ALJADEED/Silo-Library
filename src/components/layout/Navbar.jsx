import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import MenuIcon from "./MenuIcon";

const navLinks = [
{ label: "My Library", path: "/MyLibrary" },
{ label: "Home", path: "/Home" },
{ label: "Browse Books", path: "/Books" },
{ label: "Categories", path: "/Categories" },
{ label: "About", path: "/About" },
{ label: "Contact", path: "/Contact" }];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/Home";

  const headerClass = isHome
    ? "absolute top-0 left-0 right-0 z-50 bg-transparent"
    : "sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border";
  const brandPrimary = isHome ? "text-white drop-shadow" : "text-foreground";
  const brandSecondary = isHome ? "text-white/80 drop-shadow" : "text-muted-foreground";
  const menuBtnClass = isHome ? "text-white hover:bg-white/10" : "text-foreground hover:bg-accent";
  const panelClass = isHome ? "bg-transparent" : "bg-background/80 backdrop-blur-md";
  const linkActive = isHome ? "text-white" : "text-primary bg-accent";
  const linkIdle = isHome
    ? "text-white hover:bg-white/10"
    : "text-muted-foreground hover:text-foreground hover:bg-muted";
  const panelBorder = isHome ? "border-transparent" : "border-border";
  const modeLabel = isHome ? "text-white" : "text-foreground";

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/Home" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <img
              src="https://media.base44.com/images/public/69b996f05d8251785feba1e6/7f3046e56_IMG_8894.png"
              alt="Silo General Medical Library"
              className="w-14 h-14 object-contain"
              style={{}} />

            
            <div>
              <p className={`text-[11px] sm:text-sm font-bold leading-tight ${brandPrimary}`}>Silo General</p>
              <p className={`text-[10px] sm:text-xs leading-tight ${brandSecondary}`}>Medical Library</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={menuBtnClass}
              onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon open={mobileOpen} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className={`overflow-hidden ${panelClass}`}>
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) =>
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * navLinks.indexOf(link), duration: 0.2 }}>
              <Link
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path ? linkActive : linkIdle}`
                }>
              
                  {link.label}
                </Link>
            </motion.div>
          )}
          <div className={`flex items-center justify-between px-3 pt-3 mt-2 border-t ${panelBorder}`}>
            <span className={`text-sm font-medium ${modeLabel}`}>Switch mode</span>
            <ThemeToggle />
          </div>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>);

}