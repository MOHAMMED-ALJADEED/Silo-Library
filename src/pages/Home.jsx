import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import LiveSearchBar from "../components/books/LiveSearchBar";
import ECGLine from "../components/ui/ECGLine";
import BookCard from "../components/books/BookCard";
import CategoryCard from "../components/books/CategoryCard";
import TopBooksSection from "../components/books/TopBooksSection";

const CATEGORIES = [
"Anatomy", "Physiology", "Biochemistry", "Surgery", "Internal Medicine",
"Cardiology", "Neurology", "Pharmacology", "Pathology", "Radiology",
"Pediatrics", "Dermatology", "Psychiatry", "Ophthalmology", "ENT",
"Orthopedics", "Oncology", "Gastroenterology", "Endocrinology", "Immunology"];



export default function Home() {
  const { data: featuredBooks = [] } = useQuery({
    queryKey: ["featured-books"],
    queryFn: () => base44.entities.Book.filter({ featured: true }, "-created_date", 4)
  });

  const { data: recentBooks = [] } = useQuery({
    queryKey: ["recent-books"],
    queryFn: () => base44.entities.Book.list("-created_date", 8)
  });

  // Reuse the ["all-books"] cache key so this data is shared with the
  // Books page and LiveSearchBar — one fetch instead of three.
  const { data: allBooks = [] } = useQuery({
    queryKey: ["all-books"],
    queryFn: () => base44.entities.Book.list("-created_date", 1000),
    staleTime: 60 * 1000
  });

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = allBooks.filter(b => b.category === cat).length;
      return acc;
    }, {});
  }, [allBooks]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 relative sm:py-28" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b996f05d8251785feba1e6/2a84827f2_IMG_8898.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Silo General<br />
            <span className="medical-library-wave">Medical Library</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Free Medical Books for Students and Doctors
          </p>

          <div className="mt-8 mb-2">
            <ECGLine />
          </div>

          <div className="mt-2">
            <LiveSearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 h-12 transition-all duration-150 hover:scale-[1.03] active:scale-95">
              <Link to="/Books">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Books
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12">
              <Link to="/Categories">
                View Categories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-primary mb-4 text-2xl font-bold">About Our Library</h2>
          <p className="text-muted-foreground leading-relaxed">
            Silo General Medical Library is a free online resource that provides medical textbooks and educational materials for students, doctors, and healthcare professionals around the world. Our mission is to make medical education accessible to everyone.
          </p>
        </div>
      </section>

      {/* Top Books Section */}
      <TopBooksSection allBooks={allBooks} />

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-primary text-2xl font-bold">Medical Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">Browse by medical specialty</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/Categories">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) =>
            <CategoryCard key={cat} category={cat} bookCount={categoryCounts[cat]} />
            )}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 &&
      <section className="py-16 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-primary text-2xl font-bold">Featured Books</h2>
                <p className="text-sm text-muted-foreground mt-1">Handpicked recommendations</p>
              </div>
              <Button asChild variant="ghost" className="text-primary">
                <Link to="/Books">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredBooks.map((book) =>
            <BookCard key={book.id} book={book} />
            )}
            </div>
          </div>
        </section>
      }

      {/* Recently Added */}
      {recentBooks.length > 0 &&
      <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-primary text-2xl font-bold">Recently Added</h2>
                <p className="text-sm text-muted-foreground mt-1">Latest additions to our library</p>
              </div>
              <Button asChild variant="ghost" className="text-primary">
                <Link to="/Books">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {recentBooks.map((book) =>
            <BookCard key={book.id} book={book} />
            )}
            </div>
          </div>
        </section>
      }
    </div>);

}