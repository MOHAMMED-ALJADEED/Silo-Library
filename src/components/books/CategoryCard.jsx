import React from "react";
import { Link } from "react-router-dom";
import {
  Heart, Brain, Bone, Pill, Microscope, Scan,
  Baby, Stethoscope, Activity, Flower2,
  Zap, FlaskConical, Layers, Eye, Ear, Dumbbell,
  AlertCircle, HeartPulse, Home, ClipboardList,
  Shield, Droplets, ShieldCheck, Filter, Utensils,
  TrendingUp, Bug, Droplet, Wind, Globe, BarChart2, Users
} from "lucide-react";

const categoryIcons = {
  Anatomy: Bone,
  Physiology: Zap,
  Biochemistry: FlaskConical,
  Histology: Layers,
  Embryology: Users,
  Microbiology: Bug,
  Pathology: Microscope,
  Pharmacology: Pill,
  Surgery: Stethoscope,
  "Internal Medicine": Activity,
  Cardiology: Heart,
  Neurology: Brain,
  Dermatology: Flower2,
  Psychiatry: HeartPulse,
  Ophthalmology: Eye,
  ENT: Ear,
  Orthopedics: Dumbbell,
  Radiology: Scan,
  Pediatrics: Baby,
  "Gynecology & Obstetrics": Heart,
  "Emergency Medicine": AlertCircle,
  "Critical Care": HeartPulse,
  "Family Medicine": Home,
  "General Practice": ClipboardList,
  Oncology: Shield,
  Hematology: Droplets,
  Immunology: ShieldCheck,
  Nephrology: Filter,
  Gastroenterology: Utensils,
  Endocrinology: TrendingUp,
  "Infectious Diseases": Bug,
  Urology: Droplet,
  Anesthesiology: Wind,
  "Public Health": Globe,
  Epidemiology: BarChart2
};

export default function CategoryCard({ category, bookCount }) {
  const Icon = categoryIcons[category] || Stethoscope;

  return (
    <Link
      to={`/Books?category=${encodeURIComponent(category)}`}
      className="group flex flex-col items-center gap-3 p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      
      <div className="bg-primary rounded-xl w-14 h-14 flex items-center justify-center group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {category}
        </h3>
        {bookCount !== undefined &&
        <p className="text-xs text-muted-foreground mt-1">{bookCount} books</p>
        }
      </div>
    </Link>);

}