-- ============================================================
-- FIX ALL COURSE VIDEOS WITH REAL YOUTUBE URLS
-- Run this in Supabase SQL Editor
-- ============================================================

-- APPROACH: For each course slug, update the lectures in Week 1 and Week 2
-- (the initial weeks) with real, relevant YouTube videos.
-- Later weeks (added by seed_missing_videos.sql) will be handled by bulk update.

-- ============================================================
-- STEP 1: Update Week 1 & 2 lectures per course with real videos
-- ============================================================

-- Data Structures & Algorithms
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=RBSGKlAvoiM'  -- Data Structures Easy to Advanced
  WHEN 1 THEN 'https://www.youtube.com/watch?v=09_LlHjoEiY'  -- Sorting Algorithms
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'data-structures-and-algorithms' AND w.order_index < 2
);

-- Web Development Fundamentals
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=qz0aGYrrlhU'  -- HTML Tutorial Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=1Rs2ND1ryYc'  -- CSS Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'web-development-fundamentals' AND w.order_index < 2
);

-- Introduction to Machine Learning
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=Gv9_4yMHFhI'  -- Intro to ML - Google
  WHEN 1 THEN 'https://www.youtube.com/watch?v=ukzFI9rgwfU'  -- Machine Learning Algorithms
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'introduction-to-machine-learning' AND w.order_index < 2
);

-- Computer Networks
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=3QhU9jd03a0'  -- Computer Networks - Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=vv4y_uOneC0'  -- TCP/IP Model
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'computer-networks' AND w.order_index < 2
);

-- Python for Data Science
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=r-uOLxNrNk8'  -- Python for Data Science
  WHEN 1 THEN 'https://www.youtube.com/watch?v=vmEHCJofslg'  -- Pandas Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'python-for-data-science' AND w.order_index < 2
);

-- Database Management Systems
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=HXV3zeQKqGY'  -- SQL Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=ztHopE5Wnpc'  -- Database Design
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'database-management-systems' AND w.order_index < 2
);

-- Deep Learning
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=CS4cs9xVecg'  -- Deep Learning Intro - MIT
  WHEN 1 THEN 'https://www.youtube.com/watch?v=aircAruvnKk'  -- Neural Networks - 3Blue1Brown
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'deep-learning' AND w.order_index < 2
);

-- Discrete Mathematics
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=2SpuBqvNjHI'  -- Discrete Math Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=rdXw7Ps9vxc'  -- Logic & Proofs
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'discrete-mathematics' AND w.order_index < 2
);

-- Natural Language Processing
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=CMrHM8a3hqw'  -- NLP Zero to Hero
  WHEN 1 THEN 'https://www.youtube.com/watch?v=xvqsFTlX1ro'  -- Transformers Explained
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'natural-language-processing' AND w.order_index < 2
);

-- Product Design with Figma
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=FTFaQWZBqQ8'  -- Figma in 24 minutes
  WHEN 1 THEN 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc'  -- Figma Design Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'product-design-with-figma' AND w.order_index < 2
);

-- Reinforcement Learning
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=2pWv7GOvuf0'  -- RL Intro - DeepMind
  WHEN 1 THEN 'https://www.youtube.com/watch?v=nyjbcRQ-uQ8'  -- Q-Learning
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'reinforcement-learning' AND w.order_index < 2
);

-- MLOps: Deploying ML Models in Production
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=ZVWg18AXXuE'  -- What is MLOps?
  WHEN 1 THEN 'https://www.youtube.com/watch?v=9BgIDqAzfuA'  -- ML Pipelines
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'mlops-deploying-ml-models' AND w.order_index < 2
);

-- Generative AI & LLM Applications
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=zjkBMFhNj_g'  -- Intro to LLMs - Andrej Karpathy
  WHEN 1 THEN 'https://www.youtube.com/watch?v=kCc8FmEb1nY'  -- Build GPT from scratch
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'generative-ai-llm-applications' AND w.order_index < 2
);

-- Apache Kafka & Real-Time Streaming
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=aj9CDZm0Glc'  -- What is Kafka?
  WHEN 1 THEN 'https://www.youtube.com/watch?v=R873BlNVUqQ'  -- Kafka Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'apache-kafka-real-time-streaming' AND w.order_index < 2
);

-- AWS Cloud Solutions Architect
UPDATE public.lectures l
SET youtube_url = CASE 
  WHEN w.order_index = 0 AND l.order_index = 0 THEN 'https://www.youtube.com/watch?v=ZmxMotEHLM0'  -- AWS Intro
  WHEN w.order_index = 0 AND l.order_index = 1 THEN 'https://www.youtube.com/watch?v=3hLmDS179YE'  -- AWS Full Course
  WHEN w.order_index = 1 AND l.order_index = 0 THEN 'https://www.youtube.com/watch?v=xkLuZpmn09s'  -- AWS Practitioner (New Link)
  WHEN w.order_index = 1 AND l.order_index = 1 THEN 'https://www.youtube.com/watch?v=3hLmDS179YE'  -- AWS Full Course
  ELSE youtube_url
