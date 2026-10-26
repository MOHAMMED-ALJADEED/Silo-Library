import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ size = "default", initialQuery = "", onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/Books?q=${encodeURIComponent(query)}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center ${isLarge ? "max-w-2xl" : "max-w-lg"} mx-auto`}>
        <Search className={`absolute left-4 text-muted-foreground ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or specialty..."
          className={`${isLarge ? "pl-12 pr-32 h-14 text-base" : "pl-10 pr-24 h-11 text-sm"} rounded-full border-border bg-card shadow-sm focus-visible:ring-primary`} />
        
        <Button
          type="submit" className={`absolute right-1.5 rounded-full ${isLarge ? "h-11 px-6" : "h-8 px-4 text-sm"}`}>

          
          Search
        </Button>
      </div>
    </form>);

}