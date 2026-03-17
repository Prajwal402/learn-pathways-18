import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCourseBySlug, fetchCourseTree, fetchEnrollment, enrollInCourse } from "@/lib/supabase-queries";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Layers, PlayCircle, User } from "lucide-react";
import { toast } from "sonner";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => fetchCourseBySlug(slug!),
    enabled: !!slug,
  });

  const { data: tree } = useQuery({
    queryKey: ["courseTree", course?.id],
    queryFn: () => fetchCourseTree(course!.id),
    enabled: !!course?.id,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", user?.id, course?.id],
    queryFn: () => fetchEnrollment(user!.id, course!.id),
    enabled: !!user?.id && !!course?.id,
  });

  const enrollMutation = useMutation({
    mutationFn: () => enrollInCourse(user!.id, course!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      toast.success("Enrolled successfully!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const totalLectures = tree?.reduce((acc, w) => acc + w.lectures.length, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10"><Skeleton className="h-96" /></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-fade-in">
            <Badge variant="secondary" className="mb-4">Course</Badge>
            <h1 className="font-serif text-3xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{course.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{course.instructor_name}</span>
              {course.duration_text && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{course.duration_text}</span>}
              <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" />{tree?.length ?? 0} Weeks</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{totalLectures} Lectures</span>
            </div>

            {/* Course curriculum */}
            {tree && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold mb-4">Curriculum</h2>
                <div className="space-y-3">
                  {tree.map((week) => (
                    <div key={week.id} className="rounded-lg border bg-card p-4">
                      <h3 className="text-sm font-semibold">Week {week.order_index + 1}: {week.title}</h3>
                      <ul className="mt-2 space-y-1">
                        {week.lectures.map((lec) => (
                          <li key={lec.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                            {lec.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="sticky top-24 rounded-lg border bg-card p-6">
              {course.thumbnail_url && (
                <img src={course.thumbnail_url} alt={course.title} className="mb-4 rounded-md w-full aspect-video object-cover" />
              )}
              {enrollment ? (
                <Button className="w-full" size="lg" onClick={() => navigate(`/learn/${slug}`)}>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Continue Learning
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      navigate("/auth");
                      return;
                    }
                    enrollMutation.mutate();
                  }}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now — Free"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
