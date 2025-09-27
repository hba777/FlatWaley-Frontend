'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

type AuthView = 'signin' | 'signup';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 48 48"
    {...props}
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.41 2.38 30.18 0 24 0 14.62 0 6.44 5.36 2.56 13.11l7.98 6.19C12.34 13.58 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.55c0-1.59-.14-3.11-.39-4.55H24v9.11h12.45c-.54 2.9-2.19 5.36-4.66 7.01l7.29 5.67c4.27-3.94 6.92-9.73 6.92-17.24z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.7A14.5 14.5 0 0 1 9.5 24c0-1.64.28-3.22.77-4.7l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.83.91 7.44 2.56 10.61l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.29-5.67c-2.02 1.36-4.63 2.18-8.6 2.18-6.26 0-11.66-4.08-13.46-9.61l-7.98 6.19C6.44 42.64 14.62 48 24 48z"
    />
  </svg>
);


function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).google?.accounts?.id) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}


function AuthForm({
  view,
  onViewChange,
  onAuthenticated,
}: {
  view: AuthView;
  onViewChange: (view: AuthView) => void;
  onAuthenticated?: (token: string) => void;
}) {
  const router = useRouter();
  const { login, register, signInWithGoogle, loginAsGuest, resendVerificationEmail } = useUser();
  const { toast } = useToast();
  const isSignUp = view === 'signup';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: isSignUp
      ? { username: '', email: '', password: '' }
      : { email: '', password: '' },
  });

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    if (GOOGLE_CLIENT_ID) {
      loadGoogleScript()
        .then(() => {
          const google = (window as any).google;
          try {
            google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: async (response: any) => {
                if (!response?.credential) return;
                try {
                  setLoading(true);
                  setError(null);
                  await signInWithGoogle(response.credential);
                  handleAuthSuccess();
                } catch (err: any) {
                  setError(err.message || "Google sign-in failed");
                } finally {
                  setLoading(false);
                }
              },
              ux_mode: "popup",
              auto_select: false,
            });
          } catch (err) {
            console.error("Failed to initialize Google Sign-In:", err);
          }
        })
        .catch((err) => {
          console.error("Failed to load Google script:", err);
        });
    }
  }, [signInWithGoogle]);

  const handleAuthSuccess = useCallback(
    () => {
      onAuthenticated?.('');
      router.push('/onboarding');
    },
    [onAuthenticated, router]
  );

  const onSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const result = await register(values.username, values.email, values.password);
        
        // Show verification message and switch to sign in
        setShowVerificationMessage(true);
        setRegisteredEmail(values.email);
        onViewChange('signin');
        
        toast({
          title: "Verification Email Sent",
          description: result.message,
          duration: 5000,
        });
      } else {
        await login(values.email, values.password);
        handleAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    if (!GOOGLE_CLIENT_ID) {
      setError("Google Sign-In not configured");
      return;
    }
    
    try {
      setLoading(true);
      await loadGoogleScript();
      const google = (window as any).google;
      
      // Cancel any existing prompts
      try {
        google.accounts.id.cancel();
      } catch {}
      
      try {
        google.accounts.id.disableAutoSelect();
      } catch {}
      
      // Create a hidden button for Google Sign-In
      const hidden = document.getElementById("google-btn-hidden");
      if (!hidden) {
        setError("Google Sign-In unavailable. Please try again.");
        return;
      }

      // Re-render the hidden Google button to reset internal state
      try {
        hidden.innerHTML = "";
        google.accounts.id.renderButton(hidden, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
        });
      } catch {}

      // Click the freshly rendered button to open the popup
      const btn = hidden.querySelector('[role="button"]') as HTMLElement | null;
      if (btn) btn.click();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuestLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loginAsGuest();
      handleAuthSuccess();
    } catch (err: any) {
      setError(err.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  }, [loginAsGuest, handleAuthSuccess]);

  const handleResendVerification = useCallback(async () => {
    if (!registeredEmail) return;
    
    try {
      setLoading(true);
      setError(null);
      await resendVerificationEmail(registeredEmail);
      
      toast({
        title: "Verification Email Resent",
        description: "Please check your inbox for the verification email.",
        duration: 5000,
      });
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  }, [registeredEmail, resendVerificationEmail, toast]);

  return (
    <Form {...form}>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}
      
      {showVerificationMessage && !isSignUp && (
        <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
          <p className="font-medium">Verification email sent!</p>
          <p className="text-xs mt-1">Please check your inbox and verify your email before signing in.</p>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="p-0 h-auto text-green-600 hover:text-green-700 mt-2"
            onClick={handleResendVerification}
            disabled={loading}
          >
            Resend verification email
          </Button>
        </div>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isSignUp && (
            <>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
            </>
        )}

        {isSignUp && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => {
                onViewChange('signin');
                setShowVerificationMessage(false);
                setError(null);
              }} 
              disabled={loading}
            >
              Sign in
            </Button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => {
                onViewChange('signup');
                setShowVerificationMessage(false);
                setError(null);
              }} 
              disabled={loading}
            >
              Create an account
            </Button>
          </>
        )}
      </div>
      
      {/* Hidden Google button for programmatic triggering */}
      <div id="google-btn-hidden" style={{ position: "absolute", left: -9999, top: -9999 }} />
    </Form>
  );
}

export function AuthModal({ 
  children, 
  onAuthenticated 
}: { 
  children: ReactNode;
  onAuthenticated?: (token: string) => void;
}) {
  const [view, setView] = useState<AuthView>('signin');
  const [open, setOpen] = useState(false);

  const handleAuthenticated = (token: string) => {
    onAuthenticated?.(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{view === 'signin' ? 'Welcome Back' : 'Create an Account'}</DialogTitle>
          <DialogDescription>
            {view === 'signin'
              ? 'Sign in to find your perfect roommate.'
              : 'Join RoomHarmony to start your search.'}
          </DialogDescription>
        </DialogHeader>
        <AuthForm view={view} onViewChange={setView} onAuthenticated={handleAuthenticated} />
      </DialogContent>
    </Dialog>
  );
}
