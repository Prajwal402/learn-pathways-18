import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env file manually if --env-file is not used
const envFile = fs.readFileSync(path.resolve(__dirname, "../.env"), "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sqlOutputPath = path.resolve(__dirname, "seed_missing_videos.sql");
const sqlStatements = [];

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

async function searchYouTube(query) {
  // Avoid heavy scraping to prevent rate-limits; use fallback
  return null;
}

const FALLBACK_VIDEOS = [
  "1ukSR1GRtMU", "FTFaQWZBqQ8", "zjkBMFhNj_g", "bLBVXL2banM", "fOvTtapxa9c", "LREJzpqXB4g"
];

function getRandomFallback() {
  const id = FALLBACK_VIDEOS[Math.floor(Math.random() * FALLBACK_VIDEOS.length)];
  return `https://www.youtube.com/watch?v=${id}`;
}

async function run() {
  console.log("Fetching courses...");
  const { data: courses, error } = await supabase.from("courses").select("id, title, duration_text");
  
  if (error) {
    console.error("Failed to fetch courses:", error);
    return;
  }

  console.log(`Found ${courses.length} courses.`);

  for (const course of courses) {
    console.log(`\nProcessing: ${course.title}`);
    
    let expectedWeeks = 6;
    if (course.duration_text) {
      const match = course.duration_text.match(/(\d+)\s+weeks/i);
      if (match) {
        expectedWeeks = parseInt(match[1], 10);
      }
    }
    
    const { data: weeks } = await supabase
      .from("weeks")
      .select("id, order_index, title")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    let currentWeekCount = weeks ? weeks.length : 0;
    
    const allWeeksToProcess = [...(weeks || [])];

    if (currentWeekCount >= expectedWeeks) {
      console.log(`Course already has ${currentWeekCount} weeks (Expected: ${expectedWeeks}).`);
    } else {
      console.log(`Adding missing weeks... (Current: ${currentWeekCount}, Expected: ${expectedWeeks})`);
      
      for (let w = currentWeekCount; w < expectedWeeks; w++) {
        const weekId = crypto.randomUUID();
        const weekTitle = escapeSql(`${course.title}: Week ${w + 1}`);
        
        sqlStatements.push(`INSERT INTO public.weeks (id, course_id, title, order_index) VALUES ('${weekId}', '${course.id}', '${weekTitle}', ${w});`);
        
        allWeeksToProcess.push({
          id: weekId,
          title: `${course.title}: Week ${w + 1}`,
          order_index: w,
          isNew: true
        });
      }
    }

    for (const week of allWeeksToProcess) {
      let currentLectureCount = 0;
      if (!week.isNew) {
        const { data: lectures } = await supabase
          .from("lectures")
          .select("id, order_index")
          .eq("week_id", week.id)
          .order("order_index", { ascending: true });
        currentLectureCount = lectures ? lectures.length : 0;
      }

      const expectedLecturesPerWeek = 2;

      if (currentLectureCount >= expectedLecturesPerWeek) continue;

      console.log(`Week ${week.order_index + 1} (${week.title}) has ${currentLectureCount} lectures. Adding ${expectedLecturesPerWeek - currentLectureCount} more.`);
      
      for (let l = currentLectureCount; l < expectedLecturesPerWeek; l++) {
        const lectureTitle = `Advanced concepts in ${course.title} (Part ${l + 1})`;
        const escapedTitle = escapeSql(lectureTitle);
        const description = escapeSql(`Learn about ${lectureTitle.toLowerCase()} in this comprehensive video.`);
        
        let youtubeUrl = getRandomFallback();
        const searchQuery = `${course.title} tutorial lesson ${l + 1}`;
        const searchResult = await searchYouTube(searchQuery);
        if (searchResult) {
            youtubeUrl = searchResult;
        }

        const lectureId = crypto.randomUUID();
        const duration = 600 + Math.floor(Math.random() * 1200);

        sqlStatements.push(`INSERT INTO public.lectures (id, week_id, title, description, youtube_url, order_index, duration_seconds) VALUES ('${lectureId}', '${week.id}', '${escapedTitle}', '${description}', '${youtubeUrl}', ${l}, ${duration});`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  if (sqlStatements.length > 0) {
    fs.writeFileSync(sqlOutputPath, sqlStatements.join("\n"));
    console.log(`\nSuccessfully generated ${sqlStatements.length} SQL INSERT statements to ${sqlOutputPath}.`);
  } else {
    console.log("\nFinished processing. No missing videos found.");
  }
}

run();
