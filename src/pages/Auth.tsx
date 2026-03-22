import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { GraduationCap, BookOpen, Users, TrendingUp } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setShowVerification(true);
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/courses");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. 
              Click the link in the email to verify your account, then come back and sign in.
            </p>
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => {
                  setShowVerification(false);
                  setIsSignUp(false);
                  setPassword("");
                }}
                className="w-full h-12"
              >
                Go to Sign In
              </Button>
              <p className="text-xs text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setShowVerification(false);
                    setIsSignUp(true);
                  }}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left — Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src={authHero}
            alt="Student learning online"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <h2 className="font-serif text-4xl font-bold leading-tight">
              Learn From India's Best Educators
            </h2>
            <p className="mt-3 text-lg text-white/80 max-w-md">
              Access structured video courses from top universities. Track your progress and learn at your own pace.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { icon: BookOpen, label: "50+ Courses" },
                { icon: Users, label: "10K+ Students" },
                { icon: TrendingUp, label: "Free Access" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm text-white/90">
                  <s.icon className="h-5 w-5 text-white/70" />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold">
                {isSignUp ? "Create Account" : "Sign in to LearnHub"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isSignUp
                  ? "Join thousands of learners across India"
                  : "Sign in using your email or create a new account"}
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  {isSignUp ? "Sign up with email" : "Continue with LearnHub Account"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>

              <div className="flex items-center justify-between">
                <div />
                {!isSignUp && (
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-12 flex-1" disabled={loading}>
                  {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Need a LearnHub account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-primary hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
