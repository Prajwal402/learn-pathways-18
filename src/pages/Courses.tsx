import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/lib/supabase-queries";
import { CourseCard } from "@/components/CourseCard";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Courses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Course Catalog</h1>
          <p className="mt-2 text-muted-foreground">Browse and enroll in structured video-based courses</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                description={course.description}
                instructor_name={course.instructor_name}
                duration_text={course.duration_text}
                thumbnail_url={course.thumbnail_url}
              />
            ))}
            {courses?.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-20">No courses available yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
