"use client";
import { Suspense } from 'react';
import Callback from './Callback';

export default function AuthCallback() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Callback/>
    </Suspense>
  );
}