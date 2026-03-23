import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/lib/supabase-queries";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PlayCircle, TrendingUp } from "lucide-react";

export default function Index() {
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl animate-fade-in">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Learn at Your Own Pace with Structured Video Courses
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enroll in expert-led courses, watch video lectures week by week, and track your progress — all for free.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/courses">
              <Button size="lg">
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card py-16">
        <div className="container grid gap-8 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "Structured Learning", desc: "Courses organized into weeks and lectures for systematic progress" },
            { icon: PlayCircle, title: "Video-Based", desc: "High-quality video lectures you can watch anytime, anywhere" },
            { icon: TrendingUp, title: "Track Progress", desc: "Monitor your completion across all enrolled courses" },
          ].map((f) => (
            <div key={f.title} className="text-center animate-fade-in">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      {courses && courses.length > 0 && (
        <section className="container py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Featured Courses</h2>
            <Link to="/courses" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <CourseCard key={c.id} slug={c.slug} title={c.title} description={c.description} instructor_name={c.instructor_name} duration_text={c.duration_text} thumbnail_url={c.thumbnail_url} first_lecture_youtube_url={(c as any).first_lecture_youtube_url} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LearnHub. Built for learning.
        </div>
      </footer>
    </div>
  );
}
