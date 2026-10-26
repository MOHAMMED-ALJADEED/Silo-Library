import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Heart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useFavorites } from "../hooks/useFavorites";

export default function MyLibrary() {
  const { favoriteIds, removeFavorite } = useFavorites();

  const { data: allBooks = [], isLoading } = useQuery({
    queryKey: ["all-books"],
    queryFn: () => base44.entities.Book.list("-created_date", 1000),
  });

  const favorites = favoriteIds
    .map((id) => allBooks.find((b) => b.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
        </div>
        <p className="text-muted-foreground">Your saved books for quick access</p>
      </div>

      {favorites.length === 0 && !isLoading ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">No saved books yet</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Browse the library and click the heart icon to save books here.
          </p>
          <Button asChild>
            <Link to="/Books">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Books
            </Link>
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">{favorites.length} saved book{favorites.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {favorites.map((book) => (
              <div key={book.id} className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <Link to={`/BookDetail?id=${book.id}`}>
                  <div className="aspect-[3/4] bg-muted overflow-hidden">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 to-accent">
                        <BookOpen className="w-10 h-10 text-primary/40" />
                        <span className="text-xs text-muted-foreground font-medium px-4 text-center">{book.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 pb-2">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2 text-xs">{book.category}</Badge>
                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">{book.author}</p>
                    {book.year && <p className="text-xs text-muted-foreground mt-0.5">{book.year}</p>}
                  </div>
                </Link>
                <div className="px-4 pb-3">
                  <button
                    onClick={() => removeFavorite(book.id)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}