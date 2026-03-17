import { Check, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lecture {
  id: string;
  title: string;
  order_index: number;
  duration_seconds: number | null;
}

interface Week {
  id: string;
  title: string;
  order_index: number;
  lectures: Lecture[];
}

interface CourseSidebarProps {
  weeks: Week[];
  currentLectureId: string;
  completedLectures: Set<string>;
  unlockedLectures: Set<string>;
  onSelectLecture: (lectureId: string) => void;
}

export function CourseSidebar({
  weeks,
  currentLectureId,
  completedLectures,
  unlockedLectures,
  onSelectLecture,
}: CourseSidebarProps) {
  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-r bg-card">
      <div className="p-4">
        <h2 className="font-serif text-sm font-semibold text-muted-foreground uppercase tracking-wider">Course Content</h2>
      </div>
      {weeks.map((week) => (
        <div key={week.id} className="border-t">
          <div className="px-4 py-3 bg-muted/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Week {week.order_index + 1}
            </span>
            <h3 className="text-sm font-medium mt-0.5">{week.title}</h3>
          </div>
          <ul>
            {week.lectures.map((lecture) => {
              const isCompleted = completedLectures.has(lecture.id);
              const isUnlocked = unlockedLectures.has(lecture.id);
              const isCurrent = lecture.id === currentLectureId;

              return (
                <li key={lecture.id}>
                  <button
                    disabled={!isUnlocked}
                    onClick={() => onSelectLecture(lecture.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                      isCurrent && "bg-primary/10 text-primary font-medium",
                      !isCurrent && isUnlocked && "hover:bg-muted/50",
                      !isUnlocked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : !isUnlocked ? (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <PlayCircle className="h-3.5 w-3.5 text-primary" />
                      )}
                    </span>
                    <span className="line-clamp-2">{lecture.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
