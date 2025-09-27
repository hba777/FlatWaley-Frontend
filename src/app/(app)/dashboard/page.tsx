import { ProfileCardStack } from '@/components/profile-card-stack';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Match</h1>
        <p className="text-muted-foreground mb-8">Review profiles and see who you're compatible with.</p>
        <ProfileCardStack />
      </div>
    </div>
  );
}
