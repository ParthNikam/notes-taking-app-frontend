"use client";
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../AuthContext'; // Adjust path as needed

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasRun = useRef(false); // Prevent infinite loop

  useEffect(() => {
    if (hasRun.current) return;

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log("userToken:", token);

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log("User component: ", user);
        login(token, user);
        hasRun.current = true;
        router.push('/dashboard'); 
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/signup?error=invalid_data');
      }
    } else {
      router.push('/signup?error=missing_data');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign up...</p>
      </div>
    </div>
  );
}