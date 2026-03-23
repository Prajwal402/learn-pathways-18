import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { CertificateModal } from "@/components/CertificateModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

interface CompletedCourse {
  id: string;
  title: string;
  slug: string;
  instructor_name: string;
  thumbnail_url: string | null;
  completed_at: string;
  total: number;
  completed: number;
}

export default function MyCertificates() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<CompletedCourse | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("name, email").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: completedCourses, isLoading } = useQuery({
    queryKey: ["completedCourses", user?.id],
    queryFn: async () => {
      // Get enrolled courses
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      if (!enrollments?.length) return [];

      const courseIds = enrollments.map((e) => e.course_id);
      const { data: courses } = await supabase.from("courses").select("*").in("id", courseIds);
      if (!courses?.length) return [];

      const results: CompletedCourse[] = [];

      for (const course of courses) {
        const { data: weeks } = await supabase.from("weeks").select("id").eq("course_id", course.id);
        if (!weeks?.length) continue;

        const { data: lectures } = await supabase
          .from("lectures")
          .select("id")
          .in("week_id", weeks.map((w) => w.id));
        if (!lectures?.length) continue;

        const { data: progress } = await supabase
          .from("lecture_progress")
          .select("*")
          .eq("user_id", user!.id)
          .in("lecture_id", lectures.map((l) => l.id))
          .eq("is_completed", true);

        const completedCount = progress?.length ?? 0;
        if (completedCount === lectures.length) {
          const latestCompletion = progress
            ?.map((p) => p.completed_at)
            .filter(Boolean)
            .sort()
            .reverse()[0];

          results.push({
            id: course.id,
            title: course.title,
            slug: course.slug,
            instructor_name: course.instructor_name,
            thumbnail_url: course.thumbnail_url,
            completed_at: latestCompletion || new Date().toISOString(),
            total: lectures.length,
            completed: completedCount,
          });
        }
      }

      return results;
    },
    enabled: !!user?.id,
  });

  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold">My Certificates</h1>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : completedCourses?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
              >
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Instructor: {course.instructor_name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Completed on{" "}
                      {new Date(course.completed_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Certificate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">No certificates yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete a course to earn your certificate!
            </p>
            <Button className="mt-6" onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </div>
        )}
      </main>

      {selectedCourse && (
        <CertificateModal
          open={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          studentName={profile?.name || user?.email || "Student"}
          courseName={selectedCourse.title}
          instructorName={selectedCourse.instructor_name}
          completionDate={new Date(selectedCourse.completed_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      )}
    </div>
  );
}
