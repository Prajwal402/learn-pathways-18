import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  GraduationCap,
  MessageCircle,
  BookOpen,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };
type Mode = "chat" | "teacher" | "assistant";

interface AIChatPanelProps {
  courseTitle?: string;
  lectureTitle?: string;
  lectureDescription?: string;
  open: boolean;
  onClose: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const MODE_CONFIG: Record<Mode, { label: string; icon: typeof Bot; description: string }> = {
  chat: { label: "Chat", icon: MessageCircle, description: "Ask anything" },
  teacher: { label: "Teacher", icon: GraduationCap, description: "Step-by-step learning" },
  assistant: { label: "Assistant", icon: BookOpen, description: "Lecture help" },
};

const QUICK_PROMPTS: Record<Mode, string[]> = {
  chat: ["Explain this topic simply", "Give me a real-world example", "What are the key takeaways?"],
  teacher: ["Teach me this topic step by step", "Quiz me on this lecture", "Help me understand the basics"],
  assistant: ["Summarize this lecture", "Simplify the main concepts", "Generate practice examples"],
};

export function AIChatPanel({ courseTitle, lectureTitle, lectureDescription, open, onClose }: AIChatPanelProps) {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);
      let assistantContent = "";

      const upsert = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      };

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage,
            mode,
            courseTitle,
            lectureTitle,
            lectureDescription,
            history: messages,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ error: "AI service error" }));
          toast.error(err.error || "Failed to get AI response");
          setIsLoading(false);
          return;
        }

        if (!resp.body) throw new Error("No response body");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") break;
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) upsert(content);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (e) {
        console.error("AI chat error:", e);
        toast.error("Failed to connect to AI assistant");
      }
      setIsLoading(false);
    },
    [mode, courseTitle, lectureTitle, lectureDescription, messages]
  );

  const send = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    streamChat(msg);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setMessages([]);
  };

  if (!open) return null;

  return (
    <div className="flex flex-col h-full border-l bg-card w-[380px] max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b px-2 py-1.5 gap-1">
        {(Object.keys(MODE_CONFIG) as Mode[]).map((m) => {
          const { label, icon: Icon } = MODE_CONFIG[m];
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Context Badge */}
      {(courseTitle || lectureTitle) && (
        <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground border-b">
          {courseTitle && <span className="font-medium">{courseTitle}</span>}
          {lectureTitle && <span> › {lectureTitle}</span>}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
            <div className="rounded-full bg-primary/10 p-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">{MODE_CONFIG[mode].description}</p>
              <p className="text-xs text-muted-foreground mt-1">Try one of these prompts:</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {QUICK_PROMPTS[mode].map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-left text-xs px-3 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[85%]",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0"
                  )}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-3 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask the AI ${MODE_CONFIG[mode].label.toLowerCase()}...`}
            disabled={isLoading}
            className="text-sm"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
