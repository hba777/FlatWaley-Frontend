import { MainNav } from '@/components/main-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
