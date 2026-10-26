import React from "react";
import BookCard from "./BookCard";

const TOP_LISTS = [
  {
    heading: "Top Anatomy",
    titles: [
      "Netter Atlas of Human Anatomy: A Systems Approach",
      "Netter's Atlas of Human Anatomy (7th Edition)",
      "Atlas of Anatomy (4th Edition)",
      "Gray's Atlas of Anatomy (3rd Edition)",
      "Abrahams' & McMinn's Clinical Atlas of Human Anatomy (8th Edition)"
    ]
  },
  {
    heading: "Top Surgery",
    titles: [
      "Textbook of Surgery",
      "Fundamentals of Operative Surgery",
      "Essential Surgical Practice",
      "Schwartz's Principles of Surgery (11th Edition)",
      "Schwartz's Principles of Surgery"
    ]
  }
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function TopBooksSection({ allBooks }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-primary text-2xl font-bold">Top Books</h2>
          <p className="text-sm text-muted-foreground mt-1">Most-read titles by specialty</p>
        </div>

        <div className="space-y-12">
          {TOP_LISTS.map((list) => {
            const ranked = list.titles
              .map((title, idx) => {
                const book = allBooks.find((b) => norm(b.title) === norm(title));
                return book ? { book, rank: idx + 1 } : null;
              })
              .filter(Boolean);

            if (ranked.length === 0) return null;

            return (
              <div key={list.heading}>
                <h3 className="text-lg font-semibold text-foreground mb-4">{list.heading}</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
                  {ranked.map(({ book, rank }) => (
                    <div
                      key={book.id}
                      className="flex items-end gap-2 shrink-0 snap-start"
                    >
                      <span className="text-5xl sm:text-6xl font-extrabold leading-none w-10 text-center bg-gradient-to-b from-primary to-primary/30 bg-clip-text text-transparent select-none">
                        {rank}
                      </span>
                      <div className="w-40 sm:w-44">
                        <BookCard book={book} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}