END
FROM public.weeks w
JOIN public.courses c ON w.course_id = c.id
WHERE l.week_id = w.id
AND c.slug = 'aws-cloud-solutions-architect' 
AND w.order_index < 2;

-- Linux System Administration
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=sWbUDq4S6Y8'  -- Linux for Beginners
  WHEN 1 THEN 'https://www.youtube.com/watch?v=ROjZy1WbCIA'  -- Linux Command Line
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'linux-system-administration' AND w.order_index < 2
);

-- Spring Boot & Enterprise Java
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=9SGDpanrc8U'  -- Spring Boot Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=VvGjZgqojMc'  -- Spring Boot REST API
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'spring-boot-enterprise-java' AND w.order_index < 2
);

-- Mobile App Development with Flutter
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=1ukSR1GRtMU'  -- Flutter Crash Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=x0uinJvhNxI'  -- Flutter Full Course
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'mobile-app-development-with-flutter' AND w.order_index < 2
);

-- Computer Vision with Deep Learning
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=oZikw5k_2FM'  -- Computer Vision Intro
  WHEN 1 THEN 'https://www.youtube.com/watch?v=iT3pu2Tqrec'  -- CNN Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'computer-vision-with-deep-learning' AND w.order_index < 2
);

-- Advanced React Patterns & Performance
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=f687hBjwFcM'  -- Advanced React Patterns
  WHEN 1 THEN 'https://www.youtube.com/watch?v=wIyHSOugGGw'  -- React Performance
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'advanced-react-patterns-performance' AND w.order_index < 2
);

-- Blockchain & Smart Contracts
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=gyMwXuJrbJQ'  -- Blockchain Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=M576WGiDBdQ'  -- Smart Contracts Tutorial
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'blockchain-smart-contracts' AND w.order_index < 2
);

-- Probability & Statistics for CS
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=XZo4xyJXCak'  -- Statistics Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=9GTnAlQFULU'  -- Probability Intro
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'probability-statistics-for-cs' AND w.order_index < 2
);

-- Redis & Caching Strategies
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=OqCK95AS-YE'  -- Redis Tutorial
  WHEN 1 THEN 'https://www.youtube.com/watch?v=a4yX7RUgTxI'  -- Redis Full Course
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'redis-caching-strategies' AND w.order_index < 2
);

-- Web3 & Decentralized Applications
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=OwSl2xwl2-w'  -- Web3 Full Course
  WHEN 1 THEN 'https://www.youtube.com/watch?v=jYEqoIeAoBg'  -- DApp Development
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'web3-decentralized-app-development' AND w.order_index < 2
);

-- Time Series Analysis & Forecasting
UPDATE public.lectures l
SET youtube_url = CASE l.order_index
  WHEN 0 THEN 'https://www.youtube.com/watch?v=ZoJ2OctrFLA'  -- Time Series Analysis
  WHEN 1 THEN 'https://www.youtube.com/watch?v=e8Yw4alG16Q'  -- ARIMA & Forecasting
  ELSE youtube_url
END
WHERE l.week_id IN (
  SELECT w.id FROM public.weeks w
  JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'time-series-analysis-forecasting' AND w.order_index < 2
);

-- ============================================================
-- STEP 2: Add 3 brand-new courses with real videos
-- ============================================================

-- NEW COURSE 1: TypeScript Full Stack Development
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, instructor_name, duration_text)
VALUES (
  gen_random_uuid(),
  'TypeScript Full Stack Development',
  'typescript-fullstack',
  'Build full-stack apps with TypeScript, Node.js, React, and PostgreSQL. Learn type safety, async patterns, and production deployment.',
  'https://img.youtube.com/vi/BwuLxPH8IDs/hqdefault.jpg',
  'Prof. Alex Turner',
  '8 weeks'
) ON CONFLICT (slug) DO NOTHING;

WITH new_course AS (SELECT id FROM public.courses WHERE slug = 'typescript-fullstack')
INSERT INTO public.weeks (id, course_id, title, order_index)
SELECT gen_random_uuid(), new_course.id, unnest(ARRAY['Week 1: TypeScript Fundamentals', 'Week 2: Building REST APIs']), generate_series(0,1)
FROM new_course
ON CONFLICT DO NOTHING;

WITH week1 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'typescript-fullstack' AND w.order_index = 0
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week1.id, unnest(ARRAY['TypeScript in 100 Seconds', 'TypeScript Full Course']),
  unnest(ARRAY['Quick intro to TypeScript', 'Complete TypeScript tutorial']),
  unnest(ARRAY['https://www.youtube.com/watch?v=zQnBQ4tB3ZA', 'https://www.youtube.com/watch?v=BwuLxPH8IDs']),
  generate_series(0,1), 600
FROM week1
ON CONFLICT DO NOTHING;

