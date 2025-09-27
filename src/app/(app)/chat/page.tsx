import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react';
import { matchedUsers, chatMessages } from "@/lib/data"
import Link from "next/link";
import { cn } from "@/lib/utils";

// This is a server component, but we will make it work with searchParams for demo.
// In a real app, you would use a client component to handle state.
export default function ChatPage({ searchParams }: { searchParams: { user?: string } }) {
  const selectedUserId = searchParams.user || matchedUsers[0].id.toString();
  const selectedUser = matchedUsers.find(u => u.id.toString() === selectedUserId);
  const messages = chatMessages[selectedUserId as keyof typeof chatMessages] || [];

  const conversationStarters = [
    "Hi, I think we’re a good match!",
    "What are you studying?",
    "What do you like to do for fun?",
  ];

  return (
    <div className="flex h-screen bg-card">
      <aside className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
        <header className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversations</h2>
        </header>
        <ScrollArea className="flex-1">
            {matchedUsers.map(user => (
                <Link key={user.id} href={`/chat?user=${user.id}`} className={cn("block border-b p-4 hover:bg-muted/50", selectedUserId === user.id.toString() && "bg-muted")}>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                                {chatMessages[user.id.toString() as keyof typeof chatMessages]?.[chatMessages[user.id.toString() as keyof typeof chatMessages].length - 1].text || "No messages yet"}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <header className="flex items-center gap-3 p-4 border-b">
              <Avatar>
                <AvatarImage src={selectedUser.avatarUrl} />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            </header>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-end gap-2", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                    {msg.from === 'them' && <Avatar className="h-8 w-8"><AvatarImage src={selectedUser.avatarUrl} /><AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback></Avatar>}
                    <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <footer className="p-4 border-t">
              <div className="flex flex-wrap gap-2 mb-2">
                {conversationStarters.map(starter => (
                    <Button key={starter} variant="outline" size="sm" className="text-xs">{starter}</Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Type your message..." />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}
