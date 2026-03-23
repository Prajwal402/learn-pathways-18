import { useQuery } from "@tanstack/react-query";
import { fetchMyCourses } from "@/lib/supabase-queries";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function MyCourses() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["myCourses", user?.id],
    queryFn: () => fetchMyCourses(user!.id),
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-serif text-3xl font-bold mb-8">My Courses</h1>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        ) : courses?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} slug={c.slug} title={c.title} description={c.description} instructor_name={c.instructor_name} duration_text={c.duration_text} thumbnail_url={c.thumbnail_url} first_lecture_youtube_url={(c as any).first_lecture_youtube_url} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">You haven't enrolled in any courses yet.</p>
        )}
      </main>
    </div>
  );
}
