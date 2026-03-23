import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getThumbnailUrl } from "@/lib/utils";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  instructor_name: string;
  duration_text: string | null;
  thumbnail_url: string | null;
  first_lecture_youtube_url?: string | null;
}

export function CourseCard({ 
  slug, title, description, instructor_name, duration_text, thumbnail_url, first_lecture_youtube_url 
}: CourseCardProps) {
  // Prioritize the first lecture's thumbnail to match the "inside" view
  const displayThumbnail = getThumbnailUrl(first_lecture_youtube_url || thumbnail_url);

  return (
    <Link to={`/courses/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video bg-muted overflow-hidden">
          {displayThumbnail ? (
            <img src={displayThumbnail} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary/10">
              <span className="font-serif text-2xl font-bold text-primary/40">{title[0]}</span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-serif text-lg font-semibold leading-tight line-clamp-2">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{instructor_name}</span>
            {duration_text && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duration_text}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
