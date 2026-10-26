import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, ArrowLeft, Calendar, User, Loader2, Tag, Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import BookCard from "../components/books/BookCard";

function safeUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    // invalid URL — fall through
  }
  return null;
}

export default function BookDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const bookId = urlParams.get("id");
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const books = await base44.entities.Book.filter({ id: bookId });
      return books[0];
    },
    enabled: !!bookId,
  });

  const { data: relatedBooks = [] } = useQuery({
    queryKey: ["related-books", book?.category],
    queryFn: () => base44.entities.Book.filter({ category: book.category }, "-created_date", 1000),
    enabled: !!book?.category,
  });

  const filteredRelated = useMemo(() => {
    if (!book || !relatedBooks.length) return [];

    const STOP_WORDS = new Set([
      "at", "a", "the", "of", "in", "and", "for", "to", "with", "an", "or", "on", "by",
      "edition", "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
      "eighth", "ninth", "tenth", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th",
      "8th", "9th", "10th", "volume", "vol", "part", "guide", "handbook", "textbook"
    ]);

    const titleWords = book.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    const authorWords = (book.author || "").toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    const scored = relatedBooks
      .filter(b => b.id !== book.id)
      .map(b => {
        const bTitleLower = b.title.toLowerCase();
        const bAuthorLower = (b.author || "").toLowerCase();

        let titleScore = 0;
        for (const word of titleWords) {
          if (bTitleLower.includes(word)) titleScore += 3;
        }

        let authorScore = 0;
        for (const word of authorWords) {
          if (bAuthorLower.includes(word)) authorScore += 2;
        }

        return { book: b, score: titleScore + authorScore };
      })
      .sort((a, b) => b.score - a.score);

    const seriesMatches = scored
      .filter(({ score }) => score > 0)
      .slice(0, 4)
      .map(({ book }) => book);

    // Fill remaining slots with other books from the same category
    if (seriesMatches.length < 4) {
      const used = new Set(seriesMatches.map(b => b.id));
      const fillers = scored
        .filter(({ book: b }) => !used.has(b.id))
        .slice(0, 4 - seriesMatches.length)
        .map(({ book }) => book);
      return [...seriesMatches, ...fillers];
    }

    return seriesMatches;
  }, [book, relatedBooks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">Book not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
            {book.cover_image ? (
              <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 to-accent">
                <BookOpen className="w-16 h-16 text-primary/30" />
                <span className="text-sm text-muted-foreground font-medium px-6 text-center">{book.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <Badge variant="secondary" className="mb-3">
            <Tag className="w-3 h-3 mr-1" />
            {book.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{book.title}</h1>

          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {book.author}
            </div>
            {book.year && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {book.year}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button
              variant="outline"
              size="lg"
              className={`rounded-full px-8 h-12 ${isFavorite(book.id) ? "border-red-400 text-red-500 hover:bg-red-50" : ""}`}
              onClick={() => toggleFavorite(book)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite(book.id) ? "fill-current" : ""}`} />
              {isFavorite(book.id) ? "Saved to My Library" : "Save to My Library"}
            </Button>
            {safeUrl(book.pdf_url) && (
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-md">
                <a href={safeUrl(book.pdf_url)} target="_blank" rel="noopener noreferrer">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
            {safeUrl(book.read_online_url) && (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12">
                <a href={safeUrl(book.read_online_url)} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Online
                </a>
              </Button>
            )}
            {!safeUrl(book.read_online_url) && !safeUrl(book.pdf_url) && (
              <p className="text-sm text-muted-foreground italic">Download links coming soon.</p>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-foreground mb-3">About This Book</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Books */}
      {filteredRelated.length > 0 && (
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredRelated.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}