import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, BookOpen, X, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
"Anatomy", "Physiology", "Biochemistry", "Surgery", "Internal Medicine",
"Cardiology", "Neurology", "Pharmacology", "Pathology", "Radiology",
"Pediatrics", "Ophthalmology", "Orthopedics", "Oncology", "Gastroenterology"];


export default function LiveSearchBar() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Reuse ["all-books"] cache key shared with Books page — avoids a
  // duplicate 10k-book fetch when navigating between Home and Books.
  const { data: allBooks = [] } = useQuery({
    queryKey: ["all-books"],
    queryFn: () => base44.entities.Book.list("-created_date", 10000),
    staleTime: 60 * 1000
  });

  const results = useMemo(() => {
    if (!query.trim() && selectedCategory === "all") return [];
    const q = query.toLowerCase().trim();

    return allBooks.
    filter((book) => {
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      if (!q) return matchesCategory;
      const matchesSearch =
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      book.category?.toLowerCase().includes(q) ||
      book.publisher?.toLowerCase().includes(q) ||
      book.description?.toLowerCase().includes(q);
      return matchesSearch && matchesCategory;
    }).
    sort((a, b) => {
      // Relevance: title match first
      const aTitle = a.title?.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      const bTitle = b.title?.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      if (aTitle !== bTitle) return aTitle - bTitle;
      return (b.year || 0) - (a.year || 0);
    }).
    slice(0, 8);
  }, [query, selectedCategory, allBooks]);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const titles = allBooks.
    filter((b) => b.title?.toLowerCase().startsWith(q)).
    slice(0, 5).
    map((b) => b.title);
    return [...new Set(titles)].slice(0, 5);
  }, [query, allBooks]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() && selectedCategory === "all") return;
    setIsOpen(false);
    navigate(`/Books?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedCategory("all");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && (results.length > 0 || suggestions.length > 0 || query.length === 0);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        {/* Main Search Input */}
        <div className="relative flex items-center bg-card rounded-full border border-border shadow-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {setQuery(e.target.value);setIsOpen(true);}}
            onFocus={() => setIsOpen(true)}
            placeholder="Search by title, author, publisher..."
            className="w-full pl-12 pr-4 h-14 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none rounded-full" />
          
          {query &&
          <button type="button" onClick={handleClear} className="absolute right-28 p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          }
          <button
            type="submit"
            className="absolute right-1.5 h-11 px-6 text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors bg-[hsl(var(--primary))]">
            
            Search
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          <button
            type="button"
            onClick={() => {setSelectedCategory("all");setIsOpen(true);}}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === "all" ?
            "bg-primary text-primary-foreground" :
            "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"}`
            }>
            
            All
          </button>
          {CATEGORIES.slice(0, 10).map((cat) =>
          <button
            key={cat}
            type="button"
            onClick={() => {setSelectedCategory(cat);setIsOpen(true);}}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === cat ?
            "bg-primary text-primary-foreground" :
            "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"}`
            }>
            
              {cat}
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown &&
      <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 &&
        <div className="border-b border-border">
              {suggestions.map((s, i) =>
          <button
            key={i}
            type="button"
            onClick={() => {setQuery(s);setIsOpen(false);navigate(`/Books?q=${encodeURIComponent(s)}`);}}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-accent/50 transition-colors">
            
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{s}</span>
                </button>
          )}
            </div>
        }

          {/* Live Results */}
          {results.length > 0 ?
        <>
              <div className="px-4 py-2 text-xs text-muted-foreground font-medium flex items-center gap-1.5 border-b border-border">
                <TrendingUp className="w-3 h-3" />
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.map((book) =>
            <Link
              key={book.id}
              to={`/BookDetail?id=${book.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors border-b border-border/50 last:border-0">
              
                    {book.cover_image ?
              <img src={book.cover_image} alt={book.title} loading="lazy" className="w-10 h-14 object-cover rounded-md shrink-0" /> :

              <div className="w-10 h-14 bg-accent rounded-md flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-primary/50" />
                      </div>
              }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{book.category}</span>
                        {book.year && <span className="text-xs text-muted-foreground">{book.year}</span>}
                      </div>
                    </div>
                  </Link>
            )}
              </div>
              <div className="p-3 border-t border-border">
                <button
              type="button"
              onClick={() => {setIsOpen(false);navigate(`/Books?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);}}
              className="w-full text-center text-sm text-primary font-medium hover:underline">
              
                  View all results →
                </button>
              </div>
            </> :
        query.trim() ?
        <div className="px-4 py-8 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No books found for "<strong>{query}</strong>"</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try a different keyword or browse by category</p>
            </div> :
        null}
        </div>
      }
    </div>);

}