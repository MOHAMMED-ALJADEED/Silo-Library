import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "../components/books/CategoryCard";

const CATEGORIES = [
  "Anatomy", "Physiology", "Biochemistry", "Histology", "Embryology",
  "Microbiology", "Pathology", "Pharmacology", "Surgery", "Internal Medicine",
  "Cardiology", "Neurology", "Dermatology", "Psychiatry", "Ophthalmology",
  "ENT", "Orthopedics", "Radiology", "Pediatrics", "Gynecology & Obstetrics",
  "Emergency Medicine", "Critical Care", "Family Medicine", "General Practice",
  "Oncology", "Hematology", "Immunology", "Nephrology", "Gastroenterology",
  "Endocrinology", "Infectious Diseases", "Urology", "Anesthesiology",
  "Public Health", "Epidemiology"
];

export default function Categories() {
  const { data: books = [] } = useQuery({
    queryKey: ["all-books-categories"],
    queryFn: () => base44.entities.Book.list("-created_date", 1000),
  });

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = books.filter(b => b.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Medical Categories</h1>
        <p className="text-muted-foreground mt-1">Browse all {CATEGORIES.length} medical specialties</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat} category={cat} bookCount={categoryCounts[cat]} />
        ))}
      </div>
    </div>
  );
}