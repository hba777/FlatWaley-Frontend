'use client';

import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export function VerificationStatus() {
  const { user, refreshUserData } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        {user.is_verified ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">Email verified</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">Email not verified</span>
          </>
        )}
      </div>
      
      {!user.is_verified && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-auto"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Checking...' : 'Check Status'}
        </Button>
      )}
    </div>
  );
}