WITH week2 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'typescript-fullstack' AND w.order_index = 1
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week2.id, unnest(ARRAY['Node.js + TypeScript REST API', 'Prisma & PostgreSQL']),
  unnest(ARRAY['Build REST APIs with TypeScript and Express', 'Database with Prisma']),
  unnest(ARRAY['https://www.youtube.com/watch?v=H91aqUHn8sE', 'https://www.youtube.com/watch?v=RebA5J-rlwg']),
  generate_series(0,1), 600
FROM week2
ON CONFLICT DO NOTHING;

-- NEW COURSE 2: Docker & Kubernetes DevOps
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, instructor_name, duration_text)
VALUES (
  gen_random_uuid(),
  'Docker & Kubernetes for DevOps',
  'docker-kubernetes-devops',
  'Master containerization with Docker and orchestration with Kubernetes. Deploy microservices at scale in production.',
  'https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg',
  'Dr. Sarah Kim',
  '6 weeks'
) ON CONFLICT (slug) DO NOTHING;

WITH new_course AS (SELECT id FROM public.courses WHERE slug = 'docker-kubernetes-devops')
INSERT INTO public.weeks (id, course_id, title, order_index)
SELECT gen_random_uuid(), new_course.id, unnest(ARRAY['Week 1: Docker Basics', 'Week 2: Kubernetes Fundamentals']), generate_series(0,1)
FROM new_course
ON CONFLICT DO NOTHING;

WITH week1 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'docker-kubernetes-devops' AND w.order_index = 0
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week1.id, unnest(ARRAY['Docker Tutorial for Beginners', 'Docker Compose']),
  unnest(ARRAY['Learn Docker from scratch', 'Multi-container apps with Docker Compose']),
  unnest(ARRAY['https://www.youtube.com/watch?v=3c-iBn73dDE', 'https://www.youtube.com/watch?v=SXwC9fSwct8']),
  generate_series(0,1), 600
FROM week1
ON CONFLICT DO NOTHING;

WITH week2 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'docker-kubernetes-devops' AND w.order_index = 1
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week2.id, unnest(ARRAY['Kubernetes Crash Course', 'Deploying to Kubernetes']),
  unnest(ARRAY['Get started with Kubernetes', 'Real-world Kubernetes deployments']),
  unnest(ARRAY['https://www.youtube.com/watch?v=s_o8dwzRlu4', 'https://www.youtube.com/watch?v=X48VuDVv0do']),
  generate_series(0,1), 600
FROM week2
ON CONFLICT DO NOTHING;

-- NEW COURSE 3: Next.js & Full Stack React
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, instructor_name, duration_text)
VALUES (
  gen_random_uuid(),
  'Next.js Full Stack Development',
  'nextjs-fullstack',
  'Build production-ready full-stack web apps with Next.js 14, App Router, Server Actions, Prisma, and Vercel deployment.',
  'https://img.youtube.com/vi/ZjAqacIC_3c/hqdefault.jpg',
  'Prof. Mia Chen',
  '7 weeks'
) ON CONFLICT (slug) DO NOTHING;

WITH new_course AS (SELECT id FROM public.courses WHERE slug = 'nextjs-fullstack')
INSERT INTO public.weeks (id, course_id, title, order_index)
SELECT gen_random_uuid(), new_course.id, unnest(ARRAY['Week 1: Next.js Fundamentals', 'Week 2: Full Stack with Next.js']), generate_series(0,1)
FROM new_course
ON CONFLICT DO NOTHING;

WITH week1 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'nextjs-fullstack' AND w.order_index = 0
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week1.id, unnest(ARRAY['Next.js 14 Crash Course', 'Next.js App Router']),
  unnest(ARRAY['Next.js from zero to production', 'App Router explained']),
  unnest(ARRAY['https://www.youtube.com/watch?v=ZjAqacIC_3c', 'https://www.youtube.com/watch?v=gSSsZReIFRk']),
  generate_series(0,1), 600
FROM week1
ON CONFLICT DO NOTHING;

WITH week2 AS (
  SELECT w.id FROM public.weeks w JOIN public.courses c ON w.course_id = c.id
  WHERE c.slug = 'nextjs-fullstack' AND w.order_index = 1
)
INSERT INTO public.lectures (week_id, title, description, youtube_url, order_index, duration_seconds)
SELECT week2.id, unnest(ARRAY['Next.js Full Stack App', 'Deploy Next.js to Vercel']),
  unnest(ARRAY['Build a complete full stack app', 'Production deployment guide']),
  unnest(ARRAY['https://www.youtube.com/watch?v=NgayZAuTgwM', 'https://www.youtube.com/watch?v=GVF3GphyjkU']),
  generate_series(0,1), 600
FROM week2
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFY - Check lecture counts per course
-- ============================================================
SELECT c.title, c.slug, COUNT(l.id) as lecture_count
FROM public.courses c
LEFT JOIN public.weeks w ON w.course_id = c.id
LEFT JOIN public.lectures l ON l.week_id = w.id
GROUP BY c.title, c.slug
ORDER BY lecture_count DESC;
