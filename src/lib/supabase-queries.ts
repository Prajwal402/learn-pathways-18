import { supabase } from "@/integrations/supabase/client";

export async function fetchCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCourseTree(courseId: string) {
  const { data: weeks, error: weeksError } = await supabase
    .from("weeks")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");
  if (weeksError) throw weeksError;

  const weekIds = weeks.map((w) => w.id);
  const { data: lectures, error: lecturesError } = await supabase
    .from("lectures")
    .select("*")
    .in("week_id", weekIds)
    .order("order_index");
  if (lecturesError) throw lecturesError;

  return weeks.map((week) => ({
    ...week,
    lectures: lectures.filter((l) => l.week_id === week.id),
  }));
}

export async function fetchEnrollment(userId: string, courseId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data;
}

export async function enrollInCourse(userId: string, courseId: string) {
  const { error } = await supabase
    .from("enrollments")
    .insert({ user_id: userId, course_id: courseId });
  if (error) throw error;
}

export async function fetchCourseProgress(userId: string, courseId: string) {
  // Get all lectures for this course
  const { data: weeks } = await supabase
    .from("weeks")
    .select("id")
    .eq("course_id", courseId);
  if (!weeks?.length) return [];

  const { data: lectures } = await supabase
    .from("lectures")
    .select("id")
    .in("week_id", weeks.map((w) => w.id));
  if (!lectures?.length) return [];

  const { data: progress } = await supabase
    .from("lecture_progress")
    .select("*")
    .eq("user_id", userId)
    .in("lecture_id", lectures.map((l) => l.id));

  return progress || [];
}

export async function fetchLectureProgress(userId: string, lectureId: string) {
  const { data } = await supabase
    .from("lecture_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lecture_id", lectureId)
    .maybeSingle();
  return data;
}

export async function updateLectureProgress(
  userId: string,
  lectureId: string,
  lastPosition: number,
  isCompleted: boolean
) {
  const { error } = await supabase
    .from("lecture_progress")
    .upsert(
      {
        user_id: userId,
        lecture_id: lectureId,
        last_position_seconds: lastPosition,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lecture_id" }
    );
  if (error) throw error;
}
