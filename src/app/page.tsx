import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-8 text-center">
      <div className="absolute inset-0 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="z-10 flex flex-col items-center">
        <h1 className="pb-4 text-5xl font-bold tracking-tight text-transparent bg-gradient-to-t bg-clip-text from-primary to-slate-400/60 md:text-7xl">
          RoomHarmony
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Discover your perfect roommate with the power of AI. Find compatible living partners and your next home, seamlessly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="text-lg">
            <Link href="/onboarding">
              <Sparkles className="mr-2 h-5 w-5" />
              Find Your Match
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-lg">
            <Link href="/dashboard">
              View Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
