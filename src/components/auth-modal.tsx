'use client';

import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import { Separator } from '@/components/ui/separator';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1.38 0-1.5.62-1.5 1.4V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
    </svg>
);


function AuthForm({
  view,
  onViewChange,
}: {
  view: AuthView;
  onViewChange: (view: AuthView) => void;
}) {
  const router = useRouter();
  const isSignUp = view === 'signup';
  const form = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: isSignUp
      ? { username: '', email: '', password: '' }
      : { email: '', password: '' },
  });

  const onSubmit = (values: any) => {
    console.log('Form submitted:', values);
    // In a real app, you would handle authentication here.
    // For now, we'll just redirect to the onboarding page.
    router.push('/onboarding');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Button variant="outline" className="w-full">
          <GoogleIcon className="mr-2 h-4 w-4" />
          {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
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

        <Button type="submit" className="w-full">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => onViewChange('signin')}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => onViewChange('signup')}>
              Create an account
            </Button>
          </>
        )}
      </div>
    </Form>
  );
}

export function AuthModal({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>('signin');
  const [open, setOpen] = useState(false);

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
        <AuthForm view={view} onViewChange={setView} />
      </DialogContent>
    </Dialog>
  );
}
