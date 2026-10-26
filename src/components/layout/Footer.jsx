import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69b996f05d8251785feba1e6/77887ecf4_Image170726at520PM.jpeg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/85 dark:bg-black/75" aria-hidden="true" />
      {/* Footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="https://media.base44.com/images/public/69b996f05d8251785feba1e6/7f3046e56_IMG_8894.png"
                alt="Silo General Medical Library"
                className="w-14 h-14 object-contain"
              />
              <div>
                <p className="text-foreground text-sm font-bold leading-tight">Silo General</p>
                <p className="text-muted-foreground text-xs leading-tight">Medical Library</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Free medical books and educational resources for students, doctors, and healthcare professionals worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-primary mb-4 text-sm font-semibold">Quick Links</h4>
            <div className="space-y-2.5">
              <Link to="/Home" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/Books" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Browse Books</Link>
              <Link to="/Categories" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link>
              <Link to="/About" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/Contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-primary mb-4 text-sm font-semibold">Popular Categories</h4>
            <div className="space-y-2.5">
              <Link to="/Categories?cat=Anatomy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Anatomy</Link>
              <Link to="/Categories?cat=Surgery" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Surgery</Link>
              <Link to="/Categories?cat=Internal Medicine" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Internal Medicine</Link>
              <Link to="/Categories?cat=Pharmacology" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Pharmacology</Link>
              <Link to="/Categories?cat=Pathology" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Pathology</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col items-center gap-4">
          <a
            href="https://www.instagram.com/silomri?igsh=MXJiaDdkYm5mano0aQ=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram page"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Silo General Medical Library. All rights reserved. Educational use only.
          </p>
        </div>
      </div>
    </footer>);

}