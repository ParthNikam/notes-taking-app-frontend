"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">
          Welcome to Notes Taking App
        </h1>
        <button className="bg-blue-500 p-4 rounded-xl" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  )
}

export default Page