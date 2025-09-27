import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Search, Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="https://picsum.photos/seed/home-hero/1800/1200"
            alt="Students happily chatting in a shared living space"
            fill
            className="object-cover"
            priority
            data-ai-hint="happy students living"
          />
          <div className="relative z-20 container mx-auto px-4">
            <h1 className="pb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Find Your Harmony
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-200 md:text-xl">
              Discover your perfect roommate with the power of AI. Find compatible living partners and your next home, seamlessly.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/onboarding">
                  Find Your Match
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why RoomHarmony?</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Our platform is designed to make finding a roommate and a room as easy as possible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Our smart algorithm matches you with people who share your lifestyle, habits, and values.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Your Space</h3>
                <p className="text-muted-foreground">
                  Browse room listings in your desired area and filter by your specific needs and budget.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seamless Chat</h3>
                <p className="text-muted-foreground">
                  Connect with potential roommates and landlords directly through our secure messaging system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Finding your perfect living situation is just a few steps away.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6 border border-border rounded-lg bg-card">
                    <div className="text-4xl font-bold text-primary mb-3">1</div>
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-muted-foreground">Answer a few questions about your lifestyle and preferences to build your unique compatibility profile.</p>
                </div>
                <div className="flex flex-col items-center p-6 border border-border rounded-lg bg-card">
                    <div className="text-4xl font-bold text-primary mb-3">2</div>
                    <h3 className="text-xl font-semibold mb-2">Swipe & Match</h3>
                    <p className="text-muted-foreground">Browse profiles of potential roommates and see your compatibility score. Swipe right to connect!</p>
                </div>
                <div className="flex flex-col items-center p-6 border border-border rounded-lg bg-card">
                    <div className="text-4xl font-bold text-primary mb-3">3</div>
                    <h3 className="text-xl font-semibold mb-2">Chat & Connect</h3>
                    <p className="text-muted-foreground">Start conversations with your matches to see if they're the right fit and arrange viewings.</p>
                </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Find Your Roommate?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Join RoomHarmony today and take the first step towards a better living experience.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="text-lg">
                <Link href="/onboarding">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-secondary/30 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RoomHarmony. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
