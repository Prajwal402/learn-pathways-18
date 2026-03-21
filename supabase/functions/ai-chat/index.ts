import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are a friendly AI assistant inside a Learning Management System.
You help students with their learning journey. Be conversational, clear, and helpful.
Use simple language. When appropriate, use examples and analogies.
Support commands like "summarize", "explain", "example".`,

  teacher: `You are an AI Teacher inside a Learning Management System.
Your role is to teach concepts step-by-step instead of giving direct answers.
- Break down complex topics into small, digestible steps
- After explaining a step, ask the student a question to check understanding
- Wait for their response before moving to the next step
- Adapt your explanations based on student responses
- Use analogies and real-world examples
- Be encouraging and patient`,

  assistant: `You are a Lecture Assistant inside a Learning Management System.
Your role is to help students understand the current lecture better.
- Summarize lecture content when asked
- Simplify complex concepts
- Generate practical examples
- Clarify doubts with clear explanations
- Stay focused on the lecture topic
- Use bullet points and structured formatting`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { message, mode = "chat", courseTitle, lectureTitle, lectureDescription, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validModes = ["chat", "teacher", "assistant"];
    const selectedMode = validModes.includes(mode) ? mode : "chat";

    let contextBlock = "";
    if (courseTitle || lectureTitle) {
      contextBlock = `\n\nCurrent Learning Context:`;
      if (courseTitle) contextBlock += `\n- Course: ${courseTitle}`;
      if (lectureTitle) contextBlock += `\n- Lecture: ${lectureTitle}`;
      if (lectureDescription) contextBlock += `\n- Description: ${lectureDescription}`;
      contextBlock += `\n\nAlways keep your responses relevant to this context.`;
    }

    const systemPrompt = SYSTEM_PROMPTS[selectedMode] + contextBlock;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-20).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
