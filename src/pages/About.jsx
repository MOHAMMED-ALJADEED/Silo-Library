import React from "react";
import { BookOpen, GraduationCap, Globe, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Free Access",
    description: "All medical textbooks and resources are available completely free of charge."
  },
  {
    icon: GraduationCap,
    title: "Educational Focus",
    description: "Curated content designed for medical students, residents, and healthcare professionals."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Accessible from anywhere in the world, breaking barriers to medical education."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built and maintained by a community passionate about medical education."
  }
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">About Silo General Medical Library</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Silo General Medical Library is an online educational project that aims to provide easy access to medical textbooks and learning resources for students and healthcare professionals worldwide.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We believe that access to quality medical education should not be limited by geography or financial constraints. Our mission is to create a comprehensive, freely accessible digital library that serves as a trusted resource for the global medical community.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Whether you are a first-year medical student studying anatomy, a resident preparing for board exams, or a practicing physician looking for a quick reference, Silo General Medical Library is here to support your learning journey.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {features.map((feature) => (
          <div key={feature.title} className="bg-card rounded-xl border border-border p-6">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Audience */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/30 to-background rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Who We Serve</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Our library is designed for medical students, doctors, nurses, pharmacists, researchers, and all healthcare professionals who are committed to lifelong learning and providing the best possible care to their patients.
        </p>
      </div>
    </div>
  );
}