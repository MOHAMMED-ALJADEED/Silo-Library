import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, BookOpen, Loader2, ChevronDown } from "lucide-react";
import BookCard from "../components/books/BookCard";
import BookCardSkeleton from "../components/books/BookCardSkeleton";

export default function Books() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialQuery = urlParams.get("q") || "";
  const initialCategory = urlParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPublisher, setSelectedPublisher] = useState("all");
  const [displayCount, setDisplayCount] = useState(24);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["all-books"],
    queryFn: () => base44.entities.Book.list("-created_date", 10000),
    staleTime: 60 * 1000
  });

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = !searchQuery ||
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      const matchesYear = selectedYear === "all" || String(book.year) === selectedYear;
      const matchesPublisher = selectedPublisher === "all" || book.publisher === selectedPublisher;
      return matchesSearch && matchesCategory && matchesYear && matchesPublisher;
    });
  }, [books, searchQuery, selectedCategory, selectedYear, selectedPublisher]);

  // Reset pagination whenever filters change so the user sees fresh results.
  const filterKey = `${searchQuery}|${selectedCategory}|${selectedYear}|${selectedPublisher}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setDisplayCount(24);
  }

  const visibleBooks = useMemo(() => filteredBooks.slice(0, displayCount), [filteredBooks, displayCount]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(books.map((b) => b.year).filter(Boolean))].sort((a, b) => b - a);
    return uniqueYears;
  }, [books]);

  const categories = useMemo(() => {
    return [...new Set(books.map((b) => b.category).filter(Boolean))].sort();
  }, [books]);

  const publishers = useMemo(() => {
    const fromBooks = books.map((b) => b.publisher).filter(Boolean);
    return [...new Set([...fromBooks, "Cambridge University Press"])].sort();
  }, [books]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-primary text-3xl font-bold">All Books</h1>
        <p className="text-muted-foreground mt-1">Browse our complete medical library collection</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or publisher..."
              className="pl-9" />
            
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) =>
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) =>
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={selectedPublisher} onValueChange={setSelectedPublisher}>
            <SelectTrigger>
              <SelectValue placeholder="Publisher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Publishers</SelectItem>
              {publishers.map((pub) =>
              <SelectItem key={pub} value={pub}>{pub}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="flex items-center text-sm text-muted-foreground">
            {filteredBooks.length} of {books.length} book{books.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {isLoading ?
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div> :
      filteredBooks.length === 0 ?
      <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No books found matching your criteria</p>
        </div> :

      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {visibleBooks.map((book) =>
        <BookCard key={book.id} book={book} />
        )}
        </div>
        {displayCount < filteredBooks.length &&
        <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={() => setDisplayCount((c) => c + 24)} className="rounded-full px-8">
              Load More
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        }
      </>
      }
    </div>);

}