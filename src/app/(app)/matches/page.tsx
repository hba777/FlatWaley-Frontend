import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { matchedUsers } from '@/lib/data';

export default function MatchesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Your Matches</h1>
      <p className="text-muted-foreground mb-8">
        These are the people you've connected with. Start a conversation!
      </p>
      
      {matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matchedUsers.map((user) => (
            <Card key={user.id} className="flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground text-sm">{user.university}</p>
                <p className="mt-3 text-sm flex-1">{user.bio}</p>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button asChild className="w-full">
                  <Link href={`/chat?user=${user.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No matches yet</h2>
          <p className="text-muted-foreground mt-2">
            Keep swiping on the dashboard to find your perfect roommate.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Find Matches</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
