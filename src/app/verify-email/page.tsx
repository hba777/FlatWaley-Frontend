'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmailWithToken, user } = useUser();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Missing token or email.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyEmailWithToken(token, email);
        setStatus('success');
        setMessage('Email verified successfully! You can now access all features.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, verifyEmailWithToken]);

  const handleContinue = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Your email has been verified!'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}

          <p className="text-sm text-gray-600">{message}</p>

          {status === 'success' && (
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                Go to Home
              </Button>
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
