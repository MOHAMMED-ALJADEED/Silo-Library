import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";

function BookCard({ book }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(book.id);

  return (
    <div className="group relative block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(book); }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm transition-all hover:scale-110 ${fav ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
        title={fav ? "Remove from My Library" : "Save to My Library"}
      >
        <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
      </button>
    <Link
      to={`/BookDetail?id=${book.id}`}
      className="block">
      
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        {book.cover_image ?
        <img
          src={book.cover_image}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :


        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 to-accent">
            <BookOpen className="w-10 h-10 text-primary/40" />
            <span className="text-xs text-muted-foreground font-medium px-4 text-center">{book.title}</span>
          </div>
        }
      </div>
      <div className="p-4">
        <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2 text-xs">{book.category}</Badge>
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5">{book.author}</p>
        {book.year && <p className="text-xs text-muted-foreground mt-0.5">{book.year}</p>}
      </div>
    </Link>
    </div>);
}

export default memo(BookCard);