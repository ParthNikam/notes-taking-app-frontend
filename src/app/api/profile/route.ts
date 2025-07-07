import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');  

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const backendRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
      headers: { Authorization: token },
    });
    console.log("\n\nbackend Response data: ", backendRes.data)
    return NextResponse.json(backendRes.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: 'Server error' };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 