import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCourseBySlug, fetchCourseTree, fetchEnrollment, fetchCourseProgress, fetchLectureProgress, updateLectureProgress } from "@/lib/supabase-queries";
import { useAuth } from "@/hooks/useAuth";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { CourseSidebar } from "@/components/CourseSidebar";
import { AIChatPanel } from "@/components/AIChatPanel";
import { CertificateModal } from "@/components/CertificateModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, X, Sparkles, Award } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Learn() {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certShownForCourse, setCertShownForCourse] = useState(false);

  const { data: course } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => fetchCourseBySlug(slug!),
    enabled: !!slug,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", user?.id, course?.id],
    queryFn: () => fetchEnrollment(user!.id, course!.id),
    enabled: !!user?.id && !!course?.id,
  });

  const { data: tree } = useQuery({
    queryKey: ["courseTree", course?.id],
    queryFn: () => fetchCourseTree(course!.id),
    enabled: !!course?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("name, email").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: progressList } = useQuery({
    queryKey: ["courseProgress", user?.id, course?.id],
    queryFn: () => fetchCourseProgress(user!.id, course!.id),
    enabled: !!user?.id && !!course?.id,
  });

  // Flatten lectures
  const allLectures = useMemo(() => {
    if (!tree) return [];
    return tree.flatMap((w) => w.lectures);
  }, [tree]);

  const completedSet = useMemo(() => {
    const s = new Set<string>();
    progressList?.forEach((p) => { if (p.is_completed) s.add(p.lecture_id); });
    return s;
  }, [progressList]);

  // Unlocked: first lecture always unlocked, subsequent if previous completed
  const unlockedSet = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i < allLectures.length; i++) {
      if (i === 0 || completedSet.has(allLectures[i - 1].id)) {
        s.add(allLectures[i].id);
      }
    }
    return s;
  }, [allLectures, completedSet]);

  // Set initial lecture
  useEffect(() => {
    if (!currentLectureId && allLectures.length > 0) {
      // Find first incomplete lecture
      const first = allLectures.find((l) => !completedSet.has(l.id) && unlockedSet.has(l.id));
      setCurrentLectureId(first?.id ?? allLectures[0].id);
    }
  }, [allLectures, completedSet, unlockedSet, currentLectureId]);

  // Redirect if not enrolled
  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (course && user && enrollment === null) navigate(`/courses/${slug}`);
  }, [authLoading, user, enrollment, course, slug, navigate]);

  const currentLecture = allLectures.find((l) => l.id === currentLectureId);
  const currentIndex = allLectures.findIndex((l) => l.id === currentLectureId);

  const { data: lectureProgress } = useQuery({
    queryKey: ["lectureProgress", user?.id, currentLectureId],
    queryFn: () => fetchLectureProgress(user!.id, currentLectureId!),
    enabled: !!user?.id && !!currentLectureId,
  });

  const handleProgress = useCallback(async (seconds: number) => {
    if (!user || !currentLectureId) return;
    await updateLectureProgress(user.id, currentLectureId, seconds, false);
  }, [user, currentLectureId]);

  const handleEnd = useCallback(async () => {
    if (!user || !currentLectureId) return;
    await updateLectureProgress(user.id, currentLectureId, 0, true);
    queryClient.invalidateQueries({ queryKey: ["courseProgress"] });
    queryClient.invalidateQueries({ queryKey: ["lectureProgress"] });
    toast.success("Lecture completed!");

    // Check if all lectures are now completed
    const newCompleted = new Set(completedSet);
    newCompleted.add(currentLectureId);
    if (allLectures.length > 0 && newCompleted.size === allLectures.length && !certShownForCourse) {
      setCertShownForCourse(true);
      setTimeout(() => setCertModalOpen(true), 800);
    }
  }, [user, currentLectureId, queryClient, completedSet, allLectures, certShownForCourse]);

  const goToLecture = (index: number) => {
    const lec = allLectures[index];
    if (lec && unlockedSet.has(lec.id)) {
      setCurrentLectureId(lec.id);
    }
  };

  const progressPercent = allLectures.length > 0
    ? Math.round((completedSet.size / allLectures.length) * 100)
    : 0;

  if (!course || !tree) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 transition-transform lg:relative lg:translate-x-0`}>
        <CourseSidebar
          weeks={tree}
          currentLectureId={currentLectureId ?? ""}
          completedLectures={completedSet}
          unlockedLectures={unlockedSet}
          onSelectLecture={setCurrentLectureId}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b bg-card px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate(`/courses/${slug}`)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to course
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{progressPercent}% complete</span>
            <div className="progress-bar w-32">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {currentLecture && (
            <>
              <YouTubePlayer
                key={currentLectureId}
                videoId={currentLecture.youtube_url}
                startSeconds={lectureProgress?.last_position_seconds ?? 0}
                onProgress={handleProgress}
                onEnd={handleEnd}
              />

              <div className="mt-6">
                <h1 className="font-serif text-2xl font-bold">{currentLecture.title}</h1>
                {currentLecture.description && (
                  <p className="mt-2 text-muted-foreground">{currentLecture.description}</p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={currentIndex <= 0}
                  onClick={() => goToLecture(currentIndex - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setAiPanelOpen(true)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Ask AI
                </Button>
                <Button
                  disabled={currentIndex >= allLectures.length - 1 || !unlockedSet.has(allLectures[currentIndex + 1]?.id)}
                  onClick={() => goToLecture(currentIndex + 1)}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        open={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        courseTitle={course?.title}
        lectureTitle={currentLecture?.title}
        lectureDescription={currentLecture?.description ?? undefined}
      />
    </div>
  );
}
