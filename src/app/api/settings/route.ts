import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization'); 
  
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }
  
  const {name, avatar, role} = await req.json(); 

  console.log(name, avatar, role);

  try {
    const backendRes = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/settings`, 
      {name, avatar, role}, 
      {headers: { Authorization: token }},
    );
